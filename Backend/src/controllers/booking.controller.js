import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Service from '../models/Service.js';
import ApiResponse from '../utils/ApiResponse.js';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Customer)
export const createBooking = async (req, res, next) => {
  try {
    const { barberId, serviceId, date, startTime, endTime, notes } = req.body;

    const barber = await User.findById(barberId);
    const service = await Service.findById(serviceId);

    if (!barber || barber.role !== 'barber') {
      return new ApiResponse(res, 404, 'Barber not found');
    }
    if (!service) {
      return new ApiResponse(res, 404, 'Service not found');
    }

    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
      barber: barberId,
      date,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        { startTime: { $lt: endTime, $gte: startTime } },
        { endTime: { $gt: startTime, $lte: endTime } }
      ]
    });

    if (conflictingBooking) {
      return new ApiResponse(res, 400, 'This time slot is already booked');
    }

    // Find the custom price set by this specific barber
    const barberService = barber.services.find(s => s.service.toString() === serviceId);
    if (!barberService || !barberService.isActive) {
      return new ApiResponse(res, 400, 'Barber does not offer this service currently');
    }

    const bookingStatus = req.body.status === 'manual_offline' ? 'manual_offline' : 'pending';
    const customerId = req.user ? req.user._id : barberId; // If manual, customer is the barber themselves

    const booking = await Booking.create({
      customer: customerId,
      barber: barberId,
      service: serviceId,
      date,
      startTime,
      endTime,
      status: bookingStatus,
      amount: barberService.customPrice, // Use Barber's Custom Price!
      notes
    });

    // Populate for response
    await booking.populate('barber', 'name avatar');
    await booking.populate('service', 'name price');

    // Notify barber via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${barberId}`).emit('new_booking', booking);
    }

    new ApiResponse(res, 201, 'Booking created successfully', { booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's bookings (Customer or Barber)
// @route   GET /api/bookings/my
// @access  Private
export const getMyBookings = async (req, res, next) => {
  try {
    const filter = req.user.role === 'customer' 
      ? { customer: req.user._id } 
      : { barber: req.user._id };

    const bookings = await Booking.find(filter)
      .populate('customer', 'name avatar phone')
      .populate('barber', 'name avatar')
      .populate('service', 'name price duration')
      .sort('-createdAt');

    new ApiResponse(res, 200, 'Bookings fetched successfully', { bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (Accept/Reject/Complete)
// @route   PUT /api/bookings/:id/status
// @access  Private (Barber)
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const validStatuses = ['confirmed', 'completed', 'cancelled', 'no_show', 'manual_offline'];
    if (!validStatuses.includes(status)) {
      return new ApiResponse(res, 400, 'Invalid status value');
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return new ApiResponse(res, 404, 'Booking not found');
    }

    // Only the assigned barber (or admin) can update the booking
    if (req.user.role === 'barber' && booking.barber.toString() !== req.user._id.toString()) {
      return new ApiResponse(res, 403, 'Not authorized to update this booking');
    }

    booking.status = status;
    await booking.save();

    // Notify customer via Socket.io when barber accepts/rejects
    const io = req.app.get('io');
    if (io && booking.customer) {
      io.to(`user_${booking.customer}`).emit('booking_status_update', {
        bookingId: booking._id,
        status: booking.status
      });
    }

    new ApiResponse(res, 200, 'Booking status updated', { booking });
  } catch (error) {
    next(error);
  }
};

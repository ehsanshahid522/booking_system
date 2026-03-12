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

    const booking = await Booking.create({
      customer: req.user.id,
      barber: barberId,
      service: serviceId,
      date,
      startTime,
      endTime,
      amount: service.price,
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
      ? { customer: req.user.id } 
      : { barber: req.user.id };

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

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (Barber or Admin)
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!['confirmed', 'completed', 'cancelled', 'no_show'].includes(status)) {
      return new ApiResponse(res, 400, 'Invalid status');
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return new ApiResponse(res, 404, 'Booking not found');
    }

    // Authorization check
    if (req.user.role === 'barber' && booking.barber.toString() !== req.user.id) {
      return new ApiResponse(res, 403, 'Not authorized to update this booking');
    }

    booking.status = status;
    await booking.save();

    // Notify customer via Socket.io
    const io = req.app.get('io');
    if (io) {
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

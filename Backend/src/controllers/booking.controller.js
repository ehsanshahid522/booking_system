import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import Service from '../models/Service.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Customer)
export const createBooking = asyncHandler(async (req, res) => {
  let { barberId, serviceId, date, startTime, endTime, notes } = req.body;

  // Normalize date to start of day (YYYY-MM-DD) to avoid time mismatch
  const bookingDate = new Date(date);
  bookingDate.setHours(0, 0, 0, 0);

  const barber = await User.findById(barberId);
  const service = await Service.findById(serviceId);

  if (!barber || barber.role !== 'barber') {
    throw new ApiError(404, 'Barber not found');
  }
  if (!service) {
    throw new ApiError(404, 'Service not found');
  }

  // Check for conflicting bookings
  const conflictingBooking = await Booking.findOne({
    barber: barberId,
    date: bookingDate,
    status: { $in: ['pending', 'confirmed'] },
    $or: [
      { startTime: { $lt: endTime, $gte: startTime } },
      { endTime: { $gt: startTime, $lte: endTime } }
    ]
  });

  if (conflictingBooking) {
    throw new ApiError(400, 'This time slot is already booked');
  }

  // Find the custom price set by this specific barber
  const barberService = barber.services.find(s => s.service.toString() === serviceId);
  if (!barberService || !barberService.isActive) {
    throw new ApiError(400, 'Barber does not offer this service currently');
  }

  const bookingStatus = req.body.status === 'manual_offline' ? 'manual_offline' : 'pending';
  const customerId = req.user ? req.user._id : barberId; // If manual, customer is the barber themselves

  const booking = await Booking.create({
    customer: customerId,
    barber: barberId,
    service: serviceId,
    date: bookingDate,
    startTime,
    endTime,
    status: bookingStatus,
    amount: barberService.customPrice, // Use Barber's Custom Price!
    notes
  });

  // Populate for response
  await booking.populate('barber', 'name avatar');
  await booking.populate('service', 'name price');

  const customerName = req.user?.name || 'A customer';
  await Notification.create({
    user: barberId,
    title: 'New booking request',
    body: `${customerName} requested a ${service.name} appointment on ${booking.date}.`,
    type: 'booking',
    actionUrl: `/bookings/${booking._id}`
  });

  // Notify barber via Socket.io
  const io = req.app.get('io');
  if (io) {
    io.to(`user_${barberId}`).emit('new_booking', booking);
  }

  new ApiResponse(res, 201, 'Booking created successfully', { booking });
});

// @desc    Get user's bookings (Customer or Barber)
// @route   GET /api/bookings/my
// @access  Private
export const getMyBookings = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'customer' 
    ? { customer: req.user._id } 
    : { barber: req.user._id };

  const bookings = await Booking.find(filter)
    .populate('customer', 'name avatar phone')
    .populate('barber', 'name avatar')
    .populate('service', 'name price duration')
    .sort('-createdAt');

  new ApiResponse(res, 200, 'Bookings fetched successfully', { bookings });
});

// @desc    Update booking status (Accept/Reject/Complete)
// @route   PUT /api/bookings/:id/status
// @access  Private (Barber)
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const validStatuses = ['confirmed', 'completed', 'cancelled', 'no_show', 'manual_offline'];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, 'Invalid status value');
  }

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  // Only the assigned barber (or admin) can update the booking
  if (req.user.role === 'barber' && booking.barber.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to update this booking');
  }

  booking.status = status;
  await booking.save();

  const customer = await User.findById(booking.customer);
  const service = await Service.findById(booking.service);
  const statusMessage = {
    confirmed: 'accepted',
    cancelled: 'cancelled',
    completed: 'completed',
    no_show: 'marked as no-show',
    manual_offline: 'updated manually'
  }[status] || 'updated';

  if (customer) {
    await Notification.create({
      user: customer._id,
      title: 'Booking update',
      body: `Your ${service?.name || 'service'} appointment was ${statusMessage}.`,
      type: 'booking',
      actionUrl: `/bookings/${booking._id}`
    });
  }

  // Notify customer via Socket.io when barber accepts/rejects
  const io = req.app.get('io');
  if (io && booking.customer) {
    io.to(`user_${booking.customer}`).emit('booking_status_update', {
      bookingId: booking._id,
      status: booking.status
    });
  }

  new ApiResponse(res, 200, 'Booking status updated', { booking });
});

// @desc    Mark booking as paid
// @route   POST /api/bookings/:id/pay
// @access  Private (Customer)
export const payBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  if (booking.customer.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to pay for this booking');
  }

  booking.paymentStatus = 'paid';
  booking.status = booking.status === 'pending' ? 'confirmed' : booking.status;
  await booking.save();

  new ApiResponse(res, 200, 'Payment successful', { booking });
});

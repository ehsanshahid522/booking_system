import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import ApiResponse from '../utils/ApiResponse.js';

// @desc    Create new payment entry
// @route   POST /api/payments
// @access  Private
export const createPayment = async (req, res, next) => {
  try {
    const { bookingId, amount, method, transactionId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return new ApiResponse(res, 404, 'Booking not found');
    }

    const payment = await Payment.create({
      booking: bookingId,
      customer: req.user.id,
      barber: booking.barber,
      amount,
      method,
      status: 'paid', // Simulating successful payment
      transactionId: transactionId || `TXN${Date.now()}`
    });

    // Update booking payment status
    booking.paymentStatus = 'paid';
    booking.paymentMethod = method;
    await booking.save();

    new ApiResponse(res, 201, 'Payment processed successfully', { payment });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's payment history
// @route   GET /api/payments/history
// @access  Private
export const getPaymentHistory = async (req, res, next) => {
  try {
    const filter = req.user.role === 'customer' 
      ? { customer: req.user.id } 
      : { barber: req.user.id };

    const payments = await Payment.find(filter)
      .populate('booking', 'date service')
      .populate('barber', 'name')
      .populate('customer', 'name')
      .sort('-createdAt');

    new ApiResponse(res, 200, 'Payment history fetched', { payments });
  } catch (error) {
    next(error);
  }
};

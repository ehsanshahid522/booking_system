import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import ApiResponse from '../utils/ApiResponse.js';

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private (Customer)
export const createReview = async (req, res, next) => {
  try {
    const { bookingId, rating, comment } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return new ApiResponse(res, 404, 'Booking not found');
    }

    if (booking.customer.toString() !== req.user._id.toString()) {
      return new ApiResponse(res, 403, 'Not authorized to review this booking');
    }

    // Check if appointment is completed
    if (booking.status !== 'completed') {
      return new ApiResponse(res, 400, 'Can only review completed appointments');
    }

    const review = await Review.create({
      booking: bookingId,
      customer: req.user._id,
      barber: booking.barber,
      rating,
      comment
    });

    new ApiResponse(res, 201, 'Review submitted successfully', { review });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a barber
// @route   GET /api/reviews/barber/:barberId
// @access  Public
export const getBarberReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ barber: req.params.barberId })
      .populate('customer', 'name avatar')
      .sort('-createdAt');

    new ApiResponse(res, 200, 'Reviews fetched', { reviews });
  } catch (error) {
    next(error);
  }
};

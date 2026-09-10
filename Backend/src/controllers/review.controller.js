import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private (Customer)
export const createReview = asyncHandler(async (req, res) => {
  const { bookingId, rating, comment } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  if (booking.customer.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to review this booking');
  }

  // Check if appointment is completed
  if (booking.status !== 'completed') {
    throw new ApiError(400, 'Can only review completed appointments');
  }

  const review = await Review.create({
    booking: bookingId,
    customer: req.user._id,
    barber: booking.barber,
    rating,
    comment
  });

  new ApiResponse(res, 201, 'Review submitted successfully', { review });
});

// @desc    Get reviews for a barber
// @route   GET /api/reviews/barber/:barberId
// @access  Public
export const getBarberReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ barber: req.params.barberId })
    .populate('customer', 'name avatar')
    .sort('-createdAt');

  new ApiResponse(res, 200, 'Reviews fetched', { reviews });
});

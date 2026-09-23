import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/dashboard', asyncHandler(async (req, res) => {
  const totalCustomers = await User.countDocuments({ role: 'customer' });
  const totalBarbers = await User.countDocuments({ role: 'barber' });
  const totalBookings = await Booking.countDocuments();
  const completedBookings = await Booking.countDocuments({ status: 'completed' });
  const revenue = await Booking.aggregate([
    { $match: { status: { $in: ['completed', 'confirmed'] } } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  const dashboard = {
    totalCustomers,
    totalBarbers,
    totalBookings,
    completedBookings,
    revenue: revenue[0]?.total || 0
  };

  new ApiResponse(res, 200, 'Admin dashboard fetched successfully', { dashboard });
}));

export default router;

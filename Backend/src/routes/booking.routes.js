import express from 'express';
import { createBooking, getMyBookings, updateBookingStatus, payBooking } from '../controllers/booking.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes require auth

router.post('/', authorize('customer'), createBooking);
router.get('/my', getMyBookings);
router.post('/:id/pay', authorize('customer'), payBooking);
router.put('/:id/status', authorize('barber', 'admin'), updateBookingStatus);

export default router;

import express from 'express';
import { createReview, getBarberReviews } from '../controllers/review.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('customer'), createReview);
router.get('/barber/:barberId', getBarberReviews);

export default router;

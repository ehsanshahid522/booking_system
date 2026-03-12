import express from 'express';
import { getBarbers, getBarberById, updateBarberProfile, updateBarberStatus } from '../controllers/barber.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getBarbers);
router.get('/:id', getBarberById);

router.put('/profile', protect, authorize('barber'), updateBarberProfile);
router.put('/status', protect, authorize('barber'), updateBarberStatus);

export default router;

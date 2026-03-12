import express from 'express';
import { 
  getAdminStats, getAllBookings, getAllCustomers, getAllPayments, 
  broadcastMessage, toggleBarberStatus 
} from '../controllers/admin.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/bookings', getAllBookings);
router.get('/customers', getAllCustomers);
router.get('/payments', getAllPayments);
router.post('/broadcast', broadcastMessage);
router.put('/barbers/:id/status', toggleBarberStatus);

export default router;

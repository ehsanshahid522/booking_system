import express from 'express';
import { createPayment, getPaymentHistory } from '../controllers/payment.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', createPayment);
router.get('/history', getPaymentHistory);

export default router;

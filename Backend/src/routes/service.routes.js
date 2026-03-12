import express from 'express';
import { getServices, createService, updateService, deleteService } from '../controllers/service.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getServices);

// Admin only routes
router.use(protect, authorize('admin'));
router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);

export default router;

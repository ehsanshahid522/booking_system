import express from 'express';
import { sendMessage, getConversation, getConversationsList } from '../controllers/message.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', sendMessage);
router.get('/conversations', getConversationsList);
router.get('/conversation/:userId', getConversation);

export default router;

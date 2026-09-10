import Message from '../models/Message.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
export const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, text, bookingId } = req.body;

  const message = await Message.create({
    sender: req.user._id,
    receiver: receiverId,
    bookingId,
    text
  });

  await message.populate('sender', 'name avatar role');

  // Real-time send message
  const io = req.app.get('io');
  if (io) {
    io.to(`user_${receiverId}`).emit('receive_message', message);
  }

  new ApiResponse(res, 201, 'Message sent', { message });
});

// @desc    Get conversation between two users
// @route   GET /api/messages/conversation/:userId
// @access  Private
export const getConversation = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user._id;

  const messages = await Message.find({
    $or: [
      { sender: currentUserId, receiver: userId },
      { sender: userId, receiver: currentUserId }
    ]
  })
  .populate('sender', 'name avatar role')
  .sort('createdAt');

  // Mark messages as read
  await Message.updateMany(
    { sender: userId, receiver: currentUserId, isRead: false },
    { $set: { isRead: true } }
  );

  new ApiResponse(res, 200, 'Conversation fetched', { messages });
});

// @desc    Get user's recent conversations list
// @route   GET /api/messages/conversations
// @access  Private
export const getConversationsList = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  // Find all distinct users the current user has chatted with
  const messages = await Message.find({
    $or: [{ sender: userId }, { receiver: userId }]
  }).sort('-createdAt');

  // Process to get latest message per unique user
  const conversationsMap = new Map();
  
  messages.forEach(msg => {
    const otherUser = msg.sender.toString() === userId.toString() ? msg.receiver.toString() : msg.sender.toString();
    if (!conversationsMap.has(otherUser)) {
      conversationsMap.set(otherUser, msg);
    }
  });

  const conversations = Array.from(conversationsMap.values());
  
  // In a real app we would populate the other user's details manually here 
  // since aggregate populates are complex

  new ApiResponse(res, 200, 'Conversations list fetched', { conversations });
});

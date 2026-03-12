import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['booking', 'reminder', 'payment', 'system', 'promo'],
    default: 'system'
  },
  isRead: { type: Boolean, default: false },
  actionUrl: { type: String } // e.g. /bookings/123
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;

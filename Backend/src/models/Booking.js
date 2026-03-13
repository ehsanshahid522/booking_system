import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  barber: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  
  date: { type: String, required: true }, // YYYY-MM-DD
  startTime: { type: String, required: true }, // HH:mm AM/PM
  endTime: { type: String, required: true }, // HH:mm AM/PM
  
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no_show', 'manual_offline'],
    default: 'pending'
  },
  
  notes: { type: String, default: '' },
  
  amount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' },
  paymentMethod: { type: String, enum: ['cash', 'card', 'online'], default: 'cash' },
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;

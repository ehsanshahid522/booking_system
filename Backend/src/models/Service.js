import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true }, // in minutes
  category: { 
    type: String, 
    enum: ['Hair', 'Beard', 'Skin', 'Wellness', 'Combo', 'Other'], 
    default: 'Hair' 
  },
  description: { type: String, default: '' },
  icon: { type: String, default: '✂️' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);
export default Service;

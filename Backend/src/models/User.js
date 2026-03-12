import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please add a name'] },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
  },
  phone: { type: String, required: [true, 'Please add a phone number'] },
  password: { type: String, required: [true, 'Please add a password'], minlength: 6, select: false },
  role: { type: String, enum: ['customer', 'barber', 'admin'], default: 'customer' },
  avatar: { type: String, default: null },
  isActive: { type: Boolean, default: true },

  // --- Customer Specific Fields ---
  loyaltyPoints: { type: Number, default: 0 },
  favoriteBarbers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // --- Barber Specific Fields ---
  bio: { type: String, default: '' },
  experience: { type: Number, default: 0 },
  specialization: { type: String, default: '' },
  status: { type: String, enum: ['available', 'busy', 'off_duty'], default: 'available' },
  workingHours: { type: String, default: '10:00 AM - 08:00 PM' },
  daysAvailable: { type: [String], default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] },
  breakTime: { type: String, default: '02:00 PM - 03:00 PM' },
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
}, { timestamps: true });

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;

import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Payment from '../models/Payment.js';
import Notification from '../models/Notification.js';
import ApiResponse from '../utils/ApiResponse.js';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getAdminStats = async (req, res, next) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalBarbers = await User.countDocuments({ role: 'barber' });
    
    const revenueObj = await Payment.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueObj.length > 0 ? revenueObj[0].total : 0;

    new ApiResponse(res, 200, 'Admin stats fetched', {
      totalBookings,
      totalCustomers,
      totalBarbers,
      totalRevenue
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/admin/bookings
// @access  Private (Admin)
export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('customer', 'name email')
      .populate('barber', 'name')
      .populate('service', 'name price')
      .sort('-createdAt');

    new ApiResponse(res, 200, 'All bookings fetched', { bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all customers
// @route   GET /api/admin/customers
// @access  Private (Admin)
export const getAllCustomers = async (req, res, next) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-password');
    new ApiResponse(res, 200, 'Customers fetched', { customers });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all payments
// @route   GET /api/admin/payments
// @access  Private (Admin)
export const getAllPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate('booking', 'date')
      .populate('customer', 'name')
      .populate('barber', 'name')
      .sort('-createdAt');

    new ApiResponse(res, 200, 'Payments fetched', { payments });
  } catch (error) {
    next(error);
  }
};

// @desc    Broadcast message to users
// @route   POST /api/admin/broadcast
// @access  Private (Admin)
export const broadcastMessage = async (req, res, next) => {
  try {
    const { title, body, audience } = req.body; // audience: 'customers', 'barbers', 'all'

    let filter = {};
    if (audience === 'customers') filter = { role: 'customer' };
    else if (audience === 'barbers') filter = { role: 'barber' };

    const users = await User.find(filter).select('_id');
    const notifications = users.map(user => ({
      user: user._id,
      title,
      body,
      type: 'promo'
    }));

    await Notification.insertMany(notifications);

    // Broadcast via socket.io
    const io = req.app.get('io');
    if (io) {
      if (audience === 'customers' || audience === 'all') io.to('customers').emit('broadcast', { title, body });
      if (audience === 'barbers' || audience === 'all') io.to('barbers').emit('broadcast', { title, body });
    }

    new ApiResponse(res, 201, 'Broadcast sent successfully', { count: notifications.length });
  } catch (error) {
    next(error);
  }
};

// @desc    Activate/Deactivate Barber
// @route   PUT /api/admin/barbers/:id/status
// @access  Private (Admin)
export const toggleBarberStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    
    const barber = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'barber' },
      { isActive },
      { new: true }
    ).select('name isActive');

    if (!barber) {
      return new ApiResponse(res, 404, 'Barber not found');
    }

    new ApiResponse(res, 200, 'Barber status updated', { barber });
  } catch (error) {
    next(error);
  }
};

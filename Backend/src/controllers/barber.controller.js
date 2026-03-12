import User from '../models/User.js';
import ApiResponse from '../utils/ApiResponse.js';

// @desc    Get all active barbers
// @route   GET /api/barbers
// @access  Public
export const getBarbers = async (req, res, next) => {
  try {
    const barbers = await User.find({ role: 'barber', isActive: true })
      .select('name avatar bio specialization experience rating reviewCount status')
      .populate('services', 'name price duration icon category');

    new ApiResponse(res, 200, 'Barbers fetched successfully', { barbers });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single barber by ID
// @route   GET /api/barbers/:id
// @access  Public
export const getBarberById = async (req, res, next) => {
  try {
    const barber = await User.findOne({ _id: req.params.id, role: 'barber' })
      .select('-password')
      .populate('services', 'name price duration icon category');

    if (!barber) {
      return new ApiResponse(res, 404, 'Barber not found');
    }

    new ApiResponse(res, 200, 'Barber fetched successfully', { barber });
  } catch (error) {
    next(error);
  }
};

// @desc    Update barber profile
// @route   PUT /api/barbers/profile
// @access  Private (Barber only)
export const updateBarberProfile = async (req, res, next) => {
  try {
    const { bio, experience, specialization, workingHours, breakTime, daysAvailable, services } = req.body;

    const updatedBarber = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          bio,
          experience,
          specialization,
          workingHours,
          breakTime,
          daysAvailable,
          services
        }
      },
      { new: true, runValidators: true }
    ).select('-password');

    new ApiResponse(res, 200, 'Profile updated successfully', { barber: updatedBarber });
  } catch (error) {
    next(error);
  }
};

// @desc    Update barber status (online/offline/busy)
// @route   PUT /api/barbers/status
// @access  Private (Barber only)
export const updateBarberStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['available', 'busy', 'off_duty'].includes(status)) {
      return new ApiResponse(res, 400, 'Invalid status');
    }

    const barber = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { status } },
      { new: true }
    ).select('status name');

    // Emit socket event if needed
    const io = req.app.get('io');
    if (io) {
      io.emit('barber_status_update', { barberId: barber._id, status: barber.status });
    }

    new ApiResponse(res, 200, 'Status updated successfully', { barber });
  } catch (error) {
    next(error);
  }
};

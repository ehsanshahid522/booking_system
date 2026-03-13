import User from '../models/User.js';
import ApiResponse from '../utils/ApiResponse.js';

// @desc    Get all active barbers
// @route   GET /api/barbers
// @access  Public
export const getBarbers = async (req, res, next) => {
  try {
    const barbers = await User.find({ role: 'barber', isActive: true })
      .select('name avatar bio specialization experience rating reviewCount status shopName shopLocation')
      .populate('services.service', 'name price duration icon category');

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
      .populate('services.service', 'name price duration icon category');

    if (!barber) {
      return new ApiResponse(res, 404, 'Barber not found');
    }

    new ApiResponse(res, 200, 'Barber fetched successfully', { barber });
  } catch (error) {
    next(error);
  }
};

// @desc    Update barber profile & shop setup
// @route   PUT /api/barbers/profile
// @access  Private (Barber only)
export const updateBarberProfile = async (req, res, next) => {
  try {
    const { 
      shopName,
      shopLocation,
      bio, 
      experience, 
      specialization, 
      workingHours, 
      breakTime, 
      daysAvailable, 
      services 
    } = req.body;

    const updatedBarber = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          shopName,
          shopLocation,
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

// @desc    Add or update a custom priced service to barber profile
// @route   PUT /api/barbers/services
// @access  Private (Barber only)
export const updateBarberServices = async (req, res, next) => {
  try {
    const { serviceId, customPrice, isActive = true } = req.body;

    const barber = await User.findById(req.user.id);
    if (!barber) return new ApiResponse(res, 404, 'Barber not found');

    // Check if the service already exists in array
    const serviceIndex = barber.services.findIndex(s => s.service.toString() === serviceId);

    if (serviceIndex > -1) {
      // Update existing
      barber.services[serviceIndex].customPrice = customPrice;
      barber.services[serviceIndex].isActive = isActive;
    } else {
      // Add new
      barber.services.push({ service: serviceId, customPrice, isActive });
    }

    await barber.save();
    
    // Return populated data
    await barber.populate('services.service', 'name category duration icon');

    new ApiResponse(res, 200, 'Services updated successfully', { services: barber.services });
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

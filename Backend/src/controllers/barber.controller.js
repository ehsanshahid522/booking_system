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
    const updateFields = {};
    const allowedFields = [
      'shopName',
      'shopLocation',
      'bio',
      'experience',
      'specialization',
      'workingHours',
      'breakTime',
      'daysAvailable',
      'services'
    ];

    // Only add fields that are present in the request body
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    console.log(`Updating profile for barber ${req.user._id}:`, updateFields);

    const updatedBarber = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: updateFields
      },
      { returnDocument: 'after', runValidators: true }
    ).select('-password');

    if (!updatedBarber) {
      return new ApiResponse(res, 404, 'Barber not found');
    }

    new ApiResponse(res, 200, 'Profile updated successfully', { barber: updatedBarber });
  } catch (error) {
    console.error('Update Profile Error:', error);
    next(error);
  }
};

// @desc    Add or update a custom priced service to barber profile
// @route   PUT /api/barbers/services
// @access  Private (Barber only)
export const updateBarberServices = async (req, res, next) => {
  try {
    const { serviceId, customPrice, isActive = true } = req.body;

    // First check if the barber exists
    const barberCheck = await User.findById(req.user._id);
    if (!barberCheck) return new ApiResponse(res, 404, 'Barber not found');

    // Check if the service already exists
    const serviceIndex = barberCheck.services.findIndex(s => s.service.toString() === serviceId);

    let updatedBarber;

    if (serviceIndex > -1) {
      // Update existing service
      updatedBarber = await User.findOneAndUpdate(
        { _id: req.user._id, 'services.service': serviceId },
        { 
          $set: { 
            'services.$.customPrice': customPrice,
            'services.$.isActive': isActive 
          } 
        },
        { returnDocument: 'after' }
      );
    } else {
      // Add new service
      updatedBarber = await User.findByIdAndUpdate(
        req.user._id,
        { 
          $push: { 
            services: { service: serviceId, customPrice, isActive } 
          } 
        },
        { returnDocument: 'after' }
      );
    }

    // Return populated data
    await updatedBarber.populate('services.service', 'name category duration icon');

    new ApiResponse(res, 200, 'Services updated successfully', { services: updatedBarber.services });
  } catch (error) {
    console.error('Update Services Error:', error);
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
      { returnDocument: 'after' }
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

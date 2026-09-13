import User from '../models/User.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Get all active barbers
// @route   GET /api/barbers
// @access  Public
export const getBarbers = asyncHandler(async (req, res) => {
  const barbers = await User.find({ role: 'barber', isActive: true })
    .select('name avatar bio specialization experience rating reviewCount status shopName shopLocation')
    .populate('services.service', 'name price duration icon category');

  new ApiResponse(res, 200, 'Barbers fetched successfully', { barbers });
});

// @desc    Get primary barber / salon (Ehsan Salon)
// @route   GET /api/barbers/primary
// @access  Public
export const getPrimaryBarber = asyncHandler(async (req, res) => {
  const barber = await User.findOne({ role: 'barber', isActive: true })
    .select('-password')
    .populate('services.service', 'name price duration icon category');

  if (!barber) {
    throw new ApiError(404, 'Barber salon not found');
  }

  new ApiResponse(res, 200, 'Primary barber fetched successfully', { barber });
});

// @desc    Get single barber by ID
// @route   GET /api/barbers/:id
// @access  Public
export const getBarberById = asyncHandler(async (req, res) => {
  const barber = await User.findOne({ _id: req.params.id, role: 'barber' })
    .select('-password')
    .populate('services.service', 'name price duration icon category');

  if (!barber) {
    throw new ApiError(404, 'Barber not found');
  }

  new ApiResponse(res, 200, 'Barber fetched successfully', { barber });
});

// @desc    Update barber profile & shop setup
// @route   PUT /api/barbers/profile
// @access  Private (Barber only)
export const updateBarberProfile = asyncHandler(async (req, res) => {
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

  const updatedBarber = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: updateFields
    },
    { returnDocument: 'after', runValidators: true }
  ).select('-password');

  if (!updatedBarber) {
    throw new ApiError(404, 'Barber not found');
  }

  new ApiResponse(res, 200, 'Profile updated successfully', { barber: updatedBarber });
});

// @desc    Add or update a custom priced service to barber profile
// @route   PUT /api/barbers/services
// @access  Private (Barber only)
export const updateBarberServices = asyncHandler(async (req, res) => {
  const { serviceId, customPrice, isActive = true } = req.body;

  // First check if the barber exists
  const barberCheck = await User.findById(req.user._id);
  if (!barberCheck) {
    throw new ApiError(404, 'Barber not found');
  }

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
});

// @desc    Update barber status (online/offline/busy)
// @route   PUT /api/barbers/status
// @access  Private (Barber only)
export const updateBarberStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!['available', 'busy', 'off_duty'].includes(status)) {
    throw new ApiError(400, 'Invalid status');
  }

  const barber = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { status } },
    { returnDocument: 'after' }
  ).select('status name');

  if (!barber) {
    throw new ApiError(404, 'Barber not found');
  }

  // Emit socket event if needed
  const io = req.app.get('io');
  if (io) {
    io.emit('barber_status_update', { barberId: barber._id, status: barber.status });
  }

  new ApiResponse(res, 200, 'Status updated successfully', { barber });
});

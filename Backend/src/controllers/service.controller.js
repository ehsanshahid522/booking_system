import Service from '../models/Service.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Get all active services
// @route   GET /api/services
// @access  Public
export const getServices = asyncHandler(async (req, res) => {
  const services = await Service.find({ isActive: true });
  new ApiResponse(res, 200, 'Services fetched successfully', { services });
});

// @desc    Create a new service
// @route   POST /api/services
// @access  Private (Admin)
export const createService = asyncHandler(async (req, res) => {
  const service = await Service.create(req.body);
  new ApiResponse(res, 201, 'Service created successfully', { service });
});

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private (Admin)
export const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(
    req.params.id,
    req.body,
    { returnDocument: 'after', runValidators: true }
  );

  if (!service) {
    throw new ApiError(404, 'Service not found');
  }

  new ApiResponse(res, 200, 'Service updated successfully', { service });
});

// @desc    Delete (soft delete) a service
// @route   DELETE /api/services/:id
// @access  Private (Admin)
export const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { returnDocument: 'after' }
  );

  if (!service) {
    throw new ApiError(404, 'Service not found');
  }

  new ApiResponse(res, 200, 'Service deleted successfully');
});

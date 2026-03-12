import Service from '../models/Service.js';
import ApiResponse from '../utils/ApiResponse.js';

// @desc    Get all active services
// @route   GET /api/services
// @access  Public
export const getServices = async (req, res, next) => {
  try {
    const services = await Service.find({ isActive: true });
    new ApiResponse(res, 200, 'Services fetched successfully', { services });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new service
// @route   POST /api/services
// @access  Private (Admin)
export const createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    new ApiResponse(res, 201, 'Service created successfully', { service });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private (Admin)
export const updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return new ApiResponse(res, 404, 'Service not found');
    }

    new ApiResponse(res, 200, 'Service updated successfully', { service });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete (soft delete) a service
// @route   DELETE /api/services/:id
// @access  Private (Admin)
export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!service) {
      return new ApiResponse(res, 404, 'Service not found');
    }

    new ApiResponse(res, 200, 'Service deleted successfully');
  } catch (error) {
    next(error);
  }
};

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from './asyncHandler.js';

// Protect routes
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    throw new ApiError(401, 'Not authorized to access this route');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      throw new ApiError(401, 'User not found');
    }

    if (!req.user.isActive) {
      throw new ApiError(401, 'Your account has been deactivated');
    }

    next();
  } catch (err) {
    throw new ApiError(401, 'Not authorized to access this route');
  }
});

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, `User role ${req.user.role} is not authorized to access this route`);
    }
    next();
  };
};

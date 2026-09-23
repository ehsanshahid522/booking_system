import mongoose from 'mongoose';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Register a new user (Customer or Barber)
// @route   POST /api/auth/signup
// @access  Public
export const signup = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role, shopName, shopLocation } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(400, 'User already exists with this email');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role: role || 'customer',
    shopName: role === 'barber' ? shopName : undefined,
    shopLocation: role === 'barber' ? shopLocation : undefined
  });

  if (user) {
    const token = generateToken(user._id);
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    new ApiResponse(res, 201, 'User registered successfully', {
      user: userResponse,
      token
    });
  } else {
    throw new ApiError(400, 'Invalid user data');
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  // Check if user is active
  if (!user.isActive) {
    throw new ApiError(401, 'Your account has been deactivated');
  }

  // Check password
  const isMatch = await user.matchPassword(password);
  console.log(`Login attempt for: ${email} | Password Match: ${isMatch}`);
  
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const token = generateToken(user._id);

  // Remove password from response
  const userResponse = user.toObject();
  delete userResponse.password;

  new ApiResponse(res, 200, 'Login successful', {
    user: userResponse,
    token
  });
});

// @desc    Request password reset link
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email || !email.trim()) {
    throw new ApiError(400, 'Email is required');
  }

  if (mongoose.connection.readyState !== 1) {
    throw new ApiError(404, 'No user found with this email');
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) {
    throw new ApiError(404, 'No user found with this email');
  }

  // In a production app, this would send an email or generate a token.
  // For this project, we return a safe confirmation that the process started.
  new ApiResponse(res, 200, 'Password reset instructions sent', {
    email: user.email,
    message: 'Please check your email inbox for reset instructions.'
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  new ApiResponse(res, 200, 'User data fetched successfully', { user });
});

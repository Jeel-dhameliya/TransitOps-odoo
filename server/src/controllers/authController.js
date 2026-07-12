const User = require("../models/User");
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '8h', 
  });
};

const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check if user exists (explicitly select password if it's disabled in model by default, though here it's fine)
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.matchPassword(password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3. Return the token and user data
  res.json({
    _id: user._id,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role),
  });
});


const registerUser = catchAsync(async (req, res, next) => {
  const { email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new AppError('User already exists', 400));
  }

  const user = await User.create({ email, password, role });

  res.status(201).json({
    _id: user._id,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role),
  });
});

// @desc    Get current logged in user details
// @route   GET /api/auth/me
// @access  Private
const getMe = catchAsync(async (req, res, next) => {
  // req.user is already fetched and stripped of the password by your 'protect' middleware
  res.json(req.user);
});

// @desc    Update user password
// @route   PUT /api/auth/update-password
// @access  Private
const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  // We have to re-fetch the user because req.user doesn't have the password attached
  const user = await User.findById(req.user._id).select('+password');

  // Verify current password
  if (!(await user.matchPassword(currentPassword))) {
    return next(new AppError('Incorrect current password.', 401));
  }

  // Set new password (your pre-save hook in User.js will automatically hash it!)
  user.password = newPassword;
  await user.save();

  // Send a new token so the user stays logged in
  res.json({ 
    message: 'Password updated successfully.',
    token: generateToken(user._id, user.role)
  });
});

module.exports = { loginUser, registerUser, getMe, updatePassword };
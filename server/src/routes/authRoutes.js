const express = require('express');
const { check } = require('express-validator');
const validate = require('../middleware/validate');
const { 
  loginUser, 
  registerUser, 
  getMe, 
  updatePassword 
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation Rules
const loginValidation = [
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Password is required').not().isEmpty()
];

const registerValidation = [
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  check('role', 'Role must be Fleet Manager, Driver, Safety Officer, or Financial Analyst').optional().isIn(['Fleet Manager', 'Driver', 'Safety Officer', 'Financial Analyst'])
];

const passwordValidation = [
  check('currentPassword', 'Current password is required').not().isEmpty(),
  check('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 })
];

// Public Routes
router.post('/login', loginValidation, validate, loginUser);
router.post('/register', registerValidation, validate, registerUser); // (Keep this for hackathon testing)

// Protected Routes (Require a valid JWT token)
router.get('/me', protect, getMe);
router.put('/update-password', protect, passwordValidation, validate, updatePassword);

module.exports = router;
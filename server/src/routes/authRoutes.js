const express = require('express');
const { 
  loginUser, 
  registerUser, 
  getMe, 
  updatePassword 
} = require('../controllers/authController');
const { protect } = require('../middleware/auth'); // Import your security middleware

const router = express.Router();

// Public Routes
router.post('/login', loginUser);
router.post('/register', registerUser); // (Keep this for hackathon testing)

// Protected Routes (Require a valid JWT token)
router.get('/me', protect, getMe);
router.put('/update-password', protect, updatePassword);

module.exports = router;
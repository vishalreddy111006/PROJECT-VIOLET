const express = require('express');
const router = express.Router();
const {
  register,
  verifyOTP,
  login,
  resendOTP,
  getMe,
  uploadIDDocument,
  updateProfile
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);
router.post('/resend-otp', resendOTP);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, upload.single('profileImage'), updateProfile);

// Admin verification
router.post(
  '/upload-id',
  protect,
  authorize('admin'),
  upload.single('idDocument'),
  uploadIDDocument
);

module.exports = router;

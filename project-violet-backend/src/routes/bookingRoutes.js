const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBookingById,
  acceptBooking,
  rejectBooking,
  cancelBooking
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Protected routes
router.post(
  '/',
  protect,
  authorize('customer'),
  upload.fields([{ name: 'adContent', maxCount: 5 }]),
  createBooking
);

router.get('/', protect, getBookings);
router.get('/:id', protect, getBookingById);

// Admin actions
router.put('/:id/accept', protect, authorize('admin'), acceptBooking);
router.put('/:id/reject', protect, authorize('admin'), rejectBooking);

// Customer actions
router.put('/:id/cancel', protect, authorize('customer'), cancelBooking);

module.exports = router;

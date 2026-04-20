const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  getMyJobs,
  acceptJob,
  rejectJob,
  startJob,
  completeJob,
  updateLocation,
  getNearbyJobs
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Protected routes - Agent
router.get('/', protect, authorize('agent'), getJobs);
router.get('/my/assignments', protect, authorize('agent'), getMyJobs);
router.get('/:id', protect, authorize('agent', 'admin'), getJobById);

// Agent actions
router.put('/:id/accept', protect, authorize('agent'), acceptJob);
router.put('/:id/reject', protect, authorize('agent'), rejectJob);
router.put('/:id/start', protect, authorize('agent'), startJob);
router.put(
  '/:id/complete',
  protect,
  authorize('agent'),
  upload.fields([{ name: 'proofImages', maxCount: 5 }]),
  completeJob
);

// Agent location
router.put('/agent/location', protect, authorize('agent'), updateLocation);
router.post('/nearby', protect, authorize('agent'), getNearbyJobs);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  createBillboard,
  getBillboards,
  getBillboardById,
  updateBillboard,
  deleteBillboard,
  getMyBillboards,
  getRecommendations,
  getSimilar,
  searchNearby
} = require('../controllers/billboardController');
const { protect, authorize, checkVerified } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getBillboards);
router.get('/:id', getBillboardById);
router.get('/:id/similar', getSimilar);
router.post('/recommendations', getRecommendations);
router.post('/search/nearby', searchNearby);

router.post('/', protect, authorize('admin'), upload.array('images', 5), createBillboard);
// Protected routes - Admin only
router.post(
  '/',
  protect,
  authorize('admin'),
  checkVerified,
  upload.fields([
    { name: 'billboardImages', maxCount: 5 },
    { name: 'documents', maxCount: 3 }
  ]),
  createBillboard
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  upload.fields([
    { name: 'billboardImages', maxCount: 5 }
  ]),
  updateBillboard
);

router.delete('/:id', protect, authorize('admin'), deleteBillboard);
router.get('/my/listings', protect, authorize('admin'), getMyBillboards);

module.exports = router;

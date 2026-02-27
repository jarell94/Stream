const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');
const { protect, authorize } = require('../middleware/auth');

// Public: get a random ad for a video
router.get('/for-video/:videoId', adController.getAdForVideo);

// Admin routes
router.get('/', protect, authorize('admin'), adController.getAllAds);
router.post('/', protect, authorize('admin'), adController.createAd);
router.put('/:id', protect, authorize('admin'), adController.updateAd);
router.delete('/:id', protect, authorize('admin'), adController.deleteAd);

module.exports = router;

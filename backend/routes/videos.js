const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { uploadVideo, uploadThumbnail } = require('../middleware/upload');

// Public routes
router.get('/', videoController.getAllVideos);
router.get('/featured', videoController.getFeaturedVideos);
router.get('/trending', videoController.getTrendingVideos);
router.get('/by-category/:categoryId', videoController.getVideosByCategory);
router.get('/by-genre/:genre', videoController.getVideosByGenre);
router.get('/:id', videoController.getVideoById);
router.get('/:id/stream', optionalAuth, videoController.streamVideo);
router.get('/:id/related', videoController.getRelatedVideos);

// Protected routes
router.post('/:id/like', protect, videoController.likeVideo);
router.post('/:id/add-to-list', protect, videoController.addToMyList);
router.delete('/:id/remove-from-list', protect, videoController.removeFromMyList);

// Admin routes
router.post(
  '/',
  protect,
  authorize('admin'),
  uploadVideo.single('video'),
  videoController.uploadVideo
);

router.post(
  '/:id/thumbnail',
  protect,
  authorize('admin'),
  uploadThumbnail.single('thumbnail'),
  videoController.uploadThumbnail
);

router.put('/:id', protect, authorize('admin'), videoController.updateVideo);
router.delete('/:id', protect, authorize('admin'), videoController.deleteVideo);
router.patch('/:id/publish', protect, authorize('admin'), videoController.publishVideo);

module.exports = router;

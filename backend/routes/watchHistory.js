const express = require('express');
const router = express.Router();
const watchHistoryController = require('../controllers/watchHistoryController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.get('/', watchHistoryController.getWatchHistory);
router.post('/', watchHistoryController.addToWatchHistory);
router.put('/:videoId', watchHistoryController.updateProgress);
router.delete('/:videoId', watchHistoryController.removeFromHistory);
router.delete('/', watchHistoryController.clearHistory);
router.get('/continue-watching', watchHistoryController.getContinueWatching);

module.exports = router;

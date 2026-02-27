const WatchHistory = require('../models/WatchHistory');

// @desc    Get watch history
// @route   GET /api/watch-history
// @access  Private
exports.getWatchHistory = async (req, res) => {
  try {
    const history = await WatchHistory.find({ user: req.user._id })
      .populate({
        path: 'video',
        populate: { path: 'category', select: 'name slug' }
      })
      .sort({ lastWatched: -1 });

    res.json({
      success: true,
      count: history.length,
      history
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add to watch history
// @route   POST /api/watch-history
// @access  Private
exports.addToWatchHistory = async (req, res) => {
  try {
    const { videoId, progress } = req.body;

    let history = await WatchHistory.findOne({
      user: req.user._id,
      video: videoId
    });

    if (history) {
      history.progress = progress;
      history.lastWatched = Date.now();
      await history.save();
    } else {
      history = await WatchHistory.create({
        user: req.user._id,
        video: videoId,
        progress
      });
    }

    res.json({
      success: true,
      history
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update progress
// @route   PUT /api/watch-history/:videoId
// @access  Private
exports.updateProgress = async (req, res) => {
  try {
    const { progress, completed } = req.body;

    let history = await WatchHistory.findOne({
      user: req.user._id,
      video: req.params.videoId
    });

    if (!history) {
      history = await WatchHistory.create({
        user: req.user._id,
        video: req.params.videoId,
        progress,
        completed: completed || false
      });
    } else {
      history.progress = progress;
      history.completed = completed || false;
      history.lastWatched = Date.now();
      await history.save();
    }

    res.json({
      success: true,
      history
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Remove from history
// @route   DELETE /api/watch-history/:videoId
// @access  Private
exports.removeFromHistory = async (req, res) => {
  try {
    await WatchHistory.deleteOne({
      user: req.user._id,
      video: req.params.videoId
    });

    res.json({
      success: true,
      message: 'Removed from watch history'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Clear history
// @route   DELETE /api/watch-history
// @access  Private
exports.clearHistory = async (req, res) => {
  try {
    await WatchHistory.deleteMany({ user: req.user._id });

    res.json({
      success: true,
      message: 'Watch history cleared'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get continue watching
// @route   GET /api/watch-history/continue-watching
// @access  Private
exports.getContinueWatching = async (req, res) => {
  try {
    const history = await WatchHistory.find({
      user: req.user._id,
      completed: false,
      progress: { $gt: 0 }
    })
      .populate({
        path: 'video',
        populate: { path: 'category', select: 'name slug' }
      })
      .sort({ lastWatched: -1 })
      .limit(10);

    res.json({
      success: true,
      count: history.length,
      history
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

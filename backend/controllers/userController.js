const User = require('../models/User');
const Video = require('../models/Video');
const WatchHistory = require('../models/WatchHistory');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's list
// @route   GET /api/users/my-list
// @access  Private
exports.getMyList = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'myList',
      populate: { path: 'category', select: 'name slug' }
    });

    res.json({
      success: true,
      count: user.myList.length,
      videos: user.myList
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get personalized recommendations
// @route   GET /api/users/recommendations
// @access  Private
exports.getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Get watch history to understand user preferences
    const watchHistory = await WatchHistory.find({ user: user._id })
      .populate('video')
      .sort({ lastWatched: -1 })
      .limit(20);

    // Extract genres from watched videos
    const watchedGenres = [];
    watchHistory.forEach(history => {
      if (history.video && history.video.genre) {
        watchedGenres.push(...history.video.genre);
      }
    });

    // Get unique genres
    const uniqueGenres = [...new Set(watchedGenres)];

    // Find videos with similar genres
    let recommendations = [];
    if (uniqueGenres.length > 0) {
      recommendations = await Video.find({
        genre: { $in: uniqueGenres },
        isPublished: true,
        _id: { $nin: watchHistory.map(h => h.video._id) } // Exclude already watched
      })
        .populate('category', 'name slug')
        .limit(20)
        .select('-videoUrl');
    }

    // If not enough recommendations, add popular videos
    if (recommendations.length < 20) {
      const popular = await Video.find({
        isPublished: true,
        _id: { $nin: recommendations.map(v => v._id) }
      })
        .sort({ views: -1 })
        .limit(20 - recommendations.length)
        .select('-videoUrl');

      recommendations = [...recommendations, ...popular];
    }

    res.json({
      success: true,
      count: recommendations.length,
      videos: recommendations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
exports.updatePreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (req.body.favoriteGenres) {
      user.preferences.favoriteGenres = req.body.favoriteGenres;
    }
    if (req.body.preferredQuality) {
      user.preferences.preferredQuality = req.body.preferredQuality;
    }
    if (typeof req.body.autoplay !== 'undefined') {
      user.preferences.autoplay = req.body.autoplay;
    }

    await user.save();

    res.json({
      success: true,
      preferences: user.preferences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

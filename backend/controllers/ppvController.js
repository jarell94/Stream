const Video = require('../models/Video');
const User = require('../models/User');

// @desc    Purchase access to a PPV event
// @route   POST /api/ppv/:videoId/purchase
// @access  Private
exports.purchasePPV = async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    if (!video.isPPV) {
      return res.status(400).json({
        success: false,
        message: 'This video is not a pay-per-view event'
      });
    }

    const user = await User.findById(req.user._id);

    // Check if already purchased
    if (user.hasPurchasedPPV(video._id)) {
      return res.status(400).json({
        success: false,
        message: 'You have already purchased access to this event'
      });
    }

    user.purchasedPPV.push({
      video: video._id,
      price: video.ppvPrice
    });
    await user.save();

    res.json({
      success: true,
      message: `Successfully purchased access to "${video.title}"`,
      price: video.ppvPrice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Check if current user has PPV access to a video
// @route   GET /api/ppv/:videoId/access
// @access  Private
exports.checkPPVAccess = async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    if (!video.isPPV) {
      return res.json({ success: true, hasAccess: true });
    }

    // Premium subscribers get PPV access automatically
    if (req.user.subscription && req.user.subscription.plan === 'premium') {
      return res.json({ success: true, hasAccess: true });
    }

    const user = await User.findById(req.user._id);
    const hasAccess = user.hasPurchasedPPV(video._id);

    res.json({ success: true, hasAccess });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get current user's PPV purchases
// @route   GET /api/ppv/purchases
// @access  Private
exports.getPPVPurchases = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      'purchasedPPV.video',
      'title thumbnail duration releaseYear'
    );

    res.json({
      success: true,
      purchases: user.purchasedPPV
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

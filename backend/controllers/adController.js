const Ad = require('../models/Ad');

// @desc    Get a random active ad for a video (for free/ad-supported content)
// @route   GET /api/ads/for-video/:videoId
// @access  Public
exports.getAdForVideo = async (req, res) => {
  try {
    const { type = 'pre-roll' } = req.query;
    const count = await Ad.countDocuments({ isActive: true, type });

    if (count === 0) {
      return res.json({ success: true, ad: null });
    }

    const random = Math.floor(Math.random() * count);
    const ad = await Ad.findOne({ isActive: true, type }).skip(random);

    res.json({ success: true, ad });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all ads
// @route   GET /api/ads
// @access  Private/Admin
exports.getAllAds = async (req, res) => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 });
    res.json({ success: true, count: ads.length, ads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new ad
// @route   POST /api/ads
// @access  Private/Admin
exports.createAd = async (req, res) => {
  try {
    const ad = await Ad.create(req.body);
    res.status(201).json({ success: true, ad });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update an ad
// @route   PUT /api/ads/:id
// @access  Private/Admin
exports.updateAd = async (req, res) => {
  try {
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!ad) {
      return res.status(404).json({ success: false, message: 'Ad not found' });
    }

    res.json({ success: true, ad });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an ad
// @route   DELETE /api/ads/:id
// @access  Private/Admin
exports.deleteAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({ success: false, message: 'Ad not found' });
    }

    await ad.deleteOne();
    res.json({ success: true, message: 'Ad deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

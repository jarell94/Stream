const Video = require('../models/Video');
const WatchHistory = require('../models/WatchHistory');
const fs = require('fs');
const path = require('path');

// @desc    Get all videos with pagination and filters
// @route   GET /api/videos
// @access  Public
exports.getAllVideos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = { isPublished: true };
    
    if (req.query.genre) {
      filter.genre = req.query.genre;
    }

    const videos = await Video.find(filter)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-videoUrl'); // Don't send video URL in list

    const total = await Video.countDocuments(filter);

    res.json({
      success: true,
      count: videos.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      videos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get featured videos
// @route   GET /api/videos/featured
// @access  Public
exports.getFeaturedVideos = async (req, res) => {
  try {
    const videos = await Video.find({ featured: true, isPublished: true })
      .populate('category', 'name slug')
      .limit(10)
      .select('-videoUrl');

    res.json({
      success: true,
      count: videos.length,
      videos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get trending videos
// @route   GET /api/videos/trending
// @access  Public
exports.getTrendingVideos = async (req, res) => {
  try {
    const videos = await Video.find({ trending: true, isPublished: true })
      .populate('category', 'name slug')
      .sort({ views: -1 })
      .limit(20)
      .select('-videoUrl');

    res.json({
      success: true,
      count: videos.length,
      videos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get videos by category
// @route   GET /api/videos/by-category/:categoryId
// @access  Public
exports.getVideosByCategory = async (req, res) => {
  try {
    const videos = await Video.find({
      category: req.params.categoryId,
      isPublished: true
    })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .select('-videoUrl');

    res.json({
      success: true,
      count: videos.length,
      videos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get videos by genre
// @route   GET /api/videos/by-genre/:genre
// @access  Public
exports.getVideosByGenre = async (req, res) => {
  try {
    const videos = await Video.find({
      genre: req.params.genre,
      isPublished: true
    })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .select('-videoUrl');

    res.json({
      success: true,
      count: videos.length,
      videos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get video by ID
// @route   GET /api/videos/:id
// @access  Public
exports.getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('uploadedBy', 'username');

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    res.json({
      success: true,
      video
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Stream video
// @route   GET /api/videos/:id/stream
// @access  Public (PPV videos require auth + purchase)
exports.streamVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    // PPV access control
    if (video.isPPV) {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Please log in to watch this pay-per-view event'
        });
      }

      // Premium subscribers get free PPV access
      const isPremium = req.user.subscription && req.user.subscription.plan === 'premium';

      if (!isPremium) {
        const hasPurchased = req.user.hasPurchasedPPV(video._id);

        if (!hasPurchased) {
          return res.status(403).json({
            success: false,
            message: 'Purchase required to watch this pay-per-view event',
            isPPV: true,
            ppvPrice: video.ppvPrice
          });
        }
      }
    }

    // Increment views
    await video.incrementViews();

    const videoPath = path.join(__dirname, '..', video.videoUrl);
    
    // Check if file exists
    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({
        success: false,
        message: 'Video file not found'
      });
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get related videos
// @route   GET /api/videos/:id/related
// @access  Public
exports.getRelatedVideos = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    // Find videos with similar genre or category
    const relatedVideos = await Video.find({
      _id: { $ne: video._id },
      $or: [
        { genre: { $in: video.genre } },
        { category: video.category }
      ],
      isPublished: true
    })
      .limit(12)
      .select('-videoUrl');

    res.json({
      success: true,
      count: relatedVideos.length,
      videos: relatedVideos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Like video
// @route   POST /api/videos/:id/like
// @access  Private
exports.likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    video.likes += 1;
    await video.save();

    res.json({
      success: true,
      likes: video.likes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add video to my list
// @route   POST /api/videos/:id/add-to-list
// @access  Private
exports.addToMyList = async (req, res) => {
  try {
    const user = req.user;

    if (user.myList.includes(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Video already in your list'
      });
    }

    user.myList.push(req.params.id);
    await user.save();

    res.json({
      success: true,
      message: 'Video added to your list'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Remove video from my list
// @route   DELETE /api/videos/:id/remove-from-list
// @access  Private
exports.removeFromMyList = async (req, res) => {
  try {
    const user = req.user;

    user.myList = user.myList.filter(id => id.toString() !== req.params.id);
    await user.save();

    res.json({
      success: true,
      message: 'Video removed from your list'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Upload video
// @route   POST /api/videos
// @access  Private/Admin
exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a video file'
      });
    }

    const videoData = {
      ...req.body,
      videoUrl: req.file.path,
      uploadedBy: req.user._id,
      genre: req.body.genre ? req.body.genre.split(',') : []
    };

    const video = await Video.create(videoData);

    res.status(201).json({
      success: true,
      video
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Upload thumbnail
// @route   POST /api/videos/:id/thumbnail
// @access  Private/Admin
exports.uploadThumbnail = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a thumbnail'
      });
    }

    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    video.thumbnail = req.file.path;
    await video.save();

    res.json({
      success: true,
      video
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update video
// @route   PUT /api/videos/:id
// @access  Private/Admin
exports.updateVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    res.json({
      success: true,
      video
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete video
// @route   DELETE /api/videos/:id
// @access  Private/Admin
exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    // Delete video file
    if (fs.existsSync(video.videoUrl)) {
      fs.unlinkSync(video.videoUrl);
    }

    // Delete thumbnail
    if (fs.existsSync(video.thumbnail)) {
      fs.unlinkSync(video.thumbnail);
    }

    await video.deleteOne();

    res.json({
      success: true,
      message: 'Video deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Publish/Unpublish video
// @route   PATCH /api/videos/:id/publish
// @access  Private/Admin
exports.publishVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    video.isPublished = !video.isPublished;
    await video.save();

    res.json({
      success: true,
      video
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

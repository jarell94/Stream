const Video = require('../models/Video');

// @desc    Search videos
// @route   GET /api/search?q=query
// @access  Public
exports.search = async (req, res) => {
  try {
    const { q, genre, year, rating, sort } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query'
      });
    }

    const query = {
      isPublished: true,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } },
        { cast: { $elemMatch: { name: { $regex: q, $options: 'i' } } } },
        { director: { $regex: q, $options: 'i' } }
      ]
    };

    // Additional filters
    if (genre) {
      query.genre = genre;
    }
    if (year) {
      query.releaseYear = parseInt(year);
    }
    if (rating) {
      query.rating = rating;
    }

    // Sorting
    let sortOption = { views: -1 }; // Default sort by views
    if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sort === 'rating') {
      sortOption = { imdbRating: -1 };
    }

    const videos = await Video.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .limit(50)
      .select('-videoUrl');

    res.json({
      success: true,
      count: videos.length,
      query: q,
      videos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Autocomplete search
// @route   GET /api/search/autocomplete?q=query
// @access  Public
exports.autocomplete = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res.json({
        success: true,
        suggestions: []
      });
    }

    const videos = await Video.find({
      isPublished: true,
      title: { $regex: q, $options: 'i' }
    })
      .select('title')
      .limit(10);

    const suggestions = videos.map(video => video.title);

    res.json({
      success: true,
      suggestions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: 2000
  },
  thumbnail: {
    type: String,
    required: true
  },
  trailer: {
    type: String
  },
  videoUrl: {
    type: String,
    required: true
  },
  videoQualities: [{
    quality: {
      type: String,
      enum: ['360', '480', '720', '1080', '4k']
    },
    url: String,
    size: Number
  }],
  duration: {
    type: Number, // Duration in seconds
    required: true
  },
  releaseYear: {
    type: Number,
    required: true
  },
  genre: [{
    type: String,
    required: true
  }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  cast: [{
    name: String,
    role: String,
    image: String
  }],
  director: String,
  rating: {
    type: String,
    enum: ['G', 'PG', 'PG-13', 'R', 'NC-17', 'TV-Y', 'TV-Y7', 'TV-G', 'TV-PG', 'TV-14', 'TV-MA'],
    default: 'PG-13'
  },
  imdbRating: {
    type: Number,
    min: 0,
    max: 10
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  trending: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [String],
  language: {
    type: String,
    default: 'English'
  },
  subtitles: [{
    language: String,
    url: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better search performance
videoSchema.index({ title: 'text', description: 'text', tags: 'text' });
videoSchema.index({ genre: 1 });
videoSchema.index({ views: -1 });
videoSchema.index({ createdAt: -1 });

// Increment views
videoSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

module.exports = mongoose.model('Video', videoSchema);

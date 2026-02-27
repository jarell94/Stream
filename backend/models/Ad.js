const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an ad title'],
    trim: true,
    maxlength: 200
  },
  videoUrl: {
    type: String,
    required: [true, 'Please provide an ad video URL']
  },
  clickThroughUrl: {
    type: String,
    default: ''
  },
  duration: {
    type: Number, // Duration in seconds
    required: true
  },
  type: {
    type: String,
    enum: ['pre-roll', 'mid-roll', 'post-roll'],
    default: 'pre-roll'
  },
  skipAfter: {
    type: Number, // Seconds before user can skip; 0 = non-skippable
    default: 5
  },
  isActive: {
    type: Boolean,
    default: true
  },
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

module.exports = mongoose.model('Ad', adSchema);

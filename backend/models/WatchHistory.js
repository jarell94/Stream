const mongoose = require('mongoose');

const watchHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true
  },
  progress: {
    type: Number, // Progress in seconds
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  lastWatched: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
watchHistorySchema.index({ user: 1, video: 1 }, { unique: true });
watchHistorySchema.index({ lastWatched: -1 });

module.exports = mongoose.model('WatchHistory', watchHistorySchema);

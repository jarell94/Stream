const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  profilePicture: {
    type: String,
    default: 'default-avatar.png'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  myList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }],
  preferences: {
    favoriteGenres: [String],
    preferredQuality: {
      type: String,
      enum: ['360', '480', '720', '1080', 'auto'],
      default: 'auto'
    },
    autoplay: {
      type: Boolean,
      default: true
    }
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'premium'],
      default: 'free'
    },
    startDate: Date,
    endDate: Date
  },
  purchasedPPV: [{
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video'
    },
    purchasedAt: {
      type: Date,
      default: Date.now
    },
    price: {
      type: Number,
      default: 0
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive data from JSON response
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Check if user has purchased a PPV video
userSchema.methods.hasPurchasedPPV = function(videoId) {
  return this.purchasedPPV.some(
    (p) => p.video.toString() === videoId.toString()
  );
};

module.exports = mongoose.model('User', userSchema);

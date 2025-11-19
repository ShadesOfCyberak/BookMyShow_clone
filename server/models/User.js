const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot be more than 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't include password in query results by default
  },
  phone: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'theater_owner'],
    default: 'user'
  },
  theaterIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater'
  }], // For theater owners - which theaters they manage
  favorites: [{
    type: Number,
    ref: 'Movie'
  }],
  watchlist: [{
    type: Number,
    ref: 'Movie'
  }],
  userRatings: {
    type: Map,
    of: Number
  },
  // BookMyShow specific fields
  location: {
    city: {
      type: String,
      default: 'Mumbai'
    },
    state: {
      type: String,
      default: 'Maharashtra'
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  bookingHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  paymentMethods: [{
    type: {
      type: String,
      enum: ['Credit Card', 'Debit Card', 'UPI', 'Wallet']
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    lastFour: String, // Last 4 digits for cards
    expiryMonth: Number,
    expiryYear: Number
  }],
  preferences: {
    darkMode: {
      type: Boolean,
      default: false
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    subtitles: {
      type: Boolean,
      default: false
    }
  },
  notificationSettings: {
    email: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: true
    },
    newReleases: {
      type: Boolean,
      default: true
    },
    recommendations: {
      type: Boolean,
      default: true
    }
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  // Only hash the password if it's modified or new
  if (!this.isModified('password')) {
    next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
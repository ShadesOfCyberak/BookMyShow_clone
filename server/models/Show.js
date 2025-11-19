const mongoose = require('mongoose');

const ShowSchema = new mongoose.Schema({
  movie: {
    tmdbId: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    posterPath: String,
    duration: Number, // in minutes
    genre: [String],
    rating: String, // U, UA, A
    language: String
  },
  theater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
    required: true
  },
  screen: {
    screenId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  showTimes: [{
    date: {
      type: Date,
      required: true
    },
    time: {
      type: String,
      required: true // Format: "HH:MM" e.g., "14:30"
    },
    price: {
      Premium: Number,
      Gold: Number,
      Silver: Number,
      Regular: Number
    },
    availableSeats: {
      type: Number,
      required: true
    },
    bookedSeats: [String], // Array of seat numbers like ['A1', 'A2', 'B5']
    status: {
      type: String,
      enum: ['Active', 'Cancelled', 'Full'],
      default: 'Active'
    }
  }],
  format: {
    type: String,
    enum: ['2D', '3D', 'IMAX', '4DX'],
    default: '2D'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Coming Soon'],
    default: 'Active'
  }
}, {
  timestamps: true
});

// Index for efficient queries
ShowSchema.index({ 'movie.tmdbId': 1, 'theater': 1, 'showTimes.date': 1 });
ShowSchema.index({ 'theater': 1, 'showTimes.date': 1 });

module.exports = mongoose.model('Show', ShowSchema);

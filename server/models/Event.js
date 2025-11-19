const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Event description is required']
  },
  category: {
    type: String,
    enum: ['Concert', 'Theatre', 'Sports', 'Comedy', 'Workshop', 'Exhibition', 'Dance', 'Other'],
    required: true
  },
  images: {
    poster: String,
    banner: String,
    gallery: [String]
  },
  venue: {
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    capacity: Number,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  organizer: {
    name: String,
    contact: {
      phone: String,
      email: String
    }
  },
  dates: [{
    date: {
      type: Date,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: String,
    ticketTypes: [{
      name: {
        type: String,
        required: true // e.g., 'General', 'VIP', 'Premium'
      },
      price: {
        type: Number,
        required: true
      },
      totalSeats: {
        type: Number,
        required: true
      },
      availableSeats: {
        type: Number,
        required: true
      },
      benefits: [String] // e.g., ['Meet & Greet', 'Front Row Access']
    }],
    status: {
      type: String,
      enum: ['Active', 'Sold Out', 'Cancelled'],
      default: 'Active'
    }
  }],
  ageRestriction: {
    type: String,
    enum: ['All Ages', '13+', '16+', '18+', '21+'],
    default: 'All Ages'
  },
  language: [String],
  duration: String, // e.g., "2 hours", "3 hours 30 minutes"
  tags: [String], // for search and filtering
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Coming Soon', 'Cancelled'],
    default: 'Active'
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
EventSchema.index({ category: 1, 'venue.city': 1, 'dates.date': 1 });
EventSchema.index({ featured: 1, status: 1 });
EventSchema.index({ tags: 1 });

module.exports = mongoose.model('Event', EventSchema);

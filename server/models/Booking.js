const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show',
    required: true
  },
  movie: {
    tmdbId: Number,
    title: String,
    posterPath: String
  },
  theater: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theater',
      required: true
    },
    name: String,
    address: String
  },
  screen: {
    screenId: String,
    name: String
  },
  showTime: {
    date: {
      type: Date,
      required: true
    },
    time: {
      type: String,
      required: true
    }
  },
  seats: [{
    seatNumber: {
      type: String,
      required: true // e.g., 'A1', 'B5'
    },
    seatType: {
      type: String,
      enum: ['Premium', 'Gold', 'Silver', 'Regular'],
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  convenienceFee: {
    type: Number,
    default: 0
  },
  taxes: {
    type: Number,
    default: 0
  },
  finalAmount: {
    type: Number,
    required: true
  },
  payment: {
    method: {
      type: String,
      enum: ['Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Wallet'],
      required: true
    },
    transactionId: String,
    status: {
      type: String,
      enum: ['Pending', 'Success', 'Failed', 'Refunded'],
      default: 'Pending'
    },
    paidAt: Date
  },
  bookingId: {
    type: String,
    unique: true,
    required: true
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Cancelled', 'Refunded'],
    default: 'Confirmed'
  },
  qrCode: String, // For ticket validation
  cancellationPolicy: {
    canCancel: {
      type: Boolean,
      default: true
    },
    cancelBefore: Date, // Cancel before this time
    refundAmount: Number
  }
}, {
  timestamps: true
});

// Generate booking ID before saving
BookingSchema.pre('save', function(next) {
  if (!this.bookingId) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.bookingId = `BMS${timestamp}${random}`;
  }
  next();
});

// Index for efficient queries
BookingSchema.index({ user: 1, createdAt: -1 });
BookingSchema.index({ bookingId: 1 });
BookingSchema.index({ 'showTime.date': 1, theater: 1 });

module.exports = mongoose.model('Booking', BookingSchema);

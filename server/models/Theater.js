const mongoose = require('mongoose');

const TheaterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Theater name is required'],
    trim: true
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required']
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  screens: [{
    screenId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    capacity: {
      type: Number,
      required: true
    },
    seatLayout: {
      rows: {
        type: Number,
        required: true
      },
      seatsPerRow: {
        type: Number,
        required: true
      },
      seatTypes: [{
        type: {
          type: String,
          enum: ['Premium', 'Gold', 'Silver', 'Regular'],
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        rows: [String] // e.g., ['A', 'B', 'C'] for Premium
      }]
    }
  }],
  amenities: [String], // ['Parking', 'Food Court', 'AC', '3D', 'IMAX']
  contact: {
    phone: String,
    email: String
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Maintenance'],
    default: 'Active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Theater', TheaterSchema);

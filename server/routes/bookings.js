const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');
const Show = require('../models/Show');
const User = require('../models/User');

// @route   GET /api/bookings
// @desc    Get user's booking history
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('show', 'movie showTimes')
      .populate('theater.id', 'name location')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get booking by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id
    })
    .populate('show', 'movie showTimes')
    .populate('theater.id', 'name location');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { 
      showId, 
      showTimeId, 
      seats, 
      paymentMethod 
    } = req.body;
    
    // Fetch show details
    const show = await Show.findById(showId).populate('theater');
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }
    
    const showTime = show.showTimes.find(st => st._id.toString() === showTimeId);
    if (!showTime) {
      return res.status(404).json({ message: 'Show time not found' });
    }
    
    // Verify seats are still available
    const unavailableSeats = seats.filter(seat => 
      showTime.bookedSeats.includes(seat.seatNumber)
    );
    
    if (unavailableSeats.length > 0) {
      return res.status(400).json({ 
        message: 'Some seats are no longer available',
        unavailableSeats: unavailableSeats.map(s => s.seatNumber)
      });
    }
    
    // Calculate pricing
    const totalAmount = seats.reduce((sum, seat) => sum + seat.price, 0);
    const convenienceFee = Math.round(totalAmount * 0.02); // 2% convenience fee
    const taxes = Math.round((totalAmount + convenienceFee) * 0.18); // 18% GST
    const finalAmount = totalAmount + convenienceFee + taxes;
    
    // Create booking
    const booking = new Booking({
      user: req.user.id,
      show: showId,
      movie: {
        tmdbId: show.movie.tmdbId,
        title: show.movie.title,
        posterPath: show.movie.posterPath
      },
      theater: {
        id: show.theater._id,
        name: show.theater.name,
        address: show.theater.location.address
      },
      screen: show.screen,
      showTime: {
        date: showTime.date,
        time: showTime.time
      },
      seats,
      totalAmount,
      convenienceFee,
      taxes,
      finalAmount,
      payment: {
        method: paymentMethod,
        status: 'Success', // Simulate successful payment
        transactionId: `TXN${Date.now()}`,
        paidAt: new Date()
      }
    });
    
    await booking.save();
    
    // Update show seat availability
    showTime.bookedSeats.push(...seats.map(s => s.seatNumber));
    showTime.availableSeats -= seats.length;
    
    if (showTime.availableSeats === 0) {
      showTime.status = 'Full';
    }
    
    await show.save();
    
    // Add booking to user's history
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { bookingHistory: booking._id } }
    );
    
    // Generate QR code (simplified)
    booking.qrCode = `BMS_QR_${booking.bookingId}_${Date.now()}`;
    await booking.save();
    
    const populatedBooking = await Booking.findById(booking._id)
      .populate('show', 'movie')
      .populate('theater.id', 'name location');
    
    res.status(201).json(populatedBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel a booking
// @access  Private
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id,
      status: 'Confirmed'
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or already cancelled' });
    }
    
    // Check if cancellation is allowed
    const showDateTime = new Date(booking.showTime.date);
    const [hours, minutes] = booking.showTime.time.split(':');
    showDateTime.setHours(parseInt(hours), parseInt(minutes));
    
    const now = new Date();
    const timeDiff = (showDateTime - now) / (1000 * 60 * 60); // hours
    
    if (timeDiff < 2) { // Cannot cancel within 2 hours of show
      return res.status(400).json({ 
        message: 'Cannot cancel booking within 2 hours of show time' 
      });
    }
    
    // Calculate refund (deduct cancellation charges)
    const cancellationCharge = Math.min(booking.finalAmount * 0.1, 200); // 10% or ₹200 max
    const refundAmount = booking.finalAmount - cancellationCharge;
    
    // Update booking status
    booking.status = 'Cancelled';
    booking.cancellationPolicy.refundAmount = refundAmount;
    booking.payment.status = 'Refunded';
    
    await booking.save();
    
    // Free up the seats in the show
    const show = await Show.findById(booking.show);
    if (show) {
      const showTime = show.showTimes.find(st => 
        st.date.toDateString() === booking.showTime.date.toDateString() &&
        st.time === booking.showTime.time
      );
      
      if (showTime) {
        booking.seats.forEach(seat => {
          const seatIndex = showTime.bookedSeats.indexOf(seat.seatNumber);
          if (seatIndex > -1) {
            showTime.bookedSeats.splice(seatIndex, 1);
          }
        });
        
        showTime.availableSeats += booking.seats.length;
        if (showTime.status === 'Full') {
          showTime.status = 'Active';
        }
        
        await show.save();
      }
    }
    
    res.json({ 
      message: 'Booking cancelled successfully',
      refundAmount,
      cancellationCharge
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings/ticket/:bookingId
// @desc    Get ticket details by booking ID (for validation)
// @access  Public (but requires booking ID)
router.get('/ticket/:bookingId', async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      bookingId: req.params.bookingId,
      status: 'Confirmed'
    })
    .populate('show', 'movie')
    .populate('theater.id', 'name location')
    .select('-user'); // Don't expose user details
    
    if (!booking) {
      return res.status(404).json({ message: 'Invalid ticket' });
    }
    
    res.json(booking);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

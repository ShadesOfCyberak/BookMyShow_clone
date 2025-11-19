const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Show = require('../models/Show');
const Theater = require('../models/Theater');

// @route   GET /api/shows
// @desc    Get shows by movie, theater, or date
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { movieId, theaterId, date, city } = req.query;
    
    let query = { status: 'Active' };
    
    if (movieId) {
      query['movie.tmdbId'] = parseInt(movieId);
    }
    
    if (theaterId) {
      query.theater = theaterId;
    }
    
    if (date) {
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      query['showTimes.date'] = {
        $gte: searchDate,
        $lt: nextDay
      };
    } else {
      // Default to today and future shows
      query['showTimes.date'] = { $gte: new Date() };
    }
    
    let shows = await Show.find(query)
      .populate('theater', 'name location')
      .select('-__v')
      .sort({ 'showTimes.date': 1, 'showTimes.time': 1 });
    
    // Filter by city if provided
    if (city) {
      shows = shows.filter(show => 
        show.theater.location.city.toLowerCase().includes(city.toLowerCase())
      );
    }
    
    res.json(shows);
  } catch (error) {
    console.error('Error fetching shows:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/shows/:id
// @desc    Get show by ID with seat availability
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { showTimeId } = req.query;
    
    const show = await Show.findById(req.params.id)
      .populate('theater', 'name location screens');
    
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }
    
    // If specific showtime requested, add seat layout information
    if (showTimeId) {
      const showTime = show.showTimes.find(st => st._id.toString() === showTimeId);
      if (!showTime) {
        return res.status(404).json({ message: 'Show time not found' });
      }
      
      // Get seat layout from theater
      const screen = show.theater.screens.find(s => s.screenId === show.screen.screenId);
      if (screen) {
        showTime.seatLayout = screen.seatLayout;
      }
      
      return res.json({
        ...show.toObject(),
        selectedShowTime: showTime
      });
    }
    
    res.json(show);
  } catch (error) {
    console.error('Error fetching show:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/shows
// @desc    Create a new show (Admin only)
// @access  Private/Admin
router.post('/', auth, async (req, res) => {
  try {
    // Verify theater exists
    const theater = await Theater.findById(req.body.theater);
    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }
    
    // Verify screen exists in theater
    const screen = theater.screens.find(s => s.screenId === req.body.screen.screenId);
    if (!screen) {
      return res.status(404).json({ message: 'Screen not found in theater' });
    }
    
    // Set available seats based on screen capacity
    const showData = {
      ...req.body,
      showTimes: req.body.showTimes.map(showTime => ({
        ...showTime,
        availableSeats: showTime.availableSeats || screen.capacity,
        bookedSeats: []
      }))
    };
    
    const show = new Show(showData);
    await show.save();
    
    const populatedShow = await Show.findById(show._id).populate('theater', 'name location');
    res.status(201).json(populatedShow);
  } catch (error) {
    console.error('Error creating show:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/shows/:id/book-seats
// @desc    Book seats for a show (temporary hold)
// @access  Private
router.put('/:id/book-seats', auth, async (req, res) => {
  try {
    const { showTimeId, seats } = req.body;
    
    const show = await Show.findById(req.params.id);
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }
    
    const showTime = show.showTimes.find(st => st._id.toString() === showTimeId);
    if (!showTime) {
      return res.status(404).json({ message: 'Show time not found' });
    }
    
    // Check if seats are available
    const unavailableSeats = seats.filter(seat => showTime.bookedSeats.includes(seat));
    if (unavailableSeats.length > 0) {
      return res.status(400).json({ 
        message: 'Some seats are already booked',
        unavailableSeats 
      });
    }
    
    // Temporarily book seats (will be confirmed in booking process)
    showTime.bookedSeats.push(...seats);
    showTime.availableSeats -= seats.length;
    
    await show.save();
    
    res.json({ 
      message: 'Seats temporarily reserved',
      reservedSeats: seats,
      expiresIn: '10 minutes' // Implement actual expiry logic
    });
  } catch (error) {
    console.error('Error booking seats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/shows/:id
// @desc    Update show (Admin only)
// @access  Private/Admin
router.put('/:id', auth, async (req, res) => {
  try {
    const show = await Show.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('theater', 'name location');
    
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }
    
    res.json(show);
  } catch (error) {
    console.error('Error updating show:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/shows/:id
// @desc    Delete show (Admin only)
// @access  Private/Admin
router.delete('/:id', auth, async (req, res) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);
    
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }
    
    res.json({ message: 'Show deleted successfully' });
  } catch (error) {
    console.error('Error deleting show:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

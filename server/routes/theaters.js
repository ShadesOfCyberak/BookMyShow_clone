const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { requireAdmin, requireTheaterOwner, requireAdminOrTheaterOwner, requireTheaterOwnership } = require('../middleware/roleAuth');
const Theater = require('../models/Theater');
const Show = require('../models/Show');
const User = require('../models/User');

// @route   GET /api/theaters
// @desc    Get all theaters in a city
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { city, movieId } = req.query;
    
    let query = {};
    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }
    
    const theaters = await Theater.find(query).select('-__v');
    
    // If movieId is provided, also get show timings
    if (movieId) {
      const theatersWithShows = await Promise.all(
        theaters.map(async (theater) => {
          const shows = await Show.find({
            'movie.tmdbId': parseInt(movieId),
            theater: theater._id,
            status: 'Active',
            'showTimes.date': { $gte: new Date() }
          }).select('showTimes screen format');
          
          return {
            ...theater.toObject(),
            shows: shows
          };
        })
      );
      
      return res.json(theatersWithShows.filter(t => t.shows.length > 0));
    }
    
    res.json(theaters);
  } catch (error) {
    console.error('Error fetching theaters:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/theaters/:id
// @desc    Get theater by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const theater = await Theater.findById(req.params.id);
    
    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }
    
    res.json(theater);
  } catch (error) {
    console.error('Error fetching theater:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/theaters
// @desc    Create a new theater (Admin only)
// @access  Private/Admin or Theater Owner
router.post('/', auth, requireAdminOrTheaterOwner, async (req, res) => {
  try {
    const theater = new Theater(req.body);
    
    // If user is theater owner, add them to the theater
    if (req.user.role === 'theater_owner') {
      theater.owner = req.user.id;
    }
    
    await theater.save();
    
    // Add theater to user's theaterIds if they're a theater owner
    if (req.user.role === 'theater_owner') {
      await User.findByIdAndUpdate(req.user.id, {
        $push: { theaterIds: theater._id }
      });
    }
    
    res.status(201).json({
      success: true,
      data: theater
    });
  } catch (error) {
    console.error('Error creating theater:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

// @route   PUT /api/theaters/:id
// @desc    Update theater (Admin only)
// @access  Private/Admin
router.put('/:id', auth, async (req, res) => {
  try {
    const theater = await Theater.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }
    
    res.json(theater);
  } catch (error) {
    console.error('Error updating theater:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/theaters/:id
// @desc    Delete theater (Admin only)
// @access  Private/Admin
router.delete('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const theater = await Theater.findByIdAndDelete(req.params.id);
    
    if (!theater) {
      return res.status(404).json({ 
        success: false,
        error: 'Theater not found' 
      });
    }
    
    res.json({ 
      success: true,
      message: 'Theater deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting theater:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

// @route   GET /api/theaters/my-theaters
// @desc    Get theaters owned by the current theater owner
// @access  Private/Theater Owner
router.get('/my-theaters', auth, requireTheaterOwner, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('theaterIds');
    
    res.json({
      success: true,
      data: user.theaterIds || []
    });
  } catch (error) {
    console.error('Error fetching my theaters:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/Event');

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      city, 
      category, 
      date, 
      featured, 
      search,
      page = 1,
      limit = 20
    } = req.query;
    
    let query = { status: 'Active' };
    
    // Filter by city
    if (city) {
      query['venue.city'] = new RegExp(city, 'i');
    }
    
    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }
    
    // Filter by date
    if (date) {
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      query['dates.date'] = {
        $gte: searchDate,
        $lt: nextDay
      };
    } else {
      // Default to future events
      query['dates.date'] = { $gte: new Date() };
    }
    
    // Filter featured events
    if (featured === 'true') {
      query.featured = true;
    }
    
    // Search in title and description
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { tags: new RegExp(search, 'i') }
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const events = await Event.find(query)
      .select('-__v')
      .sort({ 'dates.date': 1, featured: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Event.countDocuments(query);
    
    res.json({
      events,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalEvents: total,
        hasNext: skip + events.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/events/categories
// @desc    Get all event categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = [
      'Concert', 
      'Theatre', 
      'Sports', 
      'Comedy', 
      'Workshop', 
      'Exhibition', 
      'Dance', 
      'Other'
    ];
    
    // Get count for each category
    const categoryStats = await Promise.all(
      categories.map(async (category) => {
        const count = await Event.countDocuments({ 
          category,
          status: 'Active',
          'dates.date': { $gte: new Date() }
        });
        return { category, count };
      })
    );
    
    res.json(categoryStats);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/events/:id
// @desc    Get event by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Filter future dates only
    const futureEvent = {
      ...event.toObject(),
      dates: event.dates.filter(date => new Date(date.date) >= new Date())
    };
    
    res.json(futureEvent);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/events
// @desc    Create a new event (Admin only)
// @access  Private/Admin
router.post('/', auth, async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/events/:id
// @desc    Update event (Admin only)
// @access  Private/Admin
router.put('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete event (Admin only)
// @access  Private/Admin
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/events/:id/rate
// @desc    Rate an event
// @access  Private
router.post('/:id/rate', auth, async (req, res) => {
  try {
    const { rating } = req.body;
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Simple rating calculation (in real app, track user ratings)
    const newAverage = ((event.rating.average * event.rating.count) + rating) / (event.rating.count + 1);
    
    event.rating.average = Math.round(newAverage * 10) / 10;
    event.rating.count += 1;
    
    await event.save();
    
    res.json({ message: 'Rating submitted successfully', rating: event.rating });
  } catch (error) {
    console.error('Error rating event:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

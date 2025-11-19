const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone } = req.body;
    
    // Check if email already exists for another user
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== req.user.id) {
        return res.status(400).json({
          success: false,
          error: 'Email is already in use'
        });
      }
    }
    
    // Build update object
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    
    // Update the user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error('Update profile error:', err.message);
    
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error updating profile'
    });
  }
};

// @desc    Update password
// @route   PUT /api/users/password
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Please provide current password and new password'
      });
    }
    
    // Get user with password
    const user = await User.findById(req.user.id).select('+password');
    
    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (err) {
    console.error('Update password error:', err.message);
    
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error updating password'
    });
  }
};

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
exports.updatePreferences = async (req, res, next) => {
  try {
    const { darkMode, autoplay, subtitles } = req.body;
    
    // Build update object
    const preferences = {};
    if (darkMode !== undefined) preferences.darkMode = darkMode;
    if (autoplay !== undefined) preferences.autoplay = autoplay;
    if (subtitles !== undefined) preferences.subtitles = subtitles;
    
    // Update the user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { preferences },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      data: user.preferences
    });
  } catch (err) {
    console.error('Update preferences error:', err.message);
    res.status(500).json({
      success: false,
      error: 'Server error updating preferences'
    });
  }
};

// @desc    Update notification settings
// @route   PUT /api/users/notifications
// @access  Private
exports.updateNotificationSettings = async (req, res, next) => {
  try {
    const { email, push, newReleases, recommendations } = req.body;
    
    // Build update object
    const notificationSettings = {};
    if (email !== undefined) notificationSettings.email = email;
    if (push !== undefined) notificationSettings.push = push;
    if (newReleases !== undefined) notificationSettings.newReleases = newReleases;
    if (recommendations !== undefined) notificationSettings.recommendations = recommendations;
    
    // Update the user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { notificationSettings },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      data: user.notificationSettings
    });
  } catch (err) {
    console.error('Update notification settings error:', err.message);
    res.status(500).json({
      success: false,
      error: 'Server error updating notification settings'
    });
  }
};

// @desc    Toggle movie in favorites
// @route   POST /api/users/favorites/:movieId
// @access  Private
exports.toggleFavorite = async (req, res, next) => {
  try {
    const movieId = parseInt(req.params.movieId);
    
    // Validate movieId
    if (!movieId) {
      return res.status(400).json({
        success: false,
        error: 'Invalid movie ID'
      });
    }
    
    const user = await User.findById(req.user.id);
    
    // Check if movie is already in favorites
    const isFavorite = user.favorites.includes(movieId);
    
    if (isFavorite) {
      // Remove from favorites
      user.favorites = user.favorites.filter(id => id !== movieId);
    } else {
      // Add to favorites
      user.favorites.push(movieId);
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      isFavorite: !isFavorite,
      data: user.favorites
    });
  } catch (err) {
    console.error('Toggle favorite error:', err.message);
    res.status(500).json({
      success: false,
      error: 'Server error toggling favorite'
    });
  }
};

// @desc    Toggle movie in watchlist
// @route   POST /api/users/watchlist/:movieId
// @access  Private
exports.toggleWatchlist = async (req, res, next) => {
  try {
    const movieId = parseInt(req.params.movieId);
    
    // Validate movieId
    if (!movieId) {
      return res.status(400).json({
        success: false,
        error: 'Invalid movie ID'
      });
    }
    
    const user = await User.findById(req.user.id);
    
    // Check if movie is already in watchlist
    const isInWatchlist = user.watchlist.includes(movieId);
    
    if (isInWatchlist) {
      // Remove from watchlist
      user.watchlist = user.watchlist.filter(id => id !== movieId);
    } else {
      // Add to watchlist
      user.watchlist.push(movieId);
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      isInWatchlist: !isInWatchlist,
      data: user.watchlist
    });
  } catch (err) {
    console.error('Toggle watchlist error:', err.message);
    res.status(500).json({
      success: false,
      error: 'Server error toggling watchlist'
    });
  }
};
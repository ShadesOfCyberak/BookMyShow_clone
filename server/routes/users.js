const express = require('express');
const {
  updateProfile,
  updatePassword,
  updatePreferences,
  updateNotificationSettings,
  toggleFavorite,
  toggleWatchlist
} = require('../controllers/userController');

const router = express.Router();

// All routes are now public
router.put('/profile', updateProfile);
router.put('/password', updatePassword);
router.put('/preferences', updatePreferences);
router.put('/notifications', updateNotificationSettings);
router.post('/favorites/:id', toggleFavorite);
router.post('/watchlist/:id', toggleWatchlist);

module.exports = router;
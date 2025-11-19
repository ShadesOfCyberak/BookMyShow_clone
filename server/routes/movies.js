const express = require('express');
const {
  getPopularMovies,
  searchMovies,
  getMovieDetails,
  rateMovie,
  getRecommendations,
  addMovie,
  updateMovie,
  deleteMovie,
  getAllMovies
} = require('../controllers/movieController');
const auth = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roleAuth');

const router = express.Router();

// Public routes
router.get('/popular', getPopularMovies);
router.get('/search', searchMovies);
router.get('/details/:id', getMovieDetails);

// Authenticated routes
router.post('/rate/:id', auth, rateMovie);
router.get('/recommendations', auth, getRecommendations);

// Admin-only routes
router.get('/', auth, requireAdmin, getAllMovies);
router.post('/', auth, requireAdmin, addMovie);
router.put('/:id', auth, requireAdmin, updateMovie);
router.delete('/:id', auth, requireAdmin, deleteMovie);

module.exports = router;
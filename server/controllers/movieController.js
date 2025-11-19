const axios = require('axios');
const User = require('../models/User');

// TMDB API configuration
const TMDB_API_KEY = process.env.TMDB_API_KEY || 'api_key_placeholder';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Helper function to make TMDB API requests
const tmdbRequest = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
      params: {
        api_key: TMDB_API_KEY,
        ...params
      }
    });
    return response.data;
  } catch (error) {
    console.error(`TMDB API Error: ${error.message}`);
    throw new Error('Failed to fetch data from movie database');
  }
};

// Sample movies data
const sampleMovies = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    backdrop_path: "/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
    overview: "Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden. During his long stretch in prison, Dufresne comes to be admired by the other inmates -- including an older prisoner named Red -- for his integrity and unquenchable sense of hope.",
    release_date: "1994-09-23",
    vote_average: 9.3,
    vote_count: 24558,
    popularity: 97.234,
    genre_ids: [18, 80],
    runtime: 142,
    genres: [{ id: 18, name: "Drama" }, { id: 80, name: "Crime" }]
  },
  {
    id: 2,
    title: "The Godfather",
    poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    backdrop_path: "/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
    overview: "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge.",
    release_date: "1972-03-14",
    vote_average: 9.2,
    vote_count: 18212,
    popularity: 87.681,
    genre_ids: [18, 80],
    runtime: 175,
    genres: [{ id: 18, name: "Drama" }, { id: 80, name: "Crime" }]
  },
  {
    id: 3,
    title: "The Dark Knight",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop_path: "/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg",
    overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    release_date: "2008-07-18",
    vote_average: 9.0,
    vote_count: 28447,
    popularity: 95.123,
    genre_ids: [28, 80, 18],
    runtime: 152,
    genres: [{ id: 28, name: "Action" }, { id: 80, name: "Crime" }, { id: 18, name: "Drama" }]
  },
  {
    id: 4,
    title: "Pulp Fiction",
    poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    backdrop_path: "/suaEOtk1N1sgg2QM528GluxMcE.jpg",
    overview: "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper. Their adventures unfurl in three stories that ingeniously trip back and forth in time.",
    release_date: "1994-10-14",
    vote_average: 8.9,
    vote_count: 19845,
    popularity: 89.456,
    genre_ids: [80, 53],
    runtime: 154,
    genres: [{ id: 80, name: "Crime" }, { id: 53, name: "Thriller" }]
  },
  {
    id: 5,
    title: "Fight Club",
    poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    backdrop_path: "/52AfXWuXCHn3UjD17rBruA9f5qb.jpg",
    overview: "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground \"fight clubs\" forming in every town, until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion.",
    release_date: "1999-10-15",
    vote_average: 8.8,
    vote_count: 23456,
    popularity: 92.789,
    genre_ids: [18],
    runtime: 139,
    genres: [{ id: 18, name: "Drama" }]
  },
  {
    id: 6,
    title: "Inception",
    poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: \"inception\", the implantation of another person's idea into a target's subconscious.",
    release_date: "2010-07-16",
    vote_average: 8.8,
    vote_count: 31234,
    popularity: 94.567,
    genre_ids: [28, 878, 12],
    runtime: 148,
    genres: [{ id: 28, name: "Action" }, { id: 878, name: "Science Fiction" }, { id: 12, name: "Adventure" }]
  },
  {
    id: 7,
    title: "The Matrix",
    poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    backdrop_path: "/ncF4HivY2W6SQW5dEP3N3bq3MZt.jpg",
    overview: "Set in the 22nd century, The Matrix tells the story of a young computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.",
    release_date: "1999-03-31",
    vote_average: 8.7,
    vote_count: 22345,
    popularity: 88.234,
    genre_ids: [28, 878],
    runtime: 136,
    genres: [{ id: 28, name: "Action" }, { id: 878, name: "Science Fiction" }]
  },
  {
    id: 8,
    title: "Goodfellas",
    poster_path: "/aKuFiU82suyISQpJCZ2eZnPzAie.jpg",
    backdrop_path: "/sw7mordbZxgITU877yTp65ud9Zq.jpg",
    overview: "The true story of Henry Hill, a half-Irish, half-Sicilian Brooklyn kid who is adopted by neighbourhood gangsters at an early age and climbs the ranks of a Mafia family under the guidance of Jimmy Conway.",
    release_date: "1990-09-19",
    vote_average: 8.7,
    vote_count: 11234,
    popularity: 76.123,
    genre_ids: [80, 18],
    runtime: 146,
    genres: [{ id: 80, name: "Crime" }, { id: 18, name: "Drama" }]
  },
  {
    id: 9,
    title: "The Silence of the Lambs",
    poster_path: "/rplLJ2hPcOQmkFhTqUte0MkEaO2.jpg",
    backdrop_path: "/mfwq2nMBzArGQLLoKdXgxfN0MoT.jpg",
    overview: "Clarice Starling is a top student at the FBI's training academy. Jack Crawford wants Clarice to interview Dr. Hannibal Lecter, a brilliant psychiatrist who is also a violent psychopath, serving life behind bars for various acts of murder and cannibalism.",
    release_date: "1991-02-14",
    vote_average: 8.6,
    vote_count: 13456,
    popularity: 82.456,
    genre_ids: [80, 18, 53],
    runtime: 118,
    genres: [{ id: 80, name: "Crime" }, { id: 18, name: "Drama" }, { id: 53, name: "Thriller" }]
  },
  {
    id: 10,
    title: "Interstellar",
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop_path: "/xu9zaAevzQ5nnrsXN6JcahLnG4i.jpg",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    release_date: "2014-11-07",
    vote_average: 8.6,
    vote_count: 28765,
    popularity: 96.789,
    genre_ids: [12, 18, 878],
    runtime: 169,
    genres: [{ id: 12, name: "Adventure" }, { id: 18, name: "Drama" }, { id: 878, name: "Science Fiction" }]
  }
];

// @desc    Get popular movies
// @route   GET /api/movies/popular
// @access  Public
exports.getPopularMovies = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    
    // In production, uncomment the following to use real TMDB API
    // const data = await tmdbRequest('/movie/popular', { page });
    
    // Using sample data for now
    const data = {
      results: sampleMovies,
      page: 1,
      total_pages: 1,
      total_results: sampleMovies.length
    };

    res.status(200).json({
      success: true,
      ...data
    });
  } catch (err) {
    console.error('Get popular movies error:', err.message);
    res.status(500).json({
      success: false,
      error: 'Server error fetching popular movies'
    });
  }
};

// @desc    Search movies
// @route   GET /api/movies/search
// @access  Public
exports.searchMovies = async (req, res, next) => {
  try {
    const { query, page = 1 } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }
    
    // Filter by query (case insensitive)
    const results = sampleMovies.filter(movie => 
      movie.title.toLowerCase().includes(query.toLowerCase()) ||
      movie.overview.toLowerCase().includes(query.toLowerCase())
    );
    
    // In production, uncomment the following to use real TMDB API
    // const data = await tmdbRequest('/search/movie', { query, page });
    
    // Using filtered sample data
    const data = {
      results,
      page: 1,
      total_pages: 1,
      total_results: results.length
    };

    res.status(200).json({
      success: true,
      ...data
    });
  } catch (err) {
    console.error('Search movies error:', err.message);
    res.status(500).json({
      success: false,
      error: 'Server error searching movies'
    });
  }
};

// @desc    Get movie details
// @route   GET /api/movies/details/:id
// @access  Public
exports.getMovieDetails = async (req, res, next) => {
  try {
    const movieId = parseInt(req.params.id);
    
    // Find movie in sample data
    const movie = sampleMovies.find(m => m.id === movieId);
    
    if (!movie) {
      return res.status(404).json({
        success: false,
        error: 'Movie not found'
      });
    }
    
    // In production, uncomment the following to use real TMDB API
    // const movie = await tmdbRequest(`/movie/${movieId}`);
    // const credits = await tmdbRequest(`/movie/${movieId}/credits`);
    // const recommendations = await tmdbRequest(`/movie/${movieId}/recommendations`);
    // const reviews = await tmdbRequest(`/movie/${movieId}/reviews`);
    
    // Get recommendations (other movies from same genres)
    const recommendations = sampleMovies
      .filter(m => m.id !== movieId && m.genre_ids.some(id => movie.genre_ids.includes(id)))
      .slice(0, 6);

    res.status(200).json({
      success: true,
      data: {
        ...movie,
        recommendations
      }
    });
  } catch (err) {
    console.error('Get movie details error:', err.message);
    res.status(500).json({
      success: false,
      error: 'Server error fetching movie details'
    });
  }
};

// @desc    Rate a movie
// @route   POST /api/movies/rate/:id
// @access  Private
exports.rateMovie = async (req, res, next) => {
  try {
    const movieId = parseInt(req.params.id);
    const { rating } = req.body;
    
    // Validate input
    if (!rating || rating < 0.5 || rating > 10) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 0.5 and 10'
      });
    }
    
    // Update user's ratings
    const user = await User.findById(req.user.id);
    
    // If userRatings is null/undefined, initialize it
    if (!user.userRatings) {
      user.userRatings = new Map();
    }
    
    // Set the rating
    user.userRatings.set(movieId.toString(), rating);
    await user.save();
    
    // In production, also send rating to TMDB API
    // await tmdbRequest(`/movie/${movieId}/rating`, { 
    //   value: rating * 2 // TMDB uses 0-10 scale
    // }, 'POST');
    
    res.status(200).json({
      success: true,
      data: {
        movieId,
        rating
      }
    });
  } catch (err) {
    console.error('Rate movie error:', err.message);
    res.status(500).json({
      success: false,
      error: 'Server error rating movie'
    });
  }
};

// @desc    Get personalized recommendations
// @route   GET /api/movies/recommendations
// @access  Private
exports.getRecommendations = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    // In production, use user's favorites, ratings, and watchlist
    // to get personalized recommendations from TMDB
    
    // For now, return sample recommendations
    const recommendations = [
      {
        id: 100,
        title: "Recommended Movie 1",
        poster_path: "/sample_poster.jpg",
        backdrop_path: "/sample_backdrop.jpg",
        overview: "This is a recommended movie based on your preferences.",
        release_date: "2023-05-15",
        vote_average: 8.1,
        vote_count: 1200,
        popularity: 90.5,
        genre_ids: [28, 12]
      },
      {
        id: 101,
        title: "Recommended Movie 2",
        poster_path: "/sample_poster2.jpg",
        backdrop_path: "/sample_backdrop2.jpg",
        overview: "Another recommended movie tailored to your taste.",
        release_date: "2023-04-20",
        vote_average: 7.8,
        vote_count: 950,
        popularity: 85.2,
        genre_ids: [18, 53]
      }
    ];

    res.status(200).json({
      success: true,
      data: recommendations
    });
  } catch (err) {
    console.error('Get recommendations error:', err.message);
    res.status(500).json({
      success: false,
      error: 'Server error fetching recommendations'
    });
  }
};

// @desc    Get all movies (Admin only)
// @route   GET /api/movies
// @access  Private/Admin
exports.getAllMovies = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const skip = (page - 1) * limit;
    
    // In production, this would fetch from database
    // For now, return sample data with pagination
    const startIndex = skip;
    const endIndex = skip + parseInt(limit);
    const paginatedMovies = sampleMovies.slice(startIndex, endIndex);
    
    res.status(200).json({
      success: true,
      data: {
        movies: paginatedMovies,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(sampleMovies.length / limit),
          totalMovies: sampleMovies.length,
          hasNext: endIndex < sampleMovies.length,
          hasPrev: page > 1
        }
      }
    });
  } catch (err) {
    console.error('Get all movies error:', err.message);
    res.status(500).json({
      success: false,
      error: 'Server error fetching all movies'
    });
  }
};

// @desc    Add a new movie (Admin only)
// @route   POST /api/movies
// @access  Private/Admin
exports.addMovie = async (req, res, next) => {
  try {
    const {
      title,
      overview,
      release_date,
      poster_path,
      backdrop_path,
      genre_ids,
      runtime,
      vote_average,
      popularity
    } = req.body;
    
    // Validate required fields
    if (!title || !overview || !release_date) {
      return res.status(400).json({
        success: false,
        error: 'Title, overview, and release date are required'
      });
    }
    
    // In production, save to database
    // For now, add to sample data
    const newMovie = {
      id: sampleMovies.length + 1,
      title,
      overview,
      release_date,
      poster_path: poster_path || '/default_poster.jpg',
      backdrop_path: backdrop_path || '/default_backdrop.jpg',
      genre_ids: genre_ids || [],
      runtime: runtime || 120,
      vote_average: vote_average || 0,
      vote_count: 0,
      popularity: popularity || 0,
      genres: []
    };
    
    sampleMovies.push(newMovie);
    
    res.status(201).json({
      success: true,
      data: newMovie
    });
  } catch (err) {
    console.error('Add movie error:', err.message);
    res.status(500).json({
      success: false,
      error: 'Server error adding movie'
    });
  }
};

// @desc    Update a movie (Admin only)
// @route   PUT /api/movies/:id
// @access  Private/Admin
exports.updateMovie = async (req, res, next) => {
  try {
    const movieId = parseInt(req.params.id);
    const updateData = req.body;
    
    // Find movie in sample data
    const movieIndex = sampleMovies.findIndex(m => m.id === movieId);
    
    if (movieIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Movie not found'
      });
    }
    
    // In production, update in database
    // For now, update in sample data
    sampleMovies[movieIndex] = {
      ...sampleMovies[movieIndex],
      ...updateData,
      id: movieId // Ensure ID doesn't change
    };
    
    res.status(200).json({
      success: true,
      data: sampleMovies[movieIndex]
    });
  } catch (err) {
    console.error('Update movie error:', err.message);
    res.status(500).json({
      success: false,
      error: 'Server error updating movie'
    });
  }
};

// @desc    Delete a movie (Admin only)
// @route   DELETE /api/movies/:id
// @access  Private/Admin
exports.deleteMovie = async (req, res, next) => {
  try {
    const movieId = parseInt(req.params.id);
    
    // Find movie in sample data
    const movieIndex = sampleMovies.findIndex(m => m.id === movieId);
    
    if (movieIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Movie not found'
      });
    }
    
    // In production, delete from database
    // For now, remove from sample data
    const deletedMovie = sampleMovies.splice(movieIndex, 1)[0];
    
    res.status(200).json({
      success: true,
      data: {
        message: 'Movie deleted successfully',
        deletedMovie
      }
    });
  } catch (err) {
    console.error('Delete movie error:', err.message);
    res.status(500).json({
      success: false,
      error: 'Server error deleting movie'
    });
  }
};
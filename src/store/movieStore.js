import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-toastify';
import axios from 'axios';

// API URLs
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || '8ac53721bcb7c1e97104d48845c63277';
const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';

// Setup axios instance for backend
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Setup axios instance for TMDB
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  params: {
    api_key: TMDB_API_KEY
  }
});

// Add token to backend requests when available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Genre mapping for display in UI
const genreMap = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western"
};

// Sample movies data for fallback
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

const useMovieStore = create(
  persist(
    (set, get) => ({
      // State
      movies: [],
      searchResults: [],
      searchQuery: '',
      favorites: [],
      watchlist: [],
      userRatings: {},
      currentMovie: null,
      loading: false,
      error: null,
      genres: [],
      
      // Actions
      fetchPopularMovies: async () => {
        try {
          set({ loading: true, error: null });
          
          // Fetch from TMDB API
          const response = await tmdbApi.get('/movie/popular');
          set({ movies: response.data.results, loading: false });
        } catch (error) {
          console.error('Error fetching popular movies:', error);
          // Fallback to sample data
          set({ movies: sampleMovies, loading: false, error: 'Failed to load movies' });
        }
      },
      
      searchMovies: async (query) => {
        if (!query.trim()) return;
        
        try {
          set({ loading: true, error: null, searchQuery: query });
          
          // Search using TMDB API
          const response = await tmdbApi.get('/search/movie', {
            params: { query }
          });
          set({ searchResults: response.data.results, loading: false });
        } catch (error) {
          console.error('Error searching movies:', error);
          // Fallback to sample data
          const results = sampleMovies.filter(movie => 
            movie.title.toLowerCase().includes(query.toLowerCase()) ||
            movie.overview.toLowerCase().includes(query.toLowerCase())
          );
          set({ searchResults: results, loading: false, error: 'Search failed. Using sample data.' });
        }
      },
      
      fetchMovieDetails: async (id) => {
        try {
          set({ loading: true, error: null });
          
          // Try to fetch from API first
          try {
            const response = await api.get(`/movies/details/${id}`);
            if (response.data.success) {
              set({ currentMovie: response.data.data, loading: false });
            } else {
              throw new Error('Movie not found');
            }
          } catch (apiError) {
            // If API fails, find in sample data
            console.log('Using sample data for movie details - backend not available');
            const movie = sampleMovies.find(m => m.id === parseInt(id));
            if (movie) {
              set({ currentMovie: movie, loading: false });
            } else {
              set({ 
                loading: false, 
                error: 'Movie not found.' 
              });
            }
          }
        } catch (error) {
          console.error('Error fetching movie details:', error);
          set({ 
            loading: false, 
            error: 'Failed to fetch movie details.' 
          });
        }
      },
      
      toggleFavorite: async (movie) => {
        try {
          // Optimistic update
          const { favorites } = get();
          const isFavorite = favorites.some((fav) => fav.id === movie.id);
          
          if (isFavorite) {
            set({ 
              favorites: favorites.filter((fav) => fav.id !== movie.id) 
            });
          } else {
            set({ favorites: [...favorites, movie] });
          }
          
          // Try API call, but don't fail if backend is not available
          try {
            const response = await api.post(`/users/favorites/${movie.id}`);
            if (response.data.success) {
              toast.success(`"${movie.title}" ${isFavorite ? 'removed from' : 'added to'} favorites`);
            }
          } catch (apiError) {
            console.log('Backend not available - using local storage only');
            toast.success(`"${movie.title}" ${isFavorite ? 'removed from' : 'added to'} favorites (offline mode)`);
          }
        } catch (error) {
          console.error('Error toggling favorite:', error);
          toast.error(`Failed to ${isFavorite ? 'remove from' : 'add to'} favorites`);
        }
      },
      
      toggleWatchlist: async (movie) => {
        try {
          // Optimistic update
          const { watchlist } = get();
          const isInWatchlist = watchlist.some((item) => item.id === movie.id);
          
          if (isInWatchlist) {
            set({ 
              watchlist: watchlist.filter((item) => item.id !== movie.id) 
            });
          } else {
            set({ watchlist: [...watchlist, movie] });
          }
          
          // Try API call, but don't fail if backend is not available
          try {
            const response = await api.post(`/users/watchlist/${movie.id}`);
            if (response.data.success) {
              toast.success(`"${movie.title}" ${isInWatchlist ? 'removed from' : 'added to'} watchlist`);
            }
          } catch (apiError) {
            console.log('Backend not available - using local storage only');
            toast.success(`"${movie.title}" ${isInWatchlist ? 'removed from' : 'added to'} watchlist (offline mode)`);
          }
        } catch (error) {
          console.error('Error toggling watchlist:', error);
          toast.error(`Failed to ${isInWatchlist ? 'remove from' : 'add to'} watchlist`);
        }
      },
      
      rateMovie: async (movieId, rating) => {
        try {
          // Optimistic update
          set(state => ({
            userRatings: {
              ...state.userRatings,
              [movieId]: rating
            }
          }));
          
          // API call
          await api.post(`/movies/rate/${movieId}`, { rating });
          
          const movie = get().movies.find(m => m.id === movieId) ||
                        get().searchResults.find(m => m.id === movieId) ||
                        get().currentMovie;
          
          if (movie) {
            toast.success(`You rated "${movie.title}" ${rating} stars`);
          }
        } catch (error) {
          // Revert on error
          const { userRatings } = get();
          const newRatings = { ...userRatings };
          delete newRatings[movieId];
          
          set({ userRatings: newRatings });
          
          toast.error(`Failed to rate movie: ${
            error.response?.data?.error || error.message
          }`);
        }
      },
      
      clearFavorites: () => set({ favorites: [] }),
      
      clearWatchlist: () => set({ watchlist: [] }),
      
      clearSearch: () => set({ searchResults: [], searchQuery: '' }),
      
      // Initialize state from localStorage
      initializeFromStorage: () => {
        // This function is mostly for documentation purposes
        // The persist middleware automatically handles storage
      },
      
      // Clear error state
      clearError: () => set({ error: null })
    }),
    {
      name: 'movie-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        watchlist: state.watchlist,
        userRatings: state.userRatings,
      }),
    }
  )
);

export default useMovieStore;
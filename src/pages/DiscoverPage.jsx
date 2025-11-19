import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Paper,
  Button,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import useMovieStore from '../store/movieStore';
import MovieGrid from '../components/movies/MovieGrid';

const DiscoverPage = () => {
  const { movies, loading, fetchPopularMovies } = useMovieStore();
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    rating: [0, 10],
    sortBy: 'popularity.desc',
  });

  useEffect(() => {
    fetchPopularMovies();
  }, []);

  const genres = [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 14, name: 'Fantasy' },
    { id: 36, name: 'History' },
    { id: 27, name: 'Horror' },
    { id: 10402, name: 'Music' },
    { id: 9648, name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Science Fiction' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'War' },
    { id: 37, name: 'Western' },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const sortOptions = [
    { value: 'popularity.desc', label: 'Most Popular' },
    { value: 'popularity.asc', label: 'Least Popular' },
    { value: 'vote_average.desc', label: 'Highest Rated' },
    { value: 'vote_average.asc', label: 'Lowest Rated' },
    { value: 'release_date.desc', label: 'Newest First' },
    { value: 'release_date.asc', label: 'Oldest First' },
    { value: 'title.asc', label: 'A-Z' },
    { value: 'title.desc', label: 'Z-A' },
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      genre: '',
      year: '',
      rating: [0, 10],
      sortBy: 'popularity.desc',
    });
  };

  // Filter movies based on current filters
  const filteredMovies = movies.filter(movie => {
    if (filters.genre && !movie.genre_ids?.includes(parseInt(filters.genre))) {
      return false;
    }
    
    if (filters.year) {
      const movieYear = new Date(movie.release_date).getFullYear();
      if (movieYear !== parseInt(filters.year)) {
        return false;
      }
    }
    
    if (movie.vote_average < filters.rating[0] || movie.vote_average > filters.rating[1]) {
      return false;
    }
    
    return true;
  });

  // Sort filtered movies
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    switch (filters.sortBy) {
      case 'popularity.desc':
        return (b.popularity || 0) - (a.popularity || 0);
      case 'popularity.asc':
        return (a.popularity || 0) - (b.popularity || 0);
      case 'vote_average.desc':
        return (b.vote_average || 0) - (a.vote_average || 0);
      case 'vote_average.asc':
        return (a.vote_average || 0) - (b.vote_average || 0);
      case 'release_date.desc':
        return new Date(b.release_date || 0) - new Date(a.release_date || 0);
      case 'release_date.asc':
        return new Date(a.release_date || 0) - new Date(b.release_date || 0);
      case 'title.asc':
        return (a.title || '').localeCompare(b.title || '');
      case 'title.desc':
        return (b.title || '').localeCompare(a.title || '');
      default:
        return 0;
    }
  });

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== '' && !(Array.isArray(value) && value[0] === 0 && value[1] === 10)
  ).length - 1; // Subtract 1 for sortBy which is always set

  return (
    <Container maxWidth="lg" sx={{ pt: 12, pb: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            mb: 4,
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Discover Movies
        </Typography>
      </motion.div>

      <Grid container spacing={4}>
        {/* Filters Sidebar */}
        <Grid item xs={12} md={3}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Paper sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 100 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Filters
                </Typography>
                {activeFiltersCount > 0 && (
                  <Chip
                    label={`${activeFiltersCount} active`}
                    size="small"
                    color="primary"
                  />
                )}
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Genre</InputLabel>
                  <Select
                    value={filters.genre}
                    label="Genre"
                    onChange={(e) => handleFilterChange('genre', e.target.value)}
                  >
                    <MenuItem value="">All Genres</MenuItem>
                    {genres.map((genre) => (
                      <MenuItem key={genre.id} value={genre.id}>
                        {genre.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Release Year</InputLabel>
                  <Select
                    value={filters.year}
                    label="Release Year"
                    onChange={(e) => handleFilterChange('year', e.target.value)}
                  >
                    <MenuItem value="">All Years</MenuItem>
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box>
                  <Typography gutterBottom fontWeight="medium">
                    Rating Range
                  </Typography>
                  <Slider
                    value={filters.rating}
                    onChange={(e, value) => handleFilterChange('rating', value)}
                    valueLabelDisplay="auto"
                    min={0}
                    max={10}
                    step={0.5}
                    marks={[
                      { value: 0, label: '0' },
                      { value: 5, label: '5' },
                      { value: 10, label: '10' },
                    ]}
                  />
                </Box>

                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={filters.sortBy}
                    label="Sort By"
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  >
                    {sortOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="outlined"
                  onClick={resetFilters}
                  disabled={activeFiltersCount === 0}
                  fullWidth
                >
                  Reset Filters
                </Button>
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* Movies Grid */}
        <Grid item xs={12} md={9}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                {sortedMovies.length} movies found
              </Typography>
            </Box>

            <MovieGrid
              movies={sortedMovies}
              loading={loading}
              emptyMessage="No movies match your current filters. Try adjusting your criteria."
            />
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DiscoverPage;
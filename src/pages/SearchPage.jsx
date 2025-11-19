import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import useMovieStore from '../store/movieStore';
import MovieGrid from '../components/movies/MovieGrid';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const { searchResults, loading, searchQuery, searchMovies } = useMovieStore();

  useEffect(() => {
    if (query && query !== searchQuery) {
      searchMovies(query);
    }
  }, [query, searchQuery, searchMovies]);

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
            mb: 2,
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Search Results
        </Typography>
        
        {query && (
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Results for "{query}"
          </Typography>
        )}
      </motion.div>

      {!query ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            borderRadius: 3,
          }}
        >
          <Typography variant="h5" gutterBottom color="text.secondary">
            Enter a search term to find movies
          </Typography>
        </Box>
      ) : (
        <MovieGrid
          movies={searchResults}
          loading={loading}
          emptyMessage={`No movies found for "${query}". Try a different search term.`}
        />
      )}
    </Container>
  );
};

export default SearchPage;
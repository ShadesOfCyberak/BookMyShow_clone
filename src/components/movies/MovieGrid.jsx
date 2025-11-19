import React from 'react';
import { Grid, Box, Typography, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import MovieCard from './MovieCard';

const MovieGrid = ({ 
  movies = [], 
  loading = false, 
  title, 
  emptyMessage = "No movies found" 
}) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      {title && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h4"
            component="h2"
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
            {title}
          </Typography>
        </motion.div>
      )}

      <Grid container spacing={3}>
        {movies.map((movie, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
            <MovieCard movie={movie} index={index} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MovieGrid;
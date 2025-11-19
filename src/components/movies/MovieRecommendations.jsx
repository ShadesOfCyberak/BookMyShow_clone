import React from 'react';
import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import MovieCard from './MovieCard';

const MovieRecommendations = ({ 
  recommendations = [], 
  loading = false, 
  title = "Recommended for You" 
}) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 6, mb: 4 }}>
      <Typography 
        variant="h5" 
        component="h2" 
        fontWeight="bold" 
        gutterBottom
        sx={{
          mb: 3,
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {title}
      </Typography>
      <Grid container spacing={3}>
        {recommendations.map((movie, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={`${movie.id}-${index}`}>
            <MovieCard movie={movie} index={index} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MovieRecommendations;
import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useMovieStore from '../store/movieStore';
import MovieGrid from '../components/movies/MovieGrid';

const FavoritesPage = () => {
  const { favorites } = useMovieStore();

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
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          My Favorites
        </Typography>
      </motion.div>

      {favorites.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              borderRadius: 3,
            }}
          >
            <Typography variant="h5" gutterBottom color="text.secondary">
              Your favorites list is empty
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }} color="text.secondary">
              Start exploring movies and add them to your favorites!
            </Typography>
            <Button
              component={Link}
              to="/discover"
              variant="contained"
              size="large"
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: 3,
                background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #ff5252, #26a69a)',
                },
              }}
            >
              Discover Movies
            </Button>
          </Box>
        </motion.div>
      ) : (
        <MovieGrid
          movies={favorites}
          title={`${favorites.length} Favorite${favorites.length !== 1 ? 's' : ''}`}
        />
      )}
    </Container>
  );
};

export default FavoritesPage;
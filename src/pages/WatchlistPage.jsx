import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useMovieStore from '../store/movieStore';
import MovieGrid from '../components/movies/MovieGrid';

const WatchlistPage = () => {
  const { watchlist } = useMovieStore();

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
          My Watchlist
        </Typography>
      </motion.div>

      {watchlist.length === 0 ? (
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
              Your watchlist is empty
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }} color="text.secondary">
              Add movies you want to watch later to your watchlist!
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
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                },
              }}
            >
              Discover Movies
            </Button>
          </Box>
        </motion.div>
      ) : (
        <MovieGrid
          movies={watchlist}
          title={`${watchlist.length} Movie${watchlist.length !== 1 ? 's' : ''} to Watch`}
        />
      )}
    </Container>
  );
};

export default WatchlistPage;
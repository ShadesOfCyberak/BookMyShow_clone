import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  useTheme,
  alpha
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Explore as ExploreIcon, 
  Login as LoginIcon, 
  PersonAdd as PersonAddIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material';
import MovieCard from '../components/movies/MovieCard';
import FeaturedMovie from '../components/movie/FeaturedMovie';
import MovieCarousel from '../components/movie/MovieCarousel';
import useAuthStore from '../store/authStore';
import useMovieStore from '../store/movieStore';

const HomePage = ({ onAuthModalOpen }) => {
  const theme = useTheme();
  const { isAuthenticated } = useAuthStore();
  const { movies, favorites, loading, fetchPopularMovies } = useMovieStore();
  
  // Fetch movies when component mounts
  useEffect(() => {
    if (movies.length === 0 && !loading) {
      fetchPopularMovies();
    }
  }, [movies.length, loading, fetchPopularMovies]);

  // Featured movie is the first popular movie or a random one
  const featuredMovie = movies[0] || null;
  
  // Get 4 popular movies for the hero section
  const popularMovies = movies.slice(0, 4);
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        paddingTop: { xs: '64px', sm: '70px' },
        background: theme.palette.mode === 'dark' ? 
          'linear-gradient(180deg, #111 0%, #0a0a0a 100%)' : 
          'linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%)',
      }}
    >
      {/* Hero Section */}
      {featuredMovie && (
        <Box
          sx={{
            position: 'relative',
            height: { xs: '70vh', md: '80vh' },
            display: 'flex',
            alignItems: 'center',
            backgroundImage: `url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: `linear-gradient(0deg, 
                ${alpha(theme.palette.background.default, 1)} 0%, 
                ${alpha(theme.palette.background.default, 0.9)} 10%,
                ${alpha(theme.palette.background.default, 0.6)} 30%,
                ${alpha(theme.palette.background.default, 0.3)} 60%,
                ${alpha(theme.palette.background.default, 0)} 100%)`,
              zIndex: 1,
            },
          }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Typography
                    variant="h2"
                    component="h1"
                    fontWeight="bold"
                    sx={{
                      mb: 2,
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Discover Amazing Movies
                  </Typography>
                  <Typography variant="h5" sx={{ mb: 4, color: 'text.primary' }}>
                    Explore the world of cinema, create watchlists, and get personalized recommendations
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="large"
                      component={Link}
                      to="/discover"
                      startIcon={<ExploreIcon />}
                      sx={{
                        borderRadius: 30,
                        py: 1.5,
                        px: 3,
                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #5a71d6, #6941a3)',
                        },
                      }}
                    >
                      Explore Movies
                    </Button>
                    
                    {!isAuthenticated && (
                      <Button
                        variant="outlined"
                        size="large"
                        component={Link}
                        to="/register"
                        startIcon={<PersonAddIcon />}
                        sx={{
                          borderRadius: 30,
                          py: 1.5,
                          px: 3,
                          borderColor: 'primary.main',
                          borderWidth: 2,
                          '&:hover': {
                            borderWidth: 2,
                          },
                        }}
                      >
                        Join Now
                      </Button>
                    )}
                  </Box>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: 2,
                    }}
                  >
                    {popularMovies.map((movie) => (
                      <Paper
                        key={movie.id}
                        elevation={4}
                        sx={{
                          borderRadius: 2,
                          overflow: 'hidden',
                          transition: 'transform 0.3s',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                      >
                        <Box
                          component={Link}
                          to={`/movie/${movie.id}`}
                          sx={{
                            display: 'block',
                            height: 180,
                            background: `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            textDecoration: 'none',
                          }}
                        />
                      </Paper>
                    ))}
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </Box>
      )}

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Featured Section */}
        <Typography
          variant="h4"
          component="h2"
          fontWeight="bold"
          sx={{ mb: 4, textAlign: 'center' }}
        >
          Featured Movies
        </Typography>
        
        {!loading && featuredMovie && (
          <FeaturedMovie movie={featuredMovie} />
        )}
        
        {/* Popular Movies */}
        <Box sx={{ mt: 8 }}>
          <Typography
            variant="h4"
            component="h2"
            fontWeight="bold"
            sx={{ mb: 3 }}
          >
            Popular Movies
          </Typography>
          <MovieCarousel movies={movies} />
        </Box>
        
        {/* Favorites Section - Only for authenticated users */}
        {isAuthenticated && favorites.length > 0 && (
          <Box sx={{ mt: 8 }}>
            <Typography
              variant="h4"
              component="h2"
              fontWeight="bold"
              sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <FavoriteIcon color="error" />
              Your Favorites
            </Typography>
            <MovieCarousel movies={favorites} />
            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Button 
                variant="outlined" 
                component={Link} 
                to="/favorites"
                endIcon={<ExploreIcon />}
              >
                View All Favorites
              </Button>
            </Box>
          </Box>
        )}
        
        {/* CTA Section for non-authenticated users */}
        {!isAuthenticated && (
          <Paper 
            elevation={3} 
            sx={{ 
              mt: 8, 
              p: 4, 
              borderRadius: 4, 
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(45deg, #1a1a1a, #2a2a2a)' 
                : 'linear-gradient(45deg, #EDF2F7, #FFFFFF)',
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography variant="h4" component="h3" fontWeight="bold" gutterBottom>
                  Create Your Movie Experience
                </Typography>
                <Typography variant="body1" paragraph>
                  Join MovieFlix to keep track of your favorite movies, create watchlists,
                  and get personalized recommendations based on your taste.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <Button 
                    variant="contained" 
                    size="large"
                    startIcon={<LoginIcon />}
                    component={Link}
                    to="/login"
                  >
                    Sign In
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large"
                    startIcon={<PersonAddIcon />}
                    component={Link}
                    to="/register"
                  >
                    Register
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
                <Box 
                  component="img"
                  src="https://images.unsplash.com/photo-1594909122845-11baa439b7bf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                  alt="Movie watching"
                  sx={{ 
                    width: '100%',
                    height: 300,
                    objectFit: 'cover',
                    borderRadius: 3,
                    boxShadow: 3
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default HomePage;
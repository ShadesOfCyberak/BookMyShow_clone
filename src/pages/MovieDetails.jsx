import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Chip,
  Rating,
  Button,
  Divider,
  Paper,
  IconButton,
  Avatar,
  Tab,
  Tabs,
  CircularProgress,
  Dialog,
  DialogContent,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Bookmark,
  BookmarkBorder,
  PlayArrow,
  Star,
  Schedule,
  Language,
  AttachMoney,
  Close,
  ConfirmationNumber,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import useMovieStore from '../store/movieStore';
import useAuthStore from '../store/authStore';
import MovieGrid from '../components/movies/MovieGrid';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);
  const [trailerOpen, setTrailerOpen] = useState(false);
  
  const { 
    fetchMovieDetails,
    currentMovie,
    loading,
    favorites,
    watchlist,
    toggleFavorite,
    toggleWatchlist
  } = useMovieStore();
  
  const { isAuthenticated } = useAuthStore();

  const isFavorite = favorites.some(fav => fav.id === Number(id));
  const isInWatchlist = watchlist.some(item => item.id === Number(id));

  useEffect(() => {
    if (id) {
      fetchMovieDetails(id);
    }
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id, fetchMovieDetails]);

  const handleFavoriteClick = () => {
    if (isAuthenticated && currentMovie) {
      toggleFavorite(currentMovie);
    }
  };

  const handleWatchlistClick = () => {
    if (isAuthenticated && currentMovie) {
      toggleWatchlist(currentMovie);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleTrailerOpen = () => {
    setTrailerOpen(true);
  };

  const handleTrailerClose = () => {
    setTrailerOpen(false);
  };

  const handleBookTickets = () => {
    navigate(`/booking/${id}`);
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh'
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!currentMovie) {
    return (
      <Container maxWidth="lg" sx={{ pt: 12, pb: 8 }}>
        <Typography variant="h4" align="center">
          Movie not found
        </Typography>
      </Container>
    );
  }

  // Generate a random runtime between 90 and 180 minutes
  const runtime = Math.floor(Math.random() * 90) + 90;
  
  // Generate a random budget between $5M and $250M
  const budget = (Math.floor(Math.random() * 245) + 5) * 1000000;
  
  // Extract year from release date
  const releaseYear = currentMovie.release_date 
    ? new Date(currentMovie.release_date).getFullYear()
    : 'Unknown';

  // Sample genres for demonstration
  const genres = [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 18, name: 'Drama' },
    { id: 14, name: 'Fantasy' },
    { id: 27, name: 'Horror' },
    { id: 10749, name: 'Romance' },
  ];

  // Map genre IDs to names
  const movieGenres = currentMovie.genre_ids
    ? currentMovie.genre_ids.map(id => {
        const genre = genres.find(g => g.id === id);
        return genre ? genre.name : 'Unknown';
      })
    : [];

  // Mock director and cast data
  const mockCast = [
    { id: 1, name: 'Actor One', character: 'Character One', profile_path: null },
    { id: 2, name: 'Actor Two', character: 'Character Two', profile_path: null },
    { id: 3, name: 'Actor Three', character: 'Character Three', profile_path: null },
    { id: 4, name: 'Actor Four', character: 'Character Four', profile_path: null },
  ];

  // Mock reviews
  const mockReviews = [
    {
      id: 1,
      author: 'Movie Lover',
      content: 'This movie was absolutely incredible! The performances were outstanding and the story kept me engaged throughout.',
      rating: 4.5,
      created_at: '2023-05-15T12:34:56Z',
    },
    {
      id: 2,
      author: 'Film Critic',
      content: 'While the visuals were stunning, the plot had several holes and the pacing was off in the middle section.',
      rating: 3,
      created_at: '2023-05-10T09:12:34Z',
    },
    {
      id: 3,
      author: 'Regular Viewer',
      content: 'Enjoyed the film overall. Great special effects and solid acting from the main cast.',
      rating: 4,
      created_at: '2023-05-08T18:45:23Z',
    },
  ];

  // Similar movies (using the current movie as placeholder)
  const similarMovies = Array(4).fill(currentMovie).map((movie, index) => ({
    ...movie,
    id: Number(movie.id) + index + 1,
  }));

  return (
    <>
      {/* Movie Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: 300, md: 500 },
          overflow: 'hidden',
          mt: 8,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(https://image.tmdb.org/t/p/original${currentMovie.backdrop_path})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.4) blur(1px)',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '50%',
              backgroundImage: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))',
            },
          }}
        />

        <Container
          maxWidth="lg"
          sx={{
            position: 'relative',
            zIndex: 1,
            height: '100%',
            display: 'flex',
            alignItems: 'flex-end',
            pt: { xs: 2, md: 4 },
            pb: { xs: 3, md: 5 },
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%' }}
          >
            <Grid container spacing={4} alignItems="flex-end">
              <Grid item xs={12} md={3}>
                <Box
                  sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                    display: { xs: 'none', md: 'block' },
                  }}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${currentMovie.poster_path}`}
                    alt={currentMovie.title}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={9}>
                <Box sx={{ color: 'white' }}>
                  <Typography
                    variant="h3"
                    component="h1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    {currentMovie.title}
                    {releaseYear !== 'Unknown' && (
                      <Box component="span" sx={{ ml: 1, fontWeight: 'normal', opacity: 0.8 }}>
                        ({releaseYear})
                      </Box>
                    )}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                    {movieGenres.map((genre) => (
                      <Chip
                        key={genre}
                        label={genre}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                        }}
                      />
                    ))}
                    
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        ml: { xs: 0, sm: 2 },
                        mt: { xs: 1, sm: 0 },
                      }}
                    >
                      <Star sx={{ color: '#FFD700', mr: 0.5 }} />
                      <Typography variant="body1" component="span" fontWeight="bold">
                        {currentMovie.vote_average?.toFixed(1) || '0.0'}
                      </Typography>
                      <Typography variant="body2" component="span" sx={{ ml: 0.5, opacity: 0.7 }}>
                        /10 ({currentMovie.vote_count || 0})
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Schedule sx={{ fontSize: 18, mr: 0.5, opacity: 0.7 }} />
                      <Typography variant="body2">{runtime} minutes</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Language sx={{ fontSize: 18, mr: 0.5, opacity: 0.7 }} />
                      <Typography variant="body2">English</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AttachMoney sx={{ fontSize: 18, mr: 0.5, opacity: 0.7 }} />
                      <Typography variant="body2">${(budget / 1000000).toFixed(0)}M</Typography>
                    </Box>
                  </Box>

                  <Typography variant="body1" gutterBottom sx={{ mb: 3, maxWidth: '90%' }}>
                    {currentMovie.overview}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<ConfirmationNumber />}
                      onClick={handleBookTickets}
                      sx={{
                        py: 1.5,
                        px: 4,
                        borderRadius: 2,
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                        },
                      }}
                    >
                      Book Tickets
                    </Button>
                    
                    <Button
                      variant="outlined"
                      startIcon={<PlayArrow />}
                      onClick={handleTrailerOpen}
                      sx={{
                        py: 1,
                        px: 3,
                        borderRadius: 2,
                      }}
                    >
                      Play Trailer
                    </Button>

                    {isAuthenticated && (
                      <>
                        <Button
                          variant={isFavorite ? 'contained' : 'outlined'}
                          color={isFavorite ? 'error' : 'inherit'}
                          startIcon={isFavorite ? <Favorite /> : <FavoriteBorder />}
                          onClick={handleFavoriteClick}
                          sx={{
                            py: 1,
                            px: 2,
                            borderRadius: 2,
                            borderColor: 'rgba(255, 255, 255, 0.5)',
                            color: isFavorite ? 'white' : 'white',
                          }}
                        >
                          {isFavorite ? 'In Favorites' : 'Add to Favorites'}
                        </Button>

                        <Button
                          variant={isInWatchlist ? 'contained' : 'outlined'}
                          color={isInWatchlist ? 'primary' : 'inherit'}
                          startIcon={isInWatchlist ? <Bookmark /> : <BookmarkBorder />}
                          onClick={handleWatchlistClick}
                          sx={{
                            py: 1,
                            px: 2,
                            borderRadius: 2,
                            borderColor: 'rgba(255, 255, 255, 0.5)',
                            color: isInWatchlist ? 'white' : 'white',
                          }}
                        >
                          {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                        </Button>
                      </>
                    )}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ mb: 4 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="movie details tabs"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 'medium',
                fontSize: '1rem',
                minWidth: 100,
              },
            }}
          >
            <Tab label="Cast & Crew" />
            <Tab label="Reviews" />
            <Tab label="Similar Movies" />
            <Tab label="Details" />
          </Tabs>
        </Box>

        {/* Cast & Crew */}
        <Box hidden={currentTab !== 0}>
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
            Cast
          </Typography>
          
          <Grid container spacing={2}>
            {mockCast.map((actor) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={actor.id}>
                <Paper
                  elevation={2}
                  sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Box sx={{ height: 200, backgroundColor: '#e0e0e0' }}>
                    <Avatar
                      variant="square"
                      sx={{ width: '100%', height: '100%', fontSize: '3rem' }}
                    >
                      {actor.name.charAt(0)}
                    </Avatar>
                  </Box>
                  <Box sx={{ p: 1.5 }}>
                    <Typography variant="subtitle1" fontWeight="bold" noWrap>
                      {actor.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {actor.character}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
              Director
            </Typography>
            <Typography variant="body1">
              Jane Director
            </Typography>
          </Box>
        </Box>

        {/* Reviews */}
        <Box hidden={currentTab !== 1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" fontWeight="bold">
              Reviews
            </Typography>
            <Button variant="contained">Write a Review</Button>
          </Box>

          {mockReviews.map((review) => (
            <Paper
              key={review.id}
              elevation={2}
              sx={{ p: 3, mb: 3, borderRadius: 2 }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar>{review.author.charAt(0)}</Avatar>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {review.author}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rating value={review.rating} precision={0.5} readOnly size="small" />
                  <Typography variant="body2">
                    {new Date(review.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1">{review.content}</Typography>
            </Paper>
          ))}
        </Box>

        {/* Similar Movies */}
        <Box hidden={currentTab !== 2}>
          <MovieGrid
            movies={similarMovies}
            title="You Might Also Like"
            emptyMessage="No similar movies found"
          />
        </Box>

        {/* Details */}
        <Box hidden={currentTab !== 3}>
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
            Movie Details
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Original Title
                </Typography>
                <Typography variant="body1">
                  {currentMovie.original_title || currentMovie.title}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Release Date
                </Typography>
                <Typography variant="body1">
                  {currentMovie.release_date
                    ? new Date(currentMovie.release_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Unknown'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Runtime
                </Typography>
                <Typography variant="body1">
                  {runtime} minutes ({Math.floor(runtime / 60)}h {runtime % 60}m)
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Budget
                </Typography>
                <Typography variant="body1">
                  ${budget.toLocaleString('en-US')}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Original Language
                </Typography>
                <Typography variant="body1">
                  English
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Status
                </Typography>
                <Typography variant="body1">
                  Released
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Revenue
                </Typography>
                <Typography variant="body1">
                  ${(budget * (Math.random() * 3 + 0.5)).toLocaleString('en-US')}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Production Companies
                </Typography>
                <Typography variant="body1">
                  Universal Pictures, Warner Bros., Paramount
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Trailer Dialog */}
      <Dialog
        open={trailerOpen}
        onClose={handleTrailerClose}
        maxWidth="lg"
        fullWidth
      >
        <Box sx={{ position: 'relative' }}>
          <IconButton
            onClick={handleTrailerClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
              zIndex: 1,
            }}
          >
            <Close />
          </IconButton>
          <DialogContent sx={{ p: 0, backgroundColor: '#000' }}>
            <Box
              sx={{
                position: 'relative',
                paddingTop: '56.25%', // 16:9 Aspect Ratio
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                }}
              >
                <Typography variant="h6">
                  No trailer available for this movie
                </Typography>
              </Box>
            </Box>
          </DialogContent>
        </Box>
      </Dialog>
    </>
  );
};

export default MovieDetails;
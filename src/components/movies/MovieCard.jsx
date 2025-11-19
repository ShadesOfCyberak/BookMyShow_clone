import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
  Rating,
  Chip,
  Tooltip,
  Button,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Bookmark,
  BookmarkBorder,
  PlayArrow,
  ConfirmationNumber,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useMovieStore from '../../store/movieStore';
import useAuthStore from '../../store/authStore';

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

const MovieCard = ({ movie, index = 0 }) => {
  const { favorites, watchlist, toggleFavorite, toggleWatchlist } = useMovieStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const isFavorite = favorites.some(fav => fav.id === movie.id);
  const isInWatchlist = watchlist.some(item => item.id === movie.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAuthenticated) {
      toggleFavorite(movie);
    }
  };

  const handleWatchlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAuthenticated) {
      toggleWatchlist(movie);
    }
  };

  const handleBookNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/booking/${movie.id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).getFullYear();
  };

  const getGenreName = (genreId) => {
    return genreMap[genreId] || `Genre ${genreId}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
    >
      <Card
        component={Link}
        to={`/movie/${movie.id}`}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          textDecoration: 'none',
          color: 'inherit',
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            '& .movie-overlay': {
              opacity: 1,
            },
            '& .movie-poster': {
              transform: 'scale(1.05)',
            },
          },
        }}
      >
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <CardMedia
            component="img"
            height="400"
            image={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=500&h=750&dpr=1'
            }
            alt={movie.title}
            className="movie-poster"
            sx={{
              transition: 'transform 0.3s ease',
              objectFit: 'cover',
            }}
          />
          
          {/* Overlay with actions */}
          <Box
            className="movie-overlay"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: 2,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              {isAuthenticated && (
                <>
                  <Tooltip title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                    <IconButton
                      onClick={handleFavoriteClick}
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        color: isFavorite ? 'error.main' : 'text.secondary',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 1)',
                        },
                      }}
                    >
                      {isFavorite ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}>
                    <IconButton
                      onClick={handleWatchlistClick}
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        color: isInWatchlist ? 'primary.main' : 'text.secondary',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 1)',
                        },
                      }}
                    >
                      {isInWatchlist ? <Bookmark /> : <BookmarkBorder />}
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<ConfirmationNumber />}
                onClick={handleBookNow}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  color: 'primary.main',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                Book Now
              </Button>
              
              <IconButton
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: 'primary.main',
                  alignSelf: 'center',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <PlayArrow sx={{ fontSize: 32 }} />
              </IconButton>
            </Box>
          </Box>

          {/* Rating badge */}
          {movie.vote_average > 0 && (
            <Chip
              label={movie.vote_average.toFixed(1)}
              size="small"
              sx={{
                position: 'absolute',
                top: 12,
                left: 12,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                fontWeight: 'bold',
              }}
            />
          )}
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              fontSize: '1.1rem',
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minHeight: '2.6rem',
            }}
          >
            {movie.title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating
              value={movie.vote_average / 2}
              precision={0.5}
              readOnly
              size="small"
              sx={{ mr: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              ({movie.vote_count || 0})
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            {formatDate(movie.release_date)}
          </Typography>

          {movie.genre_ids && movie.genre_ids.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
              {movie.genre_ids.slice(0, 2).map((genreId) => (
                <Chip
                  key={genreId}
                  label={getGenreName(genreId)}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MovieCard;
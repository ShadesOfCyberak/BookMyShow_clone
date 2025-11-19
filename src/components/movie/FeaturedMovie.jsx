import React from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Rating,
  useTheme,
  alpha,
} from '@mui/material';
import {
  PlayArrow,
  Info,
  Star,
  CalendarToday,
  AccessTime,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FeaturedMovie = ({ movie }) => {
  const theme = useTheme();

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'Unknown';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: 4,
        overflow: 'hidden',
        mb: 4,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '300px', md: '400px' },
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, 
              ${alpha(theme.palette.background.default, 0.1)} 0%, 
              ${alpha(theme.palette.background.default, 0.8)} 100%)`,
          },
        }}
      >
        {/* Content Overlay */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: { xs: 3, md: 4 },
            background: `linear-gradient(0deg, 
              ${alpha(theme.palette.background.default, 0.95)} 0%, 
              ${alpha(theme.palette.background.default, 0.8)} 50%,
              transparent 100%)`,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Movie Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              {movie.vote_average > 0 && (
                <Chip
                  icon={<Star sx={{ fontSize: 16 }} />}
                  label={`${movie.vote_average.toFixed(1)}`}
                  size="small"
                  sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.9),
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                />
              )}
              {movie.release_date && (
                <Chip
                  icon={<CalendarToday sx={{ fontSize: 16 }} />}
                  label={formatDate(movie.release_date)}
                  size="small"
                  variant="outlined"
                />
              )}
              {movie.runtime && (
                <Chip
                  icon={<AccessTime sx={{ fontSize: 16 }} />}
                  label={formatRuntime(movie.runtime)}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>

            {/* Title */}
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                fontSize: { xs: '1.8rem', md: '2.5rem' },
                lineHeight: 1.2,
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {movie.title}
            </Typography>

            {/* Overview */}
            <Typography
              variant="body1"
              sx={{
                mb: 3,
                maxWidth: '600px',
                lineHeight: 1.6,
                color: 'text.secondary',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {movie.overview}
            </Typography>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                component={Link}
                to={`/movie/${movie.id}`}
                startIcon={<Info />}
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
                Learn More
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                startIcon={<PlayArrow />}
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
                Watch Trailer
              </Button>
            </Box>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
};

export default FeaturedMovie; 
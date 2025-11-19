import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import MovieCard from '../movies/MovieCard';

const MovieCarousel = ({ movies, title, showNavigation = true }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [scrollPosition, setScrollPosition] = React.useState(0);

  const containerRef = React.useRef(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth',
      });
      setScrollPosition(Math.max(0, scrollPosition - 300));
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth',
      });
      setScrollPosition(scrollPosition + 300);
    }
  };

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = containerRef.current && 
    scrollPosition < (containerRef.current.scrollWidth - containerRef.current.clientWidth);

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 4 }}>
      {title && (
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 'bold',
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {title}
        </Typography>
      )}

      <Box sx={{ position: 'relative' }}>
        {/* Navigation Buttons */}
        {showNavigation && !isMobile && (
          <>
            <IconButton
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              sx={{
                position: 'absolute',
                left: -20,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                backgroundColor: 'background.paper',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                '&:hover': {
                  backgroundColor: 'background.paper',
                },
                '&.Mui-disabled': {
                  opacity: 0.3,
                },
              }}
            >
              <ChevronLeft />
            </IconButton>

            <IconButton
              onClick={scrollRight}
              disabled={!canScrollRight}
              sx={{
                position: 'absolute',
                right: -20,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                backgroundColor: 'background.paper',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                '&:hover': {
                  backgroundColor: 'background.paper',
                },
                '&.Mui-disabled': {
                  opacity: 0.3,
                },
              }}
            >
              <ChevronRight />
            </IconButton>
          </>
        )}

        {/* Carousel Container */}
        <Box
          ref={containerRef}
          sx={{
            display: 'flex',
            gap: 2,
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE and Edge
            '&::-webkit-scrollbar': {
              display: 'none', // Chrome, Safari, Opera
            },
            pb: 2, // Space for potential scrollbar
            px: showNavigation && !isMobile ? 4 : 0,
          }}
        >
          {movies.map((movie, index) => (
            <Box
              key={movie.id}
              sx={{
                minWidth: { xs: '200px', sm: '250px', md: '280px' },
                flexShrink: 0,
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <MovieCard movie={movie} index={index} />
              </motion.div>
            </Box>
          ))}
        </Box>

        {/* Scroll Indicators for Mobile */}
        {isMobile && movies.length > 2 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 1,
              mt: 2,
            }}
          >
            {Array.from({ length: Math.ceil(movies.length / 2) }, (_, i) => (
              <Box
                key={i}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: i === 0 ? 'primary.main' : 'grey.300',
                  transition: 'background-color 0.3s',
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MovieCarousel; 
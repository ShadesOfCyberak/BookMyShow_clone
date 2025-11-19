import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
  Divider,
  Grid,
} from '@mui/material';
import { motion } from 'framer-motion';
import AuthForm from '../components/auth/AuthForm';
import useAuthStore from '../store/authStore';

const AuthPage = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated } = useAuthStore();

  // Check if the URL has a specific mode parameter (login or register)
  const queryParams = new URLSearchParams(location.search);
  const initialMode = queryParams.get('mode') === 'register' ? 'register' : 'login';
  
  const [mode, setMode] = useState(initialMode);

  // If user is already authenticated, redirect to home page
  useEffect(() => {
    if (isAuthenticated) {
      // Get the intended destination from state, or default to home page
      const destination = location.state?.from?.pathname || '/';
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleToggleMode = () => {
    const newMode = mode === 'login' ? 'register' : 'login';
    setMode(newMode);
    
    // Update URL without reloading the page
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('mode', newMode);
    navigate({
      pathname: location.pathname,
      search: searchParams.toString()
    }, { replace: true });
  };

  const handleSuccess = () => {
    // Navigate to home page or previous page on successful authentication
    const destination = location.state?.from?.pathname || '/';
    navigate(destination, { replace: true });
  };

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        pt: { xs: 10, sm: 12 }, 
        pb: 8, 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Grid container spacing={4} justifyContent="center" alignItems="center">
        {/* Left side - Image and branding (hidden on small screens) */}
        {!isSmallScreen && (
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ pr: 4 }}>
                <Typography
                  variant="h3"
                  component="h1"
                  gutterBottom
                  fontWeight="bold"
                  sx={{
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  MovieFlix
                </Typography>
                
                <Typography variant="h5" gutterBottom fontWeight="medium">
                  {mode === 'login'
                    ? 'Welcome back to the world of movies'
                    : 'Join the ultimate movie experience'}
                </Typography>
                
                <Typography variant="body1" color="text.secondary" paragraph>
                  {mode === 'login'
                    ? 'Access your personalized recommendations, manage your watchlist, and continue exploring the films you love.'
                    : 'Create an account to track your favorite movies, build a custom watchlist, and get tailored recommendations based on your taste.'}
                </Typography>
                
                <Box
                  sx={{
                    mt: 4,
                    height: 300,
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                    background: `url(https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
              </Box>
            </motion.div>
          </Grid>
        )}

        {/* Right side - Auth form */}
        <Grid item xs={12} md={6}>
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={4}
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <AuthForm
                mode={mode}
                onToggleMode={handleToggleMode}
                onSuccess={handleSuccess}
              />
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AuthPage;
import React from 'react';
import {
  Container,
  Grid,
  Box,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Navigate, useLocation } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import useAuthStore from '../store/authStore';

const RegisterPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    const redirectTo = location.state?.from?.pathname || '/';
    return <Navigate to={redirectTo} replace />;
  }

  const handleSwitchToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={10} lg={8}>
          <Paper
            elevation={4}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row-reverse' }, // Note the row-reverse
              minHeight: { md: 600 },
            }}
          >
            {/* Right side - Image (visually on the left on desktop due to row-reverse) */}
            <Box
              sx={{
                flex: { md: '0 0 45%' },
                position: 'relative',
                minHeight: { xs: 200, md: 'auto' },
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: 'url("https://images.pexels.com/photos/33129/popcorn-movie-party-entertainment.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'brightness(0.8)',
                }}
              />
              <Box
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  color: 'white',
                  textAlign: 'center',
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Typography 
                    variant={isMobile ? 'h4' : 'h3'} 
                    component="h1" 
                    fontWeight="bold"
                    sx={{ 
                      textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                      mb: 2,
                    }}
                  >
                    Join MovieFlix
                  </Typography>
                  <Typography variant="body1" sx={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                    Create an account to enjoy personalized recommendations, 
                    save your favorite movies, and build your watchlist.
                  </Typography>
                </motion.div>
              </Box>
            </Box>

            {/* Left side - Register form (visually on the right on desktop due to row-reverse) */}
            <Box
              sx={{
                flex: { md: '0 0 55%' },
                p: { xs: 3, sm: 4, md: 5 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Typography 
                  variant="h4" 
                  fontWeight="bold" 
                  gutterBottom
                  sx={{
                    mb: 4,
                    textAlign: 'center',
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Create Account
                </Typography>

                <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
              </motion.div>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RegisterPage;
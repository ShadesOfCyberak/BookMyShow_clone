import React from 'react';
import {
  Container,
  Grid,
  Box,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleBack = () => {
    navigate('/login');
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 } }}>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={10}>
          <Paper
            elevation={4}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              minHeight: { xs: 'auto', md: 500 },
            }}
          >
            {/* Left side - Image */}
            <Box
              sx={{
                flex: { xs: '1', md: '0 0 40%' },
                display: { xs: 'none', md: 'block' },
                position: 'relative',
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
                  backgroundImage: 'url("https://images.pexels.com/photos/3765114/pexels-photo-3765114.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
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
                    variant="h4" 
                    component="h1" 
                    fontWeight="bold"
                    sx={{ 
                      textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                      mb: 2,
                    }}
                  >
                    Password Recovery
                  </Typography>
                  <Typography variant="body1" sx={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                    We'll help you get back into your account.
                  </Typography>
                </motion.div>
              </Box>
            </Box>

            {/* Right side - Form */}
            <Box
              sx={{
                flex: { xs: '1', md: '0 0 60%' },
                p: { xs: 3, sm: 4, md: 5 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <ForgotPasswordForm onBack={handleBack} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ForgotPasswordPage;
import React from 'react';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SentimentVeryDissatisfied, Home } from '@mui/icons-material';

const NotFoundPage = () => {
  return (
    <Container maxWidth="md" sx={{ pt: 15, pb: 8, textAlign: 'center' }}>
      <Paper
        elevation={3}
        sx={{
          borderRadius: 4,
          py: 6,
          px: 4,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.05,
            backgroundImage: 'url("https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0,
          }}
        />
        
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <SentimentVeryDissatisfied fontSize="large" sx={{ fontSize: 100, color: 'text.secondary', mb: 2 }} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontWeight: 'bold',
                fontSize: '8rem',
                lineHeight: 1,
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              404
            </Typography>
            
            <Typography 
              variant="h4" 
              component="h2" 
              sx={{ mt: 2, mb: 4, fontWeight: 'medium' }}
            >
              Page Not Found
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 6, maxWidth: 500, mx: 'auto' }} color="text.secondary">
              The page you are looking for might have been removed, had its name changed, 
              or is temporarily unavailable.
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              component={Link}
              to="/"
              variant="contained"
              size="large"
              startIcon={<Home />}
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
              Back to Home
            </Button>
          </motion.div>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFoundPage;
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { Email } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';

const ForgotPasswordForm = ({ onBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API call
    setTimeout(() => {
      // 90% success rate for demonstration
      if (Math.random() < 0.9) {
        setIsSubmitted(true);
      } else {
        setError('We could not find an account with that email address.');
      }
      setIsLoading(false);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Alert severity="success" sx={{ mb: 3 }}>
            Password reset instructions sent!
          </Alert>
          
          <Typography variant="body1" paragraph>
            We've sent an email to reset your password. 
            Please check your inbox and follow the instructions.
          </Typography>
          
          <Button 
            onClick={onBack} 
            variant="outlined" 
            sx={{ mt: 2 }}
          >
            Back to Login
          </Button>
        </Box>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          width: '100%',
        }}
      >
        <Typography 
          variant="h5" 
          component="h1" 
          textAlign="center" 
          fontWeight="bold"
          sx={{ mb: 1 }}
        >
          Reset Your Password
        </Typography>
        
        <Typography 
          variant="body1" 
          textAlign="center" 
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          Enter your email address and we'll send you instructions to reset your password.
        </Typography>

        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <TextField
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          label="Email Address"
          type="email"
          fullWidth
          error={!!errors.email}
          helperText={errors.email?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email color="action" />
              </InputAdornment>
            ),
          }}
          disabled={isLoading}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={isLoading}
          sx={{ py: 1.5 }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Send Reset Instructions'
          )}
        </Button>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Link
            component="button"
            type="button"
            variant="body2"
            onClick={onBack}
            sx={{
              textDecoration: 'none',
            }}
          >
            Back to Login
          </Link>
        </Box>
      </Box>
    </motion.div>
  );
};

export default ForgotPasswordForm;
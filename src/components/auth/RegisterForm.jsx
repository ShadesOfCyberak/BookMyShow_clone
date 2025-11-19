import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Grid,
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock, 
  Person,
  Phone 
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import useAuthStore from '../../store/authStore';

const RegisterForm = ({ onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isLoading, error, clearError } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    clearError();
    const { confirmPassword, ...userData } = data;
    const result = await registerUser(userData);
    
    if (result.success) {
      // Registration successful - navigation will be handled by App component
    }
  };

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
          maxWidth: 500,
          mx: 'auto',
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          textAlign="center"
          fontWeight="bold"
          color="primary"
          gutterBottom
        >
          Create Account
        </Typography>
        
        <Typography
          variant="body1"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          Join us to discover amazing movies
        </Typography>

        {error && (
          <Alert severity="error" onClose={clearError}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register('firstName', {
                required: 'First name is required',
                minLength: {
                  value: 2,
                  message: 'First name must be at least 2 characters',
                },
              })}
              label="First Name"
              fullWidth
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              {...register('lastName', {
                required: 'Last name is required',
                minLength: {
                  value: 2,
                  message: 'Last name must be at least 2 characters',
                },
              })}
              label="Last Name"
              fullWidth
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              disabled={isLoading}
            />
          </Grid>
        </Grid>

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

        <TextField
          {...register('phone', {
            pattern: {
              value: /^[\+]?[1-9][\d]{0,15}$/,
              message: 'Invalid phone number',
            },
          })}
          label="Phone Number (Optional)"
          fullWidth
          error={!!errors.phone}
          helperText={errors.phone?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Phone color="action" />
              </InputAdornment>
            ),
          }}
          disabled={isLoading}
        />

        <TextField
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
              message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
            },
          })}
          label="Password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          error={!!errors.password}
          helperText={errors.password?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  disabled={isLoading}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          disabled={isLoading}
        />

        <TextField
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) =>
              value === password || 'Passwords do not match',
          })}
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          fullWidth
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
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
          sx={{
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            borderRadius: 2,
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Create Account'
          )}
        </Button>

        <Box textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Link
              component="button"
              type="button"
              onClick={onSwitchToLogin}
              sx={{
                textDecoration: 'none',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Sign in here
            </Link>
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
};

export default RegisterForm;
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Link,
  Divider,
  Grid,
  Paper,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Phone,
  Google,
  Facebook,
  Twitter,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import useAuthStore from '../../store/authStore';

const AuthForm = ({ mode = 'login', onToggleMode, onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { login, register, loading, error, clearError } = useAuthStore();

  useEffect(() => {
    // Clear form errors when mode changes
    setErrors({});
    clearError();
  }, [mode, clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate email for both login and register
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    // Validate password for both login and register
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (mode === 'register' && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Additional validations for register mode
    if (mode === 'register') {
      if (!formData.firstName) {
        newErrors.firstName = 'First name is required';
      }

      if (!formData.lastName) {
        newErrors.lastName = 'Last name is required';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      // Phone is optional, but validate format if provided
      if (formData.phone && !/^\d{10,15}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
        newErrors.phone = 'Invalid phone number format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    let success = false;

    if (mode === 'login') {
      const result = await login(formData.email, formData.password);
      success = result.success;
    } else {
      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });
      success = result.success;
    }

    if (success && onSuccess) {
      onSuccess();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, sm: 4 },
        width: '100%',
        maxWidth: 500,
        mx: 'auto',
        position: 'relative',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          fontWeight="bold"
          sx={{
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 3,
          }}
        >
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </Typography>

        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          paragraph
          sx={{ mb: 4 }}
        >
          {mode === 'login'
            ? 'Sign in to access your account'
            : 'Join MovieFlix to discover and save your favorite movies'}
        </Typography>

        {/* Social Login Buttons */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Google />}
                sx={{
                  py: 1.2,
                  borderRadius: 2,
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    borderColor: 'rgba(0, 0, 0, 0.3)',
                  },
                }}
              >
                Google
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Facebook />}
                sx={{
                  py: 1.2,
                  borderRadius: 2,
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    borderColor: 'rgba(0, 0, 0, 0.3)',
                  },
                }}
              >
                Facebook
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Twitter />}
                sx={{
                  py: 1.2,
                  borderRadius: 2,
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    borderColor: 'rgba(0, 0, 0, 0.3)',
                  },
                }}
              >
                Twitter
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>

        {/* Error message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* Register-specific fields */}
          {mode === 'register' && (
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  disabled={loading}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: { xs: 0, sm: 0 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  disabled={loading}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          )}

          {/* Common fields */}
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            disabled={loading}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            disabled={loading}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={togglePasswordVisibility}
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: mode === 'register' ? 2 : 1 }}
          />

          {/* Register-specific fields */}
          {mode === 'register' && (
            <>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                disabled={loading}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Phone Number (Optional)"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />
            </>
          )}

          {/* Login-specific elements */}
          {mode === 'login' && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
              <Link href="#" variant="body2" underline="hover">
                Forgot password?
              </Link>
            </Box>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              py: 1.4,
              borderRadius: 2,
              fontWeight: 'bold',
              mt: 1,
              mb: 3,
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
              },
              position: 'relative',
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : mode === 'login' ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={onToggleMode}
                sx={{ fontWeight: 'medium' }}
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </Link>
            </Typography>
          </Box>
        </Box>
      </motion.div>
    </Paper>
  );
};

export default AuthForm;
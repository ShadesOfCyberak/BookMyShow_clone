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
  Divider,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock, 
  Google, 
  Facebook, 
  Twitter 
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import useAuthStore from '../../store/authStore';

const LoginForm = ({ onSwitchToRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isLoading, error, clearError } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    clearError();
    const result = await login(data.email, data.password, rememberMe);
    
    if (result.success) {
      // Login successful - navigation will be handled by App component
    }
  };

  const handleSocialLogin = (provider) => {
    // This would connect to social login APIs in a real implementation
    console.log(`Logging in with ${provider}`);
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
          gap: 2.5,
          width: '100%',
          maxWidth: 400,
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
          Welcome Back
        </Typography>
        
        <Typography
          variant="body1"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          Sign in to your account to continue
        </Typography>

        {error && (
          <Alert severity="error" onClose={clearError}>
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
          size="medium"
        />

        <TextField
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
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

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                size="small"
                disabled={isLoading}
              />
            }
            label={<Typography variant="body2">Remember me</Typography>}
          />        <Link
          href="/forgot-password"
          variant="body2"
          sx={{ textDecoration: 'none' }}
        >
          Forgot password?
        </Link>
        </Box>

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={isLoading}
          sx={{
            py: 1.5,
            fontWeight: 'bold',
            borderRadius: 2,
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            '&:hover': {
              background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
            },
            mt: 1,
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Sign In'
          )}
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
          <Divider sx={{ flexGrow: 1 }} />
          <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
            OR CONTINUE WITH
          </Typography>
          <Divider sx={{ flexGrow: 1 }} />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }}>
            <IconButton
              onClick={() => handleSocialLogin('Google')}
              sx={{
                bgcolor: '#f2f2f2',
                color: '#DB4437',
                '&:hover': { bgcolor: '#e8e8e8' },
                p: 1.5,
              }}
            >
              <Google />
            </IconButton>
          </motion.div>

          <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }}>
            <IconButton
              onClick={() => handleSocialLogin('Facebook')}
              sx={{
                bgcolor: '#f2f2f2',
                color: '#4267B2',
                '&:hover': { bgcolor: '#e8e8e8' },
                p: 1.5,
              }}
            >
              <Facebook />
            </IconButton>
          </motion.div>

          <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }}>
            <IconButton
              onClick={() => handleSocialLogin('Twitter')}
              sx={{
                bgcolor: '#f2f2f2',
                color: '#1DA1F2',
                '&:hover': { bgcolor: '#e8e8e8' },
                p: 1.5,
              }}
            >
              <Twitter />
            </IconButton>
          </motion.div>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link
              component="button"
              type="button"
              onClick={onSwitchToRegister}
              sx={{
                textDecoration: 'none',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Sign up here
            </Link>
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
};

export default LoginForm;
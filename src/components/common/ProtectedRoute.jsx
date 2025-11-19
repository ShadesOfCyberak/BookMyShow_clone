import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Alert, Container, Typography, Button, Box } from '@mui/material';
import { Lock as LockIcon, Person as PersonIcon } from '@mui/icons-material';
import useAuthStore from '../../store/authStore';

const ProtectedRoute = ({ children, requireRole = null }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page with the current location as state
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requireRole) {
    const userRole = user?.role || 'user';
    
    if (userRole !== requireRole) {
      return (
        <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
          <Box mb={4}>
            <LockIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Access Denied
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              You don't have permission to access this page. 
              {requireRole === 'admin' && ' Admin access required.'}
              {requireRole === 'theater_owner' && ' Theater owner access required.'}
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
              <Typography variant="body2">
                <strong>Your Role:</strong> {userRole === 'user' ? 'Regular User' : userRole.replace('_', ' ').toUpperCase()}
                <br />
                <strong>Required Role:</strong> {requireRole.replace('_', ' ').toUpperCase()}
              </Typography>
            </Alert>

            <Box display="flex" gap={2} justifyContent="center">
              <Button
                variant="outlined"
                onClick={() => window.history.back()}
                startIcon={<PersonIcon />}
              >
                Go Back
              </Button>
              <Button
                variant="contained"
                onClick={() => window.location.href = '/'}
              >
                Home
              </Button>
            </Box>
          </Box>
        </Container>
      );
    }
  }

  return children;
};

export default ProtectedRoute;
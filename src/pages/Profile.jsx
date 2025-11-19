import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Avatar,
  Button,
  Paper,
  Tabs,
  Tab,
  TextField,
  Divider,
  Alert,
  IconButton,
  Chip,
  Switch,
  FormControlLabel,
  CircularProgress
} from '@mui/material';
import {
  Save,
  PhotoCamera,
  Edit,
  Delete,
  Favorite,
  Bookmark,
  MovieFilter,
  Notifications,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';
import useMovieStore from '../store/movieStore';

const Profile = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const { user, updateUser } = useAuthStore();
  const { favorites, watchlist } = useMovieStore();

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: {
      email: true,
      push: true,
      newReleases: true,
      recommendations: true
    },
    preferences: {
      darkMode: false,
      autoplay: true,
      subtitles: false
    }
  });

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (editMode) {
      // Reset form if cancelling edit mode
      setProfileData({
        ...profileData,
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handleNotificationChange = (setting) => {
    setProfileData({
      ...profileData,
      notifications: {
        ...profileData.notifications,
        [setting]: !profileData.notifications[setting]
      }
    });
  };

  const handlePreferenceChange = (setting) => {
    setProfileData({
      ...profileData,
      preferences: {
        ...profileData.preferences,
        [setting]: !profileData.preferences[setting]
      }
    });
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const validatePasswordForm = () => {
    if (!profileData.currentPassword) {
      setPasswordError('Current password is required');
      return false;
    }
    
    if (profileData.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return false;
    }
    
    if (profileData.newPassword !== profileData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return false;
    }
    
    setPasswordError('');
    return true;
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      updateUser({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone,
      });
      
      setSuccessMessage('Profile updated successfully!');
      setEditMode(false);
      setSaving(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1500);
  };

  const handleUpdatePassword = async () => {
    if (!validatePasswordForm()) return;
    
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSuccessMessage('Password updated successfully!');
      
      // Reset password fields
      setProfileData({
        ...profileData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setSaving(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1500);
  };

  const handleSavePreferences = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSuccessMessage('Preferences saved successfully!');
      setSaving(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1500);
  };

  const favoriteGenres = [
    { id: 1, name: 'Action' },
    { id: 2, name: 'Drama' },
    { id: 3, name: 'Science Fiction' }
  ];

  return (
    <Container maxWidth="lg" sx={{ pt: 12, pb: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography
            variant="h3"
            component="h1"
            fontWeight="bold"
            sx={{
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            My Profile
          </Typography>
        </Box>
      </motion.div>

      <Grid container spacing={4}>
        {/* Profile Sidebar */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Paper
              elevation={2}
              sx={{
                p: 4,
                borderRadius: 3,
                textAlign: 'center',
                mb: 4,
              }}
            >
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    fontSize: '3rem',
                    mb: 2,
                    mx: 'auto',
                    bgcolor: 'primary.main',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {user?.firstName?.charAt(0) || 'U'}
                </Avatar>
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 10,
                    right: 0,
                    backgroundColor: 'background.paper',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      backgroundColor: 'background.default',
                    },
                  }}
                >
                  <PhotoCamera fontSize="small" />
                </IconButton>
              </Box>

              <Typography variant="h5" gutterBottom fontWeight="medium">
                {user?.firstName} {user?.lastName}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user?.email}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Member since {new Date().getFullYear()}
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight="bold">{favorites.length}</Typography>
                  <Typography variant="body2" color="text.secondary">Favorites</Typography>
                </Box>
                
                <Divider orientation="vertical" flexItem />
                
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight="bold">{watchlist.length}</Typography>
                  <Typography variant="body2" color="text.secondary">Watchlist</Typography>
                </Box>
              </Box>
            </Paper>

            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 3,
                mb: 4,
              }}
            >
              <Typography variant="h6" fontWeight="medium" gutterBottom>
                Favorite Genres
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {favoriteGenres.map((genre) => (
                  <Chip
                    key={genre.id}
                    label={genre.name}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                      color: 'primary.main',
                    }}
                  />
                ))}
              </Box>
            </Paper>

            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 3,
              }}
            >
              <Typography variant="h6" fontWeight="medium" gutterBottom>
                Account Statistics
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Movies Rated</Typography>
                  <Typography variant="body2" fontWeight="medium">24</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Reviews Written</Typography>
                  <Typography variant="body2" fontWeight="medium">7</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Lists Created</Typography>
                  <Typography variant="body2" fontWeight="medium">3</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Comments</Typography>
                  <Typography variant="body2" fontWeight="medium">12</Typography>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Paper
              elevation={2}
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <Tabs
                value={currentTab}
                onChange={handleTabChange}
                variant="fullWidth"
                aria-label="profile tabs"
                sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
                  bgcolor: 'background.default',
                }}
              >
                <Tab label="Account" icon={<Edit />} iconPosition="start" />
                <Tab label="Security" icon={<Visibility />} iconPosition="start" />
                <Tab label="Preferences" icon={<MovieFilter />} iconPosition="start" />
                <Tab label="Notifications" icon={<Notifications />} iconPosition="start" />
              </Tabs>

              <Box sx={{ p: 4 }}>
                {/* Success Message */}
                {successMessage && (
                  <Alert
                    severity="success"
                    sx={{ mb: 3 }}
                    onClose={() => setSuccessMessage('')}
                  >
                    {successMessage}
                  </Alert>
                )}

                {/* Account Tab */}
                <Box hidden={currentTab !== 0}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold">
                      Personal Information
                    </Typography>
                    <Button
                      startIcon={editMode ? <Save /> : <Edit />}
                      variant={editMode ? 'contained' : 'outlined'}
                      onClick={handleEditToggle}
                      disabled={saving}
                    >
                      {editMode ? 'Cancel' : 'Edit Profile'}
                    </Button>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="First Name"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleInputChange}
                        fullWidth
                        disabled={!editMode || saving}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Last Name"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleInputChange}
                        fullWidth
                        disabled={!editMode || saving}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Email Address"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        fullWidth
                        disabled={!editMode || saving}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Phone Number"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        fullWidth
                        disabled={!editMode || saving}
                      />
                    </Grid>
                  </Grid>

                  {editMode && (
                    <Box sx={{ mt: 3, textAlign: 'right' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpdateProfile}
                        disabled={saving}
                        startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </Box>
                  )}
                </Box>

                {/* Security Tab */}
                <Box hidden={currentTab !== 1}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Change Password
                  </Typography>
                  
                  {passwordError && (
                    <Alert severity="error" sx={{ mb: 3 }} onClose={() => setPasswordError('')}>
                      {passwordError}
                    </Alert>
                  )}
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        label="Current Password"
                        name="currentPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={profileData.currentPassword}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        disabled={saving}
                        InputProps={{
                          endAdornment: (
                            <IconButton
                              onClick={handlePasswordToggle}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="New Password"
                        name="newPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={profileData.newPassword}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        disabled={saving}
                        helperText="Password must be at least 8 characters"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Confirm New Password"
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={profileData.confirmPassword}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        disabled={saving}
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 3, textAlign: 'right' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleUpdatePassword}
                      disabled={saving}
                      startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                    >
                      {saving ? 'Updating...' : 'Update Password'}
                    </Button>
                  </Box>

                  <Divider sx={{ my: 4 }} />

                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Delete Account
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Once you delete your account, there is no going back. Please be certain.
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                  >
                    Delete Account
                  </Button>
                </Box>

                {/* Preferences Tab */}
                <Box hidden={currentTab !== 2}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    App Settings
                  </Typography>
                  
                  <Box sx={{ mb: 4 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={profileData.preferences.darkMode}
                          onChange={() => handlePreferenceChange('darkMode')}
                          disabled={saving}
                        />
                      }
                      label="Dark Mode"
                    />
                    <Typography variant="body2" color="text.secondary">
                      Switch between light and dark themes
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 4 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={profileData.preferences.autoplay}
                          onChange={() => handlePreferenceChange('autoplay')}
                          disabled={saving}
                        />
                      }
                      label="Autoplay Trailers"
                    />
                    <Typography variant="body2" color="text.secondary">
                      Automatically play trailers when viewing movie details
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 4 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={profileData.preferences.subtitles}
                          onChange={() => handlePreferenceChange('subtitles')}
                          disabled={saving}
                        />
                      }
                      label="Enable Subtitles"
                    />
                    <Typography variant="body2" color="text.secondary">
                      Automatically enable subtitles when available
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 3, textAlign: 'right' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSavePreferences}
                      disabled={saving}
                      startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                    >
                      {saving ? 'Saving...' : 'Save Preferences'}
                    </Button>
                  </Box>
                </Box>

                {/* Notifications Tab */}
                <Box hidden={currentTab !== 3}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Notification Settings
                  </Typography>
                  
                  <Box sx={{ mb: 4 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={profileData.notifications.email}
                          onChange={() => handleNotificationChange('email')}
                          disabled={saving}
                        />
                      }
                      label="Email Notifications"
                    />
                    <Typography variant="body2" color="text.secondary">
                      Receive notifications via email
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 4 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={profileData.notifications.push}
                          onChange={() => handleNotificationChange('push')}
                          disabled={saving}
                        />
                      }
                      label="Push Notifications"
                    />
                    <Typography variant="body2" color="text.secondary">
                      Receive push notifications in your browser
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                    Notification Types
                  </Typography>
                  
                  <Box sx={{ mb: 4 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={profileData.notifications.newReleases}
                          onChange={() => handleNotificationChange('newReleases')}
                          disabled={saving}
                        />
                      }
                      label="New Releases"
                    />
                    <Typography variant="body2" color="text.secondary">
                      Be notified about new movie releases
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 4 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={profileData.notifications.recommendations}
                          onChange={() => handleNotificationChange('recommendations')}
                          disabled={saving}
                        />
                      }
                      label="Recommendations"
                    />
                    <Typography variant="body2" color="text.secondary">
                      Receive personalized movie recommendations
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 3, textAlign: 'right' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSavePreferences}
                      disabled={saving}
                      startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                    >
                      {saving ? 'Saving...' : 'Save Preferences'}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
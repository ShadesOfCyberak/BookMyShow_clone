import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Card,
  CardContent,
  CardHeader,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Notifications,
  NotificationsOff,
  Language,
  Security,
  Palette,
  AutoAwesome,
  VolumeUp,
  VolumeOff,
  Email,
  Block,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import useThemeStore from '../store/themeStore';
import useAuthStore from '../store/authStore';

const SettingsPage = () => {
  const { mode, toggleMode } = useThemeStore();
  const { user } = useAuthStore();
  
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      recommendations: true,
      newReleases: false,
    },
    privacy: {
      profileVisibility: 'public',
      showWatchlist: true,
      showFavorites: true,
      allowRecommendations: true,
    },
    display: {
      autoPlayTrailers: false,
      showAdultContent: false,
      language: 'en',
      region: 'US',
    },
    playback: {
      autoplay: false,
      quality: '1080p',
      subtitles: true,
      audioLanguage: 'en',
    },
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
  };

  const handleSaveSettings = () => {
    // In a real app, you would save these to the backend
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleResetSettings = () => {
    setSettings({
      notifications: {
        email: true,
        push: true,
        recommendations: true,
        newReleases: false,
      },
      privacy: {
        profileVisibility: 'public',
        showWatchlist: true,
        showFavorites: true,
        allowRecommendations: true,
      },
      display: {
        autoPlayTrailers: false,
        showAdultContent: false,
        language: 'en',
        region: 'US',
      },
      playback: {
        autoplay: false,
        quality: '1080p',
        subtitles: true,
        audioLanguage: 'en',
      },
    });
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 12, pb: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            mb: 2,
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Customize your MovieFlix experience
        </Typography>
      </motion.div>

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Notifications Settings */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card sx={{ height: '100%' }}>
              <CardHeader
                title="Notifications"
                avatar={<Notifications />}
                titleTypographyProps={{ fontWeight: 'bold' }}
              />
              <CardContent>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Email />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email Notifications"
                      secondary="Receive updates via email"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={settings.notifications.email}
                        onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Notifications />
                    </ListItemIcon>
                    <ListItemText
                      primary="Push Notifications"
                      secondary="Receive push notifications"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={settings.notifications.push}
                        onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AutoAwesome />
                    </ListItemIcon>
                    <ListItemText
                      primary="Movie Recommendations"
                      secondary="Get personalized recommendations"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={settings.notifications.recommendations}
                        onChange={(e) => handleSettingChange('notifications', 'recommendations', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <VolumeUp />
                    </ListItemIcon>
                    <ListItemText
                      primary="New Releases"
                      secondary="Notify about new movie releases"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={settings.notifications.newReleases}
                        onChange={(e) => handleSettingChange('notifications', 'newReleases', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Privacy Settings */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card sx={{ height: '100%' }}>
              <CardHeader
                title="Privacy"
                avatar={<Security />}
                titleTypographyProps={{ fontWeight: 'bold' }}
              />
              <CardContent>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Visibility />
                    </ListItemIcon>
                    <ListItemText
                      primary="Profile Visibility"
                      secondary="Control who can see your profile"
                    />
                    <ListItemSecondaryAction>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={settings.privacy.profileVisibility}
                          onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                        >
                          <MenuItem value="public">Public</MenuItem>
                          <MenuItem value="friends">Friends</MenuItem>
                          <MenuItem value="private">Private</MenuItem>
                        </Select>
                      </FormControl>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Visibility />
                    </ListItemIcon>
                    <ListItemText
                      primary="Show Watchlist"
                      secondary="Allow others to see your watchlist"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={settings.privacy.showWatchlist}
                        onChange={(e) => handleSettingChange('privacy', 'showWatchlist', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Visibility />
                    </ListItemIcon>
                    <ListItemText
                      primary="Show Favorites"
                      secondary="Allow others to see your favorites"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={settings.privacy.showFavorites}
                        onChange={(e) => handleSettingChange('privacy', 'showFavorites', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AutoAwesome />
                    </ListItemIcon>
                    <ListItemText
                      primary="Allow Recommendations"
                      secondary="Use your data for recommendations"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={settings.privacy.allowRecommendations}
                        onChange={(e) => handleSettingChange('privacy', 'allowRecommendations', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Display Settings */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card sx={{ height: '100%' }}>
              <CardHeader
                title="Display"
                avatar={<Palette />}
                titleTypographyProps={{ fontWeight: 'bold' }}
              />
              <CardContent>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <AutoAwesome />
                    </ListItemIcon>
                    <ListItemText
                      primary="Auto-play Trailers"
                      secondary="Automatically play movie trailers"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={settings.display.autoPlayTrailers}
                        onChange={(e) => handleSettingChange('display', 'autoPlayTrailers', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Block />
                    </ListItemIcon>
                    <ListItemText
                      primary="Show Adult Content"
                      secondary="Display adult-rated content"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={settings.display.showAdultContent}
                        onChange={(e) => handleSettingChange('display', 'showAdultContent', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Language />
                    </ListItemIcon>
                    <ListItemText
                      primary="Language"
                      secondary="Interface language"
                    />
                    <ListItemSecondaryAction>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={settings.display.language}
                          onChange={(e) => handleSettingChange('display', 'language', e.target.value)}
                        >
                          <MenuItem value="en">English</MenuItem>
                          <MenuItem value="es">Spanish</MenuItem>
                          <MenuItem value="fr">French</MenuItem>
                          <MenuItem value="de">German</MenuItem>
                        </Select>
                      </FormControl>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Language />
                    </ListItemIcon>
                    <ListItemText
                      primary="Region"
                      secondary="Content region"
                    />
                    <ListItemSecondaryAction>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={settings.display.region}
                          onChange={(e) => handleSettingChange('display', 'region', e.target.value)}
                        >
                          <MenuItem value="US">United States</MenuItem>
                          <MenuItem value="UK">United Kingdom</MenuItem>
                          <MenuItem value="CA">Canada</MenuItem>
                          <MenuItem value="AU">Australia</MenuItem>
                        </Select>
                      </FormControl>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Theme Settings */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card sx={{ height: '100%' }}>
              <CardHeader
                title="Theme"
                avatar={<Palette />}
                titleTypographyProps={{ fontWeight: 'bold' }}
              />
              <CardContent>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Palette />
                    </ListItemIcon>
                    <ListItemText
                      primary="Dark Mode"
                      secondary="Use dark theme"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={mode === 'dark'}
                        onChange={toggleMode}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
                
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Theme Preview
                  </Typography>
                  <Paper
                    sx={{
                      p: 2,
                      backgroundColor: mode === 'dark' ? 'grey.800' : 'grey.100',
                      color: mode === 'dark' ? 'white' : 'black',
                    }}
                  >
                    <Typography variant="body2">
                      This is how your interface will look with the {mode} theme.
                    </Typography>
                  </Paper>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSaveSettings}
          sx={{
            borderRadius: 30,
            px: 4,
            py: 1.5,
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            '&:hover': {
              background: 'linear-gradient(45deg, #5a71d6, #6941a3)',
            },
          }}
        >
          Save Settings
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={handleResetSettings}
          sx={{
            borderRadius: 30,
            px: 4,
            py: 1.5,
          }}
        >
          Reset to Default
        </Button>
      </Box>
    </Container>
  );
};

export default SettingsPage; 
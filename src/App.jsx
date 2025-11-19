import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AuthModal from './components/auth/AuthModal';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import DiscoverPage from './pages/DiscoverPage';
import FavoritesPage from './pages/FavoritesPage';
import WatchlistPage from './pages/WatchlistPage';
import SearchPage from './pages/SearchPage';
import MovieDetails from './pages/MovieDetails';
import Profile from './pages/Profile';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import AuthPage from './pages/AuthPage';
import BookingPage from './pages/BookingPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import EventsPage from './pages/EventsPage';
import AdminDashboard from './pages/AdminDashboard';
import TheaterOwnerPanel from './pages/TheaterOwnerPanel';

// Store
import useAuthStore from './store/authStore';
import useThemeStore from './store/themeStore';

const App = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  
  const { isAuthenticated } = useAuthStore();
  const { mode, primaryColor, secondaryColor } = useThemeStore();

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: {
        main: primaryColor,
        light: mode === 'light' ? '#8fa4f3' : '#9e9eff',
        dark: mode === 'light' ? '#4c63d2' : '#4355b8',
      },
      secondary: {
        main: secondaryColor,
        light: mode === 'light' ? '#9575cd' : '#a67fda',
        dark: mode === 'light' ? '#512da8' : '#43229a',
      },
      background: {
        default: mode === 'light' ? '#f8fafc' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
      text: {
        primary: mode === 'light' ? '#1a202c' : '#e0e0e0',
        secondary: mode === 'light' ? '#4a5568' : '#a0aec0',
      },
    },
    shape: {
      borderRadius: 12,
    },
  }), [mode, primaryColor, secondaryColor]);

  // Auth modal handlers
  const handleAuthModalOpen = (mode) => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthModalClose = () => {
    setAuthModalOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          <ToastContainer position="top-right" autoClose={4000} />
          <Navbar onAuthModalOpen={handleAuthModalOpen} />
          
          <AuthModal
            open={authModalOpen}
            onClose={handleAuthModalClose}
            initialMode={authModalMode}
          />
          
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route 
                path="/" 
                element={<HomePage onAuthModalOpen={handleAuthModalOpen} />} 
              />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/events" element={<EventsPage />} />
              
              {/* Auth Routes */}
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/register" element={<AuthPage initialMode="register" />} />
              
              {/* Booking Routes */}
              <Route 
                path="/booking/:movieId" 
                element={
                  <ProtectedRoute>
                    <BookingPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/booking-confirmation/:bookingId" 
                element={
                  <ProtectedRoute>
                    <BookingConfirmationPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected Routes */}
              <Route 
                path="/favorites" 
                element={
                  <ProtectedRoute>
                    <FavoritesPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/watchlist" 
                element={
                  <ProtectedRoute>
                    <WatchlistPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                } 
              />

              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Theater Owner Routes */}
              <Route 
                path="/theater-owner" 
                element={
                  <ProtectedRoute requireRole="theater_owner">
                    <TheaterOwnerPanel />
                  </ProtectedRoute>
                } 
              />
              
              {/* 404 Not Found Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Box>
          
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
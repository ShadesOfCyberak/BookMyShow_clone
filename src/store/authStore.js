import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-toastify';
import axios from 'axios';

// API URL
const API_URL = 'http://localhost:5000/api';

// Setup axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests when available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      
      // Actions
      login: async (email, password) => {
        try {
          set({ loading: true, error: null });
          const response = await api.post('/auth/login', { email, password });
          
          const { token, user } = response.data;
          
          // Store token in localStorage for axios interceptor
          localStorage.setItem('auth-token', token);
          
          set({
            user,
            token,
            isAuthenticated: true,
            loading: false
          });
          
          toast.success('Login successful! Welcome back.');
          return { success: true };
        } catch (error) {
          const errorMessage = 
            error.response?.data?.error || 
            error.message || 
            'Login failed. Please check your credentials.';
            
          set({ 
            loading: false, 
            error: errorMessage
          });
          return { success: false, error: errorMessage };
        }
      },
      
      register: async (userData) => {
        try {
          set({ loading: true, error: null });
          const response = await api.post('/auth/register', userData);
          
          const { token, user } = response.data;
          
          // Store token in localStorage for axios interceptor
          localStorage.setItem('auth-token', token);
          
          set({
            user,
            token,
            isAuthenticated: true,
            loading: false
          });
          
          toast.success('Registration successful! Welcome to MovieFlix.');
          return { success: true };
        } catch (error) {
          const errorMessage = 
            error.response?.data?.error || 
            error.message || 
            'Registration failed. Please try again.';
            
          set({ 
            loading: false, 
            error: errorMessage
          });
          return { success: false, error: errorMessage };
        }
      },
      
      logout: async () => {
        try {
          set({ loading: true });
          
          // Only attempt API call if we have a token
          if (get().token) {
            await api.post('/auth/logout');
          }
          
          // Remove token from localStorage
          localStorage.removeItem('auth-token');
          
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false
          });
          
          toast.info('You have been logged out successfully.');
          return { success: true };
        } catch (error) {
          localStorage.removeItem('auth-token');
          set({ 
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false 
          });
          return { success: true }; // Force logout even if API fails
        }
      },
      
      updateUser: async (userData) => {
        try {
          set({ loading: true, error: null });
          const response = await api.put('/users/profile', userData);
          
          set(state => ({
            user: {
              ...state.user,
              ...response.data.data
            },
            loading: false
          }));
          
          toast.success('Profile updated successfully.');
          return { success: true };
        } catch (error) {
          const errorMessage = 
            error.response?.data?.error || 
            error.message || 
            'Failed to update profile.';
            
          set({ 
            loading: false, 
            error: errorMessage
          });
          return { success: false, error: errorMessage };
        }
      },
      
      updatePassword: async (currentPassword, newPassword) => {
        try {
          set({ loading: true, error: null });
          await api.put('/users/password', { currentPassword, newPassword });
          
          set({ loading: false });
          toast.success('Password updated successfully.');
          return { success: true };
        } catch (error) {
          const errorMessage = 
            error.response?.data?.error || 
            error.message || 
            'Failed to update password.';
            
          set({ 
            loading: false, 
            error: errorMessage
          });
          return { success: false, error: errorMessage };
        }
      },
      
      updatePreferences: async (preferences) => {
        try {
          set({ loading: true, error: null });
          const response = await api.put('/users/preferences', preferences);
          
          set(state => ({
            user: {
              ...state.user,
              preferences: response.data.data
            },
            loading: false
          }));
          
          toast.success('Preferences updated successfully.');
          return { success: true };
        } catch (error) {
          const errorMessage = 
            error.response?.data?.error || 
            error.message || 
            'Failed to update preferences.';
            
          set({ 
            loading: false, 
            error: errorMessage
          });
          return { success: false, error: errorMessage };
        }
      },
      
      updateNotificationSettings: async (settings) => {
        try {
          set({ loading: true, error: null });
          const response = await api.put('/users/notifications', settings);
          
          set(state => ({
            user: {
              ...state.user,
              notificationSettings: response.data.data
            },
            loading: false
          }));
          
          toast.success('Notification settings updated successfully.');
          return { success: true };
        } catch (error) {
          const errorMessage = 
            error.response?.data?.error || 
            error.message || 
            'Failed to update notification settings.';
            
          set({ 
            loading: false, 
            error: errorMessage
          });
          return { success: false, error: errorMessage };
        }
      },
      
      // Check if user is authenticated using the token
      checkAuthStatus: async () => {
        try {
          if (!get().token) return { success: false };
          
          const response = await api.get('/auth/me');
          
          set({
            user: response.data.data,
            isAuthenticated: true
          });
          
          return { success: true };
        } catch (error) {
          // If token is invalid, clear auth state
          localStorage.removeItem('auth-token');
          set({
            user: null,
            token: null,
            isAuthenticated: false
          });
          return { success: false };
        }
      },
      
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
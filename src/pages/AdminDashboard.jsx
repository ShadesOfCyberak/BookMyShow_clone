import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Movie as MovieIcon,
  TheaterComedy as TheaterIcon,
  Event as EventIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Dialog states
  const [movieDialog, setMovieDialog] = useState(false);
  const [theaterDialog, setTheaterDialog] = useState(false);
  const [eventDialog, setEventDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form states
  const [movieForm, setMovieForm] = useState({
    title: '',
    overview: '',
    release_date: '',
    genre_ids: [],
    poster_path: '',
    backdrop_path: '',
    runtime: '',
    language: 'en'
  });

  const [theaterForm, setTheaterForm] = useState({
    name: '',
    address: '',
    city: '',
    facilities: [],
    screens: []
  });

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    category: 'concert',
    venue: '',
    city: '',
    date: '',
    time: '',
    price: '',
    image: ''
  });

  const genres = [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 14, name: 'Fantasy' },
    { id: 36, name: 'History' },
    { id: 27, name: 'Horror' },
    { id: 10402, name: 'Music' },
    { id: 9648, name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Science Fiction' },
    { id: 10770, name: 'TV Movie' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'War' },
    { id: 37, name: 'Western' }
  ];

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('auth-token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      switch (activeTab) {
        case 0: // Movies
          try {
            const response = await axios.get(`${API_URL}/movies`, config);
            setMovies(response.data.data || []);
          } catch (err) {
            console.log('Movies API not available, using empty array');
            setMovies([]);
          }
          break;
        case 1: // Theaters
          try {
            const response = await axios.get(`${API_URL}/theaters`, config);
            setTheaters(response.data.data || []);
          } catch (err) {
            console.log('Theaters API not available, using empty array');
            setTheaters([]);
          }
          break;
        case 2: // Events
          try {
            const response = await axios.get(`${API_URL}/events`, config);
            setEvents(response.data.data || []);
          } catch (err) {
            console.log('Events API not available, using empty array');
            setEvents([]);
          }
          break;
        case 3: // Users
          try {
            const response = await axios.get(`${API_URL}/users`, config);
            setUsers(response.data.data || []);
          } catch (err) {
            console.log('Users API not available, using empty array');
            setUsers([]);
          }
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Movie handlers
  const handleAddMovie = () => {
    setEditingItem(null);
    setMovieForm({
      title: '',
      overview: '',
      release_date: '',
      genre_ids: [],
      poster_path: '',
      backdrop_path: '',
      runtime: '',
      language: 'en'
    });
    setMovieDialog(true);
  };

  const handleEditMovie = (movie) => {
    setEditingItem(movie);
    setMovieForm({
      title: movie.title || '',
      overview: movie.overview || '',
      release_date: movie.release_date || '',
      genre_ids: movie.genre_ids || [],
      poster_path: movie.poster_path || '',
      backdrop_path: movie.backdrop_path || '',
      runtime: movie.runtime || '',
      language: movie.language || 'en'
    });
    setMovieDialog(true);
  };

  const handleSaveMovie = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      if (editingItem) {
        await axios.put(`${API_URL}/movies/${editingItem.id}`, movieForm, config);
        toast.success('Movie updated successfully');
      } else {
        await axios.post(`${API_URL}/movies`, movieForm, config);
        toast.success('Movie added successfully');
      }
      
      setMovieDialog(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to save movie');
      console.error('Error saving movie:', error);
    }
  };

  const handleDeleteMovie = async (movieId) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;
    
    try {
      const token = localStorage.getItem('auth-token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      await axios.delete(`${API_URL}/movies/${movieId}`, config);
      toast.success('Movie deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete movie');
      console.error('Error deleting movie:', error);
    }
  };

  // Theater handlers
  const handleAddTheater = () => {
    setEditingItem(null);
    setTheaterForm({
      name: '',
      address: '',
      city: '',
      facilities: [],
      screens: []
    });
    setTheaterDialog(true);
  };

  const handleSaveTheater = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      if (editingItem) {
        await axios.put(`${API_URL}/theaters/${editingItem._id}`, theaterForm, config);
        toast.success('Theater updated successfully');
      } else {
        await axios.post(`${API_URL}/theaters`, theaterForm, config);
        toast.success('Theater added successfully');
      }
      
      setTheaterDialog(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to save theater');
      console.error('Error saving theater:', error);
    }
  };

  // Event handlers
  const handleAddEvent = () => {
    setEditingItem(null);
    setEventForm({
      title: '',
      description: '',
      category: 'concert',
      venue: '',
      city: '',
      date: '',
      time: '',
      price: '',
      image: ''
    });
    setEventDialog(true);
  };

  const handleSaveEvent = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      if (editingItem) {
        await axios.put(`${API_URL}/events/${editingItem._id}`, eventForm, config);
        toast.success('Event updated successfully');
      } else {
        await axios.post(`${API_URL}/events`, eventForm, config);
        toast.success('Event added successfully');
      }
      
      setEventDialog(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to save event');
      console.error('Error saving event:', error);
    }
  };

  const renderMoviesTab = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Manage Movies</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddMovie}
        >
          Add Movie
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {movies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} key={movie.id || movie._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {movie.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Release Date: {movie.release_date}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Runtime: {movie.runtime} minutes
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton onClick={() => handleEditMovie(movie)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteMovie(movie.id || movie._id)}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  const renderTheatersTab = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Manage Theaters</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddTheater}
        >
          Add Theater
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {theaters.map((theater) => (
            <Grid item xs={12} sm={6} md={4} key={theater._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {theater.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {theater.address}, {theater.city}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Screens: {theater.screens?.length || 0}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                  <IconButton>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab icon={<MovieIcon />} label="Movies" />
          <Tab icon={<TheaterIcon />} label="Theaters" />
          <Tab icon={<EventIcon />} label="Events" />
          <Tab icon={<PersonIcon />} label="Users" />
        </Tabs>
      </Paper>

      <Box sx={{ p: 3 }}>
        {activeTab === 0 && renderMoviesTab()}
        {activeTab === 1 && renderTheatersTab()}
        {activeTab === 2 && (
          <Typography>Events management coming soon...</Typography>
        )}
        {activeTab === 3 && (
          <Typography>User management coming soon...</Typography>
        )}
      </Box>

      {/* Movie Dialog */}
      <Dialog open={movieDialog} onClose={() => setMovieDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingItem ? 'Edit Movie' : 'Add New Movie'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={movieForm.title}
                onChange={(e) => setMovieForm({...movieForm, title: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Overview"
                value={movieForm.overview}
                onChange={(e) => setMovieForm({...movieForm, overview: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="date"
                label="Release Date"
                value={movieForm.release_date}
                onChange={(e) => setMovieForm({...movieForm, release_date: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Runtime (minutes)"
                value={movieForm.runtime}
                onChange={(e) => setMovieForm({...movieForm, runtime: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Poster URL"
                value={movieForm.poster_path}
                onChange={(e) => setMovieForm({...movieForm, poster_path: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMovieDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveMovie} variant="contained">
            {editingItem ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Theater Dialog */}
      <Dialog open={theaterDialog} onClose={() => setTheaterDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingItem ? 'Edit Theater' : 'Add New Theater'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Theater Name"
                value={theaterForm.name}
                onChange={(e) => setTheaterForm({...theaterForm, name: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={theaterForm.address}
                onChange={(e) => setTheaterForm({...theaterForm, address: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="City"
                value={theaterForm.city}
                onChange={(e) => setTheaterForm({...theaterForm, city: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTheaterDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveTheater} variant="contained">
            {editingItem ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;

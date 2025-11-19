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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TheaterComedy as TheaterIcon,
  Schedule as ScheduleIcon,
  Analytics as AnalyticsIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TheaterOwnerPanel = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [myTheaters, setMyTheaters] = useState([]);
  const [shows, setShows] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Dialog states
  const [showDialog, setShowDialog] = useState(false);
  const [theaterDialog, setTheaterDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form states
  const [showForm, setShowForm] = useState({
    movieId: '',
    theaterId: '',
    screenNumber: 1,
    showTime: '',
    showDate: '',
    price: '',
    totalSeats: 100,
    availableSeats: 100
  });

  const [theaterForm, setTheaterForm] = useState({
    name: '',
    address: '',
    city: '',
    facilities: [],
    screens: [
      {
        screenNumber: 1,
        name: 'Screen 1',
        capacity: 100,
        screenType: 'Regular',
        soundSystem: 'Dolby Digital',
        seatLayout: {
          rows: 10,
          seatsPerRow: 10,
          seatTypes: {
            premium: { count: 20, price: 250 },
            regular: { count: 60, price: 180 },
            economy: { count: 20, price: 120 }
          }
        }
      }
    ]
  });

  // Sample movies for dropdown
  const [availableMovies, setAvailableMovies] = useState([
    { id: 1, title: 'Avengers: Endgame' },
    { id: 2, title: 'Spider-Man: No Way Home' },
    { id: 3, title: 'The Batman' },
    { id: 4, title: 'Top Gun: Maverick' },
    { id: 5, title: 'Black Panther: Wakanda Forever' }
  ]);

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
        case 0: // My Theaters
          try {
            const response = await axios.get(`${API_URL}/theaters/my-theaters`, config);
            setMyTheaters(response.data.data || []);
          } catch (err) {
            console.log('My theaters API not available, using empty array');
            setMyTheaters([]);
          }
          break;
        case 1: // Shows
          try {
            const response = await axios.get(`${API_URL}/shows/my-shows`, config);
            setShows(response.data.data || []);
          } catch (err) {
            console.log('Shows API not available, using empty array');
            setShows([]);
          }
          break;
        case 2: // Bookings
          try {
            const response = await axios.get(`${API_URL}/bookings/my-theaters`, config);
            setBookings(response.data.data || []);
          } catch (err) {
            console.log('Bookings API not available, using empty array');
            setBookings([]);
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

  // Theater handlers
  const handleAddTheater = () => {
    setEditingItem(null);
    setTheaterForm({
      name: '',
      address: '',
      city: '',
      facilities: [],
      screens: [{
        screenNumber: 1,
        name: 'Screen 1',
        capacity: 100,
        screenType: 'Regular',
        soundSystem: 'Dolby Digital',
        seatLayout: {
          rows: 10,
          seatsPerRow: 10,
          seatTypes: {
            premium: { count: 20, price: 250 },
            regular: { count: 60, price: 180 },
            economy: { count: 20, price: 120 }
          }
        }
      }]
    });
    setTheaterDialog(true);
  };

  const handleEditTheater = (theater) => {
    setEditingItem(theater);
    setTheaterForm({
      name: theater.name || '',
      address: theater.address || '',
      city: theater.city || '',
      facilities: theater.facilities || [],
      screens: theater.screens || []
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

  // Show handlers
  const handleAddShow = () => {
    setEditingItem(null);
    setShowForm({
      movieId: '',
      theaterId: myTheaters[0]?._id || '',
      screenNumber: 1,
      showTime: '',
      showDate: '',
      price: '',
      totalSeats: 100,
      availableSeats: 100
    });
    setShowDialog(true);
  };

  const handleSaveShow = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const showData = {
        ...showForm,
        movieId: parseInt(showForm.movieId),
        price: parseFloat(showForm.price),
        totalSeats: parseInt(showForm.totalSeats),
        availableSeats: parseInt(showForm.availableSeats)
      };

      if (editingItem) {
        await axios.put(`${API_URL}/shows/${editingItem._id}`, showData, config);
        toast.success('Show updated successfully');
      } else {
        await axios.post(`${API_URL}/shows`, showData, config);
        toast.success('Show added successfully');
      }
      
      setShowDialog(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to save show');
      console.error('Error saving show:', error);
    }
  };

  const renderMyTheatersTab = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">My Theaters</Typography>
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
          {myTheaters.map((theater) => (
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
                  <Box mt={1}>
                    {theater.facilities?.map((facility, index) => (
                      <Chip
                        key={index}
                        label={facility}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                </CardContent>
                <CardActions>
                  <IconButton onClick={() => handleEditTheater(theater)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
          {myTheaters.length === 0 && !loading && (
            <Grid item xs={12}>
              <Alert severity="info">
                No theaters found. Add your first theater to get started!
              </Alert>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );

  const renderShowsTab = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Movie Shows</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddShow}
          disabled={myTheaters.length === 0}
        >
          Add Show
        </Button>
      </Box>

      {myTheaters.length === 0 ? (
        <Alert severity="warning">
          You need to add at least one theater before creating shows.
        </Alert>
      ) : loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {shows.map((show) => (
            <Grid item xs={12} sm={6} md={4} key={show._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {availableMovies.find(m => m.id === show.movieId)?.title || 'Unknown Movie'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Theater: {myTheaters.find(t => t._id === show.theaterId)?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Screen: {show.screenNumber}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date: {show.showDate} | Time: {show.showTime}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Price: ₹{show.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Available Seats: {show.availableSeats}/{show.totalSeats}
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
          {shows.length === 0 && !loading && (
            <Grid item xs={12}>
              <Alert severity="info">
                No shows scheduled. Add your first show to start selling tickets!
              </Alert>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );

  const renderBookingsTab = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        Theater Bookings & Analytics
      </Typography>
      
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Today's Bookings
                </Typography>
                <Typography variant="h3" color="primary">
                  {bookings.filter(b => new Date(b.createdAt).toDateString() === new Date().toDateString()).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Revenue
                </Typography>
                <Typography variant="h3" color="success.main">
                  ₹{bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Bookings
                </Typography>
                <List>
                  {bookings.slice(0, 10).map((booking, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={`Booking #${booking._id?.slice(-6) || index}`}
                        secondary={`${booking.movieTitle} - ${booking.theaterName} - ₹${booking.totalAmount}`}
                      />
                      <ListItemSecondaryAction>
                        <Chip
                          label={booking.status || 'confirmed'}
                          color={booking.status === 'confirmed' ? 'success' : 'warning'}
                          size="small"
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
                {bookings.length === 0 && (
                  <Alert severity="info">
                    No bookings yet. Bookings will appear here once customers start booking tickets.
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Theater Owner Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab icon={<TheaterIcon />} label="My Theaters" />
          <Tab icon={<ScheduleIcon />} label="Shows" />
          <Tab icon={<AnalyticsIcon />} label="Bookings" />
        </Tabs>
      </Paper>

      <Box sx={{ p: 3 }}>
        {activeTab === 0 && renderMyTheatersTab()}
        {activeTab === 1 && renderShowsTab()}
        {activeTab === 2 && renderBookingsTab()}
      </Box>

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

      {/* Show Dialog */}
      <Dialog open={showDialog} onClose={() => setShowDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingItem ? 'Edit Show' : 'Add New Show'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Movie</InputLabel>
                <Select
                  value={showForm.movieId}
                  onChange={(e) => setShowForm({...showForm, movieId: e.target.value})}
                >
                  {availableMovies.map((movie) => (
                    <MenuItem key={movie.id} value={movie.id}>
                      {movie.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Theater</InputLabel>
                <Select
                  value={showForm.theaterId}
                  onChange={(e) => setShowForm({...showForm, theaterId: e.target.value})}
                >
                  {myTheaters.map((theater) => (
                    <MenuItem key={theater._id} value={theater._id}>
                      {theater.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Show Date"
                value={showForm.showDate}
                onChange={(e) => setShowForm({...showForm, showDate: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="time"
                label="Show Time"
                value={showForm.showTime}
                onChange={(e) => setShowForm({...showForm, showTime: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Ticket Price (₹)"
                value={showForm.price}
                onChange={(e) => setShowForm({...showForm, price: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Screen Number"
                value={showForm.screenNumber}
                onChange={(e) => setShowForm({...showForm, screenNumber: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveShow} variant="contained">
            {editingItem ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TheaterOwnerPanel;

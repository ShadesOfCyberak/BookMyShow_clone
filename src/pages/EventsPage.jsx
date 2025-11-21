import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  Pagination
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Event as EventIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const url = import.meta.env.VITE_API_URL;

const EventsPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    city: 'Mumbai',
    date: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalEvents: 0
  });

  useEffect(() => {
    fetchCategories();
    fetchEvents();
  }, [filters.category, filters.city, filters.date, pagination.currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${url}/events/categories`);
      const categoriesData = await response.json();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: pagination.currentPage,
        limit: 12,
        ...(filters.category !== 'All' && { category: filters.category }),
        ...(filters.city && { city: filters.city }),
        ...(filters.date && { date: filters.date }),
        ...(filters.search && { search: filters.search })
      });

      const response = await fetch(`${url}/events?${queryParams}`);
      const data = await response.json();
      
      setEvents(data.events);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleSearch = () => {
    fetchEvents();
  };

  const handlePageChange = (event, value) => {
    setPagination(prev => ({ ...prev, currentPage: value }));
  };

  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getMinPrice = (ticketTypes) => {
    if (!ticketTypes || ticketTypes.length === 0) return 0;
    return Math.min(...ticketTypes.map(t => t.price));
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, mt: 8 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" mb={1}>
          Events
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover amazing events happening in your city
        </Typography>
      </Box>

      {/* Filters */}
      <Box mb={4}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Search Events"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                endAdornment: (
                  <SearchIcon 
                    sx={{ cursor: 'pointer' }} 
                    onClick={handleSearch}
                  />
                )
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                label="Category"
              >
                <MenuItem value="All">All Categories</MenuItem>
                {categories.map(cat => (
                  <MenuItem key={cat.category} value={cat.category}>
                    {cat.category} ({cat.count})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>City</InputLabel>
              <Select
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                label="City"
              >
                <MenuItem value="Mumbai">Mumbai</MenuItem>
                <MenuItem value="Delhi">Delhi</MenuItem>
                <MenuItem value="Bangalore">Bangalore</MenuItem>
                <MenuItem value="Chennai">Chennai</MenuItem>
                <MenuItem value="Kolkata">Kolkata</MenuItem>
                <MenuItem value="Pune">Pune</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              type="date"
              label="Date"
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="text.secondary">
              {pagination.totalEvents} events found
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Events Grid */}
      {loading ? (
        <Box textAlign="center" py={8}>
          <Typography>Loading events...</Typography>
        </Box>
      ) : events.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary">
            No events found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your filters to see more events
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {events.map(event => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={event._id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <Card 
                  sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: theme.shadows[8]
                    }
                  }}
                  onClick={() => navigate(`/events/${event._id}`)}
                >
                  {/* Event Image */}
                  <CardMedia
                    component="img"
                    height={200}
                    image={event.images?.poster || '/api/placeholder/400/300'}
                    alt={event.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  
                  <CardContent sx={{ flexGrow: 1 }}>
                    {/* Category Chip */}
                    <Chip 
                      label={event.category}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                    
                    {/* Event Title */}
                    <Typography 
                      variant="h6" 
                      fontWeight="bold" 
                      mb={1}
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {event.title}
                    </Typography>

                    {/* Venue */}
                    <Box display="flex" alignItems="center" mb={1}>
                      <LocationIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary" ml={0.5}>
                        {event.venue.name}, {event.venue.city}
                      </Typography>
                    </Box>

                    {/* Date */}
                    <Box display="flex" alignItems="center" mb={2}>
                      <EventIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary" ml={0.5}>
                        {event.dates.length > 0 && formatEventDate(event.dates[0].date)}
                        {event.dates.length > 1 && ` + ${event.dates.length - 1} more`}
                      </Typography>
                    </Box>

                    {/* Price */}
                    {event.dates.length > 0 && event.dates[0].ticketTypes.length > 0 && (
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        ₹{getMinPrice(event.dates[0].ticketTypes)} onwards
                      </Typography>
                    )}

                    {/* Rating */}
                    {event.rating.count > 0 && (
                      <Box mt={1}>
                        <Chip 
                          label={`⭐ ${event.rating.average} (${event.rating.count})`}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Container>
  );
};

export default EventsPage;

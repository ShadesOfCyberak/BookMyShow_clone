import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

// Components
import TheaterCard from '../components/booking/TheaterCard';
import SeatSelection from '../components/booking/SeatSelection';
import BookingSummary from '../components/booking/BookingSummary';

// Store
import useAuthStore from '../store/authStore';

const url = import.meta.env.VITE_API_URL;

const BookingPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user } = useAuthStore();

  // Booking flow state
  const [activeStep, setActiveStep] = useState(0);
  const [movie, setMovie] = useState(null);
  const [theaters, setTheaters] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedShowTime, setSelectedShowTime] = useState(null);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  const city = searchParams.get('city') || user?.location?.city || 'Mumbai';
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const steps = ['Select Theater & Show', 'Choose Seats', 'Payment & Confirmation'];

  useEffect(() => {
    fetchMovieAndTheaters();
  }, [movieId, city]);

  const fetchMovieAndTheaters = async () => {
    try {
      setLoading(true);
      
      // Fetch movie details from TMDB
      const movieResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${import.meta.env.VITE_TMDB_API_KEY || '8ac53721bcb7c1e97104d48845c63277'}`
      );
      const movieData = await movieResponse.json();
      setMovie(movieData);

      // Fetch theaters with shows for this movie
      try {
        const theatersResponse = await fetch(
          `${url}/theaters?city=${city}&movieId=${movieId}`,
          {
            headers: isAuthenticated ? {
              'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
            } : {}
          }
        );
        const theatersData = await theatersResponse.json();
        setTheaters(theatersData.data || []);
      } catch (err) {
        // Use sample theater data if API fails
        setTheaters([
          {
            _id: '1',
            name: 'PVR Phoenix',
            address: 'Phoenix Mall, Kurla West',
            city: city,
            screens: [
              {
                screenNumber: 1,
                name: 'Screen 1',
                capacity: 200,
                shows: [
                  { time: '10:00 AM', price: 150, availableSeats: 180 },
                  { time: '01:00 PM', price: 200, availableSeats: 150 },
                  { time: '04:00 PM', price: 200, availableSeats: 120 },
                  { time: '07:00 PM', price: 250, availableSeats: 90 },
                  { time: '10:00 PM', price: 200, availableSeats: 160 }
                ]
              }
            ]
          },
          {
            _id: '2',
            name: 'INOX R-City',
            address: 'R-City Mall, Ghatkopar West',
            city: city,
            screens: [
              {
                screenNumber: 1,
                name: 'Screen 1',
                capacity: 180,
                shows: [
                  { time: '11:00 AM', price: 180, availableSeats: 160 },
                  { time: '02:00 PM', price: 220, availableSeats: 140 },
                  { time: '05:00 PM', price: 220, availableSeats: 100 },
                  { time: '08:00 PM', price: 280, availableSeats: 80 },
                  { time: '11:00 PM', price: 220, availableSeats: 150 }
                ]
              }
            ]
          }
        ]);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load booking information');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectShow = (show, showTime, theater) => {
    setSelectedShow(show);
    setSelectedShowTime(showTime);
    setSelectedTheater(theater);
    setActiveStep(1);
  };

  const handleSeatsSelected = (seats) => {
    setSelectedSeats(seats);
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }
    setActiveStep(2);
  };

  const handleConfirmBooking = async (bookingData) => {
    try {
      setBookingLoading(true);
      
      const response = await fetch(`${url}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Booking failed');
      }

      const booking = await response.json();
      toast.success('Booking confirmed successfully!');
      
      // Redirect to booking confirmation page
      navigate(`/booking-confirmation/${booking.bookingId}`);
      
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.message || 'Failed to confirm booking');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleBackStep = () => {
    setActiveStep(activeStep - 1);
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  const bookingDetails = {
    movie,
    theater: selectedTheater,
    show: selectedShow,
    showTime: selectedShowTime,
    seats: selectedSeats
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" mb={1}>
          Book Tickets
        </Typography>
        {movie && (
          <Typography variant="h6" color="text.secondary">
            {movie.title}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary">
          {city} | {new Date(date).toLocaleDateString()}
        </Typography>
      </Paper>

      {/* Stepper */}
      <Paper elevation={1} sx={{ p: 2, mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Step 1: Theater Selection */}
          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" fontWeight="bold" mb={3}>
                Select Theater & Show Time
              </Typography>
              
              {theaters.length === 0 ? (
                <Alert severity="info">
                  No shows available for this movie in {city} on {new Date(date).toLocaleDateString()}.
                  Try selecting a different date or city.
                </Alert>
              ) : (
                theaters.map(theater => (
                  <TheaterCard
                    key={theater._id}
                    theater={theater}
                    movie={movie}
                    onSelectShow={handleSelectShow}
                  />
                ))
              )}
            </Box>
          )}

          {/* Step 2: Seat Selection */}
          {activeStep === 1 && selectedShow && selectedTheater && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">
                  Select Your Seats
                </Typography>
                <Button variant="outlined" onClick={handleBackStep}>
                  Back to Theaters
                </Button>
              </Box>
              
              <SeatSelection
                show={selectedShow}
                showTime={selectedShowTime}
                theater={selectedTheater}
                onSeatsSelected={handleSeatsSelected}
              />
              
              {selectedSeats.length > 0 && (
                <Box textAlign="center" mt={3}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleProceedToPayment}
                    sx={{ px: 4, py: 1.5 }}
                  >
                    Proceed to Payment
                  </Button>
                </Box>
              )}
            </Box>
          )}

          {/* Step 3: Payment & Confirmation */}
          {activeStep === 2 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">
                  Confirm Your Booking
                </Typography>
                <Button variant="outlined" onClick={handleBackStep}>
                  Back to Seat Selection
                </Button>
              </Box>
              
              <BookingSummary
                bookingDetails={bookingDetails}
                onConfirmBooking={handleConfirmBooking}
                loading={bookingLoading}
              />
            </Box>
          )}
        </motion.div>
      </AnimatePresence>
    </Container>
  );
};

export default BookingPage;

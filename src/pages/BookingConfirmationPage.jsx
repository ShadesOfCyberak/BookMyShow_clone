import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Divider,
  Alert,
  useTheme
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const BookingConfirmationPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/bookings/ticket/${bookingId}`
      );
      
      if (!response.ok) {
        throw new Error('Booking not found');
      }
      
      const bookingData = await response.json();
      setBooking(bookingData);
    } catch (error) {
      console.error('Error fetching booking:', error);
      toast.error('Failed to load booking details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleDownloadTicket = () => {
    // Implement ticket download functionality
    toast.info('Download functionality will be implemented');
  };

  const handleShareTicket = () => {
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: `${booking.movie.title} - Booking Confirmed`,
        text: `My ticket for ${booking.movie.title} at ${booking.theater.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Booking link copied to clipboard');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, mt: 8 }}>
        <Box textAlign="center">
          <Typography>Loading booking details...</Typography>
        </Box>
      </Container>
    );
  }

  if (!booking) {
    return (
      <Container maxWidth="md" sx={{ py: 4, mt: 8 }}>
        <Alert severity="error">
          Booking not found. Please check your booking ID.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4, mt: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Success Header */}
        <Box textAlign="center" mb={4}>
          <CheckCircleIcon 
            sx={{ 
              fontSize: 80, 
              color: theme.palette.success.main,
              mb: 2 
            }} 
          />
          <Typography variant="h4" fontWeight="bold" color="success.main" mb={1}>
            Booking Confirmed!
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Your tickets have been successfully booked
          </Typography>
        </Box>

        {/* Booking Details */}
        <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" mb={3}>
            Booking Details
          </Typography>

          <Grid container spacing={3}>
            {/* Movie Info */}
            <Grid item xs={12} md={6}>
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Movie
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {booking.movie.title}
                </Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Booking ID
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {booking.bookingId}
                </Typography>
              </Box>
            </Grid>

            {/* Theater Info */}
            <Grid item xs={12} md={6}>
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Theater
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {booking.theater.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {booking.theater.address}
                </Typography>
              </Box>
            </Grid>

            {/* Show Details */}
            <Grid item xs={12} md={6}>
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Date & Time
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {new Date(booking.showTime.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {formatTime(booking.showTime.time)}
                </Typography>
              </Box>
            </Grid>

            {/* Screen & Seats */}
            <Grid item xs={12} md={6}>
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Screen & Seats
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {booking.screen.name}
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {booking.seats.map(s => s.seatNumber).join(', ')}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Payment Details */}
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Payment Summary
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Typography variant="body2">
                Tickets ({booking.seats.length})
              </Typography>
            </Grid>
            <Grid item xs={4} textAlign="right">
              <Typography variant="body2">
                ₹{booking.totalAmount}
              </Typography>
            </Grid>

            <Grid item xs={8}>
              <Typography variant="body2">
                Convenience Fee
              </Typography>
            </Grid>
            <Grid item xs={4} textAlign="right">
              <Typography variant="body2">
                ₹{booking.convenienceFee}
              </Typography>
            </Grid>

            <Grid item xs={8}>
              <Typography variant="body2">
                Taxes & Fees
              </Typography>
            </Grid>
            <Grid item xs={4} textAlign="right">
              <Typography variant="body2">
                ₹{booking.taxes}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>

            <Grid item xs={8}>
              <Typography variant="h6" fontWeight="bold">
                Total Paid
              </Typography>
            </Grid>
            <Grid item xs={4} textAlign="right">
              <Typography variant="h6" fontWeight="bold" color="primary">
                ₹{booking.finalAmount}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary">
                  Payment Method: {booking.payment.method}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Transaction ID: {booking.payment.transactionId}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Paid on: {new Date(booking.payment.paidAt).toLocaleString()}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* QR Code (if available) */}
        {booking.qrCode && (
          <Paper elevation={2} sx={{ p: 3, mb: 3, textAlign: 'center' }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Your Ticket
            </Typography>
            <Box 
              sx={{ 
                width: 200, 
                height: 200, 
                backgroundColor: theme.palette.grey[100],
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `2px dashed ${theme.palette.grey[400]}`
              }}
            >
              <Typography variant="body2" color="text.secondary">
                QR Code
                <br />
                {booking.qrCode.slice(-8)}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" mt={2}>
              Show this QR code at the theater for entry
            </Typography>
          </Paper>
        )}

        {/* Action Buttons */}
        <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadTicket}
            sx={{ px: 3 }}
          >
            Download Ticket
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<ShareIcon />}
            onClick={handleShareTicket}
            sx={{ px: 3 }}
          >
            Share
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            sx={{ px: 3 }}
          >
            Back to Home
          </Button>
        </Box>

        {/* Important Notes */}
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>Important:</strong> Please arrive at the theater at least 30 minutes before the show time. 
            Carry a valid ID proof along with this ticket. Outside food and beverages are not allowed.
          </Typography>
        </Alert>
      </motion.div>
    </Container>
  );
};

export default BookingConfirmationPage;

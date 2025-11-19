import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Grid,
  useTheme,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormGroup
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  AccountBalance as BankIcon,
  PhoneAndroid as UPIIcon,
  AccountBalanceWallet as WalletIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import useAuthStore from '../../store/authStore';

const BookingSummary = ({ 
  bookingDetails, 
  onConfirmBooking, 
  loading = false 
}) => {
  const theme = useTheme();
  const { isAuthenticated, user } = useAuthStore();
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const [proceedAsGuest, setProceedAsGuest] = useState(false);
  const [guestDetails, setGuestDetails] = useState({
    name: '',
    email: '',
    phone: '',
    saveForFuture: false
  });
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: ''
  });

  const { movie, theater, show, showTime, seats } = bookingDetails;

  const calculatePricing = () => {
    const totalAmount = seats.reduce((sum, seat) => sum + seat.price, 0);
    const convenienceFee = Math.round(totalAmount * 0.02); // 2%
    const taxes = Math.round((totalAmount + convenienceFee) * 0.18); // 18% GST
    const finalAmount = totalAmount + convenienceFee + taxes;

    return {
      totalAmount,
      convenienceFee,
      taxes,
      finalAmount
    };
  };

  const pricing = calculatePricing();

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleCardDetailsChange = (field, value) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConfirmBooking = () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowGuestDialog(true);
      return;
    }

    // Proceed with booking
    proceedWithBooking();
  };

  const handleGuestBooking = () => {
    if (!guestDetails.name || !guestDetails.email || !guestDetails.phone) {
      alert('Please fill in all guest details');
      return;
    }
    
    setProceedAsGuest(true);
    setShowGuestDialog(false);
    proceedWithBooking();
  };

  const proceedWithBooking = () => {
    const bookingData = {
      showId: show._id,
      showTimeId: showTime._id,
      seats,
      paymentMethod,
      ...pricing,
      // Include guest details if booking as guest
      ...(proceedAsGuest && {
        guestDetails,
        isGuestBooking: true
      }),
      // Include user details if authenticated
      ...(isAuthenticated && user && {
        userId: user.id,
        userEmail: user.email,
        userName: `${user.firstName} ${user.lastName}`
      })
    };

    onConfirmBooking(bookingData);
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const paymentMethods = [
    { 
      value: 'Credit Card', 
      label: 'Credit/Debit Card', 
      icon: <CreditCardIcon /> 
    },
    { 
      value: 'UPI', 
      label: 'UPI', 
      icon: <UPIIcon /> 
    },
    { 
      value: 'Net Banking', 
      label: 'Net Banking', 
      icon: <BankIcon /> 
    },
    { 
      value: 'Wallet', 
      label: 'Digital Wallet', 
      icon: <WalletIcon /> 
    }
  ];

  return (
    <Box>
      {/* Booking Summary */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Booking Summary
        </Typography>

        {/* Movie Details */}
        <Box mb={2}>
          <Typography variant="subtitle1" fontWeight="bold">
            {movie.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {show.format} | {show.movie.language}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Theater & Show Details */}
        <Grid container spacing={2} mb={2}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Theater
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {theater.name}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Screen
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {show.screen.name}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Date & Time
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {new Date(showTime.date).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {formatTime(showTime.time)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Seats ({seats.length})
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {seats.map(s => s.seatNumber).join(', ')}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Pricing Breakdown */}
        <Box>
          <Typography variant="subtitle2" fontWeight="bold" mb={1}>
            Price Breakdown
          </Typography>
          
          {seats.map((seat, index) => (
            <Box key={index} display="flex" justifyContent="space-between" mb={0.5}>
              <Typography variant="body2">
                {seat.seatNumber} ({seat.seatType})
              </Typography>
              <Typography variant="body2">
                ₹{seat.price}
              </Typography>
            </Box>
          ))}
          
          <Box display="flex" justifyContent="space-between" mb={0.5}>
            <Typography variant="body2">
              Sub Total
            </Typography>
            <Typography variant="body2">
              ₹{pricing.totalAmount}
            </Typography>
          </Box>
          
          <Box display="flex" justifyContent="space-between" mb={0.5}>
            <Typography variant="body2">
              Convenience Fee
            </Typography>
            <Typography variant="body2">
              ₹{pricing.convenienceFee}
            </Typography>
          </Box>
          
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2">
              Taxes & Fees
            </Typography>
            <Typography variant="body2">
              ₹{pricing.taxes}
            </Typography>
          </Box>
          
          <Divider sx={{ my: 1 }} />
          
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6" fontWeight="bold">
              Total Amount
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="primary">
              ₹{pricing.finalAmount}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Payment Methods */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Payment Method
        </Typography>

        <FormControl component="fieldset">
          <RadioGroup
            value={paymentMethod}
            onChange={handlePaymentMethodChange}
          >
            {paymentMethods.map((method) => (
              <FormControlLabel
                key={method.value}
                value={method.value}
                control={<Radio />}
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    {method.icon}
                    <Typography>{method.label}</Typography>
                  </Box>
                }
              />
            ))}
          </RadioGroup>
        </FormControl>

        {/* Card Details Form */}
        {(paymentMethod === 'Credit Card') && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <Box mt={3}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Cardholder Name"
                    value={cardDetails.cardholderName}
                    onChange={(e) => handleCardDetailsChange('cardholderName', e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Card Number"
                    value={cardDetails.cardNumber}
                    onChange={(e) => handleCardDetailsChange('cardNumber', e.target.value)}
                    variant="outlined"
                    size="small"
                    placeholder="1234 5678 9012 3456"
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Month"
                    value={cardDetails.expiryMonth}
                    onChange={(e) => handleCardDetailsChange('expiryMonth', e.target.value)}
                    variant="outlined"
                    size="small"
                    placeholder="MM"
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Year"
                    value={cardDetails.expiryYear}
                    onChange={(e) => handleCardDetailsChange('expiryYear', e.target.value)}
                    variant="outlined"
                    size="small"
                    placeholder="YYYY"
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="CVV"
                    value={cardDetails.cvv}
                    onChange={(e) => handleCardDetailsChange('cvv', e.target.value)}
                    variant="outlined"
                    size="small"
                    placeholder="123"
                  />
                </Grid>
              </Grid>
            </Box>
          </motion.div>
        )}
      </Paper>

      {/* Terms & Conditions */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          By proceeding, you agree to our Terms & Conditions and Privacy Policy. 
          Tickets once booked cannot be exchanged or refunded.
        </Typography>
      </Alert>

      {/* Confirm Booking Button */}
      <Box textAlign="center">
        <Button
          variant="contained"
          size="large"
          onClick={handleConfirmBooking}
          disabled={loading || seats.length === 0}
          sx={{
            py: 1.5,
            px: 4,
            fontSize: '1.1rem',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Processing...' : `Pay ₹${pricing.finalAmount}`}
        </Button>
      </Box>

      {/* Guest Booking Dialog */}
      <Dialog open={showGuestDialog} onClose={() => setShowGuestDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <PersonIcon />
            <Typography variant="h6">Guest Booking</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            You can book tickets as a guest or create an account to save your booking history.
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={guestDetails.name}
                onChange={(e) => setGuestDetails({...guestDetails, name: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={guestDetails.email}
                onChange={(e) => setGuestDetails({...guestDetails, email: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                value={guestDetails.phone}
                onChange={(e) => setGuestDetails({...guestDetails, phone: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={guestDetails.saveForFuture}
                      onChange={(e) => setGuestDetails({...guestDetails, saveForFuture: e.target.checked})}
                    />
                  }
                  label="Save my details for future bookings"
                />
              </FormGroup>
            </Grid>
          </Grid>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              Guest bookings will be sent to your email. Create an account to manage bookings and earn rewards.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowGuestDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={() => {
              setShowGuestDialog(false);
              // Redirect to login/register
              window.location.href = '/auth?redirect=' + encodeURIComponent(window.location.pathname);
            }}
            variant="outlined"
          >
            Create Account
          </Button>
          <Button onClick={handleGuestBooking} variant="contained">
            Continue as Guest
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookingSummary;

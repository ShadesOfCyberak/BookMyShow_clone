import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Paper,
  Chip,
  useTheme,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';

const SeatSelection = ({ show, showTime, theater, onSeatsSelected }) => {
  const theme = useTheme();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatLayout, setSeatLayout] = useState(null);

  useEffect(() => {
    // Generate seat layout based on theater screen configuration
    if (theater && show) {
      const screen = theater.screens?.find(s => s.screenId === show.screen.screenId);
      if (screen) {
        generateSeatLayout(screen.seatLayout);
      }
    }
  }, [theater, show]);

  const generateSeatLayout = (layout) => {
    const { rows, seatsPerRow, seatTypes } = layout;
    const seatMap = {};
    
    // Create seat type mapping
    const typeMap = {};
    seatTypes.forEach(type => {
      type.rows.forEach(row => {
        typeMap[row] = { type: type.type, price: type.price };
      });
    });

    // Generate seats
    for (let i = 0; i < rows; i++) {
      const rowLetter = String.fromCharCode(65 + i); // A, B, C, etc.
      seatMap[rowLetter] = [];
      
      for (let j = 1; j <= seatsPerRow; j++) {
        const seatNumber = `${rowLetter}${j}`;
        const seatInfo = typeMap[rowLetter] || { type: 'Regular', price: 150 };
        
        seatMap[rowLetter].push({
          number: seatNumber,
          type: seatInfo.type,
          price: seatInfo.price,
          isBooked: showTime?.bookedSeats?.includes(seatNumber) || false,
          isSelected: false
        });
      }
    }
    
    setSeatLayout(seatMap);
  };

  const handleSeatClick = (rowLetter, seatIndex) => {
    if (!seatLayout) return;
    
    const seat = seatLayout[rowLetter][seatIndex];
    if (seat.isBooked) return;

    const seatNumber = seat.number;
    const newSelectedSeats = selectedSeats.includes(seatNumber)
      ? selectedSeats.filter(s => s !== seatNumber)
      : [...selectedSeats, seatNumber];

    setSelectedSeats(newSelectedSeats);

    // Update layout
    const newLayout = { ...seatLayout };
    newLayout[rowLetter] = [...newLayout[rowLetter]];
    newLayout[rowLetter][seatIndex] = {
      ...seat,
      isSelected: !seat.isSelected
    };
    setSeatLayout(newLayout);

    // Calculate selected seat details for parent
    const selectedSeatDetails = newSelectedSeats.map(seatNum => {
      const row = seatNum[0];
      const seatIdx = parseInt(seatNum.slice(1)) - 1;
      const seatData = newLayout[row][seatIdx];
      return {
        seatNumber: seatNum,
        seatType: seatData.type,
        price: seatData.price
      };
    });

    onSeatsSelected(selectedSeatDetails);
  };

  const getSeatColor = (seat) => {
    if (seat.isBooked) return theme.palette.error.main;
    if (seat.isSelected) return theme.palette.success.main;
    
    switch (seat.type) {
      case 'Premium': return theme.palette.warning.main;
      case 'Gold': return theme.palette.info.main;
      case 'Silver': return theme.palette.grey[400];
      default: return theme.palette.grey[300];
    }
  };

  const getSeatTypePrice = (type) => {
    if (!seatLayout) return 0;
    for (const row of Object.values(seatLayout)) {
      const seat = row.find(s => s.type === type);
      if (seat) return seat.price;
    }
    return 0;
  };

  if (!seatLayout) {
    return (
      <Box textAlign="center" py={4}>
        <Typography>Loading seat layout...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Movie Info */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">
          {show.movie.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {theater.name} | Screen {show.screen.name} | 
          {new Date(showTime.date).toLocaleDateString()} {showTime.time}
        </Typography>
      </Paper>

      {/* Screen */}
      <Box textAlign="center" mb={4}>
        <Box
          sx={{
            width: '60%',
            height: '20px',
            backgroundColor: theme.palette.grey[300],
            borderRadius: '10px 10px 0 0',
            margin: '0 auto',
            position: 'relative',
            '&::after': {
              content: '"SCREEN"',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '10px',
              fontWeight: 'bold',
              color: theme.palette.grey[600]
            }
          }}
        />
        <Typography variant="caption" color="text.secondary" mt={1}>
          All eyes this way please!
        </Typography>
      </Box>

      {/* Seat Layout */}
      <Box display="flex" justifyContent="center" mb={3}>
        <Box>
          {Object.entries(seatLayout).map(([rowLetter, seats]) => (
            <Box key={rowLetter} display="flex" alignItems="center" mb={1}>
              <Typography 
                variant="body2" 
                fontWeight="bold" 
                sx={{ width: '20px', textAlign: 'center', mr: 1 }}
              >
                {rowLetter}
              </Typography>
              <Box display="flex" gap={0.5}>
                {seats.map((seat, index) => (
                  <motion.div
                    key={seat.number}
                    whileHover={{ scale: seat.isBooked ? 1 : 1.1 }}
                    whileTap={{ scale: seat.isBooked ? 1 : 0.9 }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      disabled={seat.isBooked}
                      onClick={() => handleSeatClick(rowLetter, index)}
                      sx={{
                        minWidth: '30px',
                        height: '30px',
                        padding: 0,
                        backgroundColor: getSeatColor(seat),
                        color: 'white',
                        fontSize: '10px',
                        '&:hover': {
                          backgroundColor: seat.isBooked ? theme.palette.error.main : getSeatColor(seat)
                        },
                        '&.Mui-disabled': {
                          backgroundColor: theme.palette.error.main,
                          color: 'white'
                        }
                      }}
                    >
                      {seat.number.slice(1)}
                    </Button>
                  </motion.div>
                ))}
              </Box>
              <Typography 
                variant="body2" 
                fontWeight="bold" 
                sx={{ width: '20px', textAlign: 'center', ml: 1 }}
              >
                {rowLetter}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Legend */}
      <Box display="flex" justifyContent="center" gap={2} mb={3} flexWrap="wrap">
        <Box display="flex" alignItems="center" gap={0.5}>
          <Box 
            width={16} 
            height={16} 
            backgroundColor={theme.palette.grey[300]} 
            borderRadius={1}
          />
          <Typography variant="caption">Available</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={0.5}>
          <Box 
            width={16} 
            height={16} 
            backgroundColor={theme.palette.success.main} 
            borderRadius={1}
          />
          <Typography variant="caption">Selected</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={0.5}>
          <Box 
            width={16} 
            height={16} 
            backgroundColor={theme.palette.error.main} 
            borderRadius={1}
          />
          <Typography variant="caption">Booked</Typography>
        </Box>
      </Box>

      {/* Seat Types & Pricing */}
      <Grid container spacing={2} mb={3}>
        {['Premium', 'Gold', 'Silver', 'Regular'].map(type => {
          const price = getSeatTypePrice(type);
          if (price === 0) return null;
          
          return (
            <Grid item key={type}>
              <Chip 
                label={`${type} - ₹${price}`}
                variant="outlined"
                size="small"
              />
            </Grid>
          );
        })}
      </Grid>

      {/* Selection Summary */}
      {selectedSeats.length > 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            Selected {selectedSeats.length} seat(s): {selectedSeats.join(', ')}
          </Typography>
        </Alert>
      )}
    </Box>
  );
};

export default SeatSelection;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Grid,
  Divider,
  useTheme
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const TheaterCard = ({ theater, movie, onSelectShow }) => {
  const theme = useTheme();
  const [selectedShow, setSelectedShow] = useState(null);

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const groupShowsByFormat = (shows) => {
    const grouped = {};
    shows.forEach(show => {
      if (!grouped[show.format]) {
        grouped[show.format] = [];
      }
      grouped[show.format].push(show);
    });
    return grouped;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        sx={{ 
          mb: 3,
          border: `1px solid ${theme.palette.divider}`,
          '&:hover': {
            boxShadow: theme.shadows[4]
          }
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box>
              <Typography variant="h6" fontWeight="bold" mb={1}>
                {theater.name}
              </Typography>
              <Box display="flex" alignItems="center" mb={1}>
                <LocationIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary" ml={0.5}>
                  {theater.location.address}, {theater.location.city}
                </Typography>
              </Box>
              {theater.amenities && (
                <Box display="flex" gap={0.5} flexWrap="wrap">
                  {theater.amenities.slice(0, 3).map((amenity, index) => (
                    <Chip 
                      key={index}
                      label={amenity} 
                      size="small" 
                      variant="outlined" 
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {theater.shows && theater.shows.length > 0 ? (
            Object.entries(groupShowsByFormat(theater.shows)).map(([format, shows]) => (
              <Box key={format} mb={2}>
                <Typography variant="subtitle2" color="primary" fontWeight="bold" mb={1}>
                  {format}
                </Typography>
                <Grid container spacing={1}>
                  {shows[0].showTimes
                    .filter(showTime => new Date(showTime.date) >= new Date())
                    .slice(0, 6)
                    .map((showTime, index) => (
                    <Grid item key={index}>
                      <Button
                        variant={selectedShow === `${shows[0]._id}-${showTime._id}` ? "contained" : "outlined"}
                        size="small"
                        onClick={() => {
                          setSelectedShow(`${shows[0]._id}-${showTime._id}`);
                          onSelectShow(shows[0], showTime, theater);
                        }}
                        disabled={showTime.status === 'Full' || showTime.availableSeats === 0}
                        sx={{
                          minWidth: '80px',
                          fontSize: '0.75rem',
                          py: 0.5,
                          px: 1
                        }}
                      >
                        <Box textAlign="center">
                          <Typography variant="caption" display="block">
                            {formatTime(showTime.time)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ₹{showTime.price?.Regular || 150}
                          </Typography>
                        </Box>
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
              No shows available for this movie
            </Typography>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TheaterCard;

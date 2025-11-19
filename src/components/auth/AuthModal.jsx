import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import AuthForm from './AuthForm';

const AuthModal = ({ open, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);
  const { isAuthenticated } = useAuthStore();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleToggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };

  const handleSuccess = () => {
    onClose();
  };

  // Close modal if user is authenticated
  if (isAuthenticated && open) {
    onClose();
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={fullScreen}
      PaperProps={{
        elevation: 8,
        sx: {
          borderRadius: { xs: 0, sm: 2 },
          overflow: 'hidden',
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 1,
        }}
      >
        <IconButton onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent
        sx={{
          p: { xs: 2, sm: 4 },
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(145deg, #1a1a1a, #2a2a2a)'
            : 'linear-gradient(145deg, #f8fafc, #ffffff)',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <AuthForm
              mode={mode}
              onToggleMode={handleToggleMode}
              onSuccess={handleSuccess}
            />
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
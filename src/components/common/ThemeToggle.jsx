import React from 'react';
import { IconButton, Tooltip, useTheme } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import useThemeStore from '../../store/themeStore';

const ThemeToggle = () => {
  const theme = useTheme();
  const { mode, toggleMode } = useThemeStore();

  return (
    <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
      <IconButton 
        onClick={toggleMode} 
        color="inherit"
        sx={{
          borderRadius: '50%',
          transition: 'all 0.3s',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
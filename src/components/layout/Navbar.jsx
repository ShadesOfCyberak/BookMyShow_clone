import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  InputBase,
  useMediaQuery,
  useTheme,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  AccountCircle,
  Logout,
  Settings,
  Bookmark,
  Favorite,
  Login,
  PersonAdd,
  DarkMode,
  LightMode
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import useAuthStore from '../../store/authStore';
import useThemeStore from '../../store/themeStore';
import ThemeToggle from '../common/ThemeToggle';

// Styled components for search
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Navbar = ({ onAuthModalOpen }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { toggleMode } = useThemeStore();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle navigation menu
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  // Handle user menu
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleMenu = () => {
    setAnchorElNav(null);
    setAnchorElUser(null);
  };

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };
  
  // Handle user logout
  const handleLogout = async () => {
    handleMenu();
    await logout();
    navigate('/');
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: theme => theme.zIndex.drawer + 1,
        boxShadow: 1,
        backdropFilter: 'blur(10px)',
        backgroundColor: alpha(theme.palette.background.default, 0.8)
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo for desktop */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'text.primary',
              textDecoration: 'none',
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            BookMyShow
          </Typography>

          {/* Mobile menu icon */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem component={RouterLink} to="/" onClick={handleMenu}>
                Home
              </MenuItem>
              <MenuItem component={RouterLink} to="/discover" onClick={handleMenu}>
                Movies
              </MenuItem>
              <MenuItem component={RouterLink} to="/events" onClick={handleMenu}>
                Events
              </MenuItem>
              {isAuthenticated && (
                <>
                  <MenuItem component={RouterLink} to="/favorites" onClick={handleMenu}>
                    Favorites
                  </MenuItem>
                  <MenuItem component={RouterLink} to="/watchlist" onClick={handleMenu}>
                    Watchlist
                  </MenuItem>
                  {user?.role === 'admin' && (
                    <MenuItem component={RouterLink} to="/admin" onClick={handleMenu}>
                      Admin Dashboard
                    </MenuItem>
                  )}
                  {user?.role === 'theater_owner' && (
                    <MenuItem component={RouterLink} to="/theater-owner" onClick={handleMenu}>
                      Theater Dashboard
                    </MenuItem>
                  )}
                </>
              )}
            </Menu>
          </Box>
          
          {/* Logo for mobile */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              color: 'text.primary',
              textDecoration: 'none',
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            BookMyShow
          </Typography>
          
          {/* Desktop navigation links */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              component={RouterLink}
              to="/"
              onClick={handleMenu}
              sx={{ my: 2, color: 'text.primary', display: 'block' }}
            >
              Home
            </Button>
            <Button
              component={RouterLink}
              to="/discover"
              onClick={handleMenu}
              sx={{ my: 2, color: 'text.primary', display: 'block' }}
            >
              Movies
            </Button>
            <Button
              component={RouterLink}
              to="/events"
              onClick={handleMenu}
              sx={{ my: 2, color: 'text.primary', display: 'block' }}
            >
              Events
            </Button>
            {isAuthenticated && (
              <>
                <Button
                  component={RouterLink}
                  to="/favorites"
                  onClick={handleMenu}
                  sx={{ my: 2, color: 'text.primary', display: 'block' }}
                >
                  Favorites
                </Button>
                <Button
                  component={RouterLink}
                  to="/watchlist"
                  onClick={handleMenu}
                  sx={{ my: 2, color: 'text.primary', display: 'block' }}
                >
                  Watchlist
                </Button>
              </>
            )}
          </Box>

          {/* Search bar */}
          <Box component="form" onSubmit={handleSearch} sx={{ flexGrow: { xs: 0, sm: 1 }, mr: 1 }}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Search>
          </Box>
          
          {/* Theme toggle */}
          <ThemeToggle />

          {/* Auth/User section */}
          <Box sx={{ flexGrow: 0, ml: 1 }}>
            {!isAuthenticated ? (
              <>
                <Button
                  variant="text"
                  startIcon={<Login />}
                  component={RouterLink}
                  to="/login"
                  sx={{ mr: 1, display: { xs: 'none', sm: 'inline-flex' } }}
                >
                  Log in
                </Button>
                <Button
                  variant="contained"
                  startIcon={<PersonAdd />}
                  component={RouterLink}
                  to="/register"
                  sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                >
                  Sign up
                </Button>
                <IconButton 
                  color="inherit" 
                  sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
                  component={RouterLink}
                  to="/login"
                >
                  <Login />
                </IconButton>
              </>
            ) : (
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  {user?.avatar ? (
                    <Avatar alt={user.firstName} src={user.avatar} />
                  ) : (
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      {user?.firstName?.charAt(0) || 'U'}
                    </Avatar>
                  )}
                </IconButton>
              </Tooltip>
            )}
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleMenu}
            >
              {isAuthenticated && (
                <Box>
                  <Box sx={{ px: 3, py: 1, textAlign: 'center' }}>
                    <Typography variant="subtitle1">
                      {user?.firstName} {user?.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem component={RouterLink} to="/profile" onClick={handleMenu}>
                    <Avatar
                      sx={{ width: 24, height: 24, mr: 1, bgcolor: theme.palette.primary.main }}
                    >
                      <AccountCircle fontSize="small" />
                    </Avatar>
                    Profile
                  </MenuItem>
                  <MenuItem component={RouterLink} to="/favorites" onClick={handleMenu}>
                    <Avatar
                      sx={{ width: 24, height: 24, mr: 1, bgcolor: theme.palette.primary.main }}
                    >
                      <Favorite fontSize="small" />
                    </Avatar>
                    Favorites
                  </MenuItem>
                  <MenuItem component={RouterLink} to="/watchlist" onClick={handleMenu}>
                    <Avatar
                      sx={{ width: 24, height: 24, mr: 1, bgcolor: theme.palette.primary.main }}
                    >
                      <Bookmark fontSize="small" />
                    </Avatar>
                    Watchlist
                  </MenuItem>
                  <MenuItem component={RouterLink} to="/settings" onClick={handleMenu}>
                    <Avatar
                      sx={{ width: 24, height: 24, mr: 1, bgcolor: theme.palette.primary.main }}
                    >
                      <Settings fontSize="small" />
                    </Avatar>
                    Settings
                  </MenuItem>
                  
                  {user?.role === 'admin' && (
                    <MenuItem component={RouterLink} to="/admin" onClick={handleMenu}>
                      <Avatar
                        sx={{ width: 24, height: 24, mr: 1, bgcolor: theme.palette.secondary.main }}
                      >
                        <Settings fontSize="small" />
                      </Avatar>
                      Admin Dashboard
                    </MenuItem>
                  )}
                  
                  {user?.role === 'theater_owner' && (
                    <MenuItem component={RouterLink} to="/theater-owner" onClick={handleMenu}>
                      <Avatar
                        sx={{ width: 24, height: 24, mr: 1, bgcolor: theme.palette.success.main }}
                      >
                        <Settings fontSize="small" />
                      </Avatar>
                      Theater Dashboard
                    </MenuItem>
                  )}
                  
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <Avatar
                      sx={{ width: 24, height: 24, mr: 1, bgcolor: theme.palette.error.main }}
                    >
                      <Logout fontSize="small" />
                    </Avatar>
                    Logout
                  </MenuItem>
                </Box>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
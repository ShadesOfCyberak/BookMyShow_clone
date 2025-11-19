import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  Email,
  Copyright,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const footerLinks = {
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Careers', path: '/careers' },
      { name: 'Press', path: '/press' },
      { name: 'Contact', path: '/contact' },
    ],
    discover: [
      { name: 'Browse Movies', path: '/discover' },
      { name: 'New Releases', path: '/new-releases' },
      { name: 'Top Rated', path: '/top-rated' },
      { name: 'Upcoming', path: '/upcoming' },
    ],
    help: [
      { name: 'FAQ', path: '/faq' },
      { name: 'Help Center', path: '/help' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Use', path: '/terms' },
    ],
  };

  const socialIcons = [
    { icon: <Facebook />, name: 'Facebook', url: 'https://facebook.com' },
    { icon: <Twitter />, name: 'Twitter', url: 'https://twitter.com' },
    { icon: <Instagram />, name: 'Instagram', url: 'https://instagram.com' },
    { icon: <YouTube />, name: 'YouTube', url: 'https://youtube.com' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'background.paper',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.05)',
        mt: 'auto', // Push footer to the bottom
        pt: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          {/* Brand and description */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 'bold',
                fontSize: '1.5rem',
                display: 'inline-block',
                mb: 2,
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              MovieFlix
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Discover and explore movies from around the world. Get personalized recommendations,
              create watchlists, and connect with other movie enthusiasts.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialIcons.map((social) => (
                <IconButton
                  key={social.name}
                  component="a"
                  href={social.url}
                  target="_blank"
                  rel="noopener"
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                  aria-label={social.name}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Footer links */}
          <Grid item xs={12} md={7}>
            <Grid container spacing={isMobile ? 2 : 4}>
              <Grid item xs={4}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Company
                </Typography>
                <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                  {footerLinks.company.map((link) => (
                    <Box component="li" key={link.name} sx={{ mb: 1 }}>
                      <Link
                        component={RouterLink}
                        to={link.path}
                        color="text.secondary"
                        underline="hover"
                        sx={{ fontSize: '0.875rem' }}
                      >
                        {link.name}
                      </Link>
                    </Box>
                  ))}
                </Box>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Discover
                </Typography>
                <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                  {footerLinks.discover.map((link) => (
                    <Box component="li" key={link.name} sx={{ mb: 1 }}>
                      <Link
                        component={RouterLink}
                        to={link.path}
                        color="text.secondary"
                        underline="hover"
                        sx={{ fontSize: '0.875rem' }}
                      >
                        {link.name}
                      </Link>
                    </Box>
                  ))}
                </Box>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Help
                </Typography>
                <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                  {footerLinks.help.map((link) => (
                    <Box component="li" key={link.name} sx={{ mb: 1 }}>
                      <Link
                        component={RouterLink}
                        to={link.path}
                        color="text.secondary"
                        underline="hover"
                        sx={{ fontSize: '0.875rem' }}
                      >
                        {link.name}
                      </Link>
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6, pb: 4 }}>
          <Divider sx={{ mb: 3 }} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'center', sm: 'flex-start' },
              gap: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
              <Copyright fontSize="small" sx={{ mr: 0.5 }} />
              {new Date().getFullYear()} MovieFlix. All rights reserved.
            </Typography>
            
            <Box
              sx={{
                display: 'flex',
                gap: { xs: 3, sm: 4 },
                flexWrap: 'wrap',
                justifyContent: { xs: 'center', sm: 'flex-end' },
              }}
            >
              <Link
                component={RouterLink}
                to="/privacy"
                color="text.secondary"
                underline="hover"
                variant="body2"
              >
                Privacy Policy
              </Link>
              <Link
                component={RouterLink}
                to="/terms"
                color="text.secondary"
                underline="hover"
                variant="body2"
              >
                Terms of Service
              </Link>
              <Link
                component={RouterLink}
                to="/cookies"
                color="text.secondary"
                underline="hover"
                variant="body2"
              >
                Cookie Policy
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
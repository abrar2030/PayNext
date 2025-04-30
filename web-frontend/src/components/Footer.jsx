import React from 'react';
import { Box, Container, Typography, Link, Grid, IconButton, useTheme, useMediaQuery } from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const footerLinks = [
    {
      title: 'Products',
      links: [
        { name: 'Personal Payments', url: '/products/personal' },
        { name: 'Business Solutions', url: '/products/business' },
        { name: 'Enterprise API', url: '/products/enterprise' },
        { name: 'Pricing', url: '/pricing' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', url: '/about' },
        { name: 'Careers', url: '/careers' },
        { name: 'Blog', url: '/blog' },
        { name: 'Press', url: '/press' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Help Center', url: '/help' },
        { name: 'Documentation', url: '/docs' },
        { name: 'API Reference', url: '/api' },
        { name: 'Status', url: '/status' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', url: '/privacy' },
        { name: 'Terms of Service', url: '/terms' },
        { name: 'Security', url: '/security' },
        { name: 'Compliance', url: '/compliance' }
      ]
    }
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, url: 'https://facebook.com' },
    { icon: <TwitterIcon />, url: 'https://twitter.com' },
    { icon: <InstagramIcon />, url: 'https://instagram.com' },
    { icon: <LinkedInIcon />, url: 'https://linkedin.com' },
    { icon: <GitHubIcon />, url: 'https://github.com' }
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and description */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                mb: 2
              }}
            >
              PayNext
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 300 }}>
              The next generation payment solution for individuals and businesses. Fast, secure, and designed for the modern world.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              {socialLinks.map((social, index) => (
                <IconButton
                  key={index}
                  component="a"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'rgba(25, 118, 210, 0.08)'
                    }
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Footer links */}
          {footerLinks.map((section, index) => (
            <Grid item xs={6} sm={3} md={2} key={index}>
              <Typography
                variant="subtitle1"
                color="text.primary"
                sx={{ fontWeight: 'bold', mb: 2 }}
              >
                {section.title}
              </Typography>
              <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                {section.links.map((link, linkIndex) => (
                  <Box component="li" key={linkIndex} sx={{ mb: 1 }}>
                    <Link
                      href={link.url}
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        textDecoration: 'none',
                        '&:hover': {
                          color: 'primary.main',
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      {link.name}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            mt: 6,
            pt: 3,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'flex-start' },
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ mb: { xs: 2, sm: 0 } }}>
            © {new Date().getFullYear()} PayNext. All rights reserved.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              gap: 2
            }}
          >
            <Link href="/privacy" variant="body2" color="text.secondary" sx={{ textDecoration: 'none' }}>
              Privacy Policy
            </Link>
            <Link href="/terms" variant="body2" color="text.secondary" sx={{ textDecoration: 'none' }}>
              Terms of Service
            </Link>
            <Link href="/cookies" variant="body2" color="text.secondary" sx={{ textDecoration: 'none' }}>
              Cookie Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

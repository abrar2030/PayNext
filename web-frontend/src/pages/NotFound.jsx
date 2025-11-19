import React from 'react';
import { Box, Container, Typography, Button, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

const NotFound = () => {
  const theme = useTheme();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.2,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 140px)', // Account for header and footer
        textAlign: 'center',
        py: 8,
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
      }}
    >
      <Container maxWidth="md">
        <Box
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: '6rem', md: '10rem' },
                fontWeight: 700,
                color: 'primary.main',
                lineHeight: 1,
                mb: 2
              }}
            >
              404
            </Typography>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 600,
                mb: 3
              }}
            >
              Page Not Found
            </Typography>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontSize: '1.1rem',
                maxWidth: 500,
                mx: 'auto',
                mb: 5
              }}
            >
              The page you're looking for doesn't exist or has been moved.
              Let's get you back on track.
            </Typography>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              href="/"
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: 8,
                fontSize: '1.1rem'
              }}
            >
              Back to Home
            </Button>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFound;

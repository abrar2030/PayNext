import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, Fade, Backdrop } from '@mui/material';

const PageLoader = ({ loading, children }) => {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 600); // Delay hiding the loader for a smoother transition
      return () => clearTimeout(timer);
    } else {
      setShowLoader(true);
    }
  }, [loading]);

  return (
    <>
      <Backdrop
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          flexDirection: 'column',
        }}
        open={showLoader}
      >
        <Fade in={showLoader} timeout={800}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CircularProgress color="primary" size={60} thickness={4} />
            <Typography variant="h6" sx={{ mt: 2, color: 'text.primary' }}>
              Loading...
            </Typography>
          </Box>
        </Fade>
      </Backdrop>
      <Fade in={!showLoader} timeout={800}>
        <Box sx={{ visibility: showLoader ? 'hidden' : 'visible' }}>
          {children}
        </Box>
      </Fade>
    </>
  );
};

export default PageLoader;

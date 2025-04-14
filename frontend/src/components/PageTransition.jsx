import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

// Page transition component that adds smooth animations between route changes
const PageTransition = ({ children }) => {
  const location = useLocation();

  return (
    <TransitionGroup component={null}>
      <CSSTransition
        key={location.key}
        timeout={300}
        classNames="page"
        unmountOnExit
      >
        <Box
          sx={{
            position: 'relative',
            '&.page-enter': {
              opacity: 0,
              transform: 'translateY(20px)',
            },
            '&.page-enter-active': {
              opacity: 1,
              transform: 'translateY(0)',
              transition: 'opacity 300ms, transform 300ms',
            },
            '&.page-exit': {
              opacity: 1,
              transform: 'translateY(0)',
            },
            '&.page-exit-active': {
              opacity: 0,
              transform: 'translateY(-20px)',
              transition: 'opacity 300ms, transform 300ms',
            },
          }}
        >
          {children}
        </Box>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default PageTransition;

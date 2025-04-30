import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  Container,
  useScrollTrigger,
  Slide,
  useMediaQuery,
  useTheme,
  Avatar,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  AccountCircle as AccountCircleIcon
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// Hide AppBar on scroll down
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [productsAnchorEl, setProductsAnchorEl] = useState(null);
  const [companyAnchorEl, setCompanyAnchorEl] = useState(null);
  
  useEffect(() => {
    // Check if user is authenticated
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(authStatus === 'true');
  }, [location]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setProductsAnchorEl(null);
    setCompanyAnchorEl(null);
  };

  const handleProductsMenuOpen = (event) => {
    setProductsAnchorEl(event.currentTarget);
  };

  const handleCompanyMenuOpen = (event) => {
    setCompanyAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    handleMenuClose();
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleMenuClose();
    setDrawerOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { 
      label: 'Products', 
      path: null, 
      hasSubmenu: true,
      submenuItems: [
        { label: 'Personal Payments', path: '/products/personal' },
        { label: 'Business Solutions', path: '/products/business' },
        { label: 'Enterprise API', path: '/products/enterprise' }
      ],
      handleClick: handleProductsMenuOpen
    },
    { label: 'Pricing', path: '/pricing', hasSubmenu: false },
    { 
      label: 'Company', 
      path: null, 
      hasSubmenu: true,
      submenuItems: [
        { label: 'About Us', path: '/about' },
        { label: 'Careers', path: '/careers' },
        { label: 'Blog', path: '/blog' }
      ],
      handleClick: handleCompanyMenuOpen
    },
    { label: 'Help', path: '/help', hasSubmenu: false }
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', py: 2 }}>
      <Typography variant="h6" sx={{ my: 2, fontWeight: 'bold', color: 'primary.main' }}>
        PayNext
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <React.Fragment key={item.label}>
            {item.hasSubmenu ? (
              <>
                <ListItem>
                  <ListItemText 
                    primary={item.label} 
                    primaryTypographyProps={{ 
                      fontWeight: 'medium',
                      color: 'text.primary'
                    }} 
                  />
                </ListItem>
                <List disablePadding>
                  {item.submenuItems.map((subItem) => (
                    <ListItem 
                      key={subItem.label} 
                      button 
                      onClick={() => handleNavigation(subItem.path)}
                      sx={{ pl: 4 }}
                    >
                      <ListItemText 
                        primary={subItem.label} 
                        primaryTypographyProps={{ 
                          fontSize: '0.9rem',
                          color: 'text.secondary'
                        }} 
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            ) : (
              <ListItem 
                button 
                onClick={() => handleNavigation(item.path)}
                selected={isActive(item.path)}
              >
                <ListItemText 
                  primary={item.label} 
                  primaryTypographyProps={{ 
                    fontWeight: isActive(item.path) ? 'bold' : 'medium',
                    color: isActive(item.path) ? 'primary.main' : 'text.primary'
                  }} 
                />
              </ListItem>
            )}
          </React.Fragment>
        ))}
        <Divider sx={{ my: 2 }} />
        {isAuthenticated ? (
          <>
            <ListItem button onClick={() => handleNavigation('/dashboard')}>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation('/profile')}>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button onClick={() => handleNavigation('/login')}>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation('/register')}>
              <ListItemText primary="Register" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <HideOnScroll>
        <AppBar 
          position="fixed" 
          color="default" 
          elevation={0}
          sx={{ 
            backgroundColor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Container maxWidth="lg">
            <Toolbar disableGutters sx={{ height: 70 }}>
              {/* Logo */}
              <Typography
                variant="h5"
                noWrap
                component={Link}
                to="/"
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontWeight: 700,
                  color: 'primary.main',
                  textDecoration: 'none',
                  letterSpacing: '.1rem',
                }}
              >
                PayNext
              </Typography>

              {/* Mobile menu icon */}
              <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                  size="large"
                  aria-label="menu"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleDrawerToggle}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
              </Box>

              {/* Mobile logo */}
              <Typography
                variant="h6"
                noWrap
                component={Link}
                to="/"
                sx={{
                  flexGrow: 1,
                  display: { xs: 'flex', md: 'none' },
                  fontWeight: 700,
                  color: 'primary.main',
                  textDecoration: 'none',
                  letterSpacing: '.1rem',
                }}
              >
                PayNext
              </Typography>

              {/* Desktop navigation */}
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
                {navItems.map((item) => (
                  <React.Fragment key={item.label}>
                    {item.hasSubmenu ? (
                      <>
                        <Button
                          onClick={item.handleClick}
                          sx={{ 
                            my: 2, 
                            mx: 1,
                            color: 'text.primary',
                            display: 'flex',
                            alignItems: 'center',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.04)'
                            }
                          }}
                          endIcon={<KeyboardArrowDownIcon />}
                        >
                          {item.label}
                        </Button>
                        <Menu
                          anchorEl={item.label === 'Products' ? productsAnchorEl : companyAnchorEl}
                          open={item.label === 'Products' ? Boolean(productsAnchorEl) : Boolean(companyAnchorEl)}
                          onClose={handleMenuClose}
                          sx={{ mt: 1 }}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                          }}
                          PaperProps={{
                            elevation: 2,
                            sx: {
                              borderRadius: 2,
                              minWidth: 180,
                              overflow: 'visible',
                              '&:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                left: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                              },
                            },
                          }}
                        >
                          {item.submenuItems.map((subItem) => (
                            <MenuItem 
                              key={subItem.label} 
                              onClick={() => handleNavigation(subItem.path)}
                              sx={{ 
                                py: 1.5,
                                '&:hover': {
                                  backgroundColor: 'rgba(25, 118, 210, 0.08)'
                                }
                              }}
                            >
                              {subItem.label}
                            </MenuItem>
                          ))}
                        </Menu>
                      </>
                    ) : (
                      <Button
                        onClick={() => handleNavigation(item.path)}
                        sx={{ 
                          my: 2, 
                          mx: 1,
                          color: isActive(item.path) ? 'primary.main' : 'text.primary',
                          fontWeight: isActive(item.path) ? 'bold' : 'medium',
                          borderBottom: isActive(item.path) ? '2px solid' : 'none',
                          borderColor: 'primary.main',
                          borderRadius: 0,
                          '&:hover': {
                            backgroundColor: 'transparent',
                            color: 'primary.main'
                          }
                        }}
                      >
                        {item.label}
                      </Button>
                    )}
                  </React.Fragment>
                ))}
              </Box>

              {/* Auth buttons or user menu */}
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                {isAuthenticated ? (
                  <>
                    <Button
                      variant="text"
                      color="primary"
                      onClick={() => handleNavigation('/dashboard')}
                      sx={{ mr: 1 }}
                    >
                      Dashboard
                    </Button>
                    <IconButton
                      edge="end"
                      aria-label="account of current user"
                      aria-haspopup="true"
                      onClick={handleProfileMenuOpen}
                      color="inherit"
                    >
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        <AccountCircleIcon />
                      </Avatar>
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      sx={{ mt: 1 }}
                      PaperProps={{
                        elevation: 2,
                        sx: {
                          borderRadius: 2,
                          minWidth: 180,
                        },
                      }}
                    >
                      <MenuItem onClick={() => handleNavigation('/profile')}>
                        Profile
                      </MenuItem>
                      <MenuItem onClick={() => handleNavigation('/settings')}>
                        Settings
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={handleLogout}>
                        Logout
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <>
                    <Button
                      variant="text"
                      color="primary"
                      onClick={() => handleNavigation('/login')}
                      sx={{ mr: 1 }}
                    >
                      Login
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleNavigation('/register')}
                    >
                      Register
                    </Button>
                  </>
                )}
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>
      
      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Toolbar placeholder to prevent content from hiding behind the AppBar */}
      <Toolbar />
    </>
  );
};

export default Navbar;

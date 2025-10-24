import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Box, 
  Grid,
  Link,
  InputAdornment,
  IconButton,
  Alert,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

import { authService } from '../services/api';

const Register = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const steps = ['Personal Information', 'Account Details', 'Confirmation'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!formData.firstName || !formData.lastName) {
        setError('Please fill in all required fields');
        return;
      }
    } else if (activeStep === 1) {
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all required fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }
    
    setError('');
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      setLoading(true);
      const userRegistrationData = {
        username: formData.email, // Assuming email is used as username
        password: formData.password,
        email: formData.email,
        // The backend User model only has username, password, email, role.
        // We are ignoring firstName, lastName, phoneNumber, address for now, 
        // as they are not in the backend model. This is a potential bug/enhancement
        // for the backend to handle UserProfile data, but for now we align with the API.
      };
      
      await authService.register(userRegistrationData);
      
      // On successful registration, redirect to login
      navigate('/login');
    } catch (err) {
      const errorMessage = err.response && err.response.data
        ? err.response.data
        : 'Registration failed. Please try again.';
      setError(errorMessage);
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              id="firstName"
              label="First Name"
              name="firstName"
              autoFocus
              value={formData.firstName}
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              margin="normal"
              fullWidth
              id="phoneNumber"
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              variant="outlined"
            />
          </>
        );
      case 1:
        return (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              margin="normal"
              fullWidth
              name="address"
              label="Address"
              id="address"
              value={formData.address}
              onChange={handleChange}
              variant="outlined"
              multiline
              rows={3}
            />
          </>
        );
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Review Your Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle1">First Name:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">{formData.firstName}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1">Last Name:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">{formData.lastName}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1">Email:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">{formData.email}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1">Phone Number:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">{formData.phoneNumber || 'Not provided'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1">Address:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">{formData.address || 'Not provided'}</Typography>
              </Grid>
            </Grid>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%', borderRadius: 2 }}>
          <Typography component="h1" variant="h5" align="center" sx={{ mb: 3, fontWeight: 'bold' }}>
            Create Your PayNext Account
          </Typography>
          
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" noValidate>
            {getStepContent(activeStep)}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button>
              
              {activeStep === steps.length - 1 ? (
	              <Button
	                variant="contained"
	                onClick={handleSubmit}
	                sx={{ backgroundColor: '#1976d2' }}
	                disabled={loading}
	              >
	                {loading ? <CircularProgress size={24} color="inherit" /> : 'Complete Registration'}
	              </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ backgroundColor: '#1976d2' }}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
          
          {activeStep === 0 && (
            <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;

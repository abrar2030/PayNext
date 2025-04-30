import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as AccountBalanceIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HelpCenter = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Search query:', searchQuery);
    // In a real implementation, this would search the knowledge base
  };

  const handleNext = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setLoading(false);
      if (activeStep === 2) {
        setSuccess(true);
      }
    }, 1000);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setSuccess(false);
  };

  const categories = [
    {
      title: "Account Management",
      icon: <PersonIcon fontSize="large" />,
      description: "Manage your account settings, security, and profile information.",
      articles: 24
    },
    {
      title: "Payments & Transfers",
      icon: <CreditCardIcon fontSize="large" />,
      description: "Learn about sending money, payment methods, and transaction limits.",
      articles: 36
    },
    {
      title: "Security & Privacy",
      icon: <AccountBalanceIcon fontSize="large" />,
      description: "Understand our security measures and how to keep your account safe.",
      articles: 18
    },
    {
      title: "Billing & Fees",
      icon: <ReceiptIcon fontSize="large" />,
      description: "Information about our pricing plans, fees, and billing cycles.",
      articles: 15
    }
  ];

  const popularArticles = [
    {
      title: "How to reset your password",
      category: "Account Management",
      views: 12543
    },
    {
      title: "Understanding transaction fees",
      category: "Billing & Fees",
      views: 9876
    },
    {
      title: "Setting up two-factor authentication",
      category: "Security & Privacy",
      views: 8765
    },
    {
      title: "Sending money internationally",
      category: "Payments & Transfers",
      views: 7654
    },
    {
      title: "Linking a bank account",
      category: "Account Management",
      views: 6543
    }
  ];

  const troubleshootingSteps = [
    {
      label: 'Identify the issue',
      description: `Select the type of problem you're experiencing with your account or transactions.`,
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Button 
              fullWidth 
              variant="outlined" 
              onClick={handleNext}
              sx={{ 
                p: 2, 
                justifyContent: 'flex-start', 
                textAlign: 'left',
                height: '100%'
              }}
            >
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Payment Issues
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Problems with sending or receiving payments
                </Typography>
              </Box>
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button 
              fullWidth 
              variant="outlined" 
              onClick={handleNext}
              sx={{ 
                p: 2, 
                justifyContent: 'flex-start', 
                textAlign: 'left',
                height: '100%'
              }}
            >
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Account Access
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Can't log in or access your account
                </Typography>
              </Box>
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button 
              fullWidth 
              variant="outlined" 
              onClick={handleNext}
              sx={{ 
                p: 2, 
                justifyContent: 'flex-start', 
                textAlign: 'left',
                height: '100%'
              }}
            >
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Technical Problems
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  App or website not working correctly
                </Typography>
              </Box>
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button 
              fullWidth 
              variant="outlined" 
              onClick={handleNext}
              sx={{ 
                p: 2, 
                justifyContent: 'flex-start', 
                textAlign: 'left',
                height: '100%'
              }}
            >
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Other Issues
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Any other problems not listed above
                </Typography>
              </Box>
            </Button>
          </Grid>
        </Grid>
      )
    },
    {
      label: 'Provide details',
      description: 'Tell us more about the specific issue you\'re experiencing.',
      content: (
        <Box component="form" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Describe your issue"
            multiline
            rows={4}
            placeholder="Please provide as much detail as possible about the problem you're experiencing..."
            sx={{ mb: 3 }}
          />
          <TextField
            fullWidth
            label="Transaction ID (if applicable)"
            placeholder="e.g. TX123456789"
            sx={{ mb: 3 }}
          />
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
              endIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </Box>
        </Box>
      )
    },
    {
      label: 'Review solutions',
      description: 'Based on your description, here are some potential solutions.',
      content: (
        <Box sx={{ mt: 2 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            We've analyzed your issue and found some potential solutions.
          </Alert>
          
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
            Recommended Solutions:
          </Typography>
          
          <List>
            <ListItem sx={{ pl: 0, pb: 2 }}>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Clear your browser cache and cookies" 
                secondary="This resolves many common technical issues with the website." 
              />
            </ListItem>
            <ListItem sx={{ pl: 0, pb: 2 }}>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Update to the latest app version" 
                secondary="Make sure you're using the most recent version of our mobile app." 
              />
            </ListItem>
            <ListItem sx={{ pl: 0, pb: 2 }}>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Check your internet connection" 
                secondary="Ensure you have a stable internet connection and try again." 
              />
            </ListItem>
          </List>
          
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 3, mb: 2 }}>
            Did this solve your problem?
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={loading}
              endIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Yes, it's resolved
            </Button>
            <Button
              variant="outlined"
              onClick={() => setActiveStep(3)}
            >
              No, I need more help
            </Button>
          </Box>
        </Box>
      )
    },
    {
      label: 'Contact support',
      description: 'If you still need help, our support team is ready to assist you.',
      content: (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Our support team is available 24/7 to help resolve your issue. Please choose your preferred contact method:
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <IconButton 
                    sx={{ 
                      backgroundColor: 'primary.light', 
                      color: 'white', 
                      mb: 2,
                      '&:hover': {
                        backgroundColor: 'primary.main',
                      }
                    }}
                  >
                    <EmailIcon fontSize="large" />
                  </IconButton>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Email Support
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Response within 24 hours
                  </Typography>
                  <Button 
                    variant="outlined" 
                    fullWidth
                    onClick={() => window.location.href = 'mailto:support@paynext.com'}
                  >
                    Email Us
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <IconButton 
                    sx={{ 
                      backgroundColor: 'primary.light', 
                      color: 'white', 
                      mb: 2,
                      '&:hover': {
                        backgroundColor: 'primary.main',
                      }
                    }}
                  >
                    <PhoneIcon fontSize="large" />
                  </IconButton>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Phone Support
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Available 24/7
                  </Typography>
                  <Button 
                    variant="outlined" 
                    fullWidth
                    onClick={() => window.location.href = 'tel:+18007296984'}
                  >
                    Call Us
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <IconButton 
                    sx={{ 
                      backgroundColor: 'primary.light', 
                      color: 'white', 
                      mb: 2,
                      '&:hover': {
                        backgroundColor: 'primary.main',
                      }
                    }}
                  >
                    <PersonIcon fontSize="large" />
                  </IconButton>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Live Chat
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Instant assistance
                  </Typography>
                  <Button 
                    variant="outlined" 
                    fullWidth
                    onClick={() => console.log('Open chat')}
                  >
                    Start Chat
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-start' }}>
            <Button
              onClick={handleReset}
              startIcon={<ArrowForwardIcon sx={{ transform: 'rotate(180deg)' }} />}
            >
              Start Over
            </Button>
          </Box>
        </Box>
      )
    }
  ];

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          pt: { xs: 8, md: 12 },
          pb: { xs: 10, md: 16 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
            <Typography 
              variant="h2" 
              component="h1" 
              sx={{ 
                fontWeight: 'bold',
                mb: 2,
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}
            >
              How Can We Help You?
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 5,
                opacity: 0.9,
                lineHeight: 1.5
              }}
            >
              Find answers to your questions and get the support you need
            </Typography>
            
            <Paper 
              component="form"
              onSubmit={handleSearchSubmit}
              elevation={3} 
              sx={{ 
                p: 0.5,
                display: 'flex',
                alignItems: 'center',
                borderRadius: 10,
                backgroundColor: 'white',
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              <InputAdornment position="start" sx={{ pl: 2 }}>
                <SearchIcon color="action" />
              </InputAdornment>
              <TextField
                fullWidth
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={handleSearchChange}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                }}
                sx={{ 
                  ml: 1,
                  flex: 1,
                  '& .MuiInputBase-input': {
                    py: 1.5
                  }
                }}
              />
              <Button 
                type="submit"
                variant="contained"
                sx={{ 
                  borderRadius: 8,
                  px: 3,
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
              >
                Search
              </Button>
            </Paper>
          </Box>
        </Container>
        
        {/* Decorative elements */}
        <Box 
          sx={{ 
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            zIndex: 0
          }} 
        />
        <Box 
          sx={{ 
            position: 'absolute',
            bottom: -150,
            left: -150,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            zIndex: 0
          }} 
        />
      </Box>

      {/* Categories Section */}
      <Container maxWidth="lg" sx={{ mt: -8, mb: 12, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4}>
          {categories.map((category, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                elevation={3}
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  overflow: 'hidden',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 8
                  }
                }}
              >
                <Box 
                  sx={{ 
                    p: 3,
                    backgroundColor: 'primary.light',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {category.icon}
                </Box>
                <CardContent sx={{ p: 3, flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {category.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {category.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      {category.articles} articles
                    </Typography>
                    <Button 
                      size="small" 
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => console.log(`Navigate to ${category.title}`)}
                    >
                      Browse
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Popular Articles Section */}
      <Box sx={{ backgroundColor: 'grey.50', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
              Popular Articles
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ 
                maxWidth: 700,
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Quick answers to our most frequently asked questions
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {popularArticles.map((article, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card 
                  elevation={1}
                  sx={{ 
                    display: 'flex',
                    borderRadius: 2,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>
                      {article.title}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        {article.category}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {article.views.toLocaleString()} views
                      </Typography>
                    </Box>
                  </CardContent>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      pr: 2,
                      color: 'primary.main'
                    }}
                  >
                    <ArrowForwardIcon />
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button 
              variant="outlined" 
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => console.log('View all articles')}
              sx={{ 
                py: 1.5, 
                px: 4,
                borderRadius: 8
              }}
            >
              View All Articles
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Troubleshooting Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={5}>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
              Interactive Troubleshooter
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
              Having an issue? Our step-by-step troubleshooter will help you identify and resolve common problems quickly.
            </Typography>
            
            {success ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 'medium', mb: 2 }}>
                  Problem Resolved!
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  We're glad we could help you resolve your issue.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleReset}
                >
                  Start New Troubleshooting
                </Button>
              </Box>
            ) : (
              <Stepper activeStep={activeStep} orientation="vertical">
                {troubleshootingSteps.map((step, index) => (
                  <Step key={index}>
                    <StepLabel>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                        {step.label}
                      </Typography>
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {step.description}
                      </Typography>
                      {step.content}
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            )}
          </Grid>
          <Grid item xs={12} md={7}>
            <Box 
              component="img"
              src="https://cdn.pixabay.com/photo/2017/07/31/11/21/people-2557396_1280.jpg"
              alt="Customer Support"
              sx={{ 
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 4,
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Contact Section */}
      <Box sx={{ backgroundColor: 'grey.50', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
              Still Need Help?
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ 
                maxWidth: 700,
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Our support team is available 24/7 to assist you
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <Card elevation={2} sx={{ height: '100%', borderRadius: 4, textAlign: 'center', p: 3 }}>
                <Box 
                  sx={{ 
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: 'primary.light',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3
                  }}
                >
                  <EmailIcon fontSize="large" />
                </Box>
                <Typography variant="h5" component="h3" sx={{ fontWeight: 'medium', mb: 2 }}>
                  Email Support
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Send us an email and we'll get back to you within 24 hours.
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 3 }}>
                  support@paynext.com
                </Typography>
                <Button 
                  variant="outlined" 
                  fullWidth
                  size="large"
                  onClick={() => window.location.href = 'mailto:support@paynext.com'}
                  sx={{ 
                    py: 1.5,
                    borderRadius: 8
                  }}
                >
                  Email Us
                </Button>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card elevation={2} sx={{ height: '100%', borderRadius: 4, textAlign: 'center', p: 3 }}>
                <Box 
                  sx={{ 
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: 'primary.light',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3
                  }}
                >
                  <PhoneIcon fontSize="large" />
                </Box>
                <Typography variant="h5" component="h3" sx={{ fontWeight: 'medium', mb: 2 }}>
                  Phone Support
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Call us directly for immediate assistance with your issues.
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 3 }}>
                  +1 (800) PAY-NEXT
                </Typography>
                <Button 
                  variant="outlined" 
                  fullWidth
                  size="large"
                  onClick={() => window.location.href = 'tel:+18007296984'}
                  sx={{ 
                    py: 1.5,
                    borderRadius: 8
                  }}
                >
                  Call Us
                </Button>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          py: { xs: 8, md: 10 },
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              fontWeight: 'bold',
              mb: 3 
            }}
          >
            Ready to Get Started?
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 5,
              opacity: 0.9,
              maxWidth: 700,
              mx: 'auto'
            }}
          >
            Join thousands of users who trust PayNext for their payment needs. Sign up today and experience the future of payments.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              onClick={() => navigate('/register')}
              sx={{ 
                py: 1.5, 
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 8
              }}
            >
              Create Account
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              onClick={() => navigate('/about')}
              sx={{ 
                py: 1.5, 
                px: 4,
                fontSize: '1.1rem',
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                },
                borderRadius: 8
              }}
            >
              Learn More
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HelpCenter;

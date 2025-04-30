import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormGroup,
  FormControlLabel,
  Tab,
  Tabs,
  useTheme,
  useMediaQuery,
  Collapse,
  IconButton
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AnimatedElement, StaggeredList } from '../components/AnimationComponents';

const PricingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedTab, setSelectedTab] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState(null);
  
  const handleBillingCycleChange = (event) => {
    setBillingCycle(event.target.checked ? 'annually' : 'monthly');
  };
  
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  
  const handleFaqToggle = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };
  
  const pricingPlans = {
    personal: [
      {
        title: 'Basic',
        price: billingCycle === 'monthly' ? 0 : 0,
        description: 'Perfect for individuals who need simple payment solutions',
        features: [
          { text: 'Send money to friends', included: true },
          { text: 'Receive payments', included: true },
          { text: 'Mobile app access', included: true },
          { text: 'Basic customer support', included: true },
          { text: 'Transaction limit: $1,000/month', included: true },
          { text: 'Priority support', included: false },
          { text: 'No foreign transaction fees', included: false },
          { text: 'Custom payment pages', included: false }
        ],
        buttonText: 'Get Started',
        buttonVariant: 'outlined',
        popular: false
      },
      {
        title: 'Premium',
        price: billingCycle === 'monthly' ? 9.99 : 99.99,
        description: 'For individuals who need advanced features and higher limits',
        features: [
          { text: 'Send money to friends', included: true },
          { text: 'Receive payments', included: true },
          { text: 'Mobile app access', included: true },
          { text: 'Priority customer support', included: true },
          { text: 'Transaction limit: $10,000/month', included: true },
          { text: 'No foreign transaction fees', included: true },
          { text: 'Custom payment pages', included: true },
          { text: 'Advanced security features', included: true }
        ],
        buttonText: 'Get Premium',
        buttonVariant: 'contained',
        popular: true
      },
      {
        title: 'Family',
        price: billingCycle === 'monthly' ? 19.99 : 199.99,
        description: 'Share benefits with up to 5 family members with linked accounts',
        features: [
          { text: 'All Premium features', included: true },
          { text: 'Up to 5 linked family accounts', included: true },
          { text: 'Shared payment history', included: true },
          { text: 'Family spending controls', included: true },
          { text: 'Transaction limit: $25,000/month', included: true },
          { text: 'Dedicated account manager', included: true },
          { text: 'Purchase protection', included: true },
          { text: 'Emergency assistance', included: true }
        ],
        buttonText: 'Choose Family',
        buttonVariant: 'outlined',
        popular: false
      }
    ],
    business: [
      {
        title: 'Startup',
        price: billingCycle === 'monthly' ? 29.99 : 299.99,
        description: 'Essential tools for small businesses and startups',
        features: [
          { text: 'Accept online payments', included: true },
          { text: 'Payment gateway integration', included: true },
          { text: 'Basic analytics dashboard', included: true },
          { text: 'Transaction limit: $50,000/month', included: true },
          { text: 'Up to 3 team members', included: true },
          { text: 'API access', included: false },
          { text: 'Custom branding', included: false },
          { text: 'Dedicated account manager', included: false }
        ],
        buttonText: 'Start Free Trial',
        buttonVariant: 'outlined',
        popular: false
      },
      {
        title: 'Business',
        price: billingCycle === 'monthly' ? 99.99 : 999.99,
        description: 'Comprehensive solution for growing businesses',
        features: [
          { text: 'Accept online payments', included: true },
          { text: 'Payment gateway integration', included: true },
          { text: 'Advanced analytics dashboard', included: true },
          { text: 'Transaction limit: $250,000/month', included: true },
          { text: 'Up to 10 team members', included: true },
          { text: 'API access', included: true },
          { text: 'Custom branding', included: true },
          { text: 'Dedicated account manager', included: true }
        ],
        buttonText: 'Choose Business',
        buttonVariant: 'contained',
        popular: true
      },
      {
        title: 'Enterprise',
        price: 'Custom',
        description: 'Tailored solutions for large organizations with custom needs',
        features: [
          { text: 'All Business features', included: true },
          { text: 'Unlimited transaction volume', included: true },
          { text: 'Unlimited team members', included: true },
          { text: 'Custom integration support', included: true },
          { text: 'Enterprise-grade security', included: true },
          { text: 'SLA guarantees', included: true },
          { text: 'Dedicated development support', included: true },
          { text: 'On-site training', included: true }
        ],
        buttonText: 'Contact Sales',
        buttonVariant: 'outlined',
        popular: false
      }
    ]
  };
  
  const comparisonFeatures = [
    {
      category: 'Core Features',
      features: [
        { name: 'Send Money', basic: true, premium: true, business: true },
        { name: 'Receive Payments', basic: true, premium: true, business: true },
        { name: 'Mobile App Access', basic: true, premium: true, business: true },
        { name: 'Web Dashboard', basic: true, premium: true, business: true }
      ]
    },
    {
      category: 'Transaction Limits',
      features: [
        { name: 'Monthly Transaction Limit', basic: '$1,000', premium: '$10,000', business: '$250,000' },
        { name: 'Per-Transaction Limit', basic: '$500', premium: '$2,500', business: '$25,000' },
        { name: 'International Transfers', basic: false, premium: true, business: true }
      ]
    },
    {
      category: 'Support',
      features: [
        { name: 'Email Support', basic: true, premium: true, business: true },
        { name: 'Priority Support', basic: false, premium: true, business: true },
        { name: 'Phone Support', basic: false, premium: true, business: true },
        { name: 'Dedicated Account Manager', basic: false, premium: false, business: true }
      ]
    },
    {
      category: 'Advanced Features',
      features: [
        { name: 'Custom Branding', basic: false, premium: true, business: true },
        { name: 'API Access', basic: false, premium: false, business: true },
        { name: 'Analytics Dashboard', basic: false, premium: true, business: true },
        { name: 'Multi-User Access', basic: false, premium: false, business: true }
      ]
    }
  ];
  
  const faqs = [
    {
      question: 'What payment methods are accepted?',
      answer: 'PayNext accepts all major credit and debit cards including Visa, Mastercard, American Express, and Discover. We also support bank transfers, PayPal, and various digital wallets depending on your region.'
    },
    {
      question: 'How secure are my transactions?',
      answer: 'All transactions are protected with bank-level encryption and security. We use advanced fraud detection systems and comply with PCI DSS standards to ensure your financial information remains secure at all times.'
    },
    {
      question: 'Can I upgrade or downgrade my plan later?',
      answer: "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll get immediate access to new features and your billing will be prorated for the remainder of your billing cycle. When downgrading, changes will take effect at the start of your next billing cycle."
    },
    {
      question: 'Is there a free trial available?',
      answer: 'Yes, we offer a 14-day free trial for our Premium and Business plans. No credit card is required to start your trial, and you can cancel at any time before the trial period ends without being charged.'
    },
    {
      question: 'What happens if I exceed my transaction limit?',
      answer: "If you approach your transaction limit, you'll receive notifications. If you exceed your limit, additional transactions may be temporarily paused until the next billing cycle, or you may be charged additional fees depending on your plan. We recommend upgrading your plan if you regularly approach your limits."
    },
    {
      question: 'How do I cancel my subscription?',
      answer: "You can cancel your subscription at any time from your account settings. If you cancel, you'll continue to have access to your paid features until the end of your current billing cycle. We don't offer refunds for partial billing periods."
    }
  ];
  
  const formatPrice = (price) => {
    if (price === 'Custom') return 'Custom';
    
    return (
      <>
        <Typography component="span" variant="h3" sx={{ fontWeight: 'bold' }}>
          ${typeof price === 'number' ? price.toFixed(2) : price}
        </Typography>
        {typeof price === 'number' && (
          <Typography component="span" variant="h6" color="text.secondary">
            /{billingCycle === 'monthly' ? 'mo' : 'yr'}
          </Typography>
        )}
      </>
    );
  };
  
  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          pt: { xs: 10, md: 12 },
          pb: { xs: 12, md: 16 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <AnimatedElement>
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
                Simple, Transparent Pricing
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 5,
                  opacity: 0.9,
                  lineHeight: 1.5
                }}
              >
                Choose the perfect plan for your payment needs
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <Tabs 
                  value={selectedTab} 
                  onChange={handleTabChange}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 8,
                    '& .MuiTabs-indicator': {
                      display: 'none',
                    },
                    '& .MuiTab-root': {
                      color: 'white',
                      opacity: 0.7,
                      '&.Mui-selected': {
                        color: 'white',
                        opacity: 1,
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: 8,
                      },
                    },
                  }}
                >
                  <Tab label="Personal" sx={{ py: 1.5, px: 3, borderRadius: 8 }} />
                  <Tab label="Business" sx={{ py: 1.5, px: 3, borderRadius: 8 }} />
                </Tabs>
              </Box>
              
              <FormGroup sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                <Typography variant="body1" sx={{ mr: 1 }}>Monthly</Typography>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={billingCycle === 'annually'} 
                      onChange={handleBillingCycleChange}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: 'white',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        },
                      }}
                    />
                  }
                  label=""
                />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ mr: 1 }}>Annually</Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      bgcolor: 'secondary.main',
                      color: 'white',
                      px: 1,
                      py: 0.5,
                      borderRadius: 5,
                      fontWeight: 'bold',
                    }}
                  >
                    Save 20%
                  </Typography>
                </Box>
              </FormGroup>
            </Box>
          </AnimatedElement>
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

      {/* Pricing Cards Section */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          mt: -8, 
          mb: 10, 
          position: 'relative', 
          zIndex: 1 
        }}
      >
        <Grid container spacing={4} justifyContent="center">
          {pricingPlans[selectedTab === 0 ? 'personal' : 'business'].map((plan, index) => (
            <Grid 
              item 
              xs={12} 
              md={4} 
              key={index}
              sx={{
                display: 'flex',
              }}
            >
              <AnimatedElement 
                animation="fadeInUp" 
                delay={0.1 * index}
                style={{ width: '100%', height: '100%', display: 'flex' }}
              >
                <Card 
                  elevation={plan.popular ? 8 : 2} 
                  sx={{ 
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 4,
                    position: 'relative',
                    overflow: 'visible',
                    border: plan.popular ? `2px solid ${theme.palette.primary.main}` : 'none',
                    transform: plan.popular ? 'scale(1.05)' : 'none',
                    zIndex: plan.popular ? 2 : 1,
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: plan.popular ? 'scale(1.08)' : 'scale(1.03)',
                      boxShadow: plan.popular ? 12 : 6
                    }
                  }}
                >
                  {plan.popular && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -12,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bgcolor: 'secondary.main',
                        color: 'white',
                        py: 0.5,
                        px: 2,
                        borderRadius: 5,
                        fontWeight: 'bold',
                        fontSize: '0.875rem',
                        zIndex: 1,
                      }}
                    >
                      Most Popular
                    </Box>
                  )}
                  
                  <CardHeader
                    title={plan.title}
                    titleTypographyProps={{ 
                      variant: 'h5', 
                      component: 'h2',
                      align: 'center',
                      fontWeight: 'bold'
                    }}
                    sx={{ 
                      bgcolor: plan.popular ? 'primary.main' : 'transparent',
                      color: plan.popular ? 'white' : 'inherit',
                      pb: 0
                    }}
                  />
                  
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      {formatPrice(plan.price)}
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {plan.description}
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <List sx={{ flexGrow: 1 }}>
                      {plan.features.map((feature, featureIndex) => (
                        <ListItem key={featureIndex} sx={{ px: 0, py: 1 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            {feature.included ? (
                              <CheckIcon color="success" />
                            ) : (
                              <CloseIcon color="disabled" />
                            )}
                          </ListItemIcon>
                          <ListItemText 
                            primary={feature.text} 
                            primaryTypographyProps={{
                              variant: 'body2',
                              color: feature.included ? 'text.primary' : 'text.secondary'
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                    
                    <Box sx={{ mt: 3 }}>
                      <Button
                        fullWidth
                        variant={plan.buttonVariant}
                        color={plan.popular ? 'secondary' : 'primary'}
                        size="large"
                        sx={{ 
                          py: 1.5,
                          borderRadius: 8
                        }}
                      >
                        {plan.buttonText}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </AnimatedElement>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Feature Comparison Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 10 }}>
        <Container maxWidth="lg">
          <AnimatedElement>
            <Typography variant="h3" component="h2" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 6 }}>
              Feature Comparison
            </Typography>
          </AnimatedElement>
          
          <AnimatedElement animation="fadeInUp">
            <Paper elevation={2} sx={{ borderRadius: 4, overflow: 'hidden' }}>
              <Box sx={{ overflowX: 'auto' }}>
                <Box sx={{ minWidth: 650, p: 3 }}>
                  <Grid container>
                    {/* Header row */}
                    <Grid item xs={4}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', p: 2 }}>
                        Features
                      </Typography>
                    </Grid>
                    <Grid item xs={2.67}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', p: 2, textAlign: 'center' }}>
                        Basic
                      </Typography>
                    </Grid>
                    <Grid item xs={2.67}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', p: 2, textAlign: 'center', color: 'primary.main' }}>
                        Premium
                      </Typography>
                    </Grid>
                    <Grid item xs={2.67}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', p: 2, textAlign: 'center' }}>
                        Business
                      </Typography>
                    </Grid>
                    
                    {/* Feature categories and rows */}
                    {comparisonFeatures.map((category, categoryIndex) => (
                      <React.Fragment key={categoryIndex}>
                        <Grid item xs={12}>
                          <Box sx={{ bgcolor: 'grey.100', p: 1, pl: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                              {category.category}
                            </Typography>
                          </Box>
                        </Grid>
                        
                        {category.features.map((feature, featureIndex) => (
                          <React.Fragment key={featureIndex}>
                            <Grid item xs={4}>
                              <Typography variant="body2" sx={{ p: 2 }}>
                                {feature.name}
                              </Typography>
                            </Grid>
                            <Grid item xs={2.67}>
                              <Box sx={{ p: 2, textAlign: 'center' }}>
                                {typeof feature.basic === 'boolean' ? (
                                  feature.basic ? (
                                    <CheckIcon color="success" />
                                  ) : (
                                    <CloseIcon color="disabled" />
                                  )
                                ) : (
                                  <Typography variant="body2">{feature.basic}</Typography>
                                )}
                              </Box>
                            </Grid>
                            <Grid item xs={2.67}>
                              <Box sx={{ p: 2, textAlign: 'center' }}>
                                {typeof feature.premium === 'boolean' ? (
                                  feature.premium ? (
                                    <CheckIcon color="success" />
                                  ) : (
                                    <CloseIcon color="disabled" />
                                  )
                                ) : (
                                  <Typography variant="body2">{feature.premium}</Typography>
                                )}
                              </Box>
                            </Grid>
                            <Grid item xs={2.67}>
                              <Box sx={{ p: 2, textAlign: 'center' }}>
                                {typeof feature.business === 'boolean' ? (
                                  feature.business ? (
                                    <CheckIcon color="success" />
                                  ) : (
                                    <CloseIcon color="disabled" />
                                  )
                                ) : (
                                  <Typography variant="body2">{feature.business}</Typography>
                                )}
                              </Box>
                            </Grid>
                          </React.Fragment>
                        ))}
                      </React.Fragment>
                    ))}
                  </Grid>
                </Box>
              </Box>
            </Paper>
          </AnimatedElement>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Container maxWidth="md" sx={{ py: 10 }}>
        <AnimatedElement>
          <Typography variant="h3" component="h2" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 2 }}>
            Frequently Asked Questions
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mb: 6, maxWidth: 700, mx: 'auto' }}>
            Find answers to common questions about our pricing and plans
          </Typography>
        </AnimatedElement>
        
        <AnimatedElement animation="fadeInUp">
          <Paper elevation={2} sx={{ borderRadius: 4 }}>
            {faqs.map((faq, index) => (
              <Box key={index}>
                {index > 0 && <Divider />}
                <Box sx={{ p: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      py: 1,
                    }}
                    onClick={() => handleFaqToggle(index)}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                      {faq.question}
                    </Typography>
                    <IconButton size="small">
                      {expandedFaq === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>
                  <Collapse in={expandedFaq === index}>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, pb: 1 }}>
                      {faq.answer}
                    </Typography>
                  </Collapse>
                </Box>
              </Box>
            ))}
          </Paper>
        </AnimatedElement>
      </Container>

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
          <AnimatedElement>
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
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/contact')}
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
                Contact Sales
              </Button>
            </Box>
          </AnimatedElement>
        </Container>
      </Box>
    </Box>
  );
};

export default PricingPage;

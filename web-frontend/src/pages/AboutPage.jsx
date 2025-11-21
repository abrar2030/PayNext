import React, { useState } from "react";
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  useTheme,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Security as SecurityIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as AccountBalanceIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationOnIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm({
      ...contactForm,
      [name]: value,
    });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log("Contact form submitted:", contactForm);
    setFormSubmitted(true);
    // Reset form after submission
    setContactForm({
      name: "",
      email: "",
      message: "",
    });
  };

  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "CEO & Founder",
      bio: "Alex has over 15 years of experience in fintech and previously founded two successful payment startups.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Sarah Williams",
      role: "CTO",
      bio: "With a background in cybersecurity, Sarah ensures our platform remains at the cutting edge of secure payment technology.",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "David Chen",
      role: "Head of Product",
      bio: "David's passion for user experience drives our product development, creating intuitive solutions for complex financial needs.",
      image: "https://randomuser.me/api/portraits/men/68.jpg",
    },
    {
      name: "Maria Rodriguez",
      role: "Chief Financial Officer",
      bio: "Maria brings 12 years of financial expertise from leading global banking institutions to PayNext.",
      image: "https://randomuser.me/api/portraits/women/28.jpg",
    },
  ];

  const faqs = [
    {
      question: "How secure is PayNext?",
      answer:
        "PayNext employs bank-level security with 256-bit encryption, two-factor authentication, and continuous security monitoring. All transactions are protected by our advanced fraud detection system, and we're compliant with PCI DSS standards.",
    },
    {
      question: "What are the fees for using PayNext?",
      answer:
        "PayNext offers transparent pricing with no hidden fees. Standard transfers between PayNext accounts are free. External transfers to bank accounts have a 1% fee (capped at $10). International transfers have a competitive 2% fee, significantly lower than traditional banks.",
    },
    {
      question: "How quickly are transactions processed?",
      answer:
        "Transactions between PayNext accounts are instant. Transfers to external bank accounts typically complete within 1-2 business days, depending on your bank. International transfers usually take 2-3 business days.",
    },
    {
      question: "Is PayNext available internationally?",
      answer:
        "Yes, PayNext is available in over 30 countries worldwide. We support multiple currencies and provide competitive exchange rates for international transfers.",
    },
    {
      question: "How do I contact customer support?",
      answer:
        "Our customer support team is available 24/7 through in-app chat, email at support@paynext.com, or by phone at +1-800-PAY-NEXT. We typically respond to all inquiries within 2 hours.",
    },
  ];

  return (
    <Box sx={{ overflow: "hidden" }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
          color: "white",
          pt: { xs: 8, md: 12 },
          pb: { xs: 10, md: 16 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                }}
              >
                About PayNext
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  lineHeight: 1.5,
                }}
              >
                We're on a mission to revolutionize the way people and
                businesses handle payments in the digital age.
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{ display: { xs: "none", md: "block" } }}
            >
              <Box
                component="img"
                src="https://cdn.pixabay.com/photo/2015/01/09/11/08/startup-594090_1280.jpg"
                alt="PayNext Team"
                sx={{
                  width: "100%",
                  maxWidth: 600,
                  borderRadius: 4,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                }}
              />
            </Grid>
          </Grid>
        </Container>

        {/* Decorative elements */}
        <Box
          sx={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -150,
            left: -150,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            zIndex: 0,
          }}
        />
      </Box>

      {/* Our Story Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h3"
              component="h2"
              sx={{ fontWeight: "bold", mb: 3 }}
            >
              Our Story
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              Founded in 2020, PayNext began with a simple idea: payments should
              be easy, fast, and secure for everyone. Our founders, frustrated
              with the complexity and high fees of traditional payment systems,
              set out to create a solution that would democratize financial
              transactions.
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              What started as a small team of passionate innovators has grown
              into a global company serving millions of users across 30+
              countries. We've built a platform that processes billions in
              transactions annually while maintaining our core values of
              transparency, security, and user-centered design.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              Today, PayNext is at the forefront of financial technology,
              continuously evolving to meet the changing needs of individuals
              and businesses in an increasingly digital world.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://cdn.pixabay.com/photo/2017/07/25/22/54/office-2539844_1280.jpg"
              alt="PayNext Office"
              sx={{
                width: "100%",
                borderRadius: 4,
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Our Values Section */}
      <Box sx={{ backgroundColor: "grey.50", py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{ fontWeight: "bold", mb: 3 }}
            >
              Our Values
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                maxWidth: 700,
                mx: "auto",
                lineHeight: 1.6,
              }}
            >
              These core principles guide everything we do at PayNext
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card
                elevation={2}
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  p: 4,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    backgroundColor: "primary.light",
                    color: "white",
                    mb: 3,
                  }}
                >
                  <SecurityIcon fontSize="large" />
                </Box>
                <Typography
                  variant="h5"
                  component="h3"
                  sx={{ mb: 2, fontWeight: "medium" }}
                >
                  Security First
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ lineHeight: 1.7 }}
                >
                  We prioritize the security of our users' data and funds above
                  all else. Our platform employs the latest encryption and
                  security measures to ensure every transaction is protected.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                elevation={2}
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  p: 4,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    backgroundColor: "secondary.light",
                    color: "white",
                    mb: 3,
                  }}
                >
                  <CreditCardIcon fontSize="large" />
                </Box>
                <Typography
                  variant="h5"
                  component="h3"
                  sx={{ mb: 2, fontWeight: "medium" }}
                >
                  Transparency
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ lineHeight: 1.7 }}
                >
                  We believe in clear, upfront pricing with no hidden fees. Our
                  users always know exactly what they're paying for, and we're
                  committed to maintaining this transparency in all our
                  operations.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                elevation={2}
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  p: 4,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    backgroundColor: "success.light",
                    color: "white",
                    mb: 3,
                  }}
                >
                  <AccountBalanceIcon fontSize="large" />
                </Box>
                <Typography
                  variant="h5"
                  component="h3"
                  sx={{ mb: 2, fontWeight: "medium" }}
                >
                  Innovation
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ lineHeight: 1.7 }}
                >
                  We continuously push the boundaries of what's possible in
                  financial technology. By staying at the forefront of
                  innovation, we deliver cutting-edge solutions that make
                  financial transactions simpler and more efficient.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Team Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{ fontWeight: "bold", mb: 3 }}
          >
            Meet Our Team
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              maxWidth: 700,
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            The passionate people behind PayNext
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                elevation={2}
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  overflow: "hidden",
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="240"
                  image={member.image}
                  alt={member.name}
                />
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{ fontWeight: "bold" }}
                  >
                    {member.name}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="primary"
                    sx={{ mb: 2 }}
                  >
                    {member.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.bio}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* FAQ Section */}
      <Box sx={{ backgroundColor: "grey.50", py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{ fontWeight: "bold", mb: 3 }}
            >
              Frequently Asked Questions
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                maxWidth: 700,
                mx: "auto",
                lineHeight: 1.6,
              }}
            >
              Find answers to common questions about PayNext
            </Typography>
          </Box>

          <Box sx={{ maxWidth: 800, mx: "auto" }}>
            {faqs.map((faq, index) => (
              <Accordion
                key={index}
                elevation={1}
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  overflow: "hidden",
                  "&:before": {
                    display: "none",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    backgroundColor: "rgba(25, 118, 210, 0.04)",
                    "&:hover": {
                      backgroundColor: "rgba(25, 118, 210, 0.08)",
                    },
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 3 }}>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ lineHeight: 1.7 }}
                  >
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Contact Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={5}>
            <Typography
              variant="h3"
              component="h2"
              sx={{ fontWeight: "bold", mb: 3 }}
            >
              Get In Touch
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, lineHeight: 1.7 }}
            >
              Have questions or feedback? We'd love to hear from you. Our team
              is ready to assist with any inquiries you may have.
            </Typography>

            <List>
              <ListItem sx={{ px: 0, py: 1.5 }}>
                <ListItemIcon>
                  <LocationOnIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Address"
                  secondary="123 Payment Street, Financial District, New York, NY 10004"
                  primaryTypographyProps={{ fontWeight: "medium" }}
                  secondaryTypographyProps={{ lineHeight: 1.6 }}
                />
              </ListItem>
              <ListItem sx={{ px: 0, py: 1.5 }}>
                <ListItemIcon>
                  <EmailIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Email"
                  secondary="info@paynext.com"
                  primaryTypographyProps={{ fontWeight: "medium" }}
                />
              </ListItem>
              <ListItem sx={{ px: 0, py: 1.5 }}>
                <ListItemIcon>
                  <PhoneIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Phone"
                  secondary="+1 (800) PAY-NEXT"
                  primaryTypographyProps={{ fontWeight: "medium" }}
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={7}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
              {formSubmitted ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <CheckCircleIcon
                    color="success"
                    sx={{ fontSize: 60, mb: 2 }}
                  />
                  <Typography variant="h5" sx={{ fontWeight: "medium", mb: 2 }}>
                    Message Sent!
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Thank you for contacting us. We'll get back to you as soon
                    as possible.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3 }}
                    onClick={() => setFormSubmitted(false)}
                  >
                    Send Another Message
                  </Button>
                </Box>
              ) : (
                <Box component="form" onSubmit={handleContactSubmit}>
                  <Typography variant="h5" sx={{ fontWeight: "medium", mb: 3 }}>
                    Send Us a Message
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="Your Name"
                        name="name"
                        value={contactForm.name}
                        onChange={handleContactChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={contactForm.email}
                        onChange={handleContactChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="Message"
                        name="message"
                        multiline
                        rows={4}
                        value={contactForm.message}
                        onChange={handleContactChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        startIcon={<SendIcon />}
                        sx={{ py: 1.5 }}
                      >
                        Send Message
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutPage;

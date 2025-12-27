import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  CardActionArea,
  InputAdornment,
  Alert,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  Help as HelpIcon,
  Payment as PaymentIcon,
  Security as SecurityIcon,
  AccountCircle as AccountIcon,
} from "@mui/icons-material";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const categories = [
    {
      title: "Getting Started",
      icon: <HelpIcon fontSize="large" />,
      color: "#1976d2",
      faqs: [
        {
          question: "How do I create an account?",
          answer:
            "Click the 'Register' button in the top right corner, fill in your email and password, and verify your email address. You'll be ready to start sending money in minutes!",
        },
        {
          question: "What documents do I need to verify my account?",
          answer:
            "For basic accounts, you only need a valid email address. For higher transaction limits, you may need to provide a government-issued ID and proof of address.",
        },
        {
          question: "Is PayNext available in my country?",
          answer:
            "PayNext is available in over 150 countries worldwide. Check our supported countries list during registration to confirm availability in your region.",
        },
      ],
    },
    {
      title: "Payments",
      icon: <PaymentIcon fontSize="large" />,
      color: "#2e7d32",
      faqs: [
        {
          question: "How do I send money?",
          answer:
            "Log in to your account, click 'Send Money', enter the recipient's email or phone number, specify the amount, and confirm the transaction.",
        },
        {
          question: "What are the transaction fees?",
          answer:
            "Personal accounts: Free for up to $500/month. Business accounts: 1.5% per transaction. Enterprise: Custom pricing. No hidden fees!",
        },
        {
          question: "How long do transactions take?",
          answer:
            "Standard transactions: 1-3 business days. Fast processing: Same day. Instant transfers: Available for Business and Enterprise accounts.",
        },
        {
          question: "Can I cancel a transaction?",
          answer:
            "Transactions can be cancelled within 30 minutes of initiation if they haven't been processed yet. Contact support immediately if you need assistance.",
        },
      ],
    },
    {
      title: "Security",
      icon: <SecurityIcon fontSize="large" />,
      color: "#ed6c02",
      faqs: [
        {
          question: "How secure is PayNext?",
          answer:
            "We use bank-level 256-bit SSL encryption, two-factor authentication, and comply with PCI DSS standards. Your data is protected with multiple security layers.",
        },
        {
          question: "What is two-factor authentication?",
          answer:
            "2FA adds an extra layer of security by requiring a code from your phone in addition to your password. We highly recommend enabling it in your account settings.",
        },
        {
          question: "What should I do if I suspect fraud?",
          answer:
            "Immediately contact our support team at support@paynext.com or call our 24/7 fraud hotline. We'll investigate and take appropriate action to protect your account.",
        },
      ],
    },
    {
      title: "Account Management",
      icon: <AccountIcon fontSize="large" />,
      color: "#9c27b0",
      faqs: [
        {
          question: "How do I update my profile information?",
          answer:
            "Go to Settings > Profile, make your changes, and click Save. Some changes may require re-verification for security purposes.",
        },
        {
          question: "How can I add a payment method?",
          answer:
            "Navigate to Dashboard > Payment Methods > Add New. You can link bank accounts, credit cards, or debit cards. All payment methods are securely encrypted.",
        },
        {
          question: "How do I close my account?",
          answer:
            "Go to Settings > Account > Close Account. Ensure all pending transactions are completed and withdraw any remaining balance before closing.",
        },
      ],
    },
  ];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleContactFormChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitSuccess(true);
    setContactForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  const filteredCategories = categories
    .map((category) => ({
      ...category,
      faqs: category.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.faqs.length > 0 || !searchQuery);

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{ fontWeight: "bold", mb: 2 }}
        >
          How can we help you?
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 700, mx: "auto" }}
        >
          Search our knowledge base or browse by category
        </Typography>
        <TextField
          fullWidth
          placeholder="Search for help articles..."
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 600, mx: "auto" }}
        />
      </Box>

      {!selectedCategory ? (
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {filteredCategories.map((category, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                elevation={2}
                sx={{
                  height: "100%",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 4,
                  },
                }}
              >
                <CardActionArea
                  onClick={() => setSelectedCategory(category)}
                  sx={{ height: "100%", p: 3 }}
                >
                  <CardContent sx={{ textAlign: "center" }}>
                    <Box
                      sx={{
                        color: category.color,
                        mb: 2,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {category.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                      {category.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.faqs.length} articles
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ mb: 8 }}>
          <Button
            onClick={() => setSelectedCategory(null)}
            sx={{ mb: 3 }}
            variant="outlined"
          >
            ← Back to Categories
          </Button>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
            {selectedCategory.title}
          </Typography>
          {selectedCategory.faqs.map((faq, index) => (
            <Accordion key={index} elevation={1} sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" color="text.secondary">
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}

      {searchQuery &&
        filteredCategories.every((cat) => cat.faqs.length === 0) && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              No results found for "{searchQuery}"
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try different keywords or contact our support team for assistance.
            </Typography>
          </Box>
        )}

      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
          Still need help? Contact us
        </Typography>
        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Thank you for contacting us! We'll get back to you within 24 hours.
          </Alert>
        )}
        <form onSubmit={handleContactSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={contactForm.name}
                onChange={handleContactFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={contactForm.email}
                onChange={handleContactFormChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subject"
                name="subject"
                value={contactForm.subject}
                onChange={handleContactFormChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Message"
                name="message"
                multiline
                rows={6}
                value={contactForm.message}
                onChange={handleContactFormChange}
                placeholder="Please provide as much detail as possible about the problem you're experiencing..."
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" size="large" fullWidth>
                Send Message
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default HelpCenter;

import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  TextField,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  InputAdornment,
  CircularProgress,
  Alert,
  Divider,
  Avatar,
  useTheme,
} from "@mui/material";
import {
  Person as PersonIcon,
  Search as SearchIcon,
  Send as SendIcon,
  Check as CheckIcon,
  AccountBalance as AccountBalanceIcon,
  CreditCard as CreditCardIcon,
  AttachMoney as AttachMoneyIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { paymentService, simulateApiCall } from "../services/api";
import { AnimatedElement } from "../components/AnimationComponents";

const SendMoney = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    recipient: "",
    amount: "",
    paymentMethod: "card",
    note: "",
  });

  const [searchResults, setSearchResults] = useState([
    {
      id: "user1",
      name: "John Smith",
      email: "john.smith@example.com",
      avatar: "JS",
    },
    {
      id: "user2",
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      avatar: "SJ",
    },
    {
      id: "user3",
      name: "Michael Chen",
      email: "mchen@example.com",
      avatar: "MC",
    },
  ]);

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: "card1",
      type: "card",
      name: "Visa ending in 4242",
      icon: <CreditCardIcon />,
    },
    {
      id: "bank1",
      type: "bank",
      name: "Chase Bank ****6789",
      icon: <AccountBalanceIcon />,
    },
  ]);

  const handleNext = () => {
    if (activeStep === 0 && !formData.recipient) {
      setError("Please select a recipient");
      return;
    }

    if (activeStep === 1) {
      if (!formData.amount) {
        setError("Please enter an amount");
        return;
      }

      if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
        setError("Please enter a valid amount");
        return;
      }
    }

    setError("");
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRecipientSelect = (recipient) => {
    setFormData({
      ...formData,
      recipient: recipient,
    });
  };

  const handlePaymentMethodSelect = (method) => {
    setFormData({
      ...formData,
      paymentMethod: method,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      // In a real implementation, this would call the backend
      // await paymentService.sendMoney(formData);

      // For demo purposes, simulate API call
      await simulateApiCall({ success: true }, 1500);

      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError("Failed to process payment. Please try again.");
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    // In a real implementation, this would search users from the backend
    console.log("Searching for:", e.target.value);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const steps = [
    {
      label: "Select Recipient",
      description: "Choose who you want to send money to.",
      content: (
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            placeholder="Search by name or email"
            variant="outlined"
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "medium" }}>
            Recent Recipients
          </Typography>

          <Grid container spacing={2}>
            {searchResults.map((user) => (
              <Grid item xs={12} sm={6} md={4} key={user.id}>
                <Card
                  elevation={
                    formData.recipient && formData.recipient.id === user.id
                      ? 3
                      : 1
                  }
                  sx={{
                    cursor: "pointer",
                    borderRadius: 2,
                    border:
                      formData.recipient && formData.recipient.id === user.id
                        ? `2px solid ${theme.palette.primary.main}`
                        : "none",
                    transition: "all 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 3,
                    },
                  }}
                  onClick={() => handleRecipientSelect(user)}
                >
                  <CardContent
                    sx={{ display: "flex", alignItems: "center", p: 2 }}
                  >
                    <Avatar
                      sx={{
                        bgcolor:
                          formData.recipient &&
                          formData.recipient.id === user.id
                            ? "primary.main"
                            : "primary.light",
                        mr: 2,
                      }}
                    >
                      {user.avatar}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "medium" }}
                      >
                        {user.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                    {formData.recipient &&
                      formData.recipient.id === user.id && (
                        <CheckIcon color="primary" sx={{ ml: "auto" }} />
                      )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<SendIcon />}
              disabled={!formData.recipient}
            >
              Continue
            </Button>
          </Box>
        </Box>
      ),
    },
    {
      label: "Enter Amount",
      description: "Specify how much money you want to send.",
      content: (
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Amount"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            variant="outlined"
            type="number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            label="Add a note (optional)"
            name="note"
            value={formData.note}
            onChange={handleInputChange}
            variant="outlined"
            multiline
            rows={3}
            sx={{ mb: 3 }}
          />

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button onClick={handleBack}>Back</Button>
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<SendIcon />}
            >
              Continue
            </Button>
          </Box>
        </Box>
      ),
    },
    {
      label: "Select Payment Method",
      description: "Choose how you want to pay.",
      content: (
        <Box sx={{ mt: 2 }}>
          <FormControl component="fieldset" sx={{ width: "100%" }}>
            <FormLabel component="legend" sx={{ mb: 2 }}>
              Payment Methods
            </FormLabel>
            <RadioGroup
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
            >
              {paymentMethods.map((method) => (
                <Paper
                  key={method.id}
                  elevation={formData.paymentMethod === method.type ? 3 : 1}
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    border:
                      formData.paymentMethod === method.type
                        ? `2px solid ${theme.palette.primary.main}`
                        : "none",
                    transition: "all 0.2s",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 2,
                    },
                  }}
                >
                  <FormControlLabel
                    value={method.type}
                    control={<Radio />}
                    label={
                      <Box
                        sx={{ display: "flex", alignItems: "center", py: 1 }}
                      >
                        <Avatar sx={{ bgcolor: "primary.light", mr: 2 }}>
                          {method.icon}
                        </Avatar>
                        <Typography variant="subtitle1">
                          {method.name}
                        </Typography>
                      </Box>
                    }
                    sx={{ width: "100%", m: 0, p: 1 }}
                  />
                </Paper>
              ))}
            </RadioGroup>
          </FormControl>

          <Button variant="text" color="primary" sx={{ mt: 1, mb: 3 }}>
            + Add New Payment Method
          </Button>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button onClick={handleBack}>Back</Button>
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<SendIcon />}
            >
              Continue
            </Button>
          </Box>
        </Box>
      ),
    },
    {
      label: "Review & Confirm",
      description: "Verify the payment details before sending.",
      content: (
        <Box sx={{ mt: 2 }}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: "medium" }}>
              Payment Summary
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Recipient
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                  {formData.recipient ? formData.recipient.name : ""}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formData.recipient ? formData.recipient.email : ""}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Amount
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                  {formData.amount ? formatCurrency(formData.amount) : "$0.00"}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Payment Method
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                  {paymentMethods.find((m) => m.type === formData.paymentMethod)
                    ?.name || ""}
                </Typography>
              </Grid>

              {formData.note && (
                <>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>

                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">
                      Note
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">{formData.note}</Typography>
                  </Grid>
                </>
              )}
            </Grid>
          </Paper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button onClick={handleBack}>Back</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={
                loading ? <CircularProgress size={20} /> : <SendIcon />
              }
            >
              {loading ? "Processing..." : "Send Money"}
            </Button>
          </Box>
        </Box>
      ),
    },
  ];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <AnimatedElement>
        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: 4, fontWeight: "bold" }}
        >
          Send Money
        </Typography>
      </AnimatedElement>

      {success ? (
        <AnimatedElement animation="scaleUp">
          <Paper
            elevation={2}
            sx={{
              p: 4,
              borderRadius: 4,
              textAlign: "center",
            }}
          >
            <Avatar
              sx={{
                bgcolor: "success.main",
                width: 80,
                height: 80,
                mx: "auto",
                mb: 3,
              }}
            >
              <CheckIcon sx={{ fontSize: 40 }} />
            </Avatar>

            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
              Payment Successful!
            </Typography>

            <Typography variant="body1" sx={{ mb: 3 }}>
              You have successfully sent {formatCurrency(formData.amount)} to{" "}
              {formData.recipient.name}.
            </Typography>

            <Box
              sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}
            >
              <Button variant="outlined" onClick={() => navigate("/dashboard")}>
                Back to Dashboard
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  setSuccess(false);
                  setActiveStep(0);
                  setFormData({
                    recipient: "",
                    amount: "",
                    paymentMethod: "card",
                    note: "",
                  });
                }}
              >
                Send Another Payment
              </Button>
            </Box>
          </Paper>
        </AnimatedElement>
      ) : (
        <AnimatedElement animation="fadeInUp">
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 4,
            }}
          >
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "medium" }}
                    >
                      {step.label}
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {step.description}
                    </Typography>
                    {step.content}
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </AnimatedElement>
      )}
    </Container>
  );
};

export default SendMoney;

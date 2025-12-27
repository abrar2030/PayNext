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
  CardActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Check as CheckIcon, Star as StarIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const PricingPage = () => {
  const navigate = useNavigate();
  const [annual, setAnnual] = useState(false);

  const plans = [
    {
      name: "Personal",
      price: annual ? 0 : 0,
      period: "forever",
      description:
        "Perfect for individuals who want to send money to friends and family",
      features: [
        "Send up to $500/month",
        "Standard processing (1-3 business days)",
        "Basic support",
        "Mobile app access",
        "Transaction history",
      ],
      buttonText: "Get Started",
      buttonVariant: "outlined",
    },
    {
      name: "Business",
      price: annual ? 228 : 19,
      period: annual ? "year" : "month",
      description: "Ideal for small businesses and freelancers",
      features: [
        "Send up to $10,000/month",
        "Fast processing (same day)",
        "Priority support",
        "Multi-user accounts",
        "Advanced reporting",
        "API access",
        "Custom branding",
      ],
      buttonText: "Start Free Trial",
      buttonVariant: "contained",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations with specific needs",
      features: [
        "Unlimited transactions",
        "Instant processing",
        "24/7 dedicated support",
        "Custom integrations",
        "Advanced security features",
        "Compliance assistance",
        "Account manager",
        "SLA guarantee",
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outlined",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{ fontWeight: "bold", mb: 2 }}
        >
          Simple, Transparent Pricing
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 700, mx: "auto" }}
        >
          Choose the plan that's right for you. No hidden fees, cancel anytime.
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={annual}
              onChange={(e) => setAnnual(e.target.checked)}
            />
          }
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography>Monthly</Typography>
              <Typography sx={{ fontWeight: "bold" }}>Annual</Typography>
              <Chip label="Save 20%" color="success" size="small" />
            </Box>
          }
        />
      </Box>

      <Grid container spacing={4} alignItems="stretch">
        {plans.map((plan, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              elevation={plan.popular ? 8 : 2}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                border: plan.popular ? "2px solid" : "none",
                borderColor: "primary.main",
              }}
            >
              {plan.popular && (
                <Chip
                  label="Most Popular"
                  color="primary"
                  icon={<StarIcon />}
                  sx={{
                    position: "absolute",
                    top: -12,
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                />
              )}
              <CardContent sx={{ flexGrow: 1, pt: plan.popular ? 4 : 3 }}>
                <Typography
                  variant="h5"
                  component="h3"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  {plan.name}
                </Typography>
                <Box sx={{ mb: 3 }}>
                  {typeof plan.price === "number" ? (
                    <>
                      <Typography
                        variant="h3"
                        component="span"
                        sx={{ fontWeight: "bold" }}
                      >
                        ${plan.price}
                      </Typography>
                      <Typography
                        variant="body1"
                        component="span"
                        color="text.secondary"
                      >
                        /{plan.period}
                      </Typography>
                    </>
                  ) : (
                    <Typography
                      variant="h3"
                      component="span"
                      sx={{ fontWeight: "bold" }}
                    >
                      {plan.price}
                    </Typography>
                  )}
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  {plan.description}
                </Typography>
                <List dense>
                  {plan.features.map((feature, idx) => (
                    <ListItem key={idx} disableGutters>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <CardActions sx={{ p: 3, pt: 0 }}>
                <Button
                  fullWidth
                  variant={plan.buttonVariant}
                  color="primary"
                  size="large"
                  onClick={() => navigate("/register")}
                >
                  {plan.buttonText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            All plans include
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {[
              "Bank-level security",
              "No setup fees",
              "No monthly minimums",
              "Cancel anytime",
              "Mobile & web access",
              "Real-time notifications",
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body1">{feature}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default PricingPage;

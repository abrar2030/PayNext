import React from "react";
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
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  AccountBalance as AccountBalanceIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Devices as DevicesIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const features = [
    {
      icon: <SpeedIcon fontSize="large" />,
      title: "Fast Transactions",
      description:
        "Send and receive money instantly with our lightning-fast payment processing system.",
    },
    {
      icon: <SecurityIcon fontSize="large" />,
      title: "Secure Payments",
      description:
        "Bank-level security ensures your money and personal information are always protected.",
    },
    {
      icon: <DevicesIcon fontSize="large" />,
      title: "Multi-Platform",
      description:
        "Access your account from any device, anywhere, anytime with our responsive platform.",
    },
    {
      icon: <AccountBalanceIcon fontSize="large" />,
      title: "Financial Management",
      description:
        "Track your spending, set budgets, and manage your finances all in one place.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Small Business Owner",
      content:
        "PayNext has revolutionized how I handle business payments. The interface is intuitive and transactions are lightning fast!",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Michael Chen",
      role: "Freelance Developer",
      content:
        "I receive payments from clients worldwide with minimal fees and maximum security. The dashboard makes tracking everything a breeze.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Emily Rodriguez",
      role: "E-commerce Manager",
      content:
        "The integration capabilities with our online store have streamlined our entire payment process. Customer satisfaction is up 40%!",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
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
                Next Generation Payment Solution
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  lineHeight: 1.5,
                }}
              >
                Send, receive, and manage your money with ease. Fast, secure,
                and designed for the modern world.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => navigate("/register")}
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    borderRadius: 8,
                  }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate("/login")}
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontSize: "1.1rem",
                    color: "white",
                    borderColor: "white",
                    "&:hover": {
                      borderColor: "white",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                    borderRadius: 8,
                  }}
                >
                  Sign In
                </Button>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{ display: { xs: "none", md: "block" } }}
            >
              <Box
                component="img"
                src="https://cdn.pixabay.com/photo/2019/04/26/07/14/transaction-4156934_1280.png"
                alt="PayNext Dashboard Preview"
                sx={{
                  width: "100%",
                  maxWidth: 600,
                  borderRadius: 4,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                  transform:
                    "perspective(1000px) rotateY(-10deg) rotateX(5deg)",
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

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: "bold",
              mb: 2,
            }}
          >
            Why Choose PayNext
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
            Our platform combines cutting-edge technology with user-friendly
            design to provide the best payment experience possible.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                elevation={2}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 8,
                  },
                  borderRadius: 4,
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: "center", p: 3 }}>
                  <Box
                    sx={{
                      display: "inline-flex",
                      p: 2,
                      borderRadius: "50%",
                      backgroundColor: "primary.light",
                      color: "white",
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{ mb: 1, fontWeight: "medium" }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ backgroundColor: "grey.50", py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: "bold",
                mb: 2,
              }}
            >
              How It Works
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
              Get started with PayNext in three simple steps
            </Typography>
          </Box>

          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://cdn.pixabay.com/photo/2017/10/24/07/12/hacker-2883632_1280.jpg"
                alt="PayNext Mobile App"
                sx={{
                  width: "100%",
                  borderRadius: 4,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                  <Paper
                    elevation={2}
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "primary.main",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.5rem",
                      mr: 3,
                    }}
                  >
                    1
                  </Paper>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: "medium", mb: 1 }}
                    >
                      Create Your Account
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Sign up in minutes with just your email and basic
                      information. No paperwork required.
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                  <Paper
                    elevation={2}
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "primary.main",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.5rem",
                      mr: 3,
                    }}
                  >
                    2
                  </Paper>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: "medium", mb: 1 }}
                    >
                      Link Your Payment Methods
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Connect your bank account, credit cards, or other payment
                      sources securely.
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Paper
                    elevation={2}
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "primary.main",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.5rem",
                      mr: 3,
                    }}
                  >
                    3
                  </Paper>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: "medium", mb: 1 }}
                    >
                      Start Transacting
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Send money, make payments, and manage your finances with
                      ease.
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate("/register")}
                  sx={{
                    mt: 5,
                    py: 1.5,
                    px: 4,
                    borderRadius: 8,
                  }}
                >
                  Get Started Now
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: "bold",
              mb: 2,
            }}
          >
            What Our Users Say
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
            Join thousands of satisfied users who trust PayNext for their
            payment needs
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                elevation={2}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 4,
                  p: 3,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <CardMedia
                    component="img"
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      mr: 2,
                    }}
                    image={testimonial.image}
                    alt={testimonial.name}
                  />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {testimonial.role}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    flexGrow: 1,
                    fontStyle: "italic",
                    color: "text.secondary",
                    lineHeight: 1.7,
                  }}
                >
                  "{testimonial.content}"
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
          color: "white",
          py: { xs: 8, md: 10 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: "bold",
              mb: 3,
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
              mx: "auto",
            }}
          >
            Join thousands of users who trust PayNext for their payment needs.
            Sign up today and experience the future of payments.
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 3,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => navigate("/register")}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: "1.1rem",
                fontWeight: "bold",
                borderRadius: 8,
              }}
            >
              Create Account
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/login")}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: "1.1rem",
                color: "white",
                borderColor: "white",
                "&:hover": {
                  borderColor: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
                borderRadius: 8,
              }}
            >
              Learn More
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ backgroundColor: "#0a1929", color: "white", py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>
                PayNext
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7, mb: 2 }}>
                The next generation payment solution for individuals and
                businesses.
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                © {new Date().getFullYear()} PayNext. All rights reserved.
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 2 }}
              >
                Product
              </Typography>
              <Box component="ul" sx={{ p: 0, m: 0, listStyle: "none" }}>
                {["Features", "Pricing", "Integrations", "Enterprise"].map(
                  (item) => (
                    <Box component="li" key={item} sx={{ mb: 1 }}>
                      <Button
                        sx={{
                          color: "white",
                          opacity: 0.7,
                          p: 0,
                          textTransform: "none",
                          justifyContent: "flex-start",
                          "&:hover": { opacity: 1 },
                        }}
                      >
                        {item}
                      </Button>
                    </Box>
                  ),
                )}
              </Box>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 2 }}
              >
                Company
              </Typography>
              <Box component="ul" sx={{ p: 0, m: 0, listStyle: "none" }}>
                {["About", "Careers", "Blog", "Press"].map((item) => (
                  <Box component="li" key={item} sx={{ mb: 1 }}>
                    <Button
                      sx={{
                        color: "white",
                        opacity: 0.7,
                        p: 0,
                        textTransform: "none",
                        justifyContent: "flex-start",
                        "&:hover": { opacity: 1 },
                      }}
                    >
                      {item}
                    </Button>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 2 }}
              >
                Resources
              </Typography>
              <Box component="ul" sx={{ p: 0, m: 0, listStyle: "none" }}>
                {["Documentation", "Help Center", "API", "Status"].map(
                  (item) => (
                    <Box component="li" key={item} sx={{ mb: 1 }}>
                      <Button
                        sx={{
                          color: "white",
                          opacity: 0.7,
                          p: 0,
                          textTransform: "none",
                          justifyContent: "flex-start",
                          "&:hover": { opacity: 1 },
                        }}
                      >
                        {item}
                      </Button>
                    </Box>
                  ),
                )}
              </Box>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 2 }}
              >
                Legal
              </Typography>
              <Box component="ul" sx={{ p: 0, m: 0, listStyle: "none" }}>
                {["Privacy", "Terms", "Security", "Compliance"].map((item) => (
                  <Box component="li" key={item} sx={{ mb: 1 }}>
                    <Button
                      sx={{
                        color: "white",
                        opacity: 0.7,
                        p: 0,
                        textTransform: "none",
                        justifyContent: "flex-start",
                        "&:hover": { opacity: 1 },
                      }}
                    >
                      {item}
                    </Button>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Homepage;

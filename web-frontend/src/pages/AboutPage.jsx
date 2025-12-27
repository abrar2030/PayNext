import React from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Avatar,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import {
  Security as SecurityIcon,
  Speed as SpeedIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";

const AboutPage = () => {
  const stats = [
    { label: "Active Users", value: "500K+", icon: <PeopleIcon /> },
    { label: "Transactions", value: "$2B+", icon: <TrendingUpIcon /> },
    { label: "Countries", value: "150+", icon: <SecurityIcon /> },
    { label: "Uptime", value: "99.9%", icon: <SpeedIcon /> },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Co-Founder",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Michael Chen",
      role: "CTO & Co-Founder",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Product",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      name: "David Kim",
      role: "Head of Engineering",
      image: "https://randomuser.me/api/portraits/men/22.jpg",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: "center", mb: 8 }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{ fontWeight: "bold", mb: 2 }}
        >
          About PayNext
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ maxWidth: 800, mx: "auto", lineHeight: 1.6 }}
        >
          We're on a mission to make payments simple, fast, and accessible for
          everyone, everywhere.
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ mb: 8 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={2}
              sx={{ p: 3, textAlign: "center", height: "100%" }}
            >
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: 56,
                  height: 56,
                  mx: "auto",
                  mb: 2,
                }}
              >
                {stat.icon}
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                {stat.value}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {stat.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mb: 8 }}>
        <Typography
          variant="h3"
          sx={{ fontWeight: "bold", mb: 4, textAlign: "center" }}
        >
          Our Story
        </Typography>
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            PayNext was founded in 2022 with a simple vision: to revolutionize
            the way people send and receive money. We noticed that traditional
            payment systems were often slow, expensive, and complicated. We knew
            there had to be a better way.
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            Starting with a small team of passionate engineers and designers, we
            built PayNext from the ground up with a focus on security, speed,
            and user experience. Today, we serve over 500,000 users across 150
            countries, processing billions in transactions.
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            But we're just getting started. We continue to innovate and expand
            our services, always keeping our users' needs at the center of
            everything we do.
          </Typography>
        </Paper>
      </Box>

      <Box sx={{ mb: 8 }}>
        <Typography
          variant="h3"
          sx={{ fontWeight: "bold", mb: 4, textAlign: "center" }}
        >
          Our Team
        </Typography>
        <Grid container spacing={4}>
          {team.map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card elevation={2}>
                <Box sx={{ p: 3, textAlign: "center" }}>
                  <Avatar
                    src={member.image}
                    sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    {member.name}
                  </Typography>
                  <Chip label={member.role} color="primary" size="small" />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default AboutPage;

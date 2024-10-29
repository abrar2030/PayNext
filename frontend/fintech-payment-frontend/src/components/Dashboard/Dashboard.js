// src/components/Dashboard/Dashboard.js
import React from 'react';
import { Container, Typography } from '@material-ui/core';
import PaymentHistory from '../Payments/PaymentHistory';
import PaymentForm from '../Payments/PaymentForm';

function Dashboard() {
  return (
    <Container maxWidth="md">
      <Typography variant="h4">Dashboard</Typography>
      <PaymentForm />
      <PaymentHistory />
    </Container>
  );
}

export default Dashboard;

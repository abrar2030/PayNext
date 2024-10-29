// src/components/Payments/PaymentForm.js
import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import PaymentService from '../../services/PaymentService';

function PaymentForm() {
  const [receiverId, setReceiverId] = useState('');
  const [amount, setAmount] = useState('');

  const handlePayment = () => {
    PaymentService.processPayment({ receiverId, amount }).then(() => {
      alert('Payment Successful');
      // Update payment history
    }).catch(error => {
      alert('Payment Failed');
    });
  };

  return (
    <div>
      <TextField label="Receiver ID" fullWidth margin="normal" value={receiverId} onChange={e => setReceiverId(e.target.value)} />
      <TextField label="Amount" type="number" fullWidth margin="normal" value={amount} onChange={e => setAmount(e.target.value)} />
      <Button variant="contained" color="primary" onClick={handlePayment}>Send Payment</Button>
    </div>
  );
}

export default PaymentForm;

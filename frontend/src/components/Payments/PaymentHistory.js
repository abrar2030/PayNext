import React, { useEffect, useState } from 'react';
import PaymentService from '../../services/PaymentService';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await PaymentService.getPaymentHistory();
        setPayments(data);
      } catch (err) {
        setErrorMessage('Failed to fetch payment history. Please try again.');
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="container">
      <h2>Payment History</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <ul>
        {payments.map((payment) => (
          <li key={payment.id}>
            <p>Amount: {payment.amount}</p>
            <p>Description: {payment.description}</p>
            <p>Date: {new Date(payment.date).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentHistory;

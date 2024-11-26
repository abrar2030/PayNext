import React, { useEffect, useState } from 'react';
import PaymentService from '../../services/PaymentService';
import './PaymentHistory.css';

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
    <div className="payment-history-page">
      <div className="payment-history-container">
        <h2 className="payment-history-title">Payment History</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {payments.length > 0 ? (
          <table className="payment-history-table">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Description</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>${parseFloat(payment.amount).toFixed(2)}</td>
                  <td>{payment.description}</td>
                  <td>{new Date(payment.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !errorMessage && (
            <p className="no-data-message">No payment history available.</p>
          )
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;

import React, { useState } from 'react';
import PaymentService from '../../services/PaymentService';
import './PaymentForm.css';

const PaymentForm = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    try {
      await PaymentService.createPayment({ amount, description });
      setSuccessMessage('Payment successfully created!');
      setAmount('');
      setDescription('');
    } catch (err) {
      setErrorMessage('Failed to create payment. Please try again.');
    }
  };

  return (
    <div className="payment-form-page">
      <div className="payment-form-container">
        <h2 className="payment-form-title">Make a Payment</h2>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form className="payment-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Amount</label>
            <input
              type="number"
              className="form-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              placeholder="Enter amount"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              type="text"
              className="form-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Enter description"
            />
          </div>
          <button type="submit" className="submit-button">
            Submit Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;

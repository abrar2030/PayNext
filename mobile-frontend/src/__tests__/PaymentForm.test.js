import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PaymentForm from '../components/PaymentForm';

// Mock the payment service
jest.mock('../services/paymentService', () => ({
  processPayment: jest.fn(() => Promise.resolve({ id: 'payment-123', status: 'success' }))
}));

describe('PaymentForm Component', () => {
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    render(<PaymentForm onSuccess={mockOnSuccess} />);
  });

  test('renders payment form with all required fields', () => {
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/recipient/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send payment/i })).toBeInTheDocument();
  });

  test('validates form inputs', async () => {
    const submitButton = screen.getByRole('button', { name: /send payment/i });

    // Try submitting without filling fields
    fireEvent.click(submitButton);

    // Check for validation messages
    await waitFor(() => {
      expect(screen.getByText(/amount is required/i)).toBeInTheDocument();
      expect(screen.getByText(/recipient is required/i)).toBeInTheDocument();
    });
  });

  test('validates amount is a positive number', async () => {
    const amountInput = screen.getByLabelText(/amount/i);
    const submitButton = screen.getByRole('button', { name: /send payment/i });

    // Enter invalid amount
    fireEvent.change(amountInput, { target: { value: '-50' } });
    fireEvent.click(submitButton);

    // Check for validation message
    await waitFor(() => {
      expect(screen.getByText(/amount must be positive/i)).toBeInTheDocument();
    });
  });

  test('submits form with valid payment details', async () => {
    const amountInput = screen.getByLabelText(/amount/i);
    const recipientInput = screen.getByLabelText(/recipient/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /send payment/i });

    // Fill in form
    fireEvent.change(amountInput, { target: { value: '100' } });
    fireEvent.change(recipientInput, { target: { value: 'john@example.com' } });
    fireEvent.change(descriptionInput, { target: { value: 'Dinner payment' } });

    // Submit form
    fireEvent.click(submitButton);

    // Check if payment service was called and onSuccess callback triggered
    await waitFor(() => {
      const paymentService = require('../services/paymentService');
      expect(paymentService.processPayment).toHaveBeenCalledWith({
        amount: 100,
        recipient: 'john@example.com',
        description: 'Dinner payment'
      });
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  test('shows error message on payment failure', async () => {
    // Override the mock to simulate failure
    const paymentService = require('../services/paymentService');
    paymentService.processPayment.mockImplementationOnce(() =>
      Promise.reject(new Error('Insufficient funds'))
    );

    const amountInput = screen.getByLabelText(/amount/i);
    const recipientInput = screen.getByLabelText(/recipient/i);
    const submitButton = screen.getByRole('button', { name: /send payment/i });

    // Fill in form
    fireEvent.change(amountInput, { target: { value: '5000' } });
    fireEvent.change(recipientInput, { target: { value: 'john@example.com' } });

    // Submit form
    fireEvent.click(submitButton);

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/insufficient funds/i)).toBeInTheDocument();
    });
  });
});

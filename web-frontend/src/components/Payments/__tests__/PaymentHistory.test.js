import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PaymentHistory from '../PaymentHistory';
import PaymentService from '../../../services/PaymentService'; // Adjust path as needed

// Mock the PaymentService
jest.mock('../../../services/PaymentService');

describe('PaymentHistory Component', () => {
  const mockPayments = [
    { id: '1', recipient: 'user1@example.com', amount: 50, currency: 'USD', date: '2024-01-15', status: 'Completed' },
    { id: '2', recipient: 'user2@example.com', amount: 100, currency: 'EUR', date: '2024-01-16', status: 'Pending' },
  ];

  beforeEach(() => {
    // Reset mocks before each test
    PaymentService.getPaymentHistory.mockClear();
  });

  test('renders loading state initially', () => {
    PaymentService.getPaymentHistory.mockResolvedValueOnce({ payments: [] }); // Mock promise
    render(<PaymentHistory />);
    expect(screen.getByText(/loading payment history/i)).toBeInTheDocument();
  });

  test('fetches and displays payment history on mount', async () => {
    PaymentService.getPaymentHistory.mockResolvedValueOnce({ payments: mockPayments });
    render(<PaymentHistory />);

    // Wait for loading to disappear and data to appear
    await waitFor(() => {
      expect(screen.queryByText(/loading payment history/i)).not.toBeInTheDocument();
    });

    // Check if payment history is rendered
    expect(screen.getByText(/payment history/i)).toBeInTheDocument(); // Assuming a title
    expect(PaymentService.getPaymentHistory).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/user1@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/50 USD/i)).toBeInTheDocument();
    expect(screen.getByText(/Completed/i)).toBeInTheDocument();
    expect(screen.getByText(/user2@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/100 EUR/i)).toBeInTheDocument();
    expect(screen.getByText(/Pending/i)).toBeInTheDocument();
  });

  test('displays message when no payment history is available', async () => {
    PaymentService.getPaymentHistory.mockResolvedValueOnce({ payments: [] });
    render(<PaymentHistory />);

    await waitFor(() => {
      expect(screen.queryByText(/loading payment history/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/no payment history found/i)).toBeInTheDocument();
  });

  test('displays error message on fetch failure', async () => {
    const errorMessage = 'Failed to fetch payment history';
    PaymentService.getPaymentHistory.mockRejectedValueOnce(new Error(errorMessage));
    render(<PaymentHistory />);

    await waitFor(() => {
      expect(screen.queryByText(/loading payment history/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(new RegExp(errorMessage, 'i'))).toBeInTheDocument();
  });
});


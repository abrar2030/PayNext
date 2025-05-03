import PaymentService from '../PaymentService';
import api from '../api'; // Assuming api.js handles actual HTTP requests

// Mock the api module
jest.mock('../api');

describe('PaymentService', () => {
  afterEach(() => {
    // Clear mock calls after each test
    jest.clearAllMocks();
  });

  // --- makePayment Tests --- 
  it('should call the make payment API endpoint with correct payment data', async () => {
    const paymentData = { recipient: 'recipient@example.com', amount: 100, currency: 'USD' };
    const mockResponse = { success: true, transactionId: 'txn_123' };
    api.post.mockResolvedValue(mockResponse);

    await PaymentService.makePayment(paymentData);

    expect(api.post).toHaveBeenCalledTimes(1);
    expect(api.post).toHaveBeenCalledWith('/payments/send', paymentData);
  });

  it('should return transaction details on successful payment', async () => {
    const paymentData = { recipient: 'recipient@example.com', amount: 100, currency: 'USD' };
    const mockResponse = { success: true, transactionId: 'txn_123' };
    api.post.mockResolvedValue(mockResponse);

    const result = await PaymentService.makePayment(paymentData);

    expect(result).toEqual(mockResponse);
  });

  it('should throw an error on make payment API failure', async () => {
    const paymentData = { recipient: 'recipient@example.com', amount: 100, currency: 'USD' };
    const errorMessage = 'Insufficient funds';
    api.post.mockRejectedValue(new Error(errorMessage));

    await expect(PaymentService.makePayment(paymentData)).rejects.toThrow(errorMessage);
  });

  // --- getPaymentHistory Tests --- 
  it('should call the get payment history API endpoint', async () => {
    const mockResponse = { success: true, payments: [] };
    api.get.mockResolvedValue(mockResponse);

    await PaymentService.getPaymentHistory();

    expect(api.get).toHaveBeenCalledTimes(1);
    expect(api.get).toHaveBeenCalledWith('/payments/history');
  });

  it('should return payment history data on successful fetch', async () => {
    const mockPayments = [
      { id: '1', recipient: 'user1@example.com', amount: 50, currency: 'USD', date: '2024-01-15', status: 'Completed' },
      { id: '2', recipient: 'user2@example.com', amount: 100, currency: 'EUR', date: '2024-01-16', status: 'Pending' },
    ];
    const mockResponse = { success: true, payments: mockPayments };
    api.get.mockResolvedValue(mockResponse);

    const result = await PaymentService.getPaymentHistory();

    expect(result).toEqual(mockResponse);
  });

  it('should throw an error on get payment history API failure', async () => {
    const errorMessage = 'Failed to fetch history';
    api.get.mockRejectedValue(new Error(errorMessage));

    await expect(PaymentService.getPaymentHistory()).rejects.toThrow(errorMessage);
  });
});


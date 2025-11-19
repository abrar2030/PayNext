import axios from 'axios';

// Use environment variable or default to localhost API gateway
const API_URL = process.env.REACT_APP_API_BASE_URL ||
  'http://localhost:8002/payments/';

const createPayment = async (paymentData) => {
  const response = await axios.post(API_URL, paymentData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('user')}`,
    },
  });
  return response.data;
};

const getPaymentHistory = async () => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('user')}`,
    },
  });
  return response.data;
};

const PaymentService = {
  createPayment,
  getPaymentHistory,
};

export default PaymentService;

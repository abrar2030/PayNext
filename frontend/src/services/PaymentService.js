import axios from 'axios';

const API_URL = 'https://api.yourdomain.com/payments/';

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

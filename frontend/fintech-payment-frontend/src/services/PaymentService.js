import axios from 'axios';

const API_URL = 'http://localhost:8080/payments/';

class PaymentService {
  processPayment(paymentData) {
    return axios.post(API_URL + 'process', paymentData);
  }

  getPaymentHistory() {
    return axios.get(API_URL + 'history');
  }
}

export default new PaymentService();

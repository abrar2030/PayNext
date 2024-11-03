package com.fintech.paymentservice.service;

import com.fintech.paymentservice.model.Payment;
import java.util.List;

public interface PaymentService {
  Payment processPayment(Payment payment);

  List<Payment> getPaymentHistory(Long userId);
}

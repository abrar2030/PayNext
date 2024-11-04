package com.fintech.paymentservice.service;

import com.fintech.paymentservice.client.NotificationClient;
import com.fintech.paymentservice.model.NotificationRequest;
import com.fintech.paymentservice.model.Payment;
import com.fintech.paymentservice.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentServiceImpl implements PaymentService {
  @Autowired
  private PaymentRepository paymentRepository;

  @Autowired
  private NotificationClient notificationClient;

  @Override
  public Payment processPayment(Payment payment) {
    Payment savedPayment = paymentRepository.save(payment);

    // Notify user after payment is processed
    NotificationRequest notificationRequest = new NotificationRequest(String.valueOf(payment.getUserId()), "Payment processed successfully.");
    notificationClient.sendNotification(notificationRequest);

    return savedPayment;
  }

  @Override
  public List<Payment> getAllPayments() {
    return paymentRepository.findAll();
  }

  @Override
  public Payment getPaymentById(Long id) {
    Optional<Payment> payment = paymentRepository.findById(id);
    return payment.orElse(null);
  }
}
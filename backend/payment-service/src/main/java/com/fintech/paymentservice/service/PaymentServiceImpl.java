// payment-service/src/main/java/com/fintech/paymentservice/service/PaymentServiceImpl.java
package com.fintech.paymentservice.service;

import com.fintech.paymentservice.client.UserClient;
import com.fintech.paymentservice.model.Payment;
import com.fintech.paymentservice.repository.PaymentRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImpl implements PaymentService {

  private PaymentRepository paymentRepository;
  private UserClient userClient;

  @Autowired
  public PaymentServiceImpl(PaymentRepository paymentRepository, UserClient userClient) {
    this.paymentRepository = paymentRepository;
    this.userClient = userClient;
  }

  @Override
  public Payment processPayment(Payment payment) {
    // Verify sender and receiver exist
    if (!userClient.userExists(payment.getSenderId())
        || !userClient.userExists(payment.getReceiverId())) {
      throw new IllegalArgumentException("Sender or Receiver does not exist");
    }

    // Process payment logic
    payment.setTimestamp(LocalDateTime.now());
    payment.setStatus("SUCCESS");

    // Save payment to database
    Payment savedPayment = paymentRepository.save(payment);

    // Send notification (assuming there's a method to do so)
    // notificationClient.sendNotification(...);

    return savedPayment;
  }

  @Override
  public List<Payment> getPaymentHistory(Long userId) {
    return paymentRepository.findBySenderIdOrReceiverId(userId, userId);
  }
}

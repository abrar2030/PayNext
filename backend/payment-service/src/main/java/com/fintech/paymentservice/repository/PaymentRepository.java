package com.fintech.paymentservice.repository;

import com.fintech.paymentservice.model.Payment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
  List<Payment> findBySenderIdOrReceiverId(Long senderId, Long receiverId);
}

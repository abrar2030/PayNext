// payment-service/src/main/java/com/fintech/paymentservice/repository/PaymentRepository.java
package com.fintech.paymentservice.repository;

import com.fintech.paymentservice.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findBySenderIdOrReceiverId(Long senderId, Long receiverId);
}

// payment-service/src/main/java/com/fintech/paymentservice/model/Payment.java
package com.fintech.paymentservice.model;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long senderId;
    private Long receiverId;
    private Double amount;
    private LocalDateTime timestamp;
    private String status; // e.g., SUCCESS, FAILED, PENDING
}

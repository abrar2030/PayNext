package com.fintech.paymentservice.model;

import java.time.LocalDateTime;
import javax.persistence.*;
import lombok.*;

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

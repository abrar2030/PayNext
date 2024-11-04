package com.fintech.paymentservice.model;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private Long userId;

  @Column(nullable = false)
  private BigDecimal amount;

  @Column(nullable = false)
  private LocalDateTime paymentDate;

  @Column(nullable = false)
  private String status;

  public Payment() {
  }

  public Payment(Long userId, BigDecimal amount, LocalDateTime paymentDate, String status) {
    this.userId = userId;
    this.amount = amount;
    this.paymentDate = paymentDate;
    this.status = status;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }

  public BigDecimal getAmount() {
    return amount;
  }

  public void setAmount(BigDecimal amount) {
    this.amount = amount;
  }

  public LocalDateTime getPaymentDate() {
    return paymentDate;
  }

  public void setPaymentDate(LocalDateTime paymentDate) {
    this.paymentDate = paymentDate;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  @Override
  public String toString() {
    return "Payment{" +
            "id=" + id +
            ", userId=" + userId +
            ", amount=" + amount +
            ", paymentDate=" + paymentDate +
            ", status='" + status + '\'' +
            '}';
  }
}

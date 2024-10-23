package com.paynext.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import org.springframework.format.annotation.DateTimeFormat;

@Entity
@Table(name = "payments") // Updated table name to payments
public class Payment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id", nullable = false)
  private Long id;

  @Column(name = "amount", nullable = false) // Changed to reflect payment amount
  @NotNull(message = "{payment.amount.notNull}") // Updated message key
  private BigDecimal amount;

  @Column(name = "payer_name", nullable = false) // Changed to reflect payer's name
  @NotBlank(message = "{payment.payerName.notBlank}") // Updated message key
  private String payerName;

  @Column(name = "transaction_id", nullable = false) // Added transaction ID field
  @NotBlank(message = "{payment.transactionId.notBlank}") // Updated message key
  @Pattern(
      regexp = "[a-zA-Z0-9]{10,}",
      message = "{payment.transactionId.size}") // Adjusted pattern as needed
  private String transactionId;

  @Column(name = "payment_method", nullable = false) // Added payment method field
  @NotBlank(message = "{payment.method.notBlank}") // Updated message key
  private String paymentMethod;

  @Column(name = "date", nullable = false)
  @DateTimeFormat(pattern = "yyyy-MM-dd")
  @NotNull(message = "{payment.date.notNull}") // Updated message key
  private LocalDate date;

  public Payment() {}

  public Payment(
      Long id,
      BigDecimal amount,
      String payerName,
      String transactionId,
      String paymentMethod,
      LocalDate date) {
    this.id = id;
    this.amount = amount;
    this.payerName = payerName;
    this.transactionId = transactionId;
    this.paymentMethod = paymentMethod;
    this.date = date;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public BigDecimal getAmount() {
    return amount;
  }

  public void setAmount(BigDecimal amount) {
    this.amount = amount;
  }

  public String getPayerName() {
    return payerName;
  }

  public void setPayerName(String payerName) {
    this.payerName = payerName;
  }

  public String getTransactionId() {
    return transactionId;
  }

  public void setTransactionId(String transactionId) {
    this.transactionId = transactionId;
  }

  public String getPaymentMethod() {
    return paymentMethod;
  }

  public void setPaymentMethod(String paymentMethod) {
    this.paymentMethod = paymentMethod;
  }

  public LocalDate getDate() {
    return date;
  }

  public void setDate(LocalDate date) {
    this.date = date;
  }

  @Override
  public String toString() {
    return "Payment [id="
        + id
        + ", amount="
        + amount
        + ", payerName="
        + payerName
        + ", transactionId="
        + transactionId
        + ", paymentMethod="
        + paymentMethod
        + ", date="
        + date
        + "]";
  }
}

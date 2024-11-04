package com.fintech.paymentservice.controller;

import com.fintech.paymentservice.model.Payment;
import com.fintech.paymentservice.service.PaymentService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

  @Autowired private PaymentService paymentService;

  @PostMapping
  public ResponseEntity<Payment> makePayment(@RequestBody Payment payment) {
    Payment savedPayment = paymentService.processPayment(payment);
    return new ResponseEntity<>(savedPayment, HttpStatus.CREATED);
  }

  @GetMapping
  public ResponseEntity<List<Payment>> getAllPayments() {
    List<Payment> payments = paymentService.getAllPayments();
    return new ResponseEntity<>(payments, HttpStatus.OK);
  }

  @GetMapping("/{id}")
  public ResponseEntity<Payment> getPaymentById(@PathVariable Long id) {
    Payment payment = paymentService.getPaymentById(id);
    if (payment != null) {
      return new ResponseEntity<>(payment, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }
}

package com.fintech.paymentservice.controller;

import com.fintech.paymentservice.model.Payment;
import com.fintech.paymentservice.service.PaymentService;
import java.security.Principal;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
public class PaymentController {

  private PaymentService paymentService;

  @Autowired
  public PaymentController(PaymentService paymentService) {
    this.paymentService = paymentService;
  }

  @PostMapping("/process")
  public Payment processPayment(@RequestBody Payment payment, Principal principal) {
    // Assuming principal contains the authenticated user's username or ID
    Long senderId = Long.parseLong(principal.getName());
    payment.setSenderId(senderId);
    return paymentService.processPayment(payment);
  }

  @GetMapping("/history")
  public List<Payment> getPaymentHistory(Principal principal) {
    Long userId = Long.parseLong(principal.getName());
    return paymentService.getPaymentHistory(userId);
  }
}

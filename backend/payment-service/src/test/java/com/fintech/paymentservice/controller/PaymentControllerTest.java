package com.fintech.paymentservice.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fintech.paymentservice.model.Payment;
import com.fintech.paymentservice.service.PaymentService;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(PaymentController.class)
class PaymentControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private PaymentService paymentService;

  @Autowired private ObjectMapper objectMapper;

  private Payment testPayment;

  @BeforeEach
  void setUp() {
    testPayment = new Payment();
    testPayment.setId(1L);
    testPayment.setUserId(100L);
    testPayment.setAmount(new BigDecimal("100.00"));
    testPayment.setPaymentDate(LocalDateTime.now());
    testPayment.setStatus("COMPLETED");
  }

  @Test
  void processPayment_shouldReturnCreatedPayment() throws Exception {
    when(paymentService.processPayment(any(Payment.class))).thenReturn(testPayment);

    mockMvc
        .perform(
            post("/api/payments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testPayment)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.userId").value(testPayment.getUserId()))
        .andExpect(jsonPath("$.amount").value(testPayment.getAmount().doubleValue()))
        .andExpect(jsonPath("$.status").value(testPayment.getStatus()));
  }

  @Test
  void getAllPayments_shouldReturnListOfPayments() throws Exception {
    Payment secondPayment = new Payment();
    secondPayment.setId(2L);
    secondPayment.setUserId(200L);
    secondPayment.setAmount(new BigDecimal("200.00"));
    secondPayment.setPaymentDate(LocalDateTime.now());
    secondPayment.setStatus("PENDING");

    List<Payment> payments = Arrays.asList(testPayment, secondPayment);
    when(paymentService.getAllPayments()).thenReturn(payments);

    mockMvc
        .perform(get("/api/payments").contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].userId").value(testPayment.getUserId()))
        .andExpect(jsonPath("$[1].userId").value(secondPayment.getUserId()));
  }

  @Test
  void getPaymentById_whenPaymentExists_shouldReturnPayment() throws Exception {
    when(paymentService.getPaymentById(1L)).thenReturn(testPayment);

    mockMvc
        .perform(get("/api/payments/1").contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.userId").value(testPayment.getUserId()))
        .andExpect(jsonPath("$.amount").value(testPayment.getAmount().doubleValue()))
        .andExpect(jsonPath("$.status").value(testPayment.getStatus()));
  }

  @Test
  void getPaymentById_whenPaymentDoesNotExist_shouldReturnNotFound() throws Exception {
    when(paymentService.getPaymentById(999L)).thenReturn(null);

    mockMvc
        .perform(get("/api/payments/999").contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound());
  }
}

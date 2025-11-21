package com.fintech.paymentservice.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
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
    testPayment.setRecipientId(200L);
    testPayment.setAmount(new BigDecimal("100.50"));
    testPayment.setCurrency("USD");
    testPayment.setStatus("PENDING");
    testPayment.setTimestamp(LocalDateTime.now());
  }

  @Test
  void createPayment_shouldReturnCreatedPayment() throws Exception {
    when(paymentService.createPayment(any(Payment.class))).thenReturn(testPayment);

    mockMvc
        .perform(
            post("/api/payments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testPayment)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.userId").value(testPayment.getUserId()))
        .andExpect(jsonPath("$.recipientId").value(testPayment.getRecipientId()))
        .andExpect(jsonPath("$.amount").value(100.50))
        .andExpect(jsonPath("$.currency").value("USD"))
        .andExpect(jsonPath("$.status").value("PENDING"));
  }

  @Test
  void getPaymentById_whenPaymentExists_shouldReturnPayment() throws Exception {
    when(paymentService.getPaymentById(anyLong())).thenReturn(testPayment);

    mockMvc
        .perform(get("/api/payments/{id}", 1L).contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1L))
        .andExpect(jsonPath("$.amount").value(100.50));
  }

  @Test
  void getPaymentById_whenPaymentDoesNotExist_shouldReturnNotFound() throws Exception {
    when(paymentService.getPaymentById(anyLong()))
        .thenThrow(
            new RuntimeException(
                "Payment not found")); // Or return null/Optional.empty based on service impl

    mockMvc
        .perform(get("/api/payments/{id}", 99L).contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound()); // Adjust based on exception handling
  }

  @Test
  void getPaymentsByUserId_shouldReturnPaymentList() throws Exception {
    List<Payment> payments = Arrays.asList(testPayment);
    when(paymentService.getPaymentsByUserId(anyLong())).thenReturn(payments);

    mockMvc
        .perform(get("/api/payments/user/{userId}", 100L).contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].id").value(1L))
        .andExpect(jsonPath("$[0].userId").value(100L));
  }

  // Add tests for update payment status endpoint if applicable
}

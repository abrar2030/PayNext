package com.fintech.paymentservice.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.fintech.paymentservice.model.Payment;
import com.fintech.paymentservice.repository.PaymentRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PaymentServiceImplTest {

  @Mock private PaymentRepository paymentRepository;

  @InjectMocks private PaymentServiceImpl paymentService;

  private Payment testPayment;

  @BeforeEach
  void setUp() {
    testPayment = new Payment();
    testPayment.setUserId(100L);
    testPayment.setAmount(new BigDecimal("100.00"));
    testPayment.setPaymentDate(LocalDateTime.now());
    testPayment.setStatus("COMPLETED");
  }

  @Test
  void processPayment_shouldSaveAndReturnPayment() {
    when(paymentRepository.save(any(Payment.class)))
        .thenAnswer(
            invocation -> {
              Payment savedPayment = invocation.getArgument(0);
              savedPayment.setId(1L); // Simulate saving with ID
              return savedPayment;
            });

    Payment processedPayment = paymentService.processPayment(testPayment);

    assertNotNull(processedPayment);
    assertEquals(testPayment.getUserId(), processedPayment.getUserId());
    assertEquals(testPayment.getAmount(), processedPayment.getAmount());
    assertNotNull(processedPayment.getId());
    verify(paymentRepository, times(1)).save(testPayment);
  }

  @Test
  void getAllPayments_shouldReturnListOfPayments() {
    Payment secondPayment = new Payment();
    secondPayment.setId(2L);
    secondPayment.setUserId(200L);
    secondPayment.setAmount(new BigDecimal("200.00"));
    secondPayment.setPaymentDate(LocalDateTime.now());
    secondPayment.setStatus("PENDING");

    List<Payment> payments = Arrays.asList(testPayment, secondPayment);
    when(paymentRepository.findAll()).thenReturn(payments);

    List<Payment> result = paymentService.getAllPayments();

    assertNotNull(result);
    assertEquals(2, result.size());
    verify(paymentRepository, times(1)).findAll();
  }

  @Test
  void getPaymentById_whenPaymentExists_shouldReturnPayment() {
    testPayment.setId(1L);
    when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));

    Payment foundPayment = paymentService.getPaymentById(1L);

    assertNotNull(foundPayment);
    assertEquals(testPayment.getId(), foundPayment.getId());
    assertEquals(testPayment.getUserId(), foundPayment.getUserId());
    verify(paymentRepository, times(1)).findById(1L);
  }

  @Test
  void getPaymentById_whenPaymentDoesNotExist_shouldReturnNull() {
    when(paymentRepository.findById(999L)).thenReturn(Optional.empty());

    Payment foundPayment = paymentService.getPaymentById(999L);

    assertNull(foundPayment);
    verify(paymentRepository, times(1)).findById(999L);
  }
}

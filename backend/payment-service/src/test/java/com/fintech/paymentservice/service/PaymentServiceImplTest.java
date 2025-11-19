package com.fintech.paymentservice.service;

import com.fintech.paymentservice.model.Payment;
import com.fintech.paymentservice.repository.PaymentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceImplTest {

    @Mock
    private PaymentRepository paymentRepository;

    @InjectMocks
    private PaymentServiceImpl paymentService;

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
    void createPayment_shouldSetTimestampAndStatusAndSave() {
        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> {
            Payment savedPayment = invocation.getArgument(0);
            savedPayment.setId(1L); // Simulate saving with ID
            return savedPayment;
        });

        Payment paymentToCreate = new Payment();
        paymentToCreate.setUserId(100L);
        paymentToCreate.setRecipientId(200L);
        paymentToCreate.setAmount(new BigDecimal("100.50"));
        paymentToCreate.setCurrency("USD");

        Payment createdPayment = paymentService.createPayment(paymentToCreate);

        assertNotNull(createdPayment);
        assertNotNull(createdPayment.getTimestamp());
        assertEquals("PENDING", createdPayment.getStatus());
        assertEquals(1L, createdPayment.getId());
        verify(paymentRepository, times(1)).save(paymentToCreate);
    }

    @Test
    void getPaymentById_whenPaymentExists_shouldReturnPayment() {
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));

        Payment foundPayment = paymentService.getPaymentById(1L);

        assertNotNull(foundPayment);
        assertEquals(1L, foundPayment.getId());
        verify(paymentRepository, times(1)).findById(1L);
    }

    @Test
    void getPaymentById_whenPaymentDoesNotExist_shouldThrowException() {
        when(paymentRepository.findById(anyLong())).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            paymentService.getPaymentById(99L);
        });

        assertEquals("Payment not found with id: 99", exception.getMessage());
        verify(paymentRepository, times(1)).findById(99L);
    }

    @Test
    void getPaymentsByUserId_shouldReturnListOfPayments() {
        List<Payment> payments = Arrays.asList(testPayment);
        when(paymentRepository.findByUserId(100L)).thenReturn(payments);

        List<Payment> foundPayments = paymentService.getPaymentsByUserId(100L);

        assertNotNull(foundPayments);
        assertFalse(foundPayments.isEmpty());
        assertEquals(1, foundPayments.size());
        assertEquals(100L, foundPayments.get(0).getUserId());
        verify(paymentRepository, times(1)).findByUserId(100L);
    }

    @Test
    void updatePaymentStatus_whenPaymentExists_shouldUpdateAndReturnPayment() {
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(testPayment));
        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment); // Return the same object after save

        Payment updatedPayment = paymentService.updatePaymentStatus(1L, "COMPLETED");

        assertNotNull(updatedPayment);
        assertEquals("COMPLETED", updatedPayment.getStatus());
        verify(paymentRepository, times(1)).findById(1L);
        verify(paymentRepository, times(1)).save(testPayment);
    }

    @Test
    void updatePaymentStatus_whenPaymentDoesNotExist_shouldThrowException() {
        when(paymentRepository.findById(anyLong())).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            paymentService.updatePaymentStatus(99L, "COMPLETED");
        });

        assertEquals("Payment not found with id: 99", exception.getMessage());
        verify(paymentRepository, times(1)).findById(99L);
        verify(paymentRepository, never()).save(any(Payment.class));
    }
}

package com.fintech.notificationservice.service;

import com.fintech.notificationservice.model.NotificationRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;

@ExtendWith(MockitoExtension.class)
public class EmailNotificationServiceTest {

    @Mock
    private JavaMailSender javaMailSender;

    @InjectMocks
    private EmailNotificationService emailNotificationService;

    private NotificationRequest notificationRequest;

    @BeforeEach
    void setUp() {
        notificationRequest = new NotificationRequest();
        notificationRequest.setTo("user@example.com");
        notificationRequest.setSubject("Test Subject");
        notificationRequest.setBody("Test Body");
    }

    @Test
    void sendNotification_ShouldSendEmail() {
        // When
        emailNotificationService.sendNotification(notificationRequest);

        // Then
        verify(javaMailSender, times(1)).send(any(SimpleMailMessage.class));
    }
}

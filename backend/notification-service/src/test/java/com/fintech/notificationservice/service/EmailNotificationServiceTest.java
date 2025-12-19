package com.fintech.notificationservice.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.fintech.notificationservice.model.NotificationRequest;
import java.util.HashMap;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
import org.thymeleaf.TemplateEngine;
import jakarta.mail.internet.MimeMessage;

@ExtendWith(MockitoExtension.class)
class EmailNotificationServiceTest {

  @Mock private JavaMailSender mailSender;

  @Mock private TemplateEngine templateEngine;

  @Mock private MimeMessage mimeMessage;

  @InjectMocks private EmailNotificationService emailNotificationService;

  private NotificationRequest notificationRequest;

  @BeforeEach
  void setUp() {
    notificationRequest = new NotificationRequest();
    notificationRequest.setRecipientEmail("test@example.com");
    notificationRequest.setSubject("Test Subject");
    Map<String, Object> properties = new HashMap<>();
    properties.put("message", "Test message body");
    properties.put("username", "testuser");
    notificationRequest.setProperties(properties);
  }

  @Test
  void sendNotification_shouldSendEmailSuccessfully() {
    when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
    when(templateEngine.process(anyString(), any())).thenReturn("<html><body>Test</body></html>");
    doNothing().when(mailSender).send(any(MimeMessage.class));

    emailNotificationService.sendNotification(notificationRequest);

    verify(mailSender, times(1)).createMimeMessage();
    verify(mailSender, times(1)).send(any(MimeMessage.class));
    verify(templateEngine, times(1)).process(anyString(), any());
  }

  @Test
  void sendNotification_withNullProperties_shouldHandleGracefully() {
    notificationRequest.setProperties(new HashMap<>());

    when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
    when(templateEngine.process(anyString(), any())).thenReturn("<html><body>Test</body></html>");
    doNothing().when(mailSender).send(any(MimeMessage.class));

    // Should not throw exception
    emailNotificationService.sendNotification(notificationRequest);

    verify(mailSender, times(1)).createMimeMessage();
  }
}

package com.fintech.paymentservice.client;

import com.fintech.paymentservice.model.NotificationRequest;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
    name = "notification-service",
    fallback = NotificationClient.NotificationClientFallback.class)
public interface NotificationClient {

  @PostMapping("/api/notifications/send")
  @CircuitBreaker(name = "notificationService", fallbackMethod = "sendNotificationFallback")
  void sendNotification(@RequestBody NotificationRequest notificationRequest);

  default void sendNotificationFallback(NotificationRequest notificationRequest, Exception e) {
    // Fallback implementation when notification service is down
    System.out.println("Fallback: Unable to send notification. Will retry later.");
    // Here you could queue the notification for later retry
  }

  @Component
  class NotificationClientFallback implements NotificationClient {
    private static final Logger logger = LoggerFactory.getLogger(NotificationClientFallback.class);

    @Override
    public void sendNotification(NotificationRequest notificationRequest) {
      logger.warn(
          "Notification service is down. Using fallback for notification: {}",
          notificationRequest.getSubject());
      // Could implement a fallback strategy like storing in a database for later retry
    }
  }
}

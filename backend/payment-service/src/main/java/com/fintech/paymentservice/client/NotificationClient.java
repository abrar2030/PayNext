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
  void sendNotification(@RequestBody NotificationRequest notificationRequest);

  @Component
  class NotificationClientFallback implements NotificationClient {
    private static final Logger logger = LoggerFactory.getLogger(NotificationClientFallback.class);

    @Override
    public void sendNotification(NotificationRequest notificationRequest) {
      logger.warn(
          "Notification service is down. Using fallback for notification to: {}",
          notificationRequest.getRecipient());
      // Could implement a fallback strategy like storing in a database for later retry
    }
  }
}

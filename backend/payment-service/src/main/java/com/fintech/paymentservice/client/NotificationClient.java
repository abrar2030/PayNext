package com.fintech.paymentservice.client;

import com.fintech.paymentservice.model.NotificationRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "notification-service")
public interface NotificationClient {

  @PostMapping("/notifications")
  void sendNotification(@RequestBody NotificationRequest notificationRequest);
}

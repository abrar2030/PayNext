package com.fintech.paymentservice.client;

import com.fintech.paymentservice.model.NotificationRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "notification-service")
public interface NotificationClient {

  @PostMapping("/notifications/send")
  void sendNotification(@RequestBody NotificationRequest notificationRequest);
}

// notification-service/src/main/java/com/fintech/notificationservice/model/NotificationRequest.java
package com.fintech.notificationservice.model;

import lombok.Data;

import java.util.Map;

@Data
public class NotificationRequest {
    private String recipientEmail;
    private String subject;
    private Map<String, Object> properties;
}

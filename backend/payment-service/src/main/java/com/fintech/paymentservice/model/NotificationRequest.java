package com.fintech.paymentservice.model;

import java.util.Map;

public class NotificationRequest {
  private String recipientEmail;
  private String subject;
  private Map<String, Object> properties;

  // Constructors
  public NotificationRequest() {}

  public NotificationRequest(
      String recipientEmail, String subject, Map<String, Object> properties) {
    this.recipientEmail = recipientEmail;
    this.subject = subject;
    this.properties = properties;
  }

  // Getters and Setters
  public String getRecipientEmail() {
    return recipientEmail;
  }

  public void setRecipientEmail(String recipientEmail) {
    this.recipientEmail = recipientEmail;
  }

  public String getSubject() {
    return subject;
  }

  public void setSubject(String subject) {
    this.subject = subject;
  }

  public Map<String, Object> getProperties() {
    return properties;
  }

  public void setProperties(Map<String, Object> properties) {
    this.properties = properties;
  }
}

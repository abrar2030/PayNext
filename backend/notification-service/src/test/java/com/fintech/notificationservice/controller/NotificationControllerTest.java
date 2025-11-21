package com.fintech.notificationservice.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fintech.notificationservice.model.NotificationRequest;
import com.fintech.notificationservice.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(NotificationController.class)
public class NotificationControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private NotificationService notificationService;

  @Autowired private ObjectMapper objectMapper;

  private NotificationRequest notificationRequest;

  @BeforeEach
  void setUp() {
    notificationRequest = new NotificationRequest();
    notificationRequest.setTo("user@example.com");
    notificationRequest.setSubject("Test Subject");
    notificationRequest.setBody("Test Body");
  }

  @Test
  void sendNotification_ShouldReturnOk() throws Exception {
    // Given
    doNothing().when(notificationService).sendNotification(any(NotificationRequest.class));

    // When & Then
    mockMvc
        .perform(
            post("/api/notifications/send")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(notificationRequest)))
        .andExpect(status().isOk());

    verify(notificationService).sendNotification(any(NotificationRequest.class));
  }

  @Test
  void sendNotification_WithInvalidRequest_ShouldReturnBadRequest() throws Exception {
    // Given
    notificationRequest.setTo(null); // Invalid email

    // When & Then
    mockMvc
        .perform(
            post("/api/notifications/send")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(notificationRequest)))
        .andExpect(status().isBadRequest());
  }
}

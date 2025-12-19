package com.fintech.notificationservice.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fintech.notificationservice.model.NotificationRequest;
import com.fintech.notificationservice.service.NotificationService;
import java.util.HashMap;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(NotificationController.class)
class NotificationControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private NotificationService notificationService;

  @Autowired private ObjectMapper objectMapper;

  private NotificationRequest notificationRequest;

  @BeforeEach
  void setUp() {
    notificationRequest = new NotificationRequest();
    notificationRequest.setRecipientEmail("test@example.com");
    notificationRequest.setSubject("Test Subject");
    Map<String, Object> properties = new HashMap<>();
    properties.put("message", "Test message body");
    notificationRequest.setProperties(properties);
  }

  @Test
  void sendNotification_shouldReturnOk() throws Exception {
    doNothing().when(notificationService).sendNotification(any(NotificationRequest.class));

    mockMvc
        .perform(
            post("/api/notifications/send")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(notificationRequest)))
        .andExpect(status().isOk());
  }

  @Test
  void sendNotification_withInvalidRequest_shouldReturnBadRequest() throws Exception {
    // Create invalid request (missing required fields)
    NotificationRequest invalidRequest = new NotificationRequest();

    mockMvc
        .perform(
            post("/api/notifications/send")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
        .andExpect(status().isBadRequest());
  }
}

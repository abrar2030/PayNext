package com.fintech.userservice.model;

import java.time.LocalDateTime;
import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "user_id")
  private Long userId;

  @Column(name = "action", nullable = false)
  private String action;

  @Column(name = "resource", nullable = false)
  private String resource;

  @Column(name = "resource_id")
  private String resourceId;

  @Column(name = "ip_address")
  private String ipAddress;

  @Column(name = "user_agent")
  private String userAgent;

  @Column(name = "session_id")
  private String sessionId;

  @Lob
  @Column(name = "request_data")
  private String requestData;

  @Lob
  @Column(name = "response_data")
  private String responseData;

  @Column(name = "status_code")
  private Integer statusCode;

  @Column(name = "error_message")
  private String errorMessage;

  @Column(name = "execution_time_ms")
  private Long executionTimeMs;

  @Column(name = "created_at", nullable = false)
  private LocalDateTime createdAt = LocalDateTime.now();

  @Enumerated(EnumType.STRING)
  @Column(name = "severity")
  private Severity severity = Severity.INFO;

  public enum Severity {
    INFO,
    WARNING,
    ERROR,
    CRITICAL
  }
}

package com.fintech.userservice.service;

import com.fintech.userservice.model.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.List;

public interface AuditService {
    
    /**
     * Log user action
     */
    void logAction(Long userId, String action, String resource, String resourceId, 
                  HttpServletRequest request, Object requestData, Object responseData, 
                  Integer statusCode, Long executionTimeMs);
    
    /**
     * Log security event
     */
    void logSecurityEvent(Long userId, String action, String resource, 
                         HttpServletRequest request, AuditLog.Severity severity, 
                         String errorMessage);
    
    /**
     * Get user activity logs
     */
    Page<AuditLog> getUserActivityLogs(Long userId, Pageable pageable);
    
    /**
     * Get logs by action
     */
    Page<AuditLog> getLogsByAction(String action, Pageable pageable);
    
    /**
     * Get logs by date range
     */
    Page<AuditLog> getLogsByDateRange(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
    
    /**
     * Get security alerts
     */
    Page<AuditLog> getSecurityAlerts(Pageable pageable);
    
    /**
     * Get user activity summary
     */
    List<AuditLog> getUserActivitySummary(Long userId, LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Clean up old audit logs
     */
    void cleanupOldLogs(int retentionDays);
}


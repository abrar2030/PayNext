package com.fintech.userservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fintech.userservice.model.AuditLog;
import com.fintech.userservice.repository.AuditLogRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@Transactional
public class AuditServiceImpl implements AuditService {
    
    @Autowired
    private AuditLogRepository auditLogRepository;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Override
    public void logAction(Long userId, String action, String resource, String resourceId,
                         HttpServletRequest request, Object requestData, Object responseData,
                         Integer statusCode, Long executionTimeMs) {
        try {
            AuditLog auditLog = new AuditLog();
            auditLog.setUserId(userId);
            auditLog.setAction(action);
            auditLog.setResource(resource);
            auditLog.setResourceId(resourceId);
            auditLog.setStatusCode(statusCode);
            auditLog.setExecutionTimeMs(executionTimeMs);
            
            if (request != null) {
                auditLog.setIpAddress(getClientIpAddress(request));
                auditLog.setUserAgent(request.getHeader("User-Agent"));
                auditLog.setSessionId(request.getSession().getId());
            }
            
            if (requestData != null) {
                auditLog.setRequestData(objectMapper.writeValueAsString(requestData));
            }
            
            if (responseData != null) {
                auditLog.setResponseData(objectMapper.writeValueAsString(responseData));
            }
            
            // Set severity based on status code
            if (statusCode != null) {
                if (statusCode >= 500) {
                    auditLog.setSeverity(AuditLog.Severity.ERROR);
                } else if (statusCode >= 400) {
                    auditLog.setSeverity(AuditLog.Severity.WARNING);
                } else {
                    auditLog.setSeverity(AuditLog.Severity.INFO);
                }
            }
            
            auditLogRepository.save(auditLog);
            
        } catch (Exception e) {
            log.error("Failed to log audit action: {}", e.getMessage(), e);
        }
    }
    
    @Override
    public void logSecurityEvent(Long userId, String action, String resource,
                                HttpServletRequest request, AuditLog.Severity severity,
                                String errorMessage) {
        try {
            AuditLog auditLog = new AuditLog();
            auditLog.setUserId(userId);
            auditLog.setAction(action);
            auditLog.setResource(resource);
            auditLog.setSeverity(severity);
            auditLog.setErrorMessage(errorMessage);
            
            if (request != null) {
                auditLog.setIpAddress(getClientIpAddress(request));
                auditLog.setUserAgent(request.getHeader("User-Agent"));
                auditLog.setSessionId(request.getSession().getId());
            }
            
            auditLogRepository.save(auditLog);
            
            // Log critical security events
            if (severity == AuditLog.Severity.CRITICAL || severity == AuditLog.Severity.ERROR) {
                log.warn("Security event logged: {} - {} - {}", action, resource, errorMessage);
            }
            
        } catch (Exception e) {
            log.error("Failed to log security event: {}", e.getMessage(), e);
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<AuditLog> getUserActivityLogs(Long userId, Pageable pageable) {
        return auditLogRepository.findByUserId(userId, pageable);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<AuditLog> getLogsByAction(String action, Pageable pageable) {
        return auditLogRepository.findByAction(action, pageable);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<AuditLog> getLogsByDateRange(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        return auditLogRepository.findByDateRange(startDate, endDate, pageable);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<AuditLog> getSecurityAlerts(Pageable pageable) {
        return auditLogRepository.findBySeverity(AuditLog.Severity.CRITICAL, pageable);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<AuditLog> getUserActivitySummary(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        return auditLogRepository.findUserActivityInDateRange(userId, startDate, endDate);
    }
    
    @Override
    public void cleanupOldLogs(int retentionDays) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(retentionDays);
        List<AuditLog> oldLogs = auditLogRepository.findByDateRange(
            LocalDateTime.of(2000, 1, 1, 0, 0), 
            cutoffDate, 
            Pageable.unpaged()
        ).getContent();
        
        auditLogRepository.deleteAll(oldLogs);
        log.info("Cleaned up {} old audit logs older than {} days", oldLogs.size(), retentionDays);
    }
    
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
}


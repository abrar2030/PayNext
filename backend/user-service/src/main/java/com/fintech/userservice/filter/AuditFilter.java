package com.fintech.userservice.filter;

import com.fintech.userservice.service.AuditService;
import com.fintech.userservice.util.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
@Slf4j
public class AuditFilter extends OncePerRequestFilter {

    @Autowired
    private AuditService auditService;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                  FilterChain filterChain) throws ServletException, IOException {

        // Skip audit for health check and static resources
        if (shouldSkipAudit(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        ContentCachingRequestWrapper requestWrapper = new ContentCachingRequestWrapper(request);
        ContentCachingResponseWrapper responseWrapper = new ContentCachingResponseWrapper(response);

        long startTime = System.currentTimeMillis();

        try {
            filterChain.doFilter(requestWrapper, responseWrapper);
        } finally {
            long executionTime = System.currentTimeMillis() - startTime;

            // Extract user ID from JWT token
            Long userId = extractUserIdFromRequest(requestWrapper);

            // Get request and response data
            String requestData = getRequestData(requestWrapper);
            String responseData = getResponseData(responseWrapper);

            // Log the audit entry
            auditService.logAction(
                userId,
                request.getMethod(),
                request.getRequestURI(),
                extractResourceId(request),
                request,
                requestData,
                responseData,
                response.getStatus(),
                executionTime
            );

            // Copy response body back to the original response
            responseWrapper.copyBodyToResponse();
        }
    }

    private boolean shouldSkipAudit(HttpServletRequest request) {
        String uri = request.getRequestURI();
        return uri.contains("/actuator") ||
               uri.contains("/health") ||
               uri.contains("/metrics") ||
               uri.contains("/static") ||
               uri.contains("/css") ||
               uri.contains("/js") ||
               uri.contains("/images");
    }

    private Long extractUserIdFromRequest(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                return jwtUtil.extractUserId(token);
            }
        } catch (Exception e) {
            log.debug("Could not extract user ID from request: {}", e.getMessage());
        }
        return null;
    }

    private String getRequestData(ContentCachingRequestWrapper request) {
        try {
            byte[] content = request.getContentAsByteArray();
            if (content.length > 0) {
                String requestBody = new String(content, StandardCharsets.UTF_8);
                // Mask sensitive data
                return maskSensitiveData(requestBody);
            }
        } catch (Exception e) {
            log.debug("Could not read request data: {}", e.getMessage());
        }
        return null;
    }

    private String getResponseData(ContentCachingResponseWrapper response) {
        try {
            byte[] content = response.getContentAsByteArray();
            if (content.length > 0) {
                String responseBody = new String(content, StandardCharsets.UTF_8);
                // Mask sensitive data
                return maskSensitiveData(responseBody);
            }
        } catch (Exception e) {
            log.debug("Could not read response data: {}", e.getMessage());
        }
        return null;
    }

    private String extractResourceId(HttpServletRequest request) {
        String uri = request.getRequestURI();
        String[] pathSegments = uri.split("/");

        // Try to extract ID from the last path segment
        if (pathSegments.length > 0) {
            String lastSegment = pathSegments[pathSegments.length - 1];
            if (lastSegment.matches("\\d+")) {
                return lastSegment;
            }
        }

        return null;
    }

    private String maskSensitiveData(String data) {
        if (data == null) return null;

        // Mask common sensitive fields
        return data.replaceAll("(\"password\"\\s*:\\s*\")([^\"]*)(\")", "$1***$3")
                  .replaceAll("(\"token\"\\s*:\\s*\")([^\"]*)(\")", "$1***$3")
                  .replaceAll("(\"otp\"\\s*:\\s*\")([^\"]*)(\")", "$1***$3")
                  .replaceAll("(\"ssn\"\\s*:\\s*\")([^\"]*)(\")", "$1***$3")
                  .replaceAll("(\"creditCard\"\\s*:\\s*\")([^\"]*)(\")", "$1***$3");
    }
}

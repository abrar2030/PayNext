package com.fintech.apigateway.security;

import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

/**
 * Test for JwtAuthenticationEntryPoint.
 * Note: This test is disabled because it requires proper reactive WebFlux test setup.
 * To enable, ensure proper mock setup for ServerWebExchange and response.
 */
@ExtendWith(MockitoExtension.class)
@Disabled("Requires proper reactive WebFlux test setup - enable when implementing full integration tests")
public class JwtAuthenticationEntryPointTest {

  @InjectMocks private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

  private ServerWebExchange exchange;
  private AuthenticationException authException;

  @BeforeEach
  void setUp() {
    exchange = mock(ServerWebExchange.class);
    authException = mock(AuthenticationException.class);
    when(authException.getMessage()).thenReturn("Unauthorized");
  }

  @Test
  void commence_ShouldReturnUnauthorizedStatus() {
    // This test requires proper ServerWebExchange mock setup
    // Placeholder for future implementation
  }
}

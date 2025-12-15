package com.fintech.apigateway.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import java.io.IOException;
import jakarta.servlet.ServletException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.AuthenticationException;

@ExtendWith(MockitoExtension.class)
public class JwtAuthenticationEntryPointTest {

  @InjectMocks private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

  private MockHttpServletRequest request;
  private MockHttpServletResponse response;
  private AuthenticationException authException;

  @BeforeEach
  void setUp() {
    request = new MockHttpServletRequest();
    response = new MockHttpServletResponse();
    authException = mock(AuthenticationException.class);
    when(authException.getMessage()).thenReturn("Unauthorized");
  }

  @Test
  void commence_ShouldReturnUnauthorizedStatus() throws IOException, ServletException {
    // When
    jwtAuthenticationEntryPoint.commence(request, response, authException);

    // Then
    assertEquals(HttpStatus.UNAUTHORIZED.value(), response.getStatus());
  }
}

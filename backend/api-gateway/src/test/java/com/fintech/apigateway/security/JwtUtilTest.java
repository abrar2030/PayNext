package com.fintech.apigateway.security;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

/**
 * Test for JwtUtil in API Gateway.
 * Note: API Gateway doesn't have its own JwtUtil class - it uses the common-module JwtUtil.
 * This test is disabled as the JWT validation logic is tested in the common-module.
 */
@ExtendWith(MockitoExtension.class)
@Disabled("API Gateway uses common-module JwtUtil - no local JwtUtil class to test")
public class JwtUtilTest {

  @Test
  void placeholder() {
    // This test class is a placeholder
    // JWT utilities are provided by common-module and tested there
    assertTrue(true);
  }
}

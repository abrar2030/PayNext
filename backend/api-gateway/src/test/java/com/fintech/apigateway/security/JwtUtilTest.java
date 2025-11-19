package com.fintech.apigateway.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class JwtUtilTest {

    @InjectMocks
    private JwtUtil jwtUtil;

    private String username;
    private String token;

    @BeforeEach
    void setUp() {
        // We need to set the secret key via reflection since it's likely private and final
        try {
            java.lang.reflect.Field secretField = JwtUtil.class.getDeclaredField("SECRET_KEY");
            secretField.setAccessible(true);
            secretField.set(jwtUtil, "test-secret-key-for-jwt-token-validation-in-unit-tests");
        } catch (Exception e) {
            // If this fails, the test will fail anyway
        }

        username = "testuser@example.com";
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", "USER");
        token = jwtUtil.generateToken(claims, username);
    }

    @Test
    void extractUsername_ShouldReturnCorrectUsername() {
        // When
        String extractedUsername = jwtUtil.extractUsername(token);

        // Then
        assertEquals(username, extractedUsername);
    }

    @Test
    void validateToken_WithValidToken_ShouldReturnTrue() {
        // When
        boolean isValid = jwtUtil.validateToken(token, username);

        // Then
        assertTrue(isValid);
    }

    @Test
    void validateToken_WithInvalidUsername_ShouldReturnFalse() {
        // When
        boolean isValid = jwtUtil.validateToken(token, "wronguser@example.com");

        // Then
        assertFalse(isValid);
    }

    @Test
    void validateToken_WithExpiredToken_ShouldReturnFalse() {
        // Given
        String expiredToken = createExpiredToken(username);

        // When
        boolean isValid = jwtUtil.validateToken(expiredToken, username);

        // Then
        assertFalse(isValid);
    }

    private String createExpiredToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis() - 2000))
                .setExpiration(new Date(System.currentTimeMillis() - 1000))
                .signWith(io.jsonwebtoken.SignatureAlgorithm.HS256, "test-secret-key-for-jwt-token-validation-in-unit-tests")
                .compact();
    }
}

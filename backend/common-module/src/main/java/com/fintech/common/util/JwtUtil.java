package com.fintech.common.util;

import io.jsonwebtoken.*;
import java.util.Date;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class JwtUtil {
  @Value("${jwt.secret}")
  private String secret;

  private final long expiration = 604800000L; // 7 days

  // Generate token using UserDetails
  public String generateToken(UserDetails userDetails) {
    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + expiration);

    return Jwts.builder()
        .setSubject(userDetails.getUsername())
        .claim(
            "role",
            userDetails.getAuthorities().stream()
                .findFirst()
                .map(Object::toString)
                .orElse("USER"))
        .setIssuedAt(now)
        .setExpiration(expiryDate)
        .signWith(SignatureAlgorithm.HS512, secret)
        .compact();
  }

  // Extract username from token
  public String getUsernameFromToken(String token) {
    try {
      Claims claims = Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
      return claims.getSubject();
    } catch (SignatureException ex) {
      log.error("Invalid JWT signature: {}", ex.getMessage());
    } catch (MalformedJwtException ex) {
      log.error("Invalid JWT token: {}", ex.getMessage());
    } catch (ExpiredJwtException ex) {
      log.error("Expired JWT token: {}", ex.getMessage());
    } catch (UnsupportedJwtException ex) {
      log.error("Unsupported JWT token: {}", ex.getMessage());
    } catch (IllegalArgumentException ex) {
      log.error("JWT claims string is empty: {}", ex.getMessage());
    }
    return null;
  }

  // Validate token against username
  public boolean validateToken(String token, String username) {
    try {
      String extractedUsername = getUsernameFromToken(token);
      return extractedUsername != null
          && extractedUsername.equals(username)
          && !isTokenExpired(token);
    } catch (Exception e) {
      log.error("Error validating token: {}", e.getMessage());
      return false;
    }
  }

  // Check if token is expired
  private boolean isTokenExpired(String token) {
    try {
      Claims claims = Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
      return claims.getExpiration().before(new Date());
    } catch (ExpiredJwtException ex) {
      return true;
    } catch (Exception ex) {
      log.error("Error checking token expiration: {}", ex.getMessage());
      return true;
    }
  }

  // Extract claims from token
  public Claims extractAllClaims(String token) {
    try {
      return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
    } catch (Exception e) {
      log.error("Error extracting claims from token: {}", e.getMessage());
      return null;
    }
  }
}

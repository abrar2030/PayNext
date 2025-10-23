package com.fintech.common.util;

import io.jsonwebtoken.*;
import java.util.Date;
import org.springframework.stereotype.Component;
import org.springframework.security.core.userdetails.UserDetails;

@Component
public class JwtUtil {
  private final String secret = "your_jwt_secret_key";
  private final long expiration = 604800000L; // 7 days

  // Updated to use UserDetails as a more generic contract
  public String generateToken(UserDetails userDetails) {
    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + expiration);

    return Jwts.builder()
        .setSubject(userDetails.getUsername()) // Use username (which is often the ID/email)
        .claim("role", userDetails.getAuthorities().stream().findFirst().map(Object::toString).orElse("USER")) // Assuming role is available
        .setIssuedAt(now)
        .setExpiration(expiryDate)
        .signWith(SignatureAlgorithm.HS512, secret)
        .compact();
  }

  public String getUsernameFromToken(String token) {
    Claims claims = Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();

    return claims.getSubject();
  }
}

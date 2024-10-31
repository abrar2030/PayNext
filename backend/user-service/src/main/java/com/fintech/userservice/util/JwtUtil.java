// user-service/src/main/java/com/fintech/userservice/util/JwtUtil.java
package com.fintech.userservice.util;

import com.fintech.userservice.model.User;
import io.jsonwebtoken.*;
import java.util.Date;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {
  private final String secret = "your_jwt_secret_key";
  private final long expiration = 604800000L; // 7 days

  public String generateToken(User user) {
    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + expiration);

    return Jwts.builder()
        .setSubject(Long.toString(user.getId()))
        .claim("role", user.getRole())
        .setIssuedAt(now)
        .setExpiration(expiryDate)
        .signWith(SignatureAlgorithm.HS512, secret)
        .compact();
  }

  public Long getUserIdFromToken(String token) {
    Claims claims = Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();

    return Long.parseLong(claims.getSubject());
  }
}

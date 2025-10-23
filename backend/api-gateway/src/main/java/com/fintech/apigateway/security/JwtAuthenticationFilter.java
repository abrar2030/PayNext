package com.fintech.apigateway.security;

import com.fintech.common.util.JwtUtil;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.util.ArrayList;

@Component
public class JwtAuthenticationFilter implements WebFilter {

  @Autowired
  private com.fintech.common.util.JwtUtil jwtUtil;

  @Override
  public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
    ServerHttpRequest request = exchange.getRequest();
    
    // Skip filter for specific paths
    String path = request.getPath().value();
    if (path.contains("/login") || path.contains("/register") || path.contains("/actuator")) {
      return chain.filter(exchange);
    }
    
    // Check for Authorization header
    if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
      return chain.filter(exchange);
    }
    
    String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      return chain.filter(exchange);
    }
    
    String token = authHeader.substring(7);
    
    try {
      // Extract username and set authentication
      String username = jwtUtil.getUsernameFromToken(token);
      UsernamePasswordAuthenticationToken authentication = 
          new UsernamePasswordAuthenticationToken(username, null, new ArrayList<>());
      
      return chain.filter(exchange)
          .contextWrite(ReactiveSecurityContextHolder.withAuthentication(authentication));
      
    } catch (SignatureException | MalformedJwtException | ExpiredJwtException | 
             UnsupportedJwtException | IllegalArgumentException e) {
      exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
      return exchange.getResponse().setComplete();
    }
  }
}

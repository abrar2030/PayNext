package com.fintech.userservice.controller;

import com.fintech.userservice.model.User;
import com.fintech.userservice.service.UserService;
import com.fintech.userservice.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {
  private UserService userService;
  private AuthenticationManager authenticationManager;
  private JwtUtil jwtUtil;

  @Autowired
  public UserController(
      UserService userService, AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
    this.userService = userService;
    this.authenticationManager = authenticationManager;
    this.jwtUtil = jwtUtil;
  }

  @PostMapping("/register")
  public ResponseEntity<?> registerUser(@RequestBody User user) {
    if (userService.findByUsername(user.getUsername()) != null) {
      return ResponseEntity.badRequest().body("Username is already taken");
    }
    User savedUser = userService.saveUser(user);
    return ResponseEntity.ok(savedUser);
  }

  @PostMapping("/login")
  public ResponseEntity<?> authenticateUser(@RequestBody User loginRequest) {
    try {
      Authentication authentication =
          authenticationManager.authenticate(
              new UsernamePasswordAuthenticationToken(
                  loginRequest.getUsername(), loginRequest.getPassword()));
      SecurityContextHolder.getContext().setAuthentication(authentication);
      User user = userService.findByUsername(loginRequest.getUsername());
      String jwt = jwtUtil.generateToken(user);
      return ResponseEntity.ok(new AuthResponse(jwt));
    } catch (BadCredentialsException e) {
      return ResponseEntity.status(401).body("Invalid credentials");
    }
  }

  // Additional endpoints for profile management
}

// AuthResponse class
class AuthResponse {
  private String token;

  public AuthResponse(String token) {
    this.token = token;
  }

  // Getter and setter
}

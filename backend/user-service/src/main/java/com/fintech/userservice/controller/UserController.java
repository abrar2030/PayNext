package com.fintech.userservice.controller;

import com.fintech.common.util.JwtUtil;
import com.fintech.common.util.PasswordValidator;
import com.fintech.userservice.model.User;
import com.fintech.userservice.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@Slf4j
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
    try {
      PasswordValidator.validate(user.getPassword());
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }

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
      String jwt = jwtUtil.generateToken((UserDetails) authentication.getPrincipal());
      return ResponseEntity.ok(new AuthResponse(jwt));
    } catch (BadCredentialsException e) {
      log.warn("Authentication failed for user: {}", loginRequest.getUsername());
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    } catch (Exception e) {
      log.error(
          "An unexpected error occurred during login for user: {}", loginRequest.getUsername(), e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("An unexpected error occurred");
    }
  }

  // Additional endpoints for profile management
}

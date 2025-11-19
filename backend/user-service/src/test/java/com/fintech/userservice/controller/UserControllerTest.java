package com.fintech.userservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fintech.userservice.model.User;
import com.fintech.userservice.service.UserService;
import com.fintech.userservice.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private AuthenticationManager authenticationManager; // Mocked as it's often used in controllers

    @MockBean
    private JwtUtil jwtUtil; // Mocked as it's often used in controllers

    @MockBean
    private UserDetailsService userDetailsService; // Often required by SecurityConfig

    @Autowired
    private ObjectMapper objectMapper;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("password"); // Usually hashed in reality
    }

    @Test
    void registerUser_shouldReturnCreatedUser() throws Exception {
        when(userService.registerUser(any(User.class))).thenReturn(testUser);

        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testUser)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username").value(testUser.getUsername()))
                .andExpect(jsonPath("$.email").value(testUser.getEmail()));
    }

    @Test
    void getUserProfile_whenUserExists_shouldReturnUserProfile() throws Exception {
        // Assuming the controller gets the username from the authenticated principal
        // For testing, we might need to simulate authentication or pass the username
        // Here, we simplify by assuming a path variable or request param for ID/username
        // Or mock the principal extraction logic if applicable

        when(userService.findByUsername(anyString())).thenReturn(Optional.of(testUser));
        // Mock authentication if needed for the endpoint
        // SecurityContextHolder.getContext().setAuthentication(...);

        // Adjust the endpoint path as per actual implementation (e.g., /api/users/profile or /api/users/{username})
        mockMvc.perform(get("/api/users/profile") // Assuming /profile gets the authenticated user
                // .with(user("testuser")) // Example using Spring Security Test
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value(testUser.getUsername()))
                .andExpect(jsonPath("$.email").value(testUser.getEmail()));
    }

    @Test
    void getUserProfile_whenUserDoesNotExist_shouldReturnNotFound() throws Exception {
        when(userService.findByUsername(anyString())).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/users/profile") // Assuming /profile gets the authenticated user
                // .with(user("nonexistentuser")) // Example
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound()); // Adjust expected status based on implementation
    }

    // Add tests for login/authenticate endpoint if it exists in this controller
    // Add tests for update profile endpoint

}

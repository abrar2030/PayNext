package com.fintech.userservice.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import com.fintech.userservice.model.User;
import com.fintech.userservice.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

  @Mock private UserRepository userRepository;

  @Mock private PasswordEncoder passwordEncoder;

  @InjectMocks private UserServiceImpl userService;

  private User testUser;

  @BeforeEach
  void setUp() {
    testUser = new User();
    testUser.setUsername("testuser");
    testUser.setEmail("test@example.com");
    testUser.setPassword("plainPassword");
  }

  @Test
  void saveUser_shouldEncodePasswordAndSaveUser() {
    String encodedPassword = "encodedPassword";
    when(passwordEncoder.encode(anyString())).thenReturn(encodedPassword);
    when(userRepository.save(any(User.class)))
        .thenAnswer(
            invocation -> {
              User savedUser = invocation.getArgument(0);
              savedUser.setId(1L); // Simulate saving with ID
              return savedUser;
            });

    User savedUser = userService.saveUser(testUser);

    assertNotNull(savedUser);
    assertEquals(testUser.getUsername(), savedUser.getUsername());
    assertEquals(encodedPassword, savedUser.getPassword());
    verify(passwordEncoder, times(1)).encode("plainPassword");
    verify(userRepository, times(1)).save(testUser);
  }

  @Test
  void saveUser_withNullPassword_shouldNotEncodePassword() {
    testUser.setPassword(null);
    when(userRepository.save(any(User.class))).thenReturn(testUser);

    User savedUser = userService.saveUser(testUser);

    assertNotNull(savedUser);
    verify(passwordEncoder, never()).encode(anyString());
    verify(userRepository, times(1)).save(testUser);
  }

  @Test
  void findByUsername_shouldReturnUser() {
    when(userRepository.findByUsername(testUser.getUsername())).thenReturn(testUser);

    User foundUser = userService.findByUsername(testUser.getUsername());

    assertNotNull(foundUser);
    assertEquals(testUser.getUsername(), foundUser.getUsername());
    verify(userRepository, times(1)).findByUsername(testUser.getUsername());
  }

  @Test
  void findByUsername_whenUserDoesNotExist_shouldReturnNull() {
    when(userRepository.findByUsername(anyString())).thenReturn(null);

    User foundUser = userService.findByUsername("nonexistentuser");

    assertNull(foundUser);
    verify(userRepository, times(1)).findByUsername("nonexistentuser");
  }
}

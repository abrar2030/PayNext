package com.fintech.userservice.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import com.fintech.userservice.model.User;
import com.fintech.userservice.repository.UserRepository;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Unit tests for UserServiceImpl - pure Mockito, no Spring context.
 */
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
    testUser.setPassword("Password1@");
    testUser.setRole("ROLE_USER");
  }

  // ── saveUser ───────────────────────────────────────────────────────────────

  @Test
  void saveUser_shouldEncodePasswordAndSave() {
    when(userRepository.existsByEmail(anyString())).thenReturn(false);
    when(passwordEncoder.encode("Password1@")).thenReturn("encodedPassword");
    when(userRepository.save(any(User.class))).thenAnswer(inv -> {
      User u = inv.getArgument(0);
      u.setId(1L);
      return u;
    });

    User saved = userService.saveUser(testUser);

    assertNotNull(saved);
    assertEquals(1L, saved.getId());
    assertEquals("encodedPassword", saved.getPassword());
    assertEquals("ROLE_USER", saved.getRole());
    verify(passwordEncoder).encode("Password1@");
    verify(userRepository).save(testUser);
  }

  @Test
  void saveUser_withNullPassword_shouldThrowIllegalArgumentException() {
    testUser.setPassword(null);

    IllegalArgumentException ex =
        assertThrows(IllegalArgumentException.class, () -> userService.saveUser(testUser));
    assertEquals("Password must not be empty", ex.getMessage());
    verify(userRepository, never()).save(any());
  }

  @Test
  void saveUser_withBlankPassword_shouldThrowIllegalArgumentException() {
    testUser.setPassword("   ");

    IllegalArgumentException ex =
        assertThrows(IllegalArgumentException.class, () -> userService.saveUser(testUser));
    assertEquals("Password must not be empty", ex.getMessage());
    verify(userRepository, never()).save(any());
  }

  @Test
  void saveUser_withDuplicateEmail_shouldThrowIllegalArgumentException() {
    when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

    IllegalArgumentException ex =
        assertThrows(IllegalArgumentException.class, () -> userService.saveUser(testUser));
    assertEquals("Email address is already in use", ex.getMessage());
    verify(userRepository, never()).save(any());
  }

  @Test
  void saveUser_withNullRole_shouldDefaultToRoleUser() {
    testUser.setRole(null);
    when(userRepository.existsByEmail(anyString())).thenReturn(false);
    when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
    when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

    User saved = userService.saveUser(testUser);

    assertEquals("ROLE_USER", saved.getRole());
  }

  @Test
  void saveUser_withBlankRole_shouldDefaultToRoleUser() {
    testUser.setRole("  ");
    when(userRepository.existsByEmail(anyString())).thenReturn(false);
    when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
    when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

    User saved = userService.saveUser(testUser);

    assertEquals("ROLE_USER", saved.getRole());
  }

  // ── findByUsername ─────────────────────────────────────────────────────────

  @Test
  void findByUsername_whenUserExists_shouldReturnUser() {
    when(userRepository.findByUsername("testuser")).thenReturn(testUser);

    User found = userService.findByUsername("testuser");

    assertNotNull(found);
    assertEquals("testuser", found.getUsername());
    verify(userRepository).findByUsername("testuser");
  }

  @Test
  void findByUsername_whenUserNotFound_shouldReturnNull() {
    when(userRepository.findByUsername("ghost")).thenReturn(null);

    assertNull(userService.findByUsername("ghost"));
    verify(userRepository).findByUsername("ghost");
  }

  // ── findByEmail ────────────────────────────────────────────────────────────

  @Test
  void findByEmail_whenUserExists_shouldReturnUser() {
    when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

    User found = userService.findByEmail("test@example.com");

    assertNotNull(found);
    assertEquals("test@example.com", found.getEmail());
    verify(userRepository).findByEmail("test@example.com");
  }

  @Test
  void findByEmail_whenUserNotFound_shouldReturnNull() {
    when(userRepository.findByEmail("nobody@example.com")).thenReturn(Optional.empty());

    assertNull(userService.findByEmail("nobody@example.com"));
  }

  // ── findById ───────────────────────────────────────────────────────────────

  @Test
  void findById_whenUserExists_shouldReturnUser() {
    testUser.setId(1L);
    when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

    User found = userService.findById(1L);

    assertNotNull(found);
    assertEquals(1L, found.getId());
    verify(userRepository).findById(1L);
  }

  @Test
  void findById_whenUserNotFound_shouldReturnNull() {
    when(userRepository.findById(999L)).thenReturn(Optional.empty());

    assertNull(userService.findById(999L));
    verify(userRepository).findById(999L);
  }
}

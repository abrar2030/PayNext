package com.fintech.userservice.service;

import com.fintech.userservice.model.User;
import com.fintech.userservice.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("plainPassword");
    }

    @Test
    void registerUser_whenUsernameIsUnique_shouldSaveUserWithEncodedPassword() {
        String encodedPassword = "encodedPassword";
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn(encodedPassword);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User savedUser = invocation.getArgument(0);
            savedUser.setId(1L); // Simulate saving with ID
            return savedUser;
        });

        User registeredUser = userService.registerUser(testUser);

        assertNotNull(registeredUser);
        assertEquals(testUser.getUsername(), registeredUser.getUsername());
        assertEquals(encodedPassword, registeredUser.getPassword());
        verify(passwordEncoder, times(1)).encode("plainPassword");
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void registerUser_whenUsernameExists_shouldThrowException() {
        when(userRepository.findByUsername(testUser.getUsername())).thenReturn(Optional.of(testUser));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.registerUser(testUser);
        });

        assertEquals("Username already exists", exception.getMessage());
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void findByUsername_whenUserExists_shouldReturnUser() {
        when(userRepository.findByUsername(testUser.getUsername())).thenReturn(Optional.of(testUser));

        Optional<User> foundUser = userService.findByUsername(testUser.getUsername());

        assertTrue(foundUser.isPresent());
        assertEquals(testUser.getUsername(), foundUser.get().getUsername());
        verify(userRepository, times(1)).findByUsername(testUser.getUsername());
    }

    @Test
    void findByUsername_whenUserDoesNotExist_shouldReturnEmptyOptional() {
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.empty());

        Optional<User> foundUser = userService.findByUsername("nonexistentuser");

        assertFalse(foundUser.isPresent());
        verify(userRepository, times(1)).findByUsername("nonexistentuser");
    }

    // Add tests for other methods in UserServiceImpl if they exist
}


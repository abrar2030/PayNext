package com.fintech.paymentservice.client;

import com.fintech.paymentservice.dto.UserDTO;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service", fallback = UserClient.UserClientFallback.class)
public interface UserClient {

    @GetMapping("/api/users/{id}")
    @CircuitBreaker(name = "userService", fallbackMethod = "getUserByIdFallback")
    UserDTO getUserById(@PathVariable("id") Long id);

    default UserDTO getUserByIdFallback(Long id, Exception e) {
        // Fallback implementation when user service is down
        System.out.println("Fallback: Unable to get user with ID: " + id);
        return new UserDTO(id, "Unknown", "User", "unknown@example.com");
    }

    @Component
    class UserClientFallback implements UserClient {
        private static final Logger logger = LoggerFactory.getLogger(UserClientFallback.class);

        @Override
        public UserDTO getUserById(Long id) {
            logger.warn("User service is down. Using fallback for user ID: {}", id);
            return new UserDTO(id, "Unknown", "User", "unknown@example.com");
        }
    }
}

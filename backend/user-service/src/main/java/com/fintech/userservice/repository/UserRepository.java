// user-service/src/main/java/com/fintech/userservice/repository/UserRepository.java
package com.fintech.userservice.repository;

import com.fintech.userservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}

// user-service/src/main/java/com/fintech/userservice/service/UserService.java
package com.fintech.userservice.service;

import com.fintech.userservice.model.User;

public interface UserService {
    User saveUser(User user);
    User findByUsername(String username);
}

package com.fintech.userservice.service;

import com.fintech.userservice.model.User;

public interface UserService {
  User saveUser(User user);

  User findByUsername(String username);
}

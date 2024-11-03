package com.fintech.userservice.service;

import com.fintech.userservice.model.User;
import java.util.Collection;
import java.util.Collections;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails; // Correct import

public class UserPrincipal implements UserDetails {
  private Long id;
  private String username;
  private String password;
  private Collection<? extends GrantedAuthority> authorities;

  public UserPrincipal(
      Long id,
      String username,
      String password,
      Collection<? extends GrantedAuthority> authorities) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.authorities = authorities;
  }

  public static UserPrincipal create(User user) {
    // Assuming the user role is stored as a string in the 'role' field
    Collection<GrantedAuthority> authorities =
        Collections.singletonList(new SimpleGrantedAuthority(user.getRole()));

    return new UserPrincipal(user.getId(), user.getUsername(), user.getPassword(), authorities);
  }

  // Getters for id, username, and password
  public Long getId() {
    return id;
  }

  @Override
  public String getUsername() {
    return username;
  }

  @Override
  public String getPassword() {
    return password;
  }

  // Implement methods from UserDetails interface
  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return authorities;
  }

  // Account status methods can return true or be customized based on user status
  @Override
  public boolean isAccountNonExpired() {
    return true; // Customize as needed
  }

  @Override
  public boolean isAccountNonLocked() {
    return true; // Customize as needed
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true; // Customize as needed
  }

  @Override
  public boolean isEnabled() {
    return true; // Customize as needed
  }
}

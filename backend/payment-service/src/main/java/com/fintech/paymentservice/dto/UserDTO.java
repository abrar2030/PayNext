package com.fintech.paymentservice.dto;

public class UserDTO {
  private Long id;
  private String username;
  private String email;

  // Add other fields as needed

  // Default constructor
  public UserDTO() {}

  // Parameterized constructor
  public UserDTO(Long id, String username, String email) {
    this.id = id;
    this.username = username;
    this.email = email;
  }

  // Getters and Setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }
}

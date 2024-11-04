package com.fintech.paymentservice.dto;

public class UserDTO {
  private Long userId;
  private String userName;
  private String email;

  // Constructors
  public UserDTO() {
  }

  public UserDTO(Long userId, String userName, String email) {
    this.userId = userId;
    this.userName = userName;
    this.email = email;
  }

  // Getters and Setters
  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }

  public String getUserName() {
    return userName;
  }

  public void setUserName(String userName) {
    this.userName = userName;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  @Override
  public String toString() {
    return "UserDTO{" +
            "userId=" + userId +
            ", userName='" + userName + '\'' +
            ", email='" + email + '\'' +
            '}';
  }
}

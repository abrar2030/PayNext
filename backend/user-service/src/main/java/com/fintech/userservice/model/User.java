package com.fintech.userservice.model;

import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String username;
  private String
      password; // Note: Lombok's @Data will generate a setter, which is fine for JPA, but be
                // careful when setting it directly.
  private String email;
  private String role;
}

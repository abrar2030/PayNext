package com.fintech.userservice.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import javax.persistence.*;
import javax.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "user_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name must not exceed 50 characters")
    @Column(name = "first_name", nullable = false)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name must not exceed 50 characters")
    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Email(message = "Invalid email format")
    @Column(name = "email", unique = true)
    private String email;

    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Invalid phone number format")
    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "date_of_birth")
    private LocalDateTime dateOfBirth;

    @Size(max = 200, message = "Address must not exceed 200 characters")
    @Column(name = "address")
    private String address;

    @Size(max = 50, message = "City must not exceed 50 characters")
    @Column(name = "city")
    private String city;

    @Size(max = 20, message = "Postal code must not exceed 20 characters")
    @Column(name = "postal_code")
    private String postalCode;

    @Size(max = 50, message = "Country must not exceed 50 characters")
    @Column(name = "country")
    private String country;

    @Enumerated(EnumType.STRING)
    @Column(name = "kyc_status")
    private KYCStatus kycStatus = KYCStatus.PENDING;

    @Column(name = "kyc_verified_at")
    private LocalDateTime kycVerifiedAt;

    @Column(name = "risk_score")
    private Double riskScore = 0.0;

    @ElementCollection(targetClass = String.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "user_documents", joinColumns = @JoinColumn(name = "user_profile_id"))
    @Column(name = "document_url")
    private Set<String> documentUrls;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum KYCStatus {
        PENDING, VERIFIED, REJECTED, UNDER_REVIEW
    }
}

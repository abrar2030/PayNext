package com.fintech.userservice.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "otp_verifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OTPVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "otp_code", nullable = false)
    private String otpCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "otp_type", nullable = false)
    private OTPType otpType;

    @Column(name = "contact_info", nullable = false)
    private String contactInfo; // email or phone number

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "is_used", nullable = false)
    private Boolean isUsed = false;

    @Column(name = "attempts", nullable = false)
    private Integer attempts = 0;

    @Column(name = "max_attempts", nullable = false)
    private Integer maxAttempts = 3;

    public enum OTPType {
        EMAIL, SMS, LOGIN, TRANSACTION, PASSWORD_RESET
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }

    public boolean isValid() {
        return !isUsed && !isExpired() && attempts < maxAttempts;
    }
}

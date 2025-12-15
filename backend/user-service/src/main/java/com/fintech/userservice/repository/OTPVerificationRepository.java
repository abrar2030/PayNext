package com.fintech.userservice.repository;

import com.fintech.userservice.model.OTPVerification;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OTPVerificationRepository extends JpaRepository<OTPVerification, Long> {

  Optional<OTPVerification> findByUserIdAndOtpTypeAndIsUsedFalse(
      Long userId, OTPVerification.OTPType otpType);

  List<OTPVerification> findByExpiresAtBefore(LocalDateTime dateTime);

  @Query(
      "SELECT o FROM OTPVerification o WHERE o.userId = :userId AND o.otpType = :otpType AND"
          + " o.isUsed = false AND o.expiresAt > :now")
  Optional<OTPVerification> findValidOTP(
      @Param("userId") Long userId,
      @Param("otpType") OTPVerification.OTPType otpType,
      @Param("now") LocalDateTime now);

  @Query(
      "SELECT COUNT(o) FROM OTPVerification o WHERE o.contactInfo = :contactInfo AND o.createdAt >"
          + " :since")
  Long countOTPsSentToContact(
      @Param("contactInfo") String contactInfo, @Param("since") LocalDateTime since);
}

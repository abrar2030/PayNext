package com.fintech.userservice.service;

import com.fintech.userservice.model.OTPVerification;
import com.fintech.userservice.repository.OTPVerificationRepository;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@Transactional
public class OTPServiceImpl implements OTPService {

  @Autowired private OTPVerificationRepository otpRepository;

  @Autowired private JavaMailSender mailSender;

  @Value("${twilio.account.sid}")
  private String twilioAccountSid;

  @Value("${twilio.auth.token}")
  private String twilioAuthToken;

  @Value("${twilio.phone.number}")
  private String twilioPhoneNumber;

  @Value("${spring.mail.from}")
  private String fromEmail;

  private static final int OTP_LENGTH = 6;
  private static final int OTP_EXPIRY_MINUTES = 10;
  private static final SecureRandom random = new SecureRandom();

  @Override
  public OTPVerification generateEmailOTP(Long userId, String email, OTPVerification.OTPType type) {
    String otpCode = generateOTPCode();

    // Invalidate existing OTPs for this user and type
    invalidateExistingOTPs(userId, type);

    OTPVerification otp = new OTPVerification();
    otp.setUserId(userId);
    otp.setOtpCode(otpCode);
    otp.setOtpType(type);
    otp.setContactInfo(email);
    otp.setExpiresAt(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));

    otp = otpRepository.save(otp);

    sendEmailOTP(email, otpCode, type);

    log.info("Email OTP generated for user {} with type {}", userId, type);
    return otp;
  }

  @Override
  public OTPVerification generateSMSOTP(
      Long userId, String phoneNumber, OTPVerification.OTPType type) {
    String otpCode = generateOTPCode();

    // Invalidate existing OTPs for this user and type
    invalidateExistingOTPs(userId, type);

    OTPVerification otp = new OTPVerification();
    otp.setUserId(userId);
    otp.setOtpCode(otpCode);
    otp.setOtpType(type);
    otp.setContactInfo(phoneNumber);
    otp.setExpiresAt(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));

    otp = otpRepository.save(otp);

    sendSMSOTP(phoneNumber, otpCode, type);

    log.info("SMS OTP generated for user {} with type {}", userId, type);
    return otp;
  }

  @Override
  public boolean verifyOTP(Long userId, String otpCode, OTPVerification.OTPType type) {
    Optional<OTPVerification> otpOpt =
        otpRepository.findByUserIdAndOtpTypeAndIsUsedFalse(userId, type);

    if (otpOpt.isEmpty()) {
      log.warn("No valid OTP found for user {} with type {}", userId, type);
      return false;
    }

    OTPVerification otp = otpOpt.get();
    otp.setAttempts(otp.getAttempts() + 1);

    if (!otp.isValid()) {
      log.warn("Invalid OTP attempt for user {} with type {}", userId, type);
      otpRepository.save(otp);
      return false;
    }

    if (!otp.getOtpCode().equals(otpCode)) {
      log.warn("Incorrect OTP code for user {} with type {}", userId, type);
      otpRepository.save(otp);
      return false;
    }

    otp.setIsUsed(true);
    otp.setVerifiedAt(LocalDateTime.now());
    otpRepository.save(otp);

    log.info("OTP verified successfully for user {} with type {}", userId, type);
    return true;
  }

  @Override
  public OTPVerification resendOTP(Long userId, OTPVerification.OTPType type) {
    Optional<OTPVerification> existingOtp =
        otpRepository.findByUserIdAndOtpTypeAndIsUsedFalse(userId, type);

    if (existingOtp.isPresent()) {
      OTPVerification otp = existingOtp.get();
      String contactInfo = otp.getContactInfo();

      if (contactInfo.contains("@")) {
        return generateEmailOTP(userId, contactInfo, type);
      } else {
        return generateSMSOTP(userId, contactInfo, type);
      }
    }

    throw new RuntimeException("No existing OTP found to resend");
  }

  @Override
  public void cleanupExpiredOTPs() {
    List<OTPVerification> expiredOTPs = otpRepository.findByExpiresAtBefore(LocalDateTime.now());
    otpRepository.deleteAll(expiredOTPs);
    log.info("Cleaned up {} expired OTPs", expiredOTPs.size());
  }

  private String generateOTPCode() {
    StringBuilder otp = new StringBuilder();
    for (int i = 0; i < OTP_LENGTH; i++) {
      otp.append(random.nextInt(10));
    }
    return otp.toString();
  }

  private void invalidateExistingOTPs(Long userId, OTPVerification.OTPType type) {
    Optional<OTPVerification> existingOTP =
        otpRepository.findByUserIdAndOtpTypeAndIsUsedFalse(userId, type);
    existingOTP.ifPresent(otp -> {
      otp.setIsUsed(true);
      otpRepository.save(otp);
    });
  }

  private void sendEmailOTP(String email, String otpCode, OTPVerification.OTPType type) {
    try {
      SimpleMailMessage message = new SimpleMailMessage();
      message.setFrom(fromEmail);
      message.setTo(email);
      message.setSubject("PayNext - Your OTP Code");
      message.setText(
          String.format(
              "Your OTP code for %s is: %s\\n"
                  + "\\n"
                  + "This code will expire in %d minutes.\\n"
                  + "\\n"
                  + "If you didn't request this code, please ignore this email.",
              type.toString().toLowerCase(), otpCode, OTP_EXPIRY_MINUTES));

      mailSender.send(message);
      log.info("Email OTP sent to {}", email);
    } catch (Exception e) {
      log.error("Failed to send email OTP to {}: {}", email, e.getMessage());
      throw new RuntimeException("Failed to send email OTP", e);
    }
  }

  private void sendSMSOTP(String phoneNumber, String otpCode, OTPVerification.OTPType type) {
    try {
      Twilio.init(twilioAccountSid, twilioAuthToken);

      String messageBody =
          String.format(
              "Your PayNext OTP code for %s is: %s. Valid for %d minutes.",
              type.toString().toLowerCase(), otpCode, OTP_EXPIRY_MINUTES);

      Message message =
          Message.creator(
                  new PhoneNumber(phoneNumber), new PhoneNumber(twilioPhoneNumber), messageBody)
              .create();

      log.info("SMS OTP sent to {} with SID: {}", phoneNumber, message.getSid());
    } catch (Exception e) {
      log.error("Failed to send SMS OTP to {}: {}", phoneNumber, e.getMessage());
      throw new RuntimeException("Failed to send SMS OTP", e);
    }
  }
}

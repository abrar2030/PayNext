package com.fintech.userservice.service;

import com.fintech.userservice.model.OTPVerification;

public interface OTPService {

    /**
     * Generate and send OTP via email
     */
    OTPVerification generateEmailOTP(Long userId, String email, OTPVerification.OTPType type);

    /**
     * Generate and send OTP via SMS
     */
    OTPVerification generateSMSOTP(Long userId, String phoneNumber, OTPVerification.OTPType type);

    /**
     * Verify OTP code
     */
    boolean verifyOTP(Long userId, String otpCode, OTPVerification.OTPType type);

    /**
     * Resend OTP
     */
    OTPVerification resendOTP(Long userId, OTPVerification.OTPType type);

    /**
     * Clean up expired OTPs
     */
    void cleanupExpiredOTPs();
}

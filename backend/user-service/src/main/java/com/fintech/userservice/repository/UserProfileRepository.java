package com.fintech.userservice.repository;

import com.fintech.userservice.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    
    Optional<UserProfile> findByUserId(Long userId);
    
    Optional<UserProfile> findByEmail(String email);
    
    Optional<UserProfile> findByPhoneNumber(String phoneNumber);
    
    List<UserProfile> findByKycStatus(UserProfile.KYCStatus kycStatus);
    
    @Query("SELECT up FROM UserProfile up WHERE up.riskScore > :threshold")
    List<UserProfile> findHighRiskProfiles(@Param("threshold") Double threshold);
    
    @Query("SELECT COUNT(up) FROM UserProfile up WHERE up.kycStatus = :status")
    Long countByKycStatus(@Param("status") UserProfile.KYCStatus status);
    
    boolean existsByEmail(String email);
    
    boolean existsByPhoneNumber(String phoneNumber);
}


package com.fintech.aifraudservice.repository;

import com.fintech.aifraudservice.model.UserBehaviorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserBehaviorProfileRepository extends JpaRepository<UserBehaviorProfile, Long> {
    
    Optional<UserBehaviorProfile> findByUserId(Long userId);
    
    @Query("SELECT ubp FROM UserBehaviorProfile ubp WHERE ubp.baseRiskScore > :threshold")
    List<UserBehaviorProfile> findHighRiskUsers(@Param("threshold") Double threshold);
    
    @Query("SELECT ubp FROM UserBehaviorProfile ubp WHERE ubp.lastAnalysisDate < :cutoffDate OR ubp.lastAnalysisDate IS NULL")
    List<UserBehaviorProfile> findProfilesNeedingUpdate(@Param("cutoffDate") LocalDateTime cutoffDate);
    
    @Query("SELECT COUNT(ubp) FROM UserBehaviorProfile ubp WHERE ubp.fraudIncidents > 0")
    Long countUsersWithFraudHistory();
    
    @Query("SELECT AVG(ubp.baseRiskScore) FROM UserBehaviorProfile ubp")
    Double getAverageRiskScore();
    
    @Query("SELECT ubp FROM UserBehaviorProfile ubp WHERE ubp.totalTransactions < :minTransactions")
    List<UserBehaviorProfile> findNewUsers(@Param("minTransactions") Long minTransactions);
    
    @Query("SELECT ubp FROM UserBehaviorProfile ubp WHERE ubp.fraudIncidents > :threshold ORDER BY ubp.fraudIncidents DESC")
    List<UserBehaviorProfile> findUsersWithHighFraudIncidents(@Param("threshold") Integer threshold);
}


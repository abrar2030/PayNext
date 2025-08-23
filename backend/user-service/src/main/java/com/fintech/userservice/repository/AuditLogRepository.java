package com.fintech.userservice.repository;

import com.fintech.userservice.model.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    
    Page<AuditLog> findByUserId(Long userId, Pageable pageable);
    
    Page<AuditLog> findByAction(String action, Pageable pageable);
    
    Page<AuditLog> findByResource(String resource, Pageable pageable);
    
    Page<AuditLog> findBySeverity(AuditLog.Severity severity, Pageable pageable);
    
    @Query("SELECT al FROM AuditLog al WHERE al.createdAt BETWEEN :startDate AND :endDate")
    Page<AuditLog> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                  @Param("endDate") LocalDateTime endDate, 
                                  Pageable pageable);
    
    @Query("SELECT al FROM AuditLog al WHERE al.userId = :userId AND al.createdAt BETWEEN :startDate AND :endDate")
    List<AuditLog> findUserActivityInDateRange(@Param("userId") Long userId, 
                                              @Param("startDate") LocalDateTime startDate, 
                                              @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(al) FROM AuditLog al WHERE al.action = :action AND al.createdAt > :since")
    Long countActionsSince(@Param("action") String action, @Param("since") LocalDateTime since);
    
    @Query("SELECT al.ipAddress, COUNT(al) as count FROM AuditLog al WHERE al.createdAt > :since GROUP BY al.ipAddress ORDER BY count DESC")
    List<Object[]> findTopIPAddresses(@Param("since") LocalDateTime since);
}


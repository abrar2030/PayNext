package com.fintech.aifraudservice.repository;

import com.fintech.aifraudservice.model.TransactionAnalysis;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionAnalysisRepository extends JpaRepository<TransactionAnalysis, Long> {

    Optional<TransactionAnalysis> findByTransactionId(String transactionId);

    Page<TransactionAnalysis> findByUserId(Long userId, Pageable pageable);

    Page<TransactionAnalysis> findByRiskLevel(TransactionAnalysis.RiskLevel riskLevel, Pageable pageable);

    Page<TransactionAnalysis> findByFraudStatus(TransactionAnalysis.FraudStatus fraudStatus, Pageable pageable);

    @Query("SELECT ta FROM TransactionAnalysis ta WHERE ta.userId = :userId AND ta.createdAt >= :since")
    List<TransactionAnalysis> findUserTransactionsSince(@Param("userId") Long userId, @Param("since") LocalDateTime since);

    @Query("SELECT COUNT(ta) FROM TransactionAnalysis ta WHERE ta.userId = :userId AND ta.createdAt >= :since")
    Long countUserTransactionsSince(@Param("userId") Long userId, @Param("since") LocalDateTime since);

    @Query("SELECT COALESCE(SUM(ta.amount), 0) FROM TransactionAnalysis ta WHERE ta.userId = :userId AND ta.createdAt >= :since")
    BigDecimal sumUserTransactionAmountSince(@Param("userId") Long userId, @Param("since") LocalDateTime since);

    @Query("SELECT COUNT(ta) FROM TransactionAnalysis ta WHERE ta.createdAt >= :since")
    Long countTransactionsSince(@Param("since") LocalDateTime since);

    @Query("SELECT COUNT(ta) FROM TransactionAnalysis ta WHERE ta.fraudStatus = 'DECLINED' AND ta.createdAt >= :since")
    Long countFraudTransactionsSince(@Param("since") LocalDateTime since);

    @Query("SELECT COUNT(ta) FROM TransactionAnalysis ta WHERE ta.riskLevel IN ('HIGH', 'CRITICAL') AND ta.createdAt >= :since")
    Long countHighRiskTransactionsSince(@Param("since") LocalDateTime since);

    @Query("SELECT ta FROM TransactionAnalysis ta WHERE ta.riskLevel IN ('HIGH', 'CRITICAL') AND ta.fraudStatus = 'UNDER_REVIEW' ORDER BY ta.riskScore DESC")
    List<TransactionAnalysis> findHighRiskTransactions(@Param("limit") int limit);

    @Query("SELECT ta FROM TransactionAnalysis ta WHERE ta.createdAt BETWEEN :startDate AND :endDate")
    Page<TransactionAnalysis> findByDateRange(@Param("startDate") LocalDateTime startDate,
                                            @Param("endDate") LocalDateTime endDate,
                                            Pageable pageable);

    @Query("SELECT ta.merchantCategory, COUNT(ta) as count FROM TransactionAnalysis ta WHERE ta.fraudStatus = 'DECLINED' AND ta.createdAt >= :since GROUP BY ta.merchantCategory ORDER BY count DESC")
    List<Object[]> findTopFraudMerchantCategories(@Param("since") LocalDateTime since);

    @Query("SELECT ta.locationCountry, COUNT(ta) as count FROM TransactionAnalysis ta WHERE ta.fraudStatus = 'DECLINED' AND ta.createdAt >= :since GROUP BY ta.locationCountry ORDER BY count DESC")
    List<Object[]> findTopFraudCountries(@Param("since") LocalDateTime since);

    @Query("SELECT AVG(ta.riskScore) FROM TransactionAnalysis ta WHERE ta.userId = :userId")
    Double getAverageRiskScoreForUser(@Param("userId") Long userId);

    @Query("SELECT ta FROM TransactionAnalysis ta WHERE ta.userId = :userId ORDER BY ta.createdAt DESC")
    List<TransactionAnalysis> findRecentUserTransactions(@Param("userId") Long userId, Pageable pageable);
}

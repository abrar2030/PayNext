package com.fintech.aifraudservice.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Set;

@Entity
@Table(name = "user_behavior_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserBehaviorProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    // Transaction patterns
    @Column(name = "avg_transaction_amount", precision = 19, scale = 2)
    private BigDecimal avgTransactionAmount;

    @Column(name = "max_transaction_amount", precision = 19, scale = 2)
    private BigDecimal maxTransactionAmount;

    @Column(name = "min_transaction_amount", precision = 19, scale = 2)
    private BigDecimal minTransactionAmount;

    @Column(name = "daily_transaction_count")
    private Integer dailyTransactionCount;

    @Column(name = "weekly_transaction_count")
    private Integer weeklyTransactionCount;

    @Column(name = "monthly_transaction_count")
    private Integer monthlyTransactionCount;

    // Time patterns
    @Column(name = "typical_start_time")
    private LocalTime typicalStartTime;

    @Column(name = "typical_end_time")
    private LocalTime typicalEndTime;

    @ElementCollection(targetClass = Integer.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "user_active_days", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "day_of_week")
    private Set<Integer> activeDaysOfWeek; // 1-7 (Monday-Sunday)

    // Location patterns
    @ElementCollection(targetClass = String.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "user_frequent_countries", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "country")
    private Set<String> frequentCountries;

    @ElementCollection(targetClass = String.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "user_frequent_cities", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "city")
    private Set<String> frequentCities;

    // Device patterns
    @ElementCollection(targetClass = String.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "user_known_devices", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "device_fingerprint")
    private Set<String> knownDevices;

    @ElementCollection(targetClass = String.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "user_known_ips", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "ip_address")
    private Set<String> knownIpAddresses;

    // Merchant patterns
    @ElementCollection(targetClass = String.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "user_frequent_merchants", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "merchant_id")
    private Set<String> frequentMerchants;

    @ElementCollection(targetClass = String.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "user_frequent_categories", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "category")
    private Set<String> frequentCategories;

    // Payment method patterns
    @ElementCollection(targetClass = String.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "user_payment_methods", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "payment_method")
    private Set<String> preferredPaymentMethods;

    // Risk indicators
    @Column(name = "base_risk_score")
    private Double baseRiskScore = 0.0;

    @Column(name = "velocity_risk_score")
    private Double velocityRiskScore = 0.0;

    @Column(name = "behavioral_risk_score")
    private Double behavioralRiskScore = 0.0;

    @Column(name = "total_transactions")
    private Long totalTransactions = 0L;

    @Column(name = "fraud_incidents")
    private Integer fraudIncidents = 0;

    @Column(name = "false_positives")
    private Integer falsePositives = 0;

    // Timestamps
    @Column(name = "first_transaction_date")
    private LocalDateTime firstTransactionDate;

    @Column(name = "last_transaction_date")
    private LocalDateTime lastTransactionDate;

    @Column(name = "profile_created_at", nullable = false)
    private LocalDateTime profileCreatedAt = LocalDateTime.now();

    @Column(name = "profile_updated_at")
    private LocalDateTime profileUpdatedAt = LocalDateTime.now();

    @Column(name = "last_analysis_date")
    private LocalDateTime lastAnalysisDate;

    @PreUpdate
    public void preUpdate() {
        this.profileUpdatedAt = LocalDateTime.now();
    }
}

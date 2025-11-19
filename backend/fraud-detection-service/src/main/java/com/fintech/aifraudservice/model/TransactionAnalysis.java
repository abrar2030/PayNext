package com.fintech.aifraudservice.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import javax.persistence.*;
import javax.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "transaction_analyses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transaction_id", nullable = false, unique = true)
    private String transactionId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Column(name = "currency", nullable = false)
    private String currency;

    @Column(name = "merchant_id")
    private String merchantId;

    @Column(name = "merchant_category")
    private String merchantCategory;

    @Column(name = "transaction_type", nullable = false)
    private String transactionType;

    @Column(name = "payment_method", nullable = false)
    private String paymentMethod;

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "device_fingerprint")
    private String deviceFingerprint;

    @Column(name = "location_country")
    private String locationCountry;

    @Column(name = "location_city")
    private String locationCity;

    @Column(name = "risk_score", nullable = false)
    private Double riskScore;

    @Enumerated(EnumType.STRING)
    @Column(name = "risk_level", nullable = false)
    private RiskLevel riskLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "fraud_status", nullable = false)
    private FraudStatus fraudStatus = FraudStatus.PENDING;

    @Column(name = "ml_model_version")
    private String mlModelVersion;

    @ElementCollection
    @CollectionTable(name = "fraud_indicators", joinColumns = @JoinColumn(name = "analysis_id"))
    @MapKeyColumn(name = "indicator_name")
    @Column(name = "indicator_value")
    private Map<String, String> fraudIndicators;

    @Column(name = "velocity_score")
    private Double velocityScore;

    @Column(name = "behavioral_score")
    private Double behavioralScore;

    @Column(name = "geolocation_score")
    private Double geolocationScore;

    @Column(name = "device_score")
    private Double deviceScore;

    @Column(name = "time_of_day_score")
    private Double timeOfDayScore;

    @Column(name = "amount_score")
    private Double amountScore;

    @Column(name = "merchant_score")
    private Double merchantScore;

    @Column(name = "analysis_duration_ms")
    private Long analysisDurationMs;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "reviewed_by")
    private String reviewedBy;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "review_notes")
    private String reviewNotes;

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum RiskLevel {
        LOW, MEDIUM, HIGH, CRITICAL
    }

    public enum FraudStatus {
        PENDING, APPROVED, DECLINED, UNDER_REVIEW, FALSE_POSITIVE
    }
}

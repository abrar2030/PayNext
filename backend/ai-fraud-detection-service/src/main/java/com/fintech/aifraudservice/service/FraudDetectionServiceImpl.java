package com.fintech.aifraudservice.service;

import com.fintech.aifraudservice.model.TransactionAnalysis;
import com.fintech.aifraudservice.model.UserBehaviorProfile;
import com.fintech.aifraudservice.repository.TransactionAnalysisRepository;
import com.fintech.aifraudservice.repository.UserBehaviorProfileRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import weka.classifiers.Classifier;
import weka.classifiers.trees.RandomForest;
import weka.core.Attribute;
import weka.core.DenseInstance;
import weka.core.Instance;
import weka.core.Instances;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@Transactional
public class FraudDetectionServiceImpl implements FraudDetectionService {
    
    @Autowired
    private TransactionAnalysisRepository transactionAnalysisRepository;
    
    @Autowired
    private UserBehaviorProfileRepository userBehaviorProfileRepository;
    
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    
    private Classifier fraudDetectionModel;
    private Instances modelDataset;
    
    // ML Model weights for different risk factors
    private static final double VELOCITY_WEIGHT = 0.25;
    private static final double BEHAVIORAL_WEIGHT = 0.20;
    private static final double GEOLOCATION_WEIGHT = 0.15;
    private static final double DEVICE_WEIGHT = 0.15;
    private static final double AMOUNT_WEIGHT = 0.15;
    private static final double TIME_WEIGHT = 0.10;
    
    @Override
    public TransactionAnalysis analyzeTransaction(TransactionAnalysisRequest request) {
        long startTime = System.currentTimeMillis();
        
        try {
            log.info("Starting fraud analysis for transaction: {}", request.getTransactionId());
            
            // Calculate individual risk scores
            Double velocityScore = calculateVelocityScore(request.getUserId(), request);
            Double behavioralScore = calculateBehavioralScore(request.getUserId(), request);
            Double geolocationScore = calculateGeolocationScore(request.getUserId(), request);
            Double deviceScore = calculateDeviceScore(request.getUserId(), request);
            Double amountScore = calculateAmountScore(request.getUserId(), request);
            Double timeScore = calculateTimeOfDayScore(request.getUserId(), request);
            
            // Calculate overall risk score
            Double overallRiskScore = calculateOverallRiskScore(
                velocityScore, behavioralScore, geolocationScore, 
                deviceScore, amountScore, timeScore
            );
            
            // Determine risk level
            TransactionAnalysis.RiskLevel riskLevel = determineRiskLevel(overallRiskScore);
            
            // Create analysis record
            TransactionAnalysis analysis = new TransactionAnalysis();
            analysis.setTransactionId(request.getTransactionId());
            analysis.setUserId(request.getUserId());
            analysis.setAmount(request.getAmount());
            analysis.setCurrency(request.getCurrency());
            analysis.setMerchantId(request.getMerchantId());
            analysis.setMerchantCategory(request.getMerchantCategory());
            analysis.setTransactionType(request.getTransactionType());
            analysis.setPaymentMethod(request.getPaymentMethod());
            analysis.setIpAddress(request.getIpAddress());
            analysis.setDeviceFingerprint(request.getDeviceFingerprint());
            analysis.setLocationCountry(request.getLocationCountry());
            analysis.setLocationCity(request.getLocationCity());
            analysis.setRiskScore(overallRiskScore);
            analysis.setRiskLevel(riskLevel);
            analysis.setVelocityScore(velocityScore);
            analysis.setBehavioralScore(behavioralScore);
            analysis.setGeolocationScore(geolocationScore);
            analysis.setDeviceScore(deviceScore);
            analysis.setAmountScore(amountScore);
            analysis.setTimeOfDayScore(timeScore);
            analysis.setMlModelVersion("v1.0");
            analysis.setAnalysisDurationMs(System.currentTimeMillis() - startTime);
            
            // Set fraud indicators
            Map<String, String> indicators = generateFraudIndicators(request, analysis);
            analysis.setFraudIndicators(indicators);
            
            // Determine fraud status based on risk level
            if (riskLevel == TransactionAnalysis.RiskLevel.CRITICAL) {
                analysis.setFraudStatus(TransactionAnalysis.FraudStatus.DECLINED);
            } else if (riskLevel == TransactionAnalysis.RiskLevel.HIGH) {
                analysis.setFraudStatus(TransactionAnalysis.FraudStatus.UNDER_REVIEW);
            } else {
                analysis.setFraudStatus(TransactionAnalysis.FraudStatus.APPROVED);
            }
            
            // Save analysis
            analysis = transactionAnalysisRepository.save(analysis);
            
            // Update user behavior profile asynchronously
            updateUserBehaviorProfile(request, analysis);
            
            // Send to Kafka for real-time processing
            kafkaTemplate.send("fraud-analysis-results", analysis);
            
            log.info("Fraud analysis completed for transaction: {} with risk score: {} and level: {}", 
                    request.getTransactionId(), overallRiskScore, riskLevel);
            
            return analysis;
            
        } catch (Exception e) {
            log.error("Error analyzing transaction {}: {}", request.getTransactionId(), e.getMessage(), e);
            throw new RuntimeException("Fraud analysis failed", e);
        }
    }
    
    @Override
    public Double calculateRealTimeFraudScore(TransactionAnalysisRequest request) {
        try {
            Double velocityScore = calculateVelocityScore(request.getUserId(), request);
            Double behavioralScore = calculateBehavioralScore(request.getUserId(), request);
            Double geolocationScore = calculateGeolocationScore(request.getUserId(), request);
            Double deviceScore = calculateDeviceScore(request.getUserId(), request);
            Double amountScore = calculateAmountScore(request.getUserId(), request);
            Double timeScore = calculateTimeOfDayScore(request.getUserId(), request);
            
            return calculateOverallRiskScore(
                velocityScore, behavioralScore, geolocationScore, 
                deviceScore, amountScore, timeScore
            );
        } catch (Exception e) {
            log.error("Error calculating real-time fraud score: {}", e.getMessage(), e);
            return 0.5; // Default medium risk
        }
    }
    
    @Override
    public Double calculateVelocityScore(Long userId, TransactionAnalysisRequest request) {
        try {
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime oneHourAgo = now.minusHours(1);
            LocalDateTime oneDayAgo = now.minusDays(1);
            
            // Count transactions in last hour and day
            Long transactionsLastHour = transactionAnalysisRepository.countUserTransactionsSince(userId, oneHourAgo);
            Long transactionsLastDay = transactionAnalysisRepository.countUserTransactionsSince(userId, oneDayAgo);
            
            // Calculate total amount in last hour and day
            BigDecimal amountLastHour = transactionAnalysisRepository.sumUserTransactionAmountSince(userId, oneHourAgo);
            BigDecimal amountLastDay = transactionAnalysisRepository.sumUserTransactionAmountSince(userId, oneDayAgo);
            
            if (amountLastHour == null) amountLastHour = BigDecimal.ZERO;
            if (amountLastDay == null) amountLastDay = BigDecimal.ZERO;
            
            // Get user's normal velocity patterns
            UserBehaviorProfile profile = getUserBehaviorProfile(userId);
            
            double velocityScore = 0.0;
            
            // Check transaction count velocity
            if (profile != null && profile.getDailyTransactionCount() != null) {
                double normalDailyCount = profile.getDailyTransactionCount();
                double normalHourlyCount = normalDailyCount / 24.0;
                
                if (transactionsLastHour > normalHourlyCount * 3) {
                    velocityScore += 0.4; // High transaction frequency
                } else if (transactionsLastHour > normalHourlyCount * 2) {
                    velocityScore += 0.2; // Medium transaction frequency
                }
                
                if (transactionsLastDay > normalDailyCount * 2) {
                    velocityScore += 0.3; // High daily transaction count
                }
            } else {
                // No profile available, use general thresholds
                if (transactionsLastHour > 5) velocityScore += 0.4;
                if (transactionsLastDay > 20) velocityScore += 0.3;
            }
            
            // Check amount velocity
            if (profile != null && profile.getAvgTransactionAmount() != null) {
                BigDecimal normalDailyAmount = profile.getAvgTransactionAmount().multiply(
                    BigDecimal.valueOf(profile.getDailyTransactionCount() != null ? profile.getDailyTransactionCount() : 5)
                );
                
                if (amountLastDay.compareTo(normalDailyAmount.multiply(BigDecimal.valueOf(3))) > 0) {
                    velocityScore += 0.3; // High amount velocity
                }
            }
            
            return Math.min(velocityScore, 1.0);
            
        } catch (Exception e) {
            log.error("Error calculating velocity score for user {}: {}", userId, e.getMessage());
            return 0.0;
        }
    }
    
    @Override
    public Double calculateBehavioralScore(Long userId, TransactionAnalysisRequest request) {
        try {
            UserBehaviorProfile profile = getUserBehaviorProfile(userId);
            if (profile == null) {
                return 0.3; // Medium risk for new users
            }
            
            double behavioralScore = 0.0;
            
            // Check amount deviation
            if (profile.getAvgTransactionAmount() != null) {
                BigDecimal avgAmount = profile.getAvgTransactionAmount();
                BigDecimal currentAmount = request.getAmount();
                
                double ratio = currentAmount.divide(avgAmount, 2, BigDecimal.ROUND_HALF_UP).doubleValue();
                
                if (ratio > 10) {
                    behavioralScore += 0.4; // Very high amount compared to normal
                } else if (ratio > 5) {
                    behavioralScore += 0.2; // High amount compared to normal
                }
            }
            
            // Check merchant category deviation
            if (profile.getFrequentCategories() != null && !profile.getFrequentCategories().isEmpty()) {
                if (!profile.getFrequentCategories().contains(request.getMerchantCategory())) {
                    behavioralScore += 0.2; // New merchant category
                }
            }
            
            // Check payment method deviation
            if (profile.getPreferredPaymentMethods() != null && !profile.getPreferredPaymentMethods().isEmpty()) {
                if (!profile.getPreferredPaymentMethods().contains(request.getPaymentMethod())) {
                    behavioralScore += 0.15; // New payment method
                }
            }
            
            // Check time pattern deviation
            LocalTime currentTime = request.getTransactionTime().toLocalTime();
            if (profile.getTypicalStartTime() != null && profile.getTypicalEndTime() != null) {
                LocalTime startTime = profile.getTypicalStartTime();
                LocalTime endTime = profile.getTypicalEndTime();
                
                if (currentTime.isBefore(startTime) || currentTime.isAfter(endTime)) {
                    behavioralScore += 0.25; // Transaction outside normal hours
                }
            }
            
            return Math.min(behavioralScore, 1.0);
            
        } catch (Exception e) {
            log.error("Error calculating behavioral score for user {}: {}", userId, e.getMessage());
            return 0.0;
        }
    }
    
    @Override
    public Double calculateGeolocationScore(Long userId, TransactionAnalysisRequest request) {
        try {
            UserBehaviorProfile profile = getUserBehaviorProfile(userId);
            if (profile == null) {
                return 0.2; // Low-medium risk for new users
            }
            
            double geoScore = 0.0;
            
            // Check country deviation
            if (profile.getFrequentCountries() != null && !profile.getFrequentCountries().isEmpty()) {
                if (!profile.getFrequentCountries().contains(request.getLocationCountry())) {
                    geoScore += 0.5; // New country
                }
            }
            
            // Check city deviation
            if (profile.getFrequentCities() != null && !profile.getFrequentCities().isEmpty()) {
                if (!profile.getFrequentCities().contains(request.getLocationCity())) {
                    geoScore += 0.3; // New city
                }
            }
            
            // Check for high-risk countries (this would be configurable)
            Set<String> highRiskCountries = Set.of("XX", "YY", "ZZ"); // Example
            if (highRiskCountries.contains(request.getLocationCountry())) {
                geoScore += 0.4; // High-risk country
            }
            
            return Math.min(geoScore, 1.0);
            
        } catch (Exception e) {
            log.error("Error calculating geolocation score for user {}: {}", userId, e.getMessage());
            return 0.0;
        }
    }
    
    @Override
    public Double calculateDeviceScore(Long userId, TransactionAnalysisRequest request) {
        try {
            UserBehaviorProfile profile = getUserBehaviorProfile(userId);
            if (profile == null) {
                return 0.2; // Low-medium risk for new users
            }
            
            double deviceScore = 0.0;
            
            // Check device fingerprint
            if (profile.getKnownDevices() != null && !profile.getKnownDevices().isEmpty()) {
                if (!profile.getKnownDevices().contains(request.getDeviceFingerprint())) {
                    deviceScore += 0.4; // New device
                }
            }
            
            // Check IP address
            if (profile.getKnownIpAddresses() != null && !profile.getKnownIpAddresses().isEmpty()) {
                if (!profile.getKnownIpAddresses().contains(request.getIpAddress())) {
                    deviceScore += 0.3; // New IP address
                }
            }
            
            return Math.min(deviceScore, 1.0);
            
        } catch (Exception e) {
            log.error("Error calculating device score for user {}: {}", userId, e.getMessage());
            return 0.0;
        }
    }
    
    private Double calculateAmountScore(Long userId, TransactionAnalysisRequest request) {
        try {
            UserBehaviorProfile profile = getUserBehaviorProfile(userId);
            if (profile == null) {
                // For new users, check against general thresholds
                BigDecimal amount = request.getAmount();
                if (amount.compareTo(BigDecimal.valueOf(10000)) > 0) {
                    return 0.8; // Very high amount
                } else if (amount.compareTo(BigDecimal.valueOf(5000)) > 0) {
                    return 0.5; // High amount
                } else if (amount.compareTo(BigDecimal.valueOf(1000)) > 0) {
                    return 0.2; // Medium amount
                }
                return 0.0;
            }
            
            BigDecimal maxAmount = profile.getMaxTransactionAmount();
            BigDecimal avgAmount = profile.getAvgTransactionAmount();
            BigDecimal currentAmount = request.getAmount();
            
            if (maxAmount != null && currentAmount.compareTo(maxAmount.multiply(BigDecimal.valueOf(2))) > 0) {
                return 0.8; // Much higher than historical max
            } else if (maxAmount != null && currentAmount.compareTo(maxAmount) > 0) {
                return 0.5; // Higher than historical max
            } else if (avgAmount != null && currentAmount.compareTo(avgAmount.multiply(BigDecimal.valueOf(5))) > 0) {
                return 0.4; // Much higher than average
            }
            
            return 0.0;
            
        } catch (Exception e) {
            log.error("Error calculating amount score for user {}: {}", userId, e.getMessage());
            return 0.0;
        }
    }
    
    private Double calculateTimeOfDayScore(Long userId, TransactionAnalysisRequest request) {
        try {
            LocalTime currentTime = request.getTransactionTime().toLocalTime();
            
            // High-risk hours (late night/early morning)
            if (currentTime.isAfter(LocalTime.of(23, 0)) || currentTime.isBefore(LocalTime.of(6, 0))) {
                return 0.3;
            }
            
            return 0.0;
            
        } catch (Exception e) {
            log.error("Error calculating time score for user {}: {}", userId, e.getMessage());
            return 0.0;
        }
    }
    
    private Double calculateOverallRiskScore(Double velocityScore, Double behavioralScore, 
                                           Double geolocationScore, Double deviceScore, 
                                           Double amountScore, Double timeScore) {
        return (velocityScore * VELOCITY_WEIGHT) +
               (behavioralScore * BEHAVIORAL_WEIGHT) +
               (geolocationScore * GEOLOCATION_WEIGHT) +
               (deviceScore * DEVICE_WEIGHT) +
               (amountScore * AMOUNT_WEIGHT) +
               (timeScore * TIME_WEIGHT);
    }
    
    private TransactionAnalysis.RiskLevel determineRiskLevel(Double riskScore) {
        if (riskScore >= 0.8) {
            return TransactionAnalysis.RiskLevel.CRITICAL;
        } else if (riskScore >= 0.6) {
            return TransactionAnalysis.RiskLevel.HIGH;
        } else if (riskScore >= 0.3) {
            return TransactionAnalysis.RiskLevel.MEDIUM;
        } else {
            return TransactionAnalysis.RiskLevel.LOW;
        }
    }
    
    private Map<String, String> generateFraudIndicators(TransactionAnalysisRequest request, TransactionAnalysis analysis) {
        Map<String, String> indicators = new HashMap<>();
        
        if (analysis.getVelocityScore() > 0.5) {
            indicators.put("HIGH_VELOCITY", "Transaction velocity exceeds normal patterns");
        }
        
        if (analysis.getBehavioralScore() > 0.5) {
            indicators.put("BEHAVIORAL_ANOMALY", "Transaction behavior deviates from user patterns");
        }
        
        if (analysis.getGeolocationScore() > 0.5) {
            indicators.put("GEOLOCATION_RISK", "Transaction from unusual location");
        }
        
        if (analysis.getDeviceScore() > 0.5) {
            indicators.put("DEVICE_RISK", "Transaction from unknown device");
        }
        
        if (analysis.getAmountScore() > 0.5) {
            indicators.put("AMOUNT_ANOMALY", "Transaction amount is unusually high");
        }
        
        if (analysis.getTimeOfDayScore() > 0.2) {
            indicators.put("TIME_RISK", "Transaction at unusual time");
        }
        
        return indicators;
    }
    
    @Override
    @Cacheable(value = "userBehaviorProfiles", key = "#userId")
    public UserBehaviorProfile getUserBehaviorProfile(Long userId) {
        return userBehaviorProfileRepository.findByUserId(userId).orElse(null);
    }
    
    @Override
    public void updateUserBehaviorProfile(TransactionAnalysisRequest request, TransactionAnalysis analysis) {
        // This would be implemented to update user behavior patterns
        // Implementation would be complex and involve statistical analysis
        log.info("Updating behavior profile for user: {}", request.getUserId());
    }
    
    @Override
    public void retrainFraudModel() {
        // Implementation for retraining the ML model
        log.info("Retraining fraud detection model");
    }
    
    @Override
    public Map<String, Object> getFraudDetectionStats() {
        Map<String, Object> stats = new HashMap<>();
        
        LocalDateTime last24Hours = LocalDateTime.now().minusDays(1);
        
        Long totalTransactions = transactionAnalysisRepository.countTransactionsSince(last24Hours);
        Long fraudTransactions = transactionAnalysisRepository.countFraudTransactionsSince(last24Hours);
        Long highRiskTransactions = transactionAnalysisRepository.countHighRiskTransactionsSince(last24Hours);
        
        stats.put("totalTransactions24h", totalTransactions);
        stats.put("fraudTransactions24h", fraudTransactions);
        stats.put("highRiskTransactions24h", highRiskTransactions);
        stats.put("fraudRate24h", totalTransactions > 0 ? (fraudTransactions.doubleValue() / totalTransactions) * 100 : 0);
        
        return stats;
    }
    
    @Override
    public List<TransactionAnalysis> getHighRiskTransactions(int limit) {
        return transactionAnalysisRepository.findHighRiskTransactions(limit);
    }
    
    @Override
    public void markTransactionFraud(String transactionId, boolean isFraud, String reviewedBy, String notes) {
        Optional<TransactionAnalysis> analysisOpt = transactionAnalysisRepository.findByTransactionId(transactionId);
        
        if (analysisOpt.isPresent()) {
            TransactionAnalysis analysis = analysisOpt.get();
            analysis.setFraudStatus(isFraud ? 
                TransactionAnalysis.FraudStatus.DECLINED : 
                TransactionAnalysis.FraudStatus.FALSE_POSITIVE);
            analysis.setReviewedBy(reviewedBy);
            analysis.setReviewedAt(LocalDateTime.now());
            analysis.setReviewNotes(notes);
            
            transactionAnalysisRepository.save(analysis);
            
            log.info("Transaction {} marked as {} by {}", transactionId, 
                    isFraud ? "fraud" : "legitimate", reviewedBy);
        }
    }
}


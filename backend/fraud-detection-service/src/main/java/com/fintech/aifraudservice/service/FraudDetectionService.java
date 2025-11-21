package com.fintech.aifraudservice.service;

import com.fintech.aifraudservice.model.TransactionAnalysis;
import com.fintech.aifraudservice.model.UserBehaviorProfile;
import java.util.List;
import java.util.Map;

public interface FraudDetectionService {

  /** Analyze a transaction for fraud indicators */
  TransactionAnalysis analyzeTransaction(TransactionAnalysisRequest request);

  /** Get real-time fraud score for a transaction */
  Double calculateRealTimeFraudScore(TransactionAnalysisRequest request);

  /** Update user behavior profile based on transaction */
  void updateUserBehaviorProfile(TransactionAnalysisRequest request, TransactionAnalysis analysis);

  /** Get user behavior profile */
  UserBehaviorProfile getUserBehaviorProfile(Long userId);

  /** Retrain fraud detection model */
  void retrainFraudModel();

  /** Get fraud detection statistics */
  Map<String, Object> getFraudDetectionStats();

  /** Get high-risk transactions for review */
  List<TransactionAnalysis> getHighRiskTransactions(int limit);

  /** Mark transaction as fraud or legitimate */
  void markTransactionFraud(String transactionId, boolean isFraud, String reviewedBy, String notes);

  /** Calculate velocity score for user */
  Double calculateVelocityScore(Long userId, TransactionAnalysisRequest request);

  /** Calculate behavioral anomaly score */
  Double calculateBehavioralScore(Long userId, TransactionAnalysisRequest request);

  /** Calculate geolocation risk score */
  Double calculateGeolocationScore(Long userId, TransactionAnalysisRequest request);

  /** Calculate device risk score */
  Double calculateDeviceScore(Long userId, TransactionAnalysisRequest request);
}

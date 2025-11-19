package com.fintech.aifraudservice.controller;

import com.fintech.aifraudservice.model.TransactionAnalysis;
import com.fintech.aifraudservice.model.UserBehaviorProfile;
import com.fintech.aifraudservice.service.FraudDetectionService;
import com.fintech.aifraudservice.service.TransactionAnalysisRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/fraud-detection")
@Slf4j
@CrossOrigin(origins = "*")
public class FraudDetectionController {

    @Autowired
    private FraudDetectionService fraudDetectionService;

    @PostMapping("/analyze")
    public ResponseEntity<TransactionAnalysis> analyzeTransaction(@Valid @RequestBody TransactionAnalysisRequest request) {
        try {
            log.info("Received fraud analysis request for transaction: {}", request.getTransactionId());

            TransactionAnalysis analysis = fraudDetectionService.analyzeTransaction(request);

            return ResponseEntity.ok(analysis);
        } catch (Exception e) {
            log.error("Error analyzing transaction: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/score")
    public ResponseEntity<Map<String, Object>> getRealTimeFraudScore(@Valid @RequestBody TransactionAnalysisRequest request) {
        try {
            Double fraudScore = fraudDetectionService.calculateRealTimeFraudScore(request);

            Map<String, Object> response = Map.of(
                "transactionId", request.getTransactionId(),
                "fraudScore", fraudScore,
                "riskLevel", determineRiskLevel(fraudScore),
                "timestamp", System.currentTimeMillis()
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error calculating fraud score: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/user/{userId}/profile")
    public ResponseEntity<UserBehaviorProfile> getUserBehaviorProfile(@PathVariable Long userId) {
        try {
            UserBehaviorProfile profile = fraudDetectionService.getUserBehaviorProfile(userId);

            if (profile != null) {
                return ResponseEntity.ok(profile);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error retrieving user behavior profile: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getFraudDetectionStats() {
        try {
            Map<String, Object> stats = fraudDetectionService.getFraudDetectionStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error retrieving fraud detection stats: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/high-risk")
    public ResponseEntity<List<TransactionAnalysis>> getHighRiskTransactions(
            @RequestParam(defaultValue = "50") int limit) {
        try {
            List<TransactionAnalysis> highRiskTransactions = fraudDetectionService.getHighRiskTransactions(limit);
            return ResponseEntity.ok(highRiskTransactions);
        } catch (Exception e) {
            log.error("Error retrieving high-risk transactions: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/review/{transactionId}")
    public ResponseEntity<Map<String, String>> reviewTransaction(
            @PathVariable String transactionId,
            @RequestParam boolean isFraud,
            @RequestParam String reviewedBy,
            @RequestParam(required = false) String notes) {
        try {
            fraudDetectionService.markTransactionFraud(transactionId, isFraud, reviewedBy, notes);

            Map<String, String> response = Map.of(
                "status", "success",
                "message", "Transaction review completed",
                "transactionId", transactionId,
                "decision", isFraud ? "fraud" : "legitimate"
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error reviewing transaction: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/retrain")
    public ResponseEntity<Map<String, String>> retrainModel() {
        try {
            fraudDetectionService.retrainFraudModel();

            Map<String, String> response = Map.of(
                "status", "success",
                "message", "Model retraining initiated"
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error retraining model: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> health = Map.of(
            "status", "UP",
            "service", "AI Fraud Detection Service",
            "timestamp", String.valueOf(System.currentTimeMillis())
        );

        return ResponseEntity.ok(health);
    }

    private String determineRiskLevel(Double fraudScore) {
        if (fraudScore >= 0.8) {
            return "CRITICAL";
        } else if (fraudScore >= 0.6) {
            return "HIGH";
        } else if (fraudScore >= 0.3) {
            return "MEDIUM";
        } else {
            return "LOW";
        }
    }
}

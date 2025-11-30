package com.fintech.aifraudservice.controller;

import com.fintech.aifraudservice.model.TransactionAnalysis;
import com.fintech.aifraudservice.model.UserBehaviorProfile;
import com.fintech.aifraudservice.service.FraudDetectionService;
import com.fintech.aifraudservice.service.TransactionAnalysisRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.Map;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fraud-detection")
@Slf4j
@RequiredArgsConstructor // Uses constructor injection instead of @Autowired
@Tag(name = "AI Fraud Detection", description = "Operations related to transaction analysis, scoring, and model management")
// Note: While functional, global configuration via WebMvcConfigurer is usually preferred for CORS.
@CrossOrigin(origins = "*")
public class FraudDetectionController {

  // Dependency Injection: Use 'final' field for required constructor injection (cleaner than @Autowired)
  private final FraudDetectionService fraudDetectionService;

  // ----------------------------------------------------------------------------------
  // 1. Transaction Analysis and Scoring
  // ----------------------------------------------------------------------------------

  @PostMapping("/analyze")
  @Operation(summary = "Analyze transaction", description = "Runs a transaction through the AI model to get a detailed fraud analysis.")
  // Optimization: Removed redundant try-catch block. Exceptions should be handled globally 
  // via an @ControllerAdvice to provide specific error statuses (e.g., 400, 404, 500).
  public ResponseEntity<TransactionAnalysis> analyzeTransaction(
      @Valid @RequestBody TransactionAnalysisRequest request) {
    log.info("Received fraud analysis request for transaction: {}", request.getTransactionId());
    
    TransactionAnalysis analysis = fraudDetectionService.analyzeTransaction(request);

    return ResponseEntity.ok(analysis);
  }

  @PostMapping("/score")
  @Operation(summary = "Get real-time fraud score", description = "Calculates a single fraud score and risk level for a transaction.")
  // Optimization: Removed ResponseEntity<Map<String, Object>> wrapper for 200 OK responses, 
  // returning the Map directly for conciseness.
  public Map<String, Object> getRealTimeFraudScore(
      @Valid @RequestBody TransactionAnalysisRequest request) {
    
    Double fraudScore = fraudDetectionService.calculateRealTimeFraudScore(request);

    return Map.of(
        "transactionId", request.getTransactionId(),
        "fraudScore", fraudScore,
        "riskLevel", determineRiskLevel(fraudScore),
        // Use ISO-8601 string or Instant for timestamp in production, but keeping the original long for consistency.
        "timestamp", System.currentTimeMillis()
    );
  }

  // ----------------------------------------------------------------------------------
  // 2. User Profiles and Data Retrieval
  // ----------------------------------------------------------------------------------

  @GetMapping("/user/{userId}/profile")
  @Operation(summary = "Get user behavior profile", description = "Retrieves the historical behavior profile used for fraud model feature generation.")
  public ResponseEntity<UserBehaviorProfile> getUserBehaviorProfile(@PathVariable Long userId) {
    
    UserBehaviorProfile profile = fraudDetectionService.getUserBehaviorProfile(userId);

    // Explicitly handle 404 Not Found status
    if (profile == null) {
      log.warn("User behavior profile not found for ID: {}", userId);
      return ResponseEntity.notFound().build();
    }
    
    return ResponseEntity.ok(profile);
  }

  @GetMapping("/stats")
  @Operation(summary = "Get fraud detection statistics", description = "Retrieves aggregate statistics like model performance metrics and recent volumes.")
  // Optimization: Returning Map directly.
  public Map<String, Object> getFraudDetectionStats() {
    return fraudDetectionService.getFraudDetectionStats();
  }

  @GetMapping("/high-risk")
  @Operation(summary = "Get high-risk transactions", description = "Retrieves a list of transactions flagged for manual review.")
  // Optimization: Returning List directly.
  public List<TransactionAnalysis> getHighRiskTransactions(
      @RequestParam(defaultValue = "50") int limit) {
    return fraudDetectionService.getHighRiskTransactions(limit);
  }

  // ----------------------------------------------------------------------------------
  // 3. Model Management and Feedback
  // ----------------------------------------------------------------------------------

  @PostMapping("/review/{transactionId}")
  @Operation(summary = "Review transaction for model feedback", description = "Allows analysts to mark a transaction as fraud or legitimate to provide feedback to the model.")
  // Optimization: Returning Map directly.
  public Map<String, String> reviewTransaction(
      @PathVariable String transactionId,
      @RequestParam boolean isFraud,
      @RequestParam String reviewedBy,
      @RequestParam(required = false) String notes) {
    
    fraudDetectionService.markTransactionFraud(transactionId, isFraud, reviewedBy, notes);

    return Map.of(
        "status", "success",
        "message", "Transaction review completed",
        "transactionId", transactionId,
        "decision", isFraud ? "fraud" : "legitimate"
    );
  }

  @PostMapping("/retrain")
  @Operation(summary = "Initiate model retraining", description = "Starts an asynchronous job to retrain the fraud detection model with new data/labels.")
  // Optimization: Returning Map directly.
  public Map<String, String> retrainModel() {
    
    fraudDetectionService.retrainFraudModel();

    return Map.of(
        "status", "success", 
        "message", "Model retraining initiated"
    );
  }

  // ----------------------------------------------------------------------------------
  // 4. Health Check
  // ----------------------------------------------------------------------------------

  @GetMapping("/health")
  @Operation(summary = "Service health check", description = "Checks the operational status of the AI Fraud Detection service.")
  // Optimization: Returning Map directly.
  public Map<String, String> healthCheck() {
    return Map.of(
        "status", "UP",
        "service", "AI Fraud Detection Service",
        "timestamp", String.valueOf(System.currentTimeMillis())
    );
  }

  // ----------------------------------------------------------------------------------
  // 5. Utility
  // ----------------------------------------------------------------------------------

  /**
   * Helper method to determine the risk level based on the fraud score.
   * @param fraudScore The calculated fraud score (0.0 to 1.0)
   * @return A string representing the risk level.
   */
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
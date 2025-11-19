package com.fintech.aifraudservice.service;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import javax.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionAnalysisRequest {

    @NotBlank(message = "Transaction ID is required")
    private String transactionId;

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;

    @NotBlank(message = "Currency is required")
    @Size(min = 3, max = 3, message = "Currency must be 3 characters")
    private String currency;

    private String merchantId;

    private String merchantCategory;

    @NotBlank(message = "Transaction type is required")
    private String transactionType;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;

    private String ipAddress;

    private String deviceFingerprint;

    private String locationCountry;

    private String locationCity;

    private String userAgent;

    private LocalDateTime transactionTime = LocalDateTime.now();

    private String sessionId;

    private Boolean isRecurring = false;

    private String referenceTransactionId;

    private String cardBin; // First 6 digits of card number

    private String cardLast4; // Last 4 digits of card number

    private String cardType; // VISA, MASTERCARD, etc.

    private Boolean isInternational = false;

    private String riskContext; // Additional context for risk assessment
}

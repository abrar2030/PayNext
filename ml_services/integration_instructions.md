This document provides instructions on how to integrate the existing PayNext backend (Java Spring Boot) and frontend applications (Next.js/React) with the newly developed Python-based Machine Learning microservices.

## 1. Fraud Detection Service Integration

**Objective:** To call the fraud detection API before processing a transaction to determine its legitimacy.

**ML Service Endpoint:** `http://localhost:5000/predict_fraud` (when running locally)

**Request Method:** `POST`

**Request Body (JSON):**
```json
{
    "user_id": "string",
    "transaction_amount": "float",
    "transaction_time": "ISO 8601 string (e.g., 2024-10-21T10:30:00)",
    "location": "string",
    "merchant": "string",
    "transaction_type": "string"
}
```

**Response Body (JSON):**
```json
{
    "is_fraud": "boolean",
    "fraud_probability": "float"
}
```

**Backend (Java Spring Boot) Integration Steps:**

1.  **Add HTTP Client:** Ensure your `pom.xml` includes a dependency for an HTTP client (e.g., `RestTemplate` or `WebClient` for Spring Boot).
    ```xml
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-webflux</artifactId> <!-- For WebClient -->
    </dependency>
    ```
2.  **Create a Service Class:** Develop a new Java service (e.g., `FraudDetectionService.java`) that handles the communication with the Python API.
    ```java
    // Example using WebClient
    @Service
    public class FraudDetectionService {
        private final WebClient webClient;

        public FraudDetectionService(WebClient.Builder webClientBuilder) {
            this.webClient = webClientBuilder.baseUrl("http://localhost:5000").build();
        }

        public FraudPredictionResponse predictFraud(TransactionDetails transaction) {
            // Map transaction details to the request JSON format
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("user_id", transaction.getUserId());
            requestBody.put("transaction_amount", transaction.getAmount());
            requestBody.put("transaction_time", transaction.getTimestamp().toInstant().toString());
            requestBody.put("location", transaction.getLocation());
            requestBody.put("merchant", transaction.getMerchant());
            requestBody.put("transaction_type", transaction.getType());

            return webClient.post()
                    .uri("/predict_fraud")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(FraudPredictionResponse.class)
                    .block(); // Or use non-blocking approach with Mono/Flux
        }
    }

    // DTOs for request and response (create these classes)
    public class TransactionDetails { /* fields and getters/setters */ }
    public class FraudPredictionResponse { boolean is_fraud; double fraud_probability; /* getters/setters */ }
    ```
3.  **Integrate into Transaction Flow:** In your existing payment processing logic (e.g., in `PaymentService.java` or `PaymentController.java`), call the `FraudDetectionService` before approving a transaction.
    ```java
    // Inside your payment processing method
    FraudPredictionResponse fraudResponse = fraudDetectionService.predictFraud(transactionDetails);
    if (fraudResponse != null && fraudResponse.is_fraud()) {
        // Handle fraudulent transaction (e.g., block, flag for review)
        System.out.println("Fraudulent transaction detected!");
        // Return appropriate error or status
    } else {
        // Proceed with transaction
    }
    ```

## 2. Personalized Financial Recommendations Service Integration

**Objective:** To fetch personalized financial recommendations for a user based on their spending patterns.

**ML Service Endpoint:** `http://localhost:5001/get_recommendations` (when running locally)

**Request Method:** `POST`

**Request Body (JSON):**
```json
{
    "user_id": "string"
}
```

**Response Body (JSON):**
```json
{
    "user_id": "string",
    "cluster": "integer",
    "recommendations": ["string", "string", ...]
}
```

**Frontend (Next.js/React) Integration Steps:**

1.  **Create an API Utility:** Create a utility function (e.g., `recommendationApi.js`) to make HTTP requests to the recommendation service.
    ```javascript
    // PayNext/mobile-frontend/src/services/recommendationApi.js or similar
    export const getRecommendations = async (userId) => {
        try {
            const response = await fetch("http://localhost:5001/get_recommendations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_id: userId }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching recommendations:", error);
            return null;
        }
    };
    ```
2.  **Integrate into UI Component:** Call this utility function from a relevant UI component (e.g., a dashboard or profile page) to display recommendations.
    ```javascript
    // PayNext/mobile-frontend/src/app/profile/page.tsx or similar
    import React, { useEffect, useState } from 'react';
    import { getRecommendations } from '../../services/recommendationApi'; // Adjust path as needed

    const UserProfilePage = () => {
        const [recommendations, setRecommendations] = useState([]);
        const userId = 'user_0001'; // Replace with actual logged-in user ID

        useEffect(() => {
            const fetchRecommendations = async () => {
                const data = await getRecommendations(userId);
                if (data && data.recommendations) {
                    setRecommendations(data.recommendations);
                }
            };
            fetchRecommendations();
        }, [userId]);

        return (
            <div>
                <h1>Your Profile</h1>
                <h2>Personalized Recommendations:</h2>
                {recommendations.length > 0 ? (
                    <ul>
                        {recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No recommendations available at this time.</p>
                )}
            </div>
        );
    };

    export default UserProfilePage;
    ```

## 3. Deployment Considerations

*   **Environment Variables:** Replace `http://localhost:5000` and `http://localhost:5001` with actual deployed service URLs using environment variables.
*   **Security:** Implement API keys or other authentication mechanisms for secure communication between services.
*   **Scalability:** Consider deploying the Python microservices using Docker and Kubernetes for better scalability and management, similar to the existing PayNext architecture.

These instructions provide a clear path for integrating the new ML capabilities into the PayNext application, enhancing its functionality and user experience.

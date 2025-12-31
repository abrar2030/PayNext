# Usage Guide

This document covers typical usage patterns for PayNext, including CLI operations, API usage, and common workflows.

## Table of Contents

- [Command Line Usage](#command-line-usage)
- [API Usage](#api-usage)
- [Common Workflows](#common-workflows)
- [Integration Examples](#integration-examples)

## Command Line Usage

### Service Management

PayNext provides the `paynext.sh` script for managing backend services locally.

**Build Services**

```bash
# Build all services
./scripts/paynext.sh build

# Build specific service
./scripts/paynext.sh build user-service
./scripts/paynext.sh build payment-service
```

**Start Services**

```bash
# Start all services
./scripts/paynext.sh start

# Start specific service
./scripts/paynext.sh start api-gateway
./scripts/paynext.sh start payment-service

# Services start in background with PID tracking
```

**Stop Services**

```bash
# Stop all services
./scripts/paynext.sh stop

# Stop specific service
./scripts/paynext.sh stop user-service
```

**List Running Services**

```bash
# View all service statuses
./scripts/paynext.sh list

# Output shows:
# Service              PID        Status
# -------              ---        ------
# eureka-server        12345      Running
# api-gateway          12346      Running
# user-service         12347      Running
```

### Testing

**Run All Tests**

```bash
# Run complete test suite
./scripts/run_all_tests.sh

# Run with custom project directory
./scripts/run_all_tests.sh -d /path/to/project
```

**Run Service-Specific Tests**

```bash
# Backend service tests
cd backend/user-service
mvn test

# Frontend tests
cd web-frontend
npm test

# ML service tests
cd ml_services/fraud
pytest
```

**Test Coverage**

```bash
# Backend coverage
cd backend
mvn clean verify

# Frontend coverage
cd web-frontend
npm run test -- --coverage
```

### Database Management

```bash
# Database management script
./scripts/db_manager.sh

# Examples:
./scripts/db_manager.sh create user_db
./scripts/db_manager.sh backup payment_db
./scripts/db_manager.sh restore payment_db backup.sql
```

### Docker Operations

**Complete Stack**

```bash
# Start entire stack
docker-compose up -d

# View logs
docker-compose logs -f

# Stop stack
docker-compose down

# Clean restart (removes volumes)
docker-compose down -v
docker-compose up -d
```

**Individual Services**

```bash
# Start specific services
docker-compose up -d mysql redis rabbitmq

# Rebuild and restart service
docker-compose build payment-service
docker-compose up -d payment-service

# Scale service
docker-compose up -d --scale payment-service=3
```

### Development Environment Setup

```bash
# Automated development setup
./scripts/dev_environment_setup.sh

# This script:
# - Checks prerequisites
# - Installs dependencies
# - Configures environment
# - Starts required services
```

## API Usage

### Authentication Flow

**1. Register User**

```bash
curl -X POST http://localhost:8002/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john.doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "role": "USER"
  }'
```

Response:

```json
{
  "id": 1,
  "username": "john.doe",
  "email": "john@example.com",
  "role": "USER",
  "createdAt": "2025-01-01T10:00:00Z"
}
```

**2. Login**

```bash
curl -X POST http://localhost:8002/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john.doe",
    "password": "SecurePass123!"
  }'
```

Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**3. Use Token for Authenticated Requests**

```bash
# Store token
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Make authenticated request
curl -X GET http://localhost:8002/api/payments/history \
  -H "Authorization: Bearer $TOKEN"
```

### Payment Processing

**Create Payment**

```bash
curl -X POST http://localhost:8002/api/payments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 99.99,
    "currency": "USD",
    "method": "CREDIT_CARD",
    "cardNumber": "4111111111111111",
    "cardExpiry": "12/25",
    "cardCvv": "123",
    "description": "Product purchase"
  }'
```

Response:

```json
{
  "id": 1001,
  "status": "SUCCESS",
  "transactionId": "TXN-2025-001",
  "amount": 99.99,
  "currency": "USD",
  "timestamp": "2025-01-01T10:30:00Z"
}
```

**Get Payment History**

```bash
curl -X GET http://localhost:8002/api/payments \
  -H "Authorization: Bearer $TOKEN"
```

**Get Payment by ID**

```bash
curl -X GET http://localhost:8002/api/payments/1001 \
  -H "Authorization: Bearer $TOKEN"
```

### Fraud Detection

**Check Transaction for Fraud**

```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_id": "TXN-2025-001",
    "user_id": "user123",
    "amount": 500.00,
    "merchant": "OnlineStore",
    "location": "US-NY",
    "transaction_type": "purchase",
    "time_of_day": 14
  }'
```

Response:

```json
{
  "transaction_id": "TXN-2025-001",
  "is_fraud": false,
  "fraud_probability": 0.03,
  "risk_score": 15.2,
  "recommendation": "APPROVE"
}
```

### Notification Service

**Send Email Notification**

```bash
curl -X POST http://localhost:8002/api/notifications/email \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "user@example.com",
    "subject": "Payment Confirmation",
    "body": "Your payment of $99.99 was successful",
    "template": "payment_confirmation"
  }'
```

## Common Workflows

### Workflow 1: Complete Payment Process

**Step-by-step payment flow with fraud detection**

```bash
# 1. User registration
curl -X POST http://localhost:8002/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","email":"alice@example.com","password":"Pass123!"}'

# 2. Login to get token
TOKEN=$(curl -X POST http://localhost:8002/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"Pass123!"}' | jq -r '.token')

# 3. Check fraud before payment
FRAUD_CHECK=$(curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "alice",
    "amount": 150.00,
    "merchant": "ElectronicsStore",
    "location": "US-CA",
    "transaction_type": "purchase"
  }')

echo $FRAUD_CHECK | jq '.is_fraud'

# 4. If not fraud, process payment
if [ $(echo $FRAUD_CHECK | jq -r '.is_fraud') == "false" ]; then
  curl -X POST http://localhost:8002/api/payments \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "amount": 150.00,
      "currency": "USD",
      "method": "CREDIT_CARD",
      "description": "Electronics purchase"
    }'
fi
```

### Workflow 2: Recurring Subscription

```bash
# Create recurring payment subscription
curl -X POST http://localhost:8002/api/payments/subscription \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 29.99,
    "currency": "USD",
    "interval": "MONTHLY",
    "startDate": "2025-01-01",
    "method": "CREDIT_CARD"
  }'

# List active subscriptions
curl -X GET http://localhost:8002/api/payments/subscriptions \
  -H "Authorization: Bearer $TOKEN"

# Cancel subscription
curl -X DELETE http://localhost:8002/api/payments/subscription/123 \
  -H "Authorization: Bearer $TOKEN"
```

### Workflow 3: Multi-Currency Payment

```bash
# Payment in EUR (auto-converts)
curl -X POST http://localhost:8002/api/payments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 89.99,
    "currency": "EUR",
    "method": "CREDIT_CARD",
    "description": "International purchase"
  }'

# Get exchange rates
curl -X GET http://localhost:8002/api/payments/rates?base=USD&target=EUR \
  -H "Authorization: Bearer $TOKEN"
```

### Workflow 4: Split Payment

```bash
# Split payment among multiple recipients
curl -X POST http://localhost:8002/api/payments/split \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "totalAmount": 300.00,
    "currency": "USD",
    "splits": [
      {"recipientId": "merchant1", "amount": 200.00},
      {"recipientId": "merchant2", "amount": 100.00}
    ],
    "method": "CREDIT_CARD"
  }'
```

### Workflow 5: Transaction Refund

```bash
# Process refund
curl -X POST http://localhost:8002/api/transactions/1001/refund \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 99.99,
    "reason": "Product return",
    "refundMethod": "ORIGINAL_PAYMENT_METHOD"
  }'

# Check refund status
curl -X GET http://localhost:8002/api/transactions/1001 \
  -H "Authorization: Bearer $TOKEN"
```

## Integration Examples

### JavaScript/Node.js Integration

```javascript
const axios = require("axios");

const API_BASE = "http://localhost:8002";
let authToken = null;

// Login and get token
async function login(username, password) {
  const response = await axios.post(`${API_BASE}/users/login`, {
    username,
    password,
  });
  authToken = response.data.token;
  return authToken;
}

// Process payment
async function processPayment(amount, currency = "USD") {
  const response = await axios.post(
    `${API_BASE}/api/payments`,
    {
      amount,
      currency,
      method: "CREDIT_CARD",
      description: "Purchase",
    },
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  );
  return response.data;
}

// Usage
(async () => {
  await login("alice", "Pass123!");
  const payment = await processPayment(99.99);
  console.log("Payment successful:", payment);
})();
```

### Python Integration

```python
import requests

API_BASE = 'http://localhost:8002'

class PayNextClient:
    def __init__(self):
        self.token = None

    def login(self, username, password):
        response = requests.post(f'{API_BASE}/users/login', json={
            'username': username,
            'password': password
        })
        self.token = response.json()['token']
        return self.token

    def process_payment(self, amount, currency='USD'):
        response = requests.post(
            f'{API_BASE}/api/payments',
            json={
                'amount': amount,
                'currency': currency,
                'method': 'CREDIT_CARD',
                'description': 'Purchase'
            },
            headers={'Authorization': f'Bearer {self.token}'}
        )
        return response.json()

# Usage
client = PayNextClient()
client.login('alice', 'Pass123!')
payment = client.process_payment(99.99)
print(f"Payment successful: {payment}")
```

### Java Integration

```java
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

public class PayNextClient {
    private static final String API_BASE = "http://localhost:8002";
    private String authToken;
    private RestTemplate restTemplate = new RestTemplate();

    public String login(String username, String password) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String requestJson = String.format(
            "{\"username\":\"%s\",\"password\":\"%s\"}",
            username, password
        );

        HttpEntity<String> request = new HttpEntity<>(requestJson, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(
            API_BASE + "/users/login", request, Map.class
        );

        this.authToken = (String) response.getBody().get("token");
        return this.authToken;
    }

    public Map processPayment(double amount, String currency) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(authToken);

        String requestJson = String.format(
            "{\"amount\":%.2f,\"currency\":\"%s\",\"method\":\"CREDIT_CARD\"}",
            amount, currency
        );

        HttpEntity<String> request = new HttpEntity<>(requestJson, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(
            API_BASE + "/api/payments", request, Map.class
        );

        return response.getBody();
    }
}
```

## Web Dashboard Usage

### Accessing the Dashboard

1. Start web frontend: `cd web-frontend && npm start`
2. Open browser: `http://localhost:3000`
3. Register account or login

### Dashboard Features

**Dashboard Overview**

- View recent transactions
- Check account balance
- Quick payment button
- Fraud alerts

**Payment Management**

- Create new payments
- View payment history
- Export transaction reports
- Manage payment methods

**Settings**

- Update profile
- Configure notifications
- Security settings (2FA)
- API key management

## Mobile App Usage

### Running Mobile App

```bash
cd mobile-frontend

# Development mode
pnpm dev

# Build for production
pnpm build
```

### Mobile Features

- QR code payments
- Biometric authentication
- Push notifications
- Offline transaction queue
- Receipt scanning

## Next Steps

- [API Reference](API.md) - Complete API documentation
- [Configuration Guide](CONFIGURATION.md) - Advanced configuration
- [Examples](examples/) - More detailed examples
- [Troubleshooting](TROUBLESHOOTING.md) - Common issues

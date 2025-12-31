# Example 3: Fraud Detection Integration

Using ML-powered fraud detection before processing payments.

## Prerequisites

- Fraud detection service running on port 5000
- Transaction data

## Check Transaction for Fraud

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

**Response**:

```json
{
  "transaction_id": "TXN-2025-001",
  "is_fraud": false,
  "fraud_probability": 0.03,
  "risk_score": 15.2,
  "recommendation": "APPROVE"
}
```

## Integrated Payment with Fraud Check

```bash
#!/bin/bash

# 1. Check fraud
FRAUD_RESULT=$(curl -s -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "amount": 150.00,
    "merchant": "Electronics",
    "location": "US-CA"
  }')

IS_FRAUD=$(echo $FRAUD_RESULT | jq -r '.is_fraud')

# 2. Process payment if not fraud
if [ "$IS_FRAUD" == "false" ]; then
  curl -X POST http://localhost:8002/api/payments \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "amount": 150.00,
      "currency": "USD",
      "method": "CREDIT_CARD"
    }'
else
  echo "Transaction flagged as fraudulent"
fi
```

# Example 4: ML Services Integration

Using various ML services for analytics and predictions.

## Credit Scoring

```bash
curl -X POST http://localhost:5005/predict \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "annual_income": 75000,
    "credit_history_length": 5,
    "number_of_accounts": 3,
    "payment_history": 0.95,
    "debt_to_income": 0.3
  }'
```

## Churn Prediction

```bash
curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "days_since_last_transaction": 45,
    "transaction_frequency": 12,
    "average_transaction_amount": 75.50
  }'
```

## Transaction Categorization

```bash
curl -X POST http://localhost:5002/predict \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Amazon.com purchase",
    "amount": 45.99,
    "merchant": "Amazon"
  }'
```

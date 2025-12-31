# Example 2: Processing Payments

Complete payment processing workflows including multi-currency and recurring payments.

## Prerequisites

- Authenticated user (see Example 1)
- JWT token

## Basic Payment

```bash
curl -X POST http://localhost:8002/api/payments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 99.99,
    "currency": "USD",
    "method": "CREDIT_CARD",
    "description": "Product purchase"
  }'
```

## Multi-Currency Payment

```bash
curl -X POST http://localhost:8002/api/payments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 89.99,
    "currency": "EUR",
    "method": "CREDIT_CARD",
    "description": "International purchase"
  }'
```

## Recurring Subscription

```bash
curl -X POST http://localhost:8002/api/payments/subscription \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 29.99,
    "currency": "USD",
    "interval": "MONTHLY",
    "startDate": "2025-01-01",
    "description": "Premium subscription"
  }'
```

## Get Payment History

```bash
curl -X GET "http://localhost:8002/api/payments?page=0&size=10" \
  -H "Authorization: Bearer $TOKEN"
```

## Process Refund

```bash
curl -X POST http://localhost:8002/api/transactions/1001/refund \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 99.99,
    "reason": "Product return"
  }'
```

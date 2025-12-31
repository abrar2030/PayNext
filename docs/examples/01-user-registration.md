# Example 1: User Registration & Authentication

Complete guide to user registration and authentication workflows.

## Prerequisites

- PayNext services running
- API Gateway accessible at `http://localhost:8002`

## Step 1: Register New User

```bash
curl -X POST http://localhost:8002/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "role": "USER"
  }'
```

**Response**:

```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "role": "USER",
  "createdAt": "2025-01-01T10:00:00Z",
  "status": "ACTIVE"
}
```

## Step 2: Login

```bash
curl -X POST http://localhost:8002/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "SecurePass123!"
  }'
```

**Response**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "expiresIn": 3600
}
```

## Step 3: Use Token

```bash
# Store token
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Make authenticated request
curl -X GET http://localhost:8002/users/profile \
  -H "Authorization: Bearer $TOKEN"
```

## Complete Script

```bash
#!/bin/bash

# Register
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:8002/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }')

echo "User registered: $REGISTER_RESPONSE"

# Login
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8002/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "SecurePass123!"
  }')

# Extract token
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')
echo "Token obtained: $TOKEN"

# Get profile
curl -X GET http://localhost:8002/users/profile \
  -H "Authorization: Bearer $TOKEN"
```

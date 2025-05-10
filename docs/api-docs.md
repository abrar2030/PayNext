# PayNext API Documentation

This document provides an overview of the RESTful API endpoints for each service in the **PayNext** project, including the **User Service**, **Payment Service**, **Notification Service**, and **API Gateway**.

## Table of Contents

- [User Service](#user-service)
- [Payment Service](#payment-service)
- [Notification Service](#notification-service)
- [API Gateway](#api-gateway)

---

## User Service

### Base URL
`http://localhost:8003/user-service`

### Endpoints

- **POST /register** - Registers a new user.
    - **Request Body**:
      ```json
      {
        "username": "string",
        "password": "string",
        "email": "string"
      }
      ```
    - **Response**:
        - `201 Created`: User registered successfully.

  #### Postman Example
    1. **Method**: POST
    2. **URL**: `http://localhost:8003/user-service/register`
    3. **Headers**:
        - `Content-Type: application/json`
    4. **Body** (raw JSON):
        ```json
        {
          "username": "abrar2030",
          "password": "abrar2030",
          "email": "abrarahmedpei@gmail.com"
        }
        ```

  #### Command Line Example
    ```bash
    curl -X POST http://localhost:8003/user-service/register \
    -H "Content-Type: application/json" \
    -d '{
          "username": "abrar2030",
          "password": "abrar2030",
          "email": "abrarahmedpei@gmail.com"
        }'
    ```

- **POST /login** - Authenticates a user and returns a JWT token.
    - **Request Body**:
      ```json
      {
        "username": "string",
        "password": "string"
      }
      ```
    - **Response**:
        - `200 OK`: Returns JWT token.

  #### Postman Example
    1. **Method**: POST
    2. **URL**: `http://localhost:8003/user-service/login`
    3. **Headers**:
        - `Content-Type: application/json`
    4. **Body** (raw JSON):
        ```json
        {
          "username": "abrar2030",
          "password": "abrar2030"
        }
        ```

  #### Command Line Example
    ```bash
    curl -X POST http://localhost:8003/user-service/login \
    -H "Content-Type: application/json" \
    -d '{
          "username": "abrar2030",
          "password": "abrar2030"
        }'
    ```

- **GET /profile** - Retrieves the profile information of the logged-in user.
    - **Headers**: `Authorization: Bearer <token>`
    - **Response**:
        - `200 OK`: User profile information.

  #### Postman Example
    1. **Method**: GET
    2. **URL**: `http://localhost:8003/user-service/profile`
    3. **Headers**:
        - `Authorization: Bearer <token>`

  #### Command Line Example
    ```bash
    curl -X GET http://localhost:8003/user-service/profile \
    -H "Authorization: Bearer YOUR_JWT_TOKEN"
    ```

---

## Payment Service

### Base URL
`http://localhost:8004/payment-service`

### Endpoints

- **POST /payments** - Initiates a new payment.
    - **Headers**: `Authorization: Bearer <token>`
    - **Request Body**:
      ```json
      {
        "amount": "number",
        "recipientId": "string",
        "paymentMethod": "string"
      }
      ```
    - **Response**:
        - `201 Created`: Payment initiated successfully.

  #### Postman Example
    1. **Method**: POST
    2. **URL**: `http://localhost:8004/payment-service/payments`
    3. **Headers**:
        - `Content-Type: application/json`
        - `Authorization: Bearer <token>`
    4. **Body** (raw JSON):
        ```json
        {
          "amount": 100.50,
          "recipientId": "recipient123",
          "paymentMethod": "credit_card"
        }
        ```

  #### Command Line Example
    ```bash
    curl -X POST http://localhost:8004/payment-service/payments \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer YOUR_JWT_TOKEN" \
    -d '{
          "amount": 100.50,
          "recipientId": "recipient123",
          "paymentMethod": "credit_card"
        }'
    ```

- **GET /payments/{id}** - Retrieves payment details by ID.
    - **Headers**: `Authorization: Bearer <token>`
    - **Response**:
        - `200 OK`: Payment details.

  #### Postman Example
    1. **Method**: GET
    2. **URL**: `http://localhost:8004/payment-service/payments/{id}`
    3. **Headers**:
        - `Authorization: Bearer <token>`

  #### Command Line Example
    ```bash
    curl -X GET http://localhost:8004/payment-service/payments/PAYMENT_ID \
    -H "Authorization: Bearer YOUR_JWT_TOKEN"
    ```

- **GET /payments/user/{userId}** - Retrieves all payments for a specific user.
    - **Headers**: `Authorization: Bearer <token>`
    - **Response**:
        - `200 OK`: List of payments.

  #### Postman Example
    1. **Method**: GET
    2. **URL**: `http://localhost:8004/payment-service/payments/user/{userId}`
    3. **Headers**:
        - `Authorization: Bearer <token>`

  #### Command Line Example
    ```bash
    curl -X GET http://localhost:8004/payment-service/payments/user/USER_ID \
    -H "Authorization: Bearer YOUR_JWT_TOKEN"
    ```

---

## Notification Service

### Base URL
`http://localhost:8005/notification-service`

### Endpoints

- **POST /notifications** - Sends a notification to a user.
    - **Headers**: `Authorization: Bearer <token>`
    - **Request Body**:
      ```json
      {
        "userId": "string",
        "message": "string",
        "type": "string"
      }
      ```
    - **Response**:
        - `201 Created`: Notification sent successfully.

  #### Postman Example
    1. **Method**: POST
    2. **URL**: `http://localhost:8005/notification-service/notifications`
    3. **Headers**:
        - `Content-Type: application/json`
        - `Authorization: Bearer <token>`
    4. **Body** (raw JSON):
        ```json
        {
          "userId": "abrar2030",
          "message": "Your payment was successful.",
          "type": "payment_confirmation"
        }
        ```

  #### Command Line Example
    ```bash
    curl -X POST http://localhost:8005/notification-service/notifications \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer YOUR_JWT_TOKEN" \
    -d '{
          "userId": "abrar2030",
          "message": "Your payment was successful.",
          "type": "payment_confirmation"
        }'
    ```

- **GET /notifications/user/{userId}** - Retrieves all notifications for a specific user.
    - **Headers**: `Authorization: Bearer <token>`
    - **Response**:
        - `200 OK`: List of notifications.

  #### Postman Example
    1. **Method**: GET
    2. **URL**: `http://localhost:8005/notification-service/notifications/user/{userId}`
    3. **Headers**:
        - `Authorization: Bearer <token>`

  #### Command Line Example
    ```bash
    curl -X GET http://localhost:8005/notification-service/notifications/user/abrar2030 \
    -H "Authorization: Bearer YOUR_JWT_TOKEN"
    ```

---

## API Gateway

The API Gateway routes requests to the appropriate microservices.

### Base URL
`http://localhost:8002/api`

### Endpoints

- **POST /api/auth/register** - Routes to the User Service to register a new user.

  #### Postman Example
    1. **Method**: POST
    2. **URL**: `http://localhost:8002/api/auth/register`
    3. **Headers**:
        - `Content-Type: application/json`
    4. **Body** (raw JSON):
        ```json
        {
          "username": "abrar2030",
          "password": "abrar2030",
          "email": "abrarahmedpei@gmail.com"
        }
        ```

  #### Command Line Example
    ```bash
    curl -X POST http://localhost:8002/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{
          "username": "abrar2030",
          "password": "abrar2030",
          "email": "abrarahmedpei@gmail.com"
        }'
    ```

- **POST /api/auth/login** - Routes to the User Service to authenticate a user.

  #### Postman Example
    1. **Method**: POST
    2. **URL**: `http://localhost:8002/api/auth/login`
    3. **Headers**:
        - `Content-Type: application/json`
    4. **Body** (raw JSON):
        ```json
        {
          "username": "abrar2030",
          "password": "abrar2030"
        }
        ```

  #### Command Line Example
    ```bash
    curl -X POST http://localhost:8002/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{
          "username": "abrar2030",
          "password": "abrar2030"
        }'
    ```

- **POST /api/payments** - Routes to the Payment Service to initiate a payment.

  #### Postman Example
    1. **Method**: POST
    2. **URL**: `http://localhost:8002/api/payments`
    3. **Headers**:
        - `Content-Type: application/json`
        - `Authorization: Bearer <token>`
    4. **Body** (raw JSON):
        ```json
        {
          "amount": 100.50,
          "recipientId": "recipient123",
          "paymentMethod": "credit_card"
        }
        ```

  #### Command Line Example
    ```bash
    curl -X POST http://localhost:8002/api/payments \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer YOUR_JWT_TOKEN" \
    -d '{
          "amount": 100.50,
          "recipientId": "recipient123",
          "paymentMethod": "credit_card"
        }'
    ```

- **POST /api/notifications** - Routes to the Notification Service to send a notification.

  #### Postman Example
    1. **Method**: POST
    2. **URL**: `http://localhost:8002/api/notifications`
    3. **Headers**:
        - `Content-Type: application/json`
        - `Authorization: Bearer <token>`
    4. **Body** (raw JSON):
        ```json
        {
          "userId": "abrar2030",
          "message": "Your payment was successful.",
          "type": "payment_confirmation"
        }
        ```

  #### Command Line Example
    ```bash
    curl -X POST http://localhost:8002/api/notifications \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer YOUR_JWT_TOKEN" \
    -d '{
          "userId": "abrar2030",
          "message": "Your payment was successful.",
          "type": "payment_confirmation"
        }'
    ```

Each endpoint in the gateway is prefixed with `/api`, and the gateway handles JWT authentication and service routing.

---

## Notes

- **Authentication**: Most endpoints require a Bearer token in the `Authorization` header.
- **Error Handling**: Standard HTTP status codes are used, with `400 Bad Request`, `401 Unauthorized`, and `404 Not Found` for common errors.
- **Rate Limiting**: API Gateway may enforce rate limiting to prevent abuse.

---

This documentation provides a high-level overview of each API endpoint and the expected input/output formats for the PayNext project.

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
`/user-service`

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

- **GET /profile** - Retrieves the profile information of the logged-in user.
    - **Headers**: `Authorization: Bearer <token>`
    - **Response**:
        - `200 OK`: User profile information.

---

## Payment Service

### Base URL
`/payment-service`

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

- **GET /payments/{id}** - Retrieves payment details by ID.
    - **Headers**: `Authorization: Bearer <token>`
    - **Response**:
        - `200 OK`: Payment details.

- **GET /payments/user/{userId}** - Retrieves all payments for a specific user.
    - **Headers**: `Authorization: Bearer <token>`
    - **Response**:
        - `200 OK`: List of payments.

---

## Notification Service

### Base URL
`/notification-service`

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

- **GET /notifications/user/{userId}** - Retrieves all notifications for a specific user.
    - **Headers**: `Authorization: Bearer <token>`
    - **Response**:
        - `200 OK`: List of notifications.

---

## API Gateway

The API Gateway routes requests to the appropriate microservices.

### Base URL
`/api`

### Endpoints

- **POST /api/auth/register** - Routes to the User Service to register a new user.
- **POST /api/auth/login** - Routes to the User Service to authenticate a user.
- **POST /api/payments** - Routes to the Payment Service to initiate a payment.
- **POST /api/notifications** - Routes to the Notification Service to send a notification.

Each endpoint in the gateway is prefixed with `/api`, and the gateway handles JWT authentication and service routing.

---

## Notes

- **Authentication**: Most endpoints require a Bearer token in the `Authorization` header.
- **Error Handling**: Standard HTTP status codes are used, with `400 Bad Request`, `401 Unauthorized`, and `404 Not Found` for common errors.
- **Rate Limiting**: API Gateway may enforce rate limiting to prevent abuse.

---

This documentation provides a high-level overview of each API endpoint and the expected input/output formats for the PayNext project.
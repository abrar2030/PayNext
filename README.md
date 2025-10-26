# PayNext

![CI/CD Status](https://img.shields.io/github/actions/workflow/status/abrar2030/PayNext/cicd.yml?branch=main&label=CI/CD&logo=github)
[![Test Coverage](https://img.shields.io/badge/coverage-87%25-brightgreen)](https://github.com/abrar2030/PayNext/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 💳 Modern Microservices Payment Platform

PayNext is a robust, scalable payment processing platform built on a microservices architecture. It provides secure, fast, and reliable payment solutions for businesses of all sizes, with support for multiple payment methods and currencies.

<div align="center">
  <img src="docs/images/PayNext_dashboard.bmp" alt="PayNext Dashboard" width="80%">
</div>

> **Note**: This project is under active development. Features and functionalities are continuously being enhanced to improve payment processing capabilities and user experience.

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Services](#services)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [CI/CD Pipeline](#cicd-pipeline)
- [Deployment with Kubernetes](#deployment-with-kubernetes)
- [Scripts](#scripts)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Overview

PayNext is a comprehensive payment processing platform designed with a microservices architecture to ensure scalability, resilience, and maintainability. The system handles various payment methods, provides robust security features, and offers a seamless user experience for both merchants and customers.

## Architecture

PayNext follows a microservices architecture with the following components:

```
PayNext/
├── API Gateway
│   └── Routes requests to appropriate services
├── Service Registry
│   └── Manages service discovery
├── Config Server
│   └── Centralizes configuration management
├── Core Services
│   ├── User Service
│   ├── Payment Service
│   ├── Transaction Service
│   ├── Notification Service
│   └── Reporting Service
├── Frontend Applications
│   ├── Web Dashboard
│   └── Mobile App
└── Infrastructure
    ├── Database Cluster
    ├── Message Queue
    ├── Cache Layer
    └── Monitoring Stack
```

### Request Flow
1. Client requests are received by the API Gateway
2. Gateway routes requests to appropriate microservices
3. Services communicate with each other via REST APIs or message queues
4. Service Registry maintains a registry of available services
5. Config Server provides centralized configuration management

## Features

### Payment Processing
* **Multiple Payment Methods**: Support for credit/debit cards, bank transfers, digital wallets
* **International Payments**: Multi-currency support with automatic conversion
* **Recurring Payments**: Scheduled and subscription-based payment processing
* **Split Payments**: Divide payments among multiple recipients
* **Payment Links**: Generate shareable payment links

### Security
* **PCI DSS Compliance**: Adherence to Payment Card Industry Data Security Standards
* **Fraud Detection**: AI-powered fraud detection and prevention
* **Tokenization**: Secure handling of sensitive payment information
* **Two-Factor Authentication**: Enhanced security for user accounts
* **Encryption**: End-to-end encryption for all transactions

### User Management
* **Merchant Onboarding**: Streamlined process for merchant registration
* **Customer Profiles**: Secure storage of customer payment preferences
* **Role-Based Access Control**: Granular permissions for different user types
* **Account Management**: Self-service tools for account maintenance

### Reporting & Analytics
* **Transaction Reports**: Detailed insights into payment activities
* **Financial Reconciliation**: Tools for balancing accounts
* **Business Intelligence**: Analytics dashboard for performance metrics
* **Export Capabilities**: Data export in various formats (CSV, PDF, Excel)
* **Custom Reports**: Configurable reporting options

## Technology Stack

### Backend
* **Framework**: Spring Boot, Spring Cloud
* **Language**: Java 17
* **Database**: MySQL, MongoDB
* **Message Queue**: RabbitMQ, Kafka
* **Cache**: Redis
* **Service Discovery**: Netflix Eureka
* **API Gateway**: Spring Cloud Gateway
* **Config Server**: Spring Cloud Config

### Web Frontend
* **Framework**: React with TypeScript
* **State Management**: Redux Toolkit
* **Styling**: Material-UI, Styled Components
* **API Client**: Axios
* **Data Visualization**: Recharts, D3.js

### Mobile Frontend
* **Framework**: React Native
* **Navigation**: React Navigation
* **State Management**: Redux Toolkit
* **UI Components**: React Native Paper

### Infrastructure
* **Containerization**: Docker
* **Orchestration**: Kubernetes
* **CI/CD**: GitHub Actions
* **Monitoring**: Prometheus, Grafana
* **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
* **Infrastructure as Code**: Terraform, Helm

## Services

### API Gateway
* Routes client requests to appropriate microservices
* Handles authentication and authorization
* Implements rate limiting and circuit breaking
* Provides API documentation with Swagger

### User Service
* Manages user registration and authentication
* Handles user profiles and preferences
* Implements role-based access control
* Provides account management functionality

### Payment Service
* Processes payment transactions
* Integrates with payment gateways and providers
* Handles payment method management
* Implements payment security measures

### Transaction Service
* Records and manages transaction history
* Provides transaction status tracking
* Handles refunds and chargebacks
* Implements transaction reconciliation

### Notification Service
* Sends transaction notifications and alerts
* Manages notification preferences
* Supports multiple channels (email, SMS, push)
* Handles notification templates

### Reporting Service
* Generates financial and transaction reports
* Provides analytics and insights
* Handles data export functionality
* Implements custom reporting options

## Getting Started

### Prerequisites
* Java 17
* Maven
* Docker and Docker Compose
* Kubernetes (for production deployment)
* Node.js and npm

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/abrar2030/PayNext.git
   cd PayNext
   ```

2. **Start infrastructure services with Docker Compose**
   ```bash
   docker-compose up -d mysql rabbitmq redis
   ```

3. **Build and run backend services**
   ```bash
   # Using the convenience script
   ./paynext.sh build-run-backend
   
   # Or manually
   cd backend
   ./mvnw clean package
   java -jar service-registry/target/service-registry.jar &
   java -jar config-server/target/config-server.jar &
   java -jar api-gateway/target/api-gateway.jar &
   java -jar user-service/target/user-service.jar &
   java -jar payment-service/target/payment-service.jar &
   ```

4. **Build and run frontend**
   ```bash
   cd web-frontend
   npm install
   npm start
   ```

5. **Access the application**
   * Web Dashboard: [http://localhost:3000](http://localhost:3000)
   * API Gateway: [http://localhost:8080](http://localhost:8080)
   * Service Registry: [http://localhost:8761](http://localhost:8761)
   * Swagger UI: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

### Docker Compose Setup

To run the entire application stack using Docker Compose:

```bash
# Build and start all services
./docker-build-and-compose.sh

# Or use Docker Compose directly
docker-compose up --build
```

### Mobile App Setup

```bash
cd mobile-frontend
npm install
npx react-native run-android  # For Android
npx react-native run-ios      # For iOS
```

## API Endpoints

### User API
* `POST /api/users/register` - Register a new user
* `POST /api/users/login` - User login
* `GET /api/users/profile` - Get user profile
* `PUT /api/users/profile` - Update user profile

### Payment API
* `POST /api/payments` - Initiate a new payment
* `GET /api/payments/{id}` - Get payment details
* `GET /api/payments/history` - Retrieve payment history
* `POST /api/payments/methods` - Add payment method
* `GET /api/payments/methods` - List payment methods

### Transaction API
* `GET /api/transactions` - List transactions
* `GET /api/transactions/{id}` - Get transaction details
* `POST /api/transactions/{id}/refund` - Process refund
* `GET /api/transactions/reports` - Generate transaction reports

## Testing

The project maintains comprehensive test coverage across all components to ensure reliability and security.

### Test Coverage

| Component | Coverage | Status |
|-----------|----------|--------|
| API Gateway | 85% | ✅ |
| User Service | 90% | ✅ |
| Payment Service | 92% | ✅ |
| Transaction Service | 88% | ✅ |
| Notification Service | 84% | ✅ |
| Reporting Service | 82% | ✅ |
| Web Frontend | 85% | ✅ |
| Mobile Frontend | 80% | ✅ |
| Overall | 87% | ✅ |

### Backend Tests
* Unit tests for service and repository layers
* Integration tests for API endpoints
* Contract tests for service interactions
* Performance tests for critical operations

### Frontend Tests
* Component tests with React Testing Library
* Integration tests with Cypress
* End-to-end tests for critical user flows
* Snapshot tests for UI components

### Running Tests

```bash
# Backend tests
cd backend
./mvnw test

# Frontend tests
cd web-frontend
npm test

# End-to-end tests
cd e2e-tests
npm test

# Run all tests
./run-all-tests.sh
```

## CI/CD Pipeline

PayNext uses GitHub Actions for continuous integration and deployment:

* Automated testing on each pull request
* Code quality checks with SonarQube
* Security scanning with OWASP Dependency Check
* Docker image building and publishing
* Automated deployment to staging and production environments

## Deployment with Kubernetes

PayNext can be deployed to Kubernetes using the provided manifests:

```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/

# Or use Helm
helm install paynext ./helm/paynext
```

The deployment includes:
* Horizontal Pod Autoscaling
* Ingress configuration
* Persistent volume claims
* ConfigMaps and Secrets management
* Readiness and liveness probes

## Scripts

The repository includes several utility scripts:

* `paynext.sh` - Main script for common operations
* `docker-build-and-compose.sh` - Build and run with Docker Compose
* `run-all-tests.sh` - Run all tests across the platform
* `deploy-to-k8s.sh` - Deploy to Kubernetes cluster

## Technologies Used

* **Languages**: Java, TypeScript, JavaScript
* **Frameworks**: Spring Boot, React, React Native
* **Databases**: MySQL, MongoDB, Redis
* **Tools**: Docker, Kubernetes, Maven, npm
* **CI/CD**: GitHub Actions, SonarQube

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
# PayNext

[![CI/CD Status](https://img.shields.io/github/actions/workflow/status/abrar2030/PayNext/complete-workflow.yml?branch=main&label=CI/CD&logo=github)](https://github.com/abrar2030/PayNext/actions)
[![Backend Status](https://img.shields.io/github/actions/workflow/status/abrar2030/PayNext/backend-workflow.yml?branch=main&label=Backend&logo=spring)](https://github.com/abrar2030/PayNext/actions)
[![Frontend Status](https://img.shields.io/github/actions/workflow/status/abrar2030/PayNext/frontend-workflow.yml?branch=main&label=Frontend&logo=react)](https://github.com/abrar2030/PayNext/actions)
[![License](https://img.shields.io/github/license/abrar2030/PayNext)](https://github.com/abrar2030/PayNext/blob/main/LICENSE)

## 💳 Modern Microservices Payment Platform

PayNext is a robust, scalable payment processing platform built on a microservices architecture. It provides secure, fast, and reliable payment solutions for businesses of all sizes, with support for multiple payment methods and currencies.

<div align="center">
  <img src="docs/paynext_dashboard.png" alt="PayNext Dashboard" width="80%">
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

### Communication Flow
1. Client requests are received by the API Gateway
2. Gateway routes requests to appropriate microservices
3. Services communicate with each other via REST APIs or message queues
4. Service Registry maintains a registry of available services
5. Config Server provides centralized configuration management

## Features

### Payment Processing
- **Multiple Payment Methods**: Support for credit/debit cards, bank transfers, digital wallets
- **International Payments**: Multi-currency support with automatic conversion
- **Recurring Payments**: Scheduled and subscription-based payment processing
- **Split Payments**: Divide payments among multiple recipients
- **Payment Links**: Generate shareable payment links

### Security
- **PCI DSS Compliance**: Adherence to Payment Card Industry Data Security Standards
- **Fraud Detection**: AI-powered fraud detection and prevention
- **Tokenization**: Secure handling of sensitive payment information
- **Two-Factor Authentication**: Enhanced security for user accounts
- **Encryption**: End-to-end encryption for all transactions

### User Management
- **Merchant Onboarding**: Streamlined process for merchant registration
- **Customer Profiles**: Secure storage of customer payment preferences
- **Role-Based Access Control**: Granular permissions for different user types
- **Account Management**: Self-service tools for account maintenance

### Reporting & Analytics
- **Transaction Reports**: Detailed insights into payment activities
- **Financial Reconciliation**: Tools for balancing accounts
- **Business Intelligence**: Analytics dashboard for performance metrics
- **Export Capabilities**: Data export in various formats (CSV, PDF, Excel)
- **Custom Reports**: Configurable reporting options

## Technology Stack

### Backend
- **Framework**: Spring Boot, Spring Cloud
- **Language**: Java 17
- **Database**: MySQL, MongoDB
- **Message Queue**: RabbitMQ, Kafka
- **Cache**: Redis
- **Service Discovery**: Netflix Eureka
- **API Gateway**: Spring Cloud Gateway
- **Config Server**: Spring Cloud Config

### Frontend
- **Framework**: React with TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Material-UI, Styled Components
- **API Client**: Axios
- **Data Visualization**: Recharts, D3.js

### Mobile App
- **Framework**: React Native
- **Navigation**: React Navigation
- **State Management**: Redux Toolkit
- **UI Components**: React Native Paper

### DevOps
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus, Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Infrastructure as Code**: Terraform, Helm

## Services

### API Gateway
- Routes client requests to appropriate microservices
- Handles authentication and authorization
- Implements rate limiting and circuit breaking
- Provides API documentation with Swagger

### User Service
- Manages user registration and authentication
- Handles user profiles and preferences
- Implements role-based access control
- Provides account management functionality

### Payment Service
- Processes payment transactions
- Integrates with payment gateways and providers
- Handles payment method management
- Implements payment security measures

### Transaction Service
- Records and manages transaction history
- Provides transaction status tracking
- Handles refunds and chargebacks
- Implements transaction reconciliation

### Notification Service
- Sends transaction notifications and alerts
- Manages notification preferences
- Supports multiple channels (email, SMS, push)
- Handles notification templates

### Reporting Service
- Generates financial and transaction reports
- Provides analytics and insights
- Handles data export functionality
- Implements custom reporting options

## Getting Started

### Prerequisites
- Java 17
- Maven
- Docker and Docker Compose
- Kubernetes (for production deployment)
- Node.js and npm

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
   - Web Dashboard: http://localhost:3000
   - API Gateway: http://localhost:8080
   - Service Registry: http://localhost:8761
   - Swagger UI: http://localhost:8080/swagger-ui.html

### Using Docker Compose

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

### User Service
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Payment Service
- `POST /api/payments` - Initiate a new payment
- `GET /api/payments/{id}` - Get payment details
- `GET /api/payments/history` - Retrieve payment history
- `POST /api/payments/methods` - Add payment method
- `GET /api/payments/methods` - List payment methods

### Transaction Service
- `GET /api/transactions` - List transactions
- `GET /api/transactions/{id}` - Get transaction details
- `POST /api/transactions/{id}/refund` - Process refund

### Notification Service
- `POST /api/notifications` - Send a notification
- `GET /api/notifications` - List notifications
- `PUT /api/notifications/preferences` - Update notification preferences

## Testing

The project includes comprehensive testing to ensure reliability and functionality:

### Unit Testing
- Backend services are tested using JUnit and Mockito
- Frontend components are tested with Jest and React Testing Library
- Each microservice has its own test suite

### Integration Testing
- API endpoint integration tests
- Service-to-service communication tests
- Database interaction tests

### End-to-End Testing
- Complete user workflows tested with Cypress
- Payment processing flow validation
- Authentication and authorization testing

### Performance Testing
- Load testing with JMeter
- Stress testing for high transaction volumes
- Response time benchmarking

To run tests:
```bash
# Backend tests (from each service directory)
./mvnw test

# Frontend tests
cd web-frontend
npm test

# End-to-end tests
cd web-frontend
npm run test:e2e

# Run all tests with the convenience script
./run_all_tests.sh
```

## CI/CD Pipeline

PayNext uses GitHub Actions for continuous integration and deployment:

### Continuous Integration
- Automated testing on each pull request and push to main
- Code quality checks with SonarQube
- Test coverage reporting
- Security scanning for vulnerabilities

### Continuous Deployment
- Automated deployment to staging environment on merge to main
- Manual promotion to production after approval
- Docker image building and publishing
- Kubernetes deployment updates

Current CI/CD Status:
- Main: ![CI/CD Status](https://img.shields.io/github/actions/workflow/status/abrar2030/PayNext/complete-workflow.yml?branch=main&label=build)
- Backend: ![Backend Status](https://img.shields.io/github/actions/workflow/status/abrar2030/PayNext/backend-workflow.yml?branch=main&label=backend)
- Frontend: ![Frontend Status](https://img.shields.io/github/actions/workflow/status/abrar2030/PayNext/frontend-workflow.yml?branch=main&label=frontend)

## Deployment with Kubernetes

The project includes Kubernetes manifests and Helm charts for deployment:

### Kubernetes Directory Structure
```
k8s/
├── base/                # Base Kubernetes configurations
├── overlays/            # Environment-specific overlays
│   ├── development/
│   ├── staging/
│   └── production/
└── helm/                # Helm charts for deployment
```

### Helm Commands
To install the chart:
```bash
helm install paynext ./k8s/helm
```

To uninstall the chart:
```bash
helm uninstall paynext
```

### Kubernetes Deployment
```bash
# Deploy to development environment
./kubernetes-auto-deploy.sh development

# Deploy to staging environment
./kubernetes-auto-deploy.sh staging

# Deploy to production environment
./kubernetes-auto-deploy.sh production
```

## Scripts

The project contains several scripts for managing services and deployment:

- **paynext.sh**: Main script for managing the application with various commands
- **docker-build-and-compose.sh**: Builds Docker images and starts services with Docker Compose
- **kubernetes-auto-deploy.sh**: Automates deployment to Kubernetes environments
- **run_all_tests.sh**: Runs all tests across the project
- **manage-services.sh**: Manages individual microservices (build, run, stop)
- **start-service.sh**: Starts a specific service with proper configuration

## Technologies Used

- **Backend**: Java 17, Spring Boot, Spring Cloud, Spring Data JPA, Spring Security
- **Frontend**: React.js, TypeScript, Redux, Material-UI
- **Mobile**: React Native, Redux
- **Database**: MySQL, MongoDB, Redis
- **Messaging**: RabbitMQ, Kafka
- **Authentication**: JWT, OAuth 2.0
- **Documentation**: Swagger, Spring REST Docs
- **Containerization**: Docker
- **Orchestration**: Kubernetes, Helm
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus, Grafana, ELK Stack

## Contributing

We welcome contributions to improve PayNext! Here's how you can contribute:

1. **Fork the repository**
   - Create your own copy of the project to work on

2. **Create a feature branch**
   - `git checkout -b feature/amazing-feature`
   - Use descriptive branch names that reflect the changes

3. **Make your changes**
   - Follow the coding standards and guidelines
   - Write clean, maintainable, and tested code
   - Update documentation as needed

4. **Commit your changes**
   - `git commit -m 'Add some amazing feature'`
   - Use clear and descriptive commit messages
   - Reference issue numbers when applicable

5. **Push to branch**
   - `git push origin feature/amazing-feature`

6. **Open Pull Request**
   - Provide a clear description of the changes
   - Link to any relevant issues
   - Respond to review comments and make necessary adjustments

### Development Guidelines
- Follow Java code conventions for backend services
- Use ESLint and Prettier for JavaScript/React code
- Write unit tests for new features
- Update documentation for any changes
- Ensure all tests pass before submitting a pull request
- Keep pull requests focused on a single feature or fix

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

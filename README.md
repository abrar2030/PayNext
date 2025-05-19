# Microservices-Based FinTech Payment Solution

[![CI Status](https://img.shields.io/github/actions/workflow/status/abrar2030/PayNext/ci-cd.yml?branch=main&label=CI&logo=github)](https://github.com/abrar2030/PayNext/actions)
[![CI Status](https://img.shields.io/github/workflow/status/abrar2030/PayNext/CI/main?label=CI)](https://github.com/abrar2030/PayNext/actions)
[![Test Coverage](https://img.shields.io/codecov/c/github/abrar2030/PayNext/main?label=Coverage)](https://codecov.io/gh/abrar2030/PayNext)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

This project is a microservices-based payment solution built with Spring Boot and React.js. It consists of multiple backend microservices, a frontend application, deployment scripts, CI/CD configurations, and Kubernetes configurations, providing a comprehensive FinTech payment platform.


<div align="center">
  <img src="docs/PayNext.bmp" alt="A microservices-based payment solution" width="100%">
</div>

> **Note**: PayNext is currently under active development. Features and functionalities are being added and improved continuously to enhance user experience.

## Table of Contents

- [Architecture](#architecture)
- [Services](#services)
- [Feature Implementation Status](#feature-implementation-status)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Using the Application](#using-the-application)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [CI/CD Pipeline](#cicd-pipeline)
- [Deployment with Kubernetes](#deployment-with-kubernetes)
- [Scripts](#scripts)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Architecture

The application follows a microservices architecture, consisting of:

- **Eureka Server**: Service registry for microservices.
- **API Gateway**: Routes external requests to appropriate microservices.
- **User Service**: Manages user accounts and authentication.
- **Payment Service**: Handles payment transactions.
- **Notification Service**: Sends notifications to users.
- **Frontend Application**: Built with React.js to provide a user interface.
- **MySQL Database**: Used for storing persistent data related to users and transactions.

The backend services communicate via REST APIs, and the microservices are registered with the Eureka Server for service discovery.

## Services

### Backend Services

- **Eureka Server** (`eureka-server`): Runs on port `8001`.
- **API Gateway** (`api-gateway`): Runs on port `8002`.
- **User Service** (`user-service`): Runs on port `8003`. Manages user registration, login, and user-related operations.
- **Payment Service** (`payment-service`): Runs on port `8004`. Manages payment initiation, processing, and history.
- **Notification Service** (`notification-service`): Runs on port `8005`. Handles notifications, such as payment confirmations.

### Frontend Application

- **React.js Application** (`frontend`): Runs on port `3000`. It provides the user interface for interacting with the backend services, allowing users to register, make payments, view payment history, and more.

## Feature Implementation Status

| Feature | Status | Description | Planned Release |
|---------|--------|-------------|----------------|
| **Core Infrastructure** |
| Eureka Server | ✅ Implemented | Service registry for microservices | v1.0 |
| API Gateway | ✅ Implemented | Request routing and load balancing | v1.0 |
| Docker Containerization | ✅ Implemented | Containerized services | v1.0 |
| Kubernetes Deployment | ✅ Implemented | Orchestration for containers | v1.0 |
| CI/CD Pipeline | ✅ Implemented | Automated testing and deployment | v1.0 |
| **User Service** |
| User Registration | ✅ Implemented | Account creation functionality | v1.0 |
| User Authentication | ✅ Implemented | Secure login with JWT | v1.0 |
| Profile Management | ✅ Implemented | User profile editing | v1.0 |
| Role-based Authorization | ✅ Implemented | Access control based on roles | v1.0 |
| Password Recovery | 🔄 In Progress | Reset forgotten passwords | v1.1 |
| Multi-factor Authentication | 📅 Planned | Enhanced security with 2FA | v1.2 |
| **Payment Service** |
| Payment Initiation | ✅ Implemented | Start payment transactions | v1.0 |
| Payment Processing | ✅ Implemented | Execute payment transactions | v1.0 |
| Payment History | ✅ Implemented | View past transactions | v1.0 |
| Recurring Payments | 🔄 In Progress | Scheduled regular payments | v1.1 |
| International Payments | 🔄 In Progress | Cross-border transactions | v1.1 |
| Payment Analytics | 📅 Planned | Transaction insights and reporting | v1.2 |
| **Notification Service** |
| Email Notifications | ✅ Implemented | Transaction alerts via email | v1.0 |
| In-app Notifications | ✅ Implemented | Alerts within the application | v1.0 |
| Notification Preferences | 🔄 In Progress | User-defined alert settings | v1.1 |
| SMS Notifications | 📅 Planned | Transaction alerts via SMS | v1.2 |
| Push Notifications | 📅 Planned | Mobile device alerts | v1.2 |
| **Frontend Application** |
| User Dashboard | ✅ Implemented | Main user interface | v1.0 |
| Payment Interface | ✅ Implemented | Transaction creation UI | v1.0 |
| Transaction History | ✅ Implemented | View past payments | v1.0 |
| Responsive Design | ✅ Implemented | Mobile-friendly interface | v1.0 |
| Advanced Filtering | 🔄 In Progress | Enhanced transaction search | v1.1 |
| Data Visualization | 📅 Planned | Charts and graphs for insights | v1.2 |

**Legend:**
- ✅ Implemented: Feature is complete and available
- 🔄 In Progress: Feature is currently being developed
- 📅 Planned: Feature is planned for future release

## Prerequisites

- **Java 17** or higher installed.
- **Node.js** and **npm** installed.
- **Docker** and **Docker Compose** installed.
- **Minikube** for local Kubernetes deployment.
- **kubectl** for managing Kubernetes clusters.

## Installation

### Clone the Repository

```bash
git clone https://github.com/abrar2030/PayNext.git
cd PayNext
```

### Setup Environment Variables

Set up the necessary environment variables for JWT secrets and Eureka server URLs in the backend services.

You can create a `.env` file or use Kubernetes secrets for deployment.

## Running the Application

### Docker Setup

Build and run all the microservices and the frontend using Docker Compose:

```bash
docker-compose up --build
```

### Kubernetes Deployment

Deploy the application on Minikube using the provided Helm charts:

1. Start Minikube:

   ```bash
   minikube start
   ```

2. Deploy using Helm:

   ```bash
   helm install paynext kubernetes
   ```

## Using the Application

Once the application is running, access the frontend using your browser:

- **Frontend URL**: [http://localhost:3000](http://localhost:3000)

### User Registration and Login
- Users can register by providing their details.
- Login with credentials to access the payment features.

### Payment Processing
- Initiate payments by filling in the required details.
- View payment history.

### Notifications
- Notifications are sent upon successful payment transactions.

## API Endpoints

### User Service
- `POST /api/users/register` - Register a new user.
- `POST /api/users/login` - User login.

### Payment Service
- `POST /api/payments` - Initiate a new payment.
- `GET /api/payments/history` - Retrieve payment history.

### Notification Service
- `POST /api/notifications` - Send a notification.

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
cd frontend
npm test

# End-to-end tests
cd frontend
npm run test:e2e

# Run all tests with the convenience script
./run-all-tests.sh
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
- Build: ![Build Status](https://img.shields.io/github/workflow/status/abrar2030/PayNext/CI/main?label=build)
- Test Coverage: ![Coverage](https://img.shields.io/codecov/c/github/abrar2030/PayNext/main?label=coverage)
- Code Quality: ![Code Quality](https://img.shields.io/sonar/quality_gate/abrar2030_PayNext?server=https%3A%2F%2Fsonarcloud.io&label=code%20quality)

## Deployment with Kubernetes

The project includes a Helm chart for Kubernetes deployment. All services are defined as Kubernetes deployments and services.

### Helm Chart Directory
- **kubernetes**: Contains Helm templates for deploying all backend services, the frontend, and related Kubernetes configurations.

### Helm Commands

To install the chart:

```bash
helm install paynext ./kubernetes
```

To uninstall the chart:

```bash
helm uninstall paynext
```

## Scripts

The project contains several scripts for managing services and deployment:

- **docker-minikube-deploy.sh**: Builds Docker images for each service and deploys them to Minikube.
- **manage-services.sh**: A script for managing individual microservices, including options to clean, build, and run services.
- **git-auto-commit.sh**: Automates the process of committing and pushing changes to the GitHub repository.
- **git-auto-rebase.sh**: Automates rebasing the current branch onto a target branch.
- **build-and-run.sh**: Builds and runs the backend and frontend services.

## Technologies Used

- **Backend**: Java, Spring Boot, Spring Cloud (Netflix Eureka), Spring Data JPA, Spring Security.
- **Frontend**: React.js, Axios for API calls.
- **Database**: MySQL.
- **Authentication**: JWT (JSON Web Tokens).
- **Containerization**: Docker.
- **Orchestration**: Kubernetes, Helm.
- **CI/CD**: GitHub Actions for automated testing, building, and deployment.

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
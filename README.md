# Microservices-Based FinTech Payment Solution

## Overview

This project is a microservices-based payment solution built with Spring Boot and React.js. It consists of multiple backend microservices, a frontend application, deployment scripts, CI/CD configurations, and Kubernetes configurations, providing a comprehensive FinTech payment platform.

Note: PayNext is currently under active development. Features and functionalities are being added and improved continuously to enhance user experience.

## Table of Contents

- [Architecture](#architecture)
- [Services](#services)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Using the Application](#using-the-application)
- [API Endpoints](#api-endpoints)
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

- **React.js Application** (`fintech-payment-frontend`): Runs on port `3000`. It provides the user interface for interacting with the backend services, allowing users to register, make payments, view payment history, and more.

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
   helm install paynext paynext-chart
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

## Deployment with Kubernetes

The project includes a Helm chart for Kubernetes deployment. All services are defined as Kubernetes deployments and services.

### Helm Chart Directory
- **paynext-chart**: Contains Helm templates for deploying all backend services, the frontend, and related Kubernetes configurations.

### Helm Commands

To install the chart:

```bash
helm install paynext ./paynext-chart
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

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

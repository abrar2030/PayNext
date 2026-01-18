# GitHub Workflows Documentation for PayNext

This document provides a comprehensive overview of the GitHub Actions workflows used in the PayNext project. These workflows automate the continuous integration and continuous deployment (CI/CD) processes for both the backend and frontend components of the application.

## Overview

The PayNext project is a payment processing platform with a microservices architecture. It uses GitHub Actions to automate testing, building, and deployment processes across multiple components:

- Backend Services (Java/Spring Boot):
  - Eureka Server (Service Discovery)
  - API Gateway
  - User Service
  - Payment Service
  - Notification Service
- Frontend Application (React/Node.js)

The workflow architecture is designed with a modular approach, allowing for independent processing of backend and frontend components, as well as a complete workflow that orchestrates both.

## Workflow Structure

### Backend CI/CD Pipeline (`backend-workflow.yml`)

This workflow handles the continuous integration and continuous deployment pipeline for the Java-based backend microservices.

**Triggers:**

- Push to `main` or `develop` branches with changes in the `backend/` directory or the workflow file itself
- Pull requests targeting `main` or `develop` branches with changes in the `backend/` directory or the workflow file itself

**Key Jobs:**

1. **build-and-test**: Builds and tests the backend services.
   - Sets up JDK 17 (Temurin distribution) with Maven caching
   - Builds the application using Maven
   - Runs tests and uploads test results as artifacts
   - Uploads JAR files as artifacts for later use

2. **code-quality**: Performs code quality analysis.
   - Depends on successful completion of the build-and-test job
   - Runs SonarQube analysis to identify code quality issues and vulnerabilities
   - Uses repository secrets for SonarQube authentication

3. **docker-build-and-push**: Builds and pushes Docker images for all microservices.
   - Depends on successful completion of both build-and-test and code-quality jobs
   - Only runs on push events to main or develop branches
   - Sets up Docker Buildx for efficient builds
   - Downloads the previously built JAR artifacts
   - Sets environment tag based on the branch (latest for main, develop for develop)
   - Builds and pushes Docker images for each microservice:
     - Eureka Server
     - API Gateway
     - User Service
     - Payment Service
     - Notification Service

4. **deploy**: Deploys the backend services to Kubernetes.
   - Depends on successful completion of the docker-build-and-push job
   - Only runs on push events to the main branch
   - Uses the production environment configuration
   - Sets up kubectl for Kubernetes interaction
   - Applies Kubernetes deployment manifests for each service
   - Verifies successful deployment with rollout status checks

**Environment Variables and Secrets:**

- `GITHUB_TOKEN`: Used for GitHub Actions authentication
- `SONAR_TOKEN`: Authentication token for SonarQube
- `SONAR_HOST_URL`: URL of the SonarQube server
- `DOCKER_USERNAME`: Username for Docker registry authentication
- `DOCKER_PASSWORD`: Password for Docker registry authentication
- `KUBECONFIG`: Kubernetes configuration for deployment

### Frontend CI/CD Pipeline (`frontend-workflow.yml`)

This workflow handles the continuous integration and continuous deployment pipeline for the React-based frontend application.

**Triggers:**

- Push to `main` or `develop` branches with changes in the `frontend/` directory or the workflow file itself
- Pull requests targeting `main` or `develop` branches with changes in the `frontend/` directory or the workflow file itself

**Key Jobs:**

1. **build-and-test**: Builds and tests the frontend application.
   - Sets up Node.js 18 with npm caching
   - Installs dependencies using npm ci
   - Runs linting checks
   - Executes tests with coverage reporting
   - Builds the production-ready frontend
   - Uploads test coverage and build artifacts

2. **docker-build-and-push**: Builds and pushes the frontend Docker image.
   - Depends on successful completion of the build-and-test job
   - Only runs on push events to main or develop branches
   - Downloads the previously built frontend artifacts
   - Sets environment tag based on the branch (latest for main, develop for develop)
   - Builds and pushes the frontend Docker image

3. **deploy**: Deploys the frontend to Kubernetes.
   - Depends on successful completion of the docker-build-and-push job
   - Only runs on push events to the main branch
   - Uses the production environment configuration
   - Applies Kubernetes deployment manifest for the frontend
   - Verifies successful deployment with rollout status check

**Environment Variables and Secrets:**

- `DOCKER_USERNAME`: Username for Docker registry authentication
- `DOCKER_PASSWORD`: Password for Docker registry authentication
- `KUBECONFIG`: Kubernetes configuration for deployment

### Complete CI/CD Pipeline (`complete-workflow.yml`)

This orchestrator workflow coordinates the execution of both backend and frontend workflows and adds additional deployment verification steps.

**Triggers:**

- Push to `main` or `develop` branches
- Pull requests targeting `main` or `develop` branches
- Manual trigger via workflow dispatch

**Key Jobs:**

1. **backend**: Executes the backend workflow.
   - Uses the reusable workflow defined in backend-workflow.yml
   - Passes all secrets to the called workflow

2. **frontend**: Executes the frontend workflow.
   - Uses the reusable workflow defined in frontend-workflow.yml
   - Passes all secrets to the called workflow

3. **deploy-all**: Performs final deployment verification and notification.
   - Depends on successful completion of both backend and frontend jobs
   - Only runs on push events to the main branch
   - Uses the production environment configuration
   - Verifies all Kubernetes resources (deployments, services, pods)
   - Runs integration tests against the deployed services
   - Sends a deployment notification to Slack

**Environment Variables and Secrets:**

- All secrets from backend and frontend workflows
- `SLACK_WEBHOOK_URL`: Webhook URL for Slack notifications

## Workflow Interdependencies

The workflows in this project are designed with the following dependencies:

1. **Component-Specific Workflows**:
   - Backend workflow: build-and-test → code-quality → docker-build-and-push → deploy
   - Frontend workflow: build-and-test → docker-build-and-push → deploy

2. **Complete Workflow**:
   - Orchestrates both component workflows
   - Adds final verification and notification: backend + frontend → deploy-all

This architecture ensures that:

- Components can be built and tested independently
- Code quality is verified before building Docker images
- Docker images are built before deployment
- Production deployments only occur for the main branch
- Final verification ensures all components are properly deployed

## Environment Setup

### Development Environment

The development environment is implicitly defined through the workflows:

1. **Backend**: Java 17 with Maven for building and testing
2. **Frontend**: Node.js 18 with npm for building and testing

### Production Environment

The production environment is configured with the following components:

1. **Container Registry**: Docker Hub (quantsingularity namespace)
2. **Deployment Platform**: Kubernetes
3. **Services**: Deployed as separate Kubernetes deployments
4. **Configuration**: Stored in Kubernetes manifests in the kubernetes/ directory

### Secrets Management

The following secrets are required for the workflows to function properly:

- `SONAR_TOKEN`: Authentication token for SonarQube
- `SONAR_HOST_URL`: URL of the SonarQube server
- `DOCKER_USERNAME`: Username for Docker registry authentication
- `DOCKER_PASSWORD`: Password for Docker registry authentication
- `KUBECONFIG`: Kubernetes configuration for deployment
- `SLACK_WEBHOOK_URL`: Webhook URL for Slack notifications

These secrets should be configured in the repository settings under "Secrets and variables" → "Actions".

## Best Practices and Recommendations

### Adding New Microservices

When adding a new microservice to the project:

1. Add the service to the docker-build-and-push job in the backend workflow
2. Create a Kubernetes deployment manifest in the kubernetes directory
3. Add the deployment and verification steps to the deploy job

### Troubleshooting

Common issues and their solutions:

1. **Failed Tests**: Check the test results artifact for specific failures
2. **SonarQube Analysis Failures**: Verify SonarQube credentials and project configuration
3. **Docker Build Failures**: Check Docker registry credentials and build context
4. **Deployment Failures**: Verify Kubernetes configuration and manifest validity

### Security Considerations

- Secrets are securely managed by GitHub Actions
- SonarQube analysis identifies security vulnerabilities
- Docker images are built with specific tags to ensure version control
- Kubernetes deployments use secure configurations

## Workflow Customization

To customize the workflows for specific needs:

1. **Modifying Build Parameters**: Update the Maven or npm build commands
2. **Changing Deployment Targets**: Update the Kubernetes manifests
3. **Adding New Services**: Add new build and deployment steps for the service

## Reusable Workflow Pattern

The project implements a reusable workflow pattern through the complete-workflow.yml file, which:

1. Calls the backend and frontend workflows as reusable workflows
2. Passes all secrets to the called workflows
3. Adds additional deployment verification and notification steps

This pattern provides several benefits:

- Reduces duplication of workflow configuration
- Centralizes orchestration of the CI/CD pipeline
- Allows for independent execution of component workflows
- Enables comprehensive deployment verification

## Continuous Integration Strategy

The CI strategy implemented in these workflows ensures:

1. **Early Feedback**: Tests and linting run on every pull request
2. **Code Quality**: SonarQube analysis identifies issues before merging
3. **Artifact Management**: Build artifacts are stored for later use
4. **Docker Images**: Images are built and tagged based on the branch

## Continuous Deployment Strategy

The CD strategy implemented in these workflows ensures:

1. **Environment Separation**: Development (develop branch) and production (main branch) environments
2. **Automated Deployment**: Kubernetes deployments are automated for the main branch
3. **Deployment Verification**: Rollout status checks ensure successful deployment
4. **Notification**: Slack notifications inform the team of successful deployments

## Conclusion

The GitHub Actions workflows in the PayNext project provide a robust CI/CD pipeline that ensures code quality, automates testing, and streamlines deployment across multiple application components. The modular architecture allows for independent processing of backend and frontend components, while the complete workflow orchestrates the entire deployment process. By following best practices for workflow design and implementation, the project maintains a reliable and efficient CI/CD pipeline that supports the development and deployment of the payment processing platform.

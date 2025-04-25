# PayNext CI/CD Configuration

This directory contains CI/CD configurations for the PayNext project, including GitHub Actions workflows and Jenkins pipeline configurations.

## GitHub Actions Workflows

The GitHub Actions workflows include:

1. **backend-workflow.yml**: CI/CD pipeline for the Java/Spring Boot backend microservices
   - Builds and tests the backend services (eureka-server, api-gateway, user-service, payment-service, notification-service)
   - Performs code quality analysis with SonarQube
   - Builds and pushes Docker images for each microservice
   - Deploys to Kubernetes in production environment (main branch only)

2. **frontend-workflow.yml**: CI/CD pipeline for the Node.js frontend
   - Builds and tests the frontend application
   - Performs linting and code coverage analysis
   - Builds and pushes Docker image
   - Deploys to Kubernetes in production environment (main branch only)

3. **complete-workflow.yml**: Orchestrator workflow that combines backend and frontend pipelines
   - Uses reusable workflows to trigger both backend and frontend pipelines
   - Performs final verification of all deployments
   - Sends deployment notifications

## Jenkins Pipelines

The Jenkins pipeline configurations include:

1. **Jenkinsfile-backend**: Pipeline for the Java/Spring Boot backend microservices
   - Builds and tests the backend services
   - Performs code quality analysis with SonarQube
   - Builds and pushes Docker images for each microservice
   - Deploys to Kubernetes in production environment (main branch only)

2. **Jenkinsfile-frontend**: Pipeline for the Node.js frontend
   - Builds and tests the frontend application
   - Performs linting and code coverage analysis
   - Builds and pushes Docker image
   - Deploys to Kubernetes in production environment (main branch only)

3. **Jenkinsfile-main**: Main pipeline that orchestrates both backend and frontend pipelines
   - Triggers backend and frontend pipelines
   - Performs integration tests
   - Deploys all services to Kubernetes
   - Runs smoke tests against deployed services

## Setup Instructions

### GitHub Actions Setup

1. Place the workflow files in the `.github/workflows` directory in your repository
2. Configure the following secrets in your GitHub repository:
   - `DOCKER_USERNAME`: Username for Docker registry
   - `DOCKER_PASSWORD`: Password for Docker registry
   - `SONAR_TOKEN`: SonarQube authentication token
   - `SONAR_HOST_URL`: URL of your SonarQube instance
   - `KUBECONFIG`: Kubernetes configuration file
   - `SLACK_WEBHOOK_URL`: Webhook URL for Slack notifications (optional)

### Jenkins Setup

1. Create the following Jenkins pipeline jobs:
   - `PayNext-Backend-Pipeline`: Use `Jenkinsfile-backend`
   - `PayNext-Frontend-Pipeline`: Use `Jenkinsfile-frontend`
   - `PayNext-Main-Pipeline`: Use `Jenkinsfile-main`

2. Configure the following credentials in Jenkins:
   - `docker-credentials`: Username and password for Docker registry
   - `sonarqube-token`: SonarQube authentication token
   - `sonarqube-url`: URL of your SonarQube instance
   - `kubeconfig`: Kubernetes configuration file

3. Install the following Jenkins plugins:
   - Pipeline
   - Docker Pipeline
   - Kubernetes CLI
   - SonarQube Scanner
   - HTML Publisher (for test reports)

## Notes

- These configurations assume that Kubernetes deployment YAML files are located in the `kubernetes` directory
- The Docker image naming convention used is `abrar2030/paynext-[service-name]`
- Modify the deployment steps as needed based on your specific infrastructure requirements

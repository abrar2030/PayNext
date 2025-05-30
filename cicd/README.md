# PayNext CI/CD Configuration

This directory contains CI/CD configurations for the PayNext project, including Jenkins pipeline configurations.

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

# PayNext CI/CD Pipelines (Jenkins)

This directory contains the Jenkins Pipeline definitions for the PayNext microservice application. The pipelines are designed to support a multi-service monorepo structure.

## Refactoring and Enhancement Summary

The Jenkins pipeline structure has been streamlined to eliminate redundant files and introduce a generic, parameterized pipeline for all backend services.

### Key Changes:

*   **File Consolidation**: The monolithic `Jenkinsfile` and the non-parameterized `Jenkinsfile-backend` have been removed.
*   **Generic Service Pipeline**: A new file, **`jenkins/Jenkinsfile-service`**, has been created. This single, parameterized pipeline handles the full CI/CD lifecycle (build, test, SonarQube, Docker build/push, Helm deploy) for **any backend microservice**.
*   **Central Orchestration**: The **`jenkins/Jenkinsfile-main`** now acts as the central orchestrator for the entire application. It defines all services and iteratively calls the generic `Jenkinsfile-service` for each backend service, passing the necessary parameters (e.g., service directory, Docker image name, SonarQube project key).
*   **Frontend Consistency**: The **`jenkins/Jenkinsfile-frontend`** has been updated to use the new Helm-based deployment approach, ensuring consistency with the refactored Kubernetes chart.

## Pipeline Structure

| File | Purpose | Description |
| :--- | :--- | :--- |
| `jenkins/Jenkinsfile-main` | **Orchestrator** | Main pipeline that coordinates the CI/CD for all services. Calls `Jenkinsfile-service` for backend services and `Jenkinsfile-frontend` for the frontend. |
| `jenkins/Jenkinsfile-service` | **Generic Backend Service** | Parameterized pipeline for any backend microservice. Handles Maven build, unit tests, SonarQube analysis, Docker build/push, and Helm deployment. |
| `jenkins/Jenkinsfile-frontend` | **Frontend Service** | Dedicated pipeline for the frontend application. Handles Node.js dependencies, linting, testing, Docker build/push, and Helm deployment. |

## Setup Instructions

### Jenkins Setup

1.  **Job Creation**: The previous three separate jobs (`PayNext-Backend-Pipeline`, `PayNext-Frontend-Pipeline`, `PayNext-Main-Pipeline`) are now consolidated into two main jobs:
    *   **`PayNext-Main-Pipeline`**: A Multibranch Pipeline job that uses the `jenkins/Jenkinsfile-main` file to orchestrate the entire build.
    *   **`PayNext-Service-Pipeline`**: A parameterized Pipeline job that uses the **`jenkins/Jenkinsfile-service`** file. This job is called by `PayNext-Main-Pipeline` for each backend service.
    *   **`PayNext-Frontend-Pipeline`**: A parameterized Pipeline job that uses the **`jenkins/Jenkinsfile-frontend`** file. This job is called by `PayNext-Main-Pipeline` for the frontend service.

2.  **Credentials**: Configure the following credentials in Jenkins Global Credentials:
    *   `docker-credentials`: Username and password for Docker registry.
    *   `sonarqube-token`: SonarQube authentication token (Secret Text).
    *   `kubeconfig`: Kubernetes configuration file (Secret File).

3.  **Plugins**: Ensure the following Jenkins plugins are installed:
    *   Pipeline
    *   Docker Pipeline
    *   Kubernetes CLI
    *   SonarQube Scanner
    *   HTML Publisher (for test reports)
    *   **Build with Parameters** (required for the new parameterized service jobs).

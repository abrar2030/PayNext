# Minikube Deployment Script Documentation

## Overview
This documentation describes the `minikube-deployment.sh` script, which is used to automate the process of building Docker images and deploying services to Minikube. The script is specifically designed for the PayNext project, providing an easy way to deploy various microservices.

## Prerequisites
- [Minikube](https://minikube.sigs.k8s.io/docs/start/) installed and configured.
- Docker installed on your system.
- Kubernetes CLI (kubectl) installed and configured.
- A working Minikube profile (`minikube`) to handle deployments.
- PayNext Helm chart files and Dockerfiles must be available in the correct directories as expected by the script.

## Usage
```sh
./kubernetes-auto-deploy.sh [service-name]
```
- **service-name**: The name of the service you want to deploy. Possible values include:
    - `eureka-server`
    - `api-gateway`
    - `user-service`
    - `payment-service`
    - `notification-service`
    - `fintech-payment-frontend`

## Script Description
This Bash script performs the following actions:

1. **Check Service Name**
    - Checks if a service name is provided as a command-line argument. If not, it displays a usage message and exits.

2. **Start Minikube**
    - Starts Minikube using a specified profile (`minikube`).

3. **Configure Docker Environment**
    - Configures the shell to use Minikube's Docker daemon so that the images can be built inside Minikube's Docker environment.

4. **Build Docker Image**
    - Builds a Docker image for the specified service. The image is tagged as `fintech-[service-name]`.
    - Uses the Dockerfile located in the `backend/[service-name]` directory.

5. **Deploy Service to Minikube**
    - Based on the service name provided, the script applies the relevant Kubernetes deployment and service files located in the `kubernetes/templates` directory.

## Services
The services available for deployment are:
- **eureka-server**: Applies the deployment and service YAML files for Eureka Server.
- **api-gateway**: Applies the deployment and service YAML files for API Gateway.
- **user-service**: Applies the deployment and service YAML files for User Service.
- **payment-service**: Applies the deployment and service YAML files for Payment Service.
- **notification-service**: Applies the deployment and service YAML files for Notification Service.
- **fintech-payment-frontend**: Applies the deployment and service YAML files for the FinTech Payment Frontend.

## Example
To deploy the `user-service`, run the following command:

```sh
./kubernetes-auto-deploy.sh user-service
```
This command will:
1. Start Minikube.
2. Set up the Docker environment to point to Minikube.
3. Build the Docker image for the `user-service` from the `backend/user-service/Dockerfile`.
4. Apply the corresponding Kubernetes deployment and service YAML files to deploy `user-service` to Minikube.

## Exit Codes
- **0**: Successful execution.
- **1**: Missing service name or unrecognized service name.
- **Non-zero exit codes**: Docker build errors or other issues during execution.

## Notes
- The script uses Minikube's Docker environment (`eval $(minikube -p $MINIKUBE_PROFILE docker-env)`) to ensure that the built Docker images are available to the Minikube cluster.
- The Kubernetes resources are deployed using the `kubectl apply -f` command, which expects the YAML files to be in the specified locations (`kubernetes/templates/`).
- If any Docker build errors occur, the script will exit and report the error.

## Troubleshooting
- **Minikube Startup Issues**: Make sure that Minikube is installed and properly configured. Use `minikube status` to check the status.
- **Docker Build Errors**: Verify the Dockerfile paths and that the necessary files are in place for building the Docker image.
- **Service Not Recognized**: Ensure you are using one of the listed services in the `Usage` section. Double-check the spelling.

## Author
This script is part of the PayNext project.

Feel free to update or improve it to suit your project's requirements.

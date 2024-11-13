#!/bin/bash

# =====================================================
# Kubernetes Service Deployment Script
# =====================================================
# This script automates the deployment of Kubernetes
# services for the PayNext project using kubectl.
#
# Usage:
#   ./deploy-services.sh
# =====================================================

# Function to check if kubectl is installed
check_kubectl_installed() {
    if ! command -v kubectl &> /dev/null; then
        echo "Error: kubectl is not installed. Please install kubectl before running this script."
        exit 1
    fi
}

# Check for kubectl installation
check_kubectl_installed

# Array of Kubernetes deployment files
services=(
    "./kubernetes/deployment-eureka-server.yaml"
    "./kubernetes/service-eureka-server.yaml"
    "./kubernetes/deployment-api-gateway.yaml"
    "./kubernetes/service-api-gateway.yaml"
    "./kubernetes/deployment-user-service.yaml"
    "./kubernetes/service-user-service.yaml"
    "./kubernetes/deployment-payment-service.yaml"
    "./kubernetes/service-payment-service.yaml"
    "./kubernetes/deployment-notification-service.yaml"
    "./kubernetes/service-notification-service.yaml"
    "./kubernetes/deployment-frontend.yaml"
    "./kubernetes/service-frontend.yaml"
)

# Loop through the services and apply each one
for service in "${services[@]}"; do
    echo "Deploying $service..."
    if kubectl apply -f "$service"; then
        echo "Successfully deployed $service."
    else
        echo "Error: Failed to deploy $service."
        exit 1
    fi
done

echo "All services have been deployed successfully."

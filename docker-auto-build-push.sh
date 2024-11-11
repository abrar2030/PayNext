#!/bin/bash

# =====================================================
# Docker Auto Build & Push Script
# =====================================================
# This script automates the process of building, tagging,
# and pushing Docker images for all services to Docker Hub.
#
# Usage:
#   ./docker-auto-build-push.sh
# =====================================================

# Exit immediately if a command exits with a non-zero status
set -e

# Function to display usage information
usage() {
    echo "Usage: $0"
    echo ""
    echo "This script builds, tags, and pushes Docker images to Docker Hub for all specified services."
    exit 1
}

# Check if Docker is installed
if ! command -v docker &> /dev/null
then
    echo "Error: Docker is not installed. Please install Docker before running this script."
    exit 1
fi

# Check if Git is installed
if ! command -v git &> /dev/null
then
    echo "Error: Git is not installed. Please install Git before running this script."
    exit 1
fi

# Check if inside a Git repository
if ! git rev-parse --is-inside-work-tree &> /dev/null
then
    echo "Error: This script must be run inside a Git repository."
    exit 1
fi

# Use Docker credentials from environment variables
if [ -z "$DOCKER_USERNAME" ] || [ -z "$DOCKER_PASSWORD" ]; then
    echo "Error: Docker credentials are not set. Please set DOCKER_USERNAME and DOCKER_PASSWORD in your .bashrc file."
    exit 1
fi

# Log in to Docker Hub
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
echo "Successfully logged in to Docker Hub."

# Services to build and push
SERVICES=("eureka-server" "api-gateway" "user-service" "payment-service" "notification-service" "fintech-payment-frontend")

# Iterate over each service to build and push
for SERVICE in "${SERVICES[@]}"
do
    # Determine service path
    if [ "$SERVICE" == "fintech-payment-frontend" ]; then
        SERVICE_PATH="./frontend"
    else
        SERVICE_PATH="./backend/$SERVICE"
    fi

    echo "----------------------------------------"
    echo "Processing service: $SERVICE"
    echo "Service path: $SERVICE_PATH"

    # Check if service directory exists
    if [ ! -d "$SERVICE_PATH" ]; then
        echo "Warning: Directory $SERVICE_PATH does not exist. Skipping $SERVICE."
        continue
    fi

    # Build Docker image
    IMAGE_NAME="$DOCKER_USERNAME/$SERVICE:latest"
    echo "Building Docker image for $SERVICE..."
    docker build -t "$IMAGE_NAME" "$SERVICE_PATH"
    echo "Successfully built $IMAGE_NAME."

    # Push Docker image to Docker Hub
    echo "Pushing Docker image $IMAGE_NAME to Docker Hub..."
    docker push "$IMAGE_NAME"
    echo "Successfully pushed $IMAGE_NAME to Docker Hub."
done

# Logout from Docker Hub
docker logout
echo "Logged out from Docker Hub."

echo "All Docker images have been built and pushed successfully!"
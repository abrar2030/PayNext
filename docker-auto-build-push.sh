#!/bin/bash

# =====================================================
# Docker Auto Build & Push Script
# =====================================================
# This script automates the process of building, tagging,
# and pushing Docker images for frontend and backend services
# to their respective Docker Hub repositories.
#
# Frontend Service:
#   - Image pushed to abrar2030/frontend:latest
#
# Backend Services:
#   - Images pushed to abrar2030/backend-<service>:latest
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
    echo "This script builds, tags, and pushes Docker images to Docker Hub for frontend and backend services."
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
    echo "Error: Docker credentials are not set. Please set DOCKER_USERNAME and DOCKER_PASSWORD in your environment variables."
    exit 1
fi

# Log in to Docker Hub, suppressing only the warning message
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin 2>/dev/null
echo "Successfully logged in to Docker Hub."

# Define Docker Hub repositories
FRONTEND_REPO="$DOCKER_USERNAME/frontend"
BACKEND_PREFIX="$DOCKER_USERNAME/backend"

# Services to build and push
BACKEND_SERVICES=("eureka-server" "api-gateway" "user-service" "payment-service" "notification-service")
# shellcheck disable=SC2034
FRONTEND_SERVICE="fintech-payment-frontend"

# Function to build and push a Docker image
build_and_push() {
    local IMAGE_NAME=$1
    local SERVICE_PATH=$2

    echo "----------------------------------------"
    echo "Building Docker image: $IMAGE_NAME"
    echo "Service path: $SERVICE_PATH"

    # Check if service directory exists
    if [ ! -d "$SERVICE_PATH" ]; then
        echo "Warning: Directory $SERVICE_PATH does not exist. Skipping."
        return
    fi

    # Build Docker image
    echo "Building Docker image for $IMAGE_NAME..."
    docker build -t "$IMAGE_NAME" "$SERVICE_PATH"
    echo "Successfully built $IMAGE_NAME."

    # Push Docker image to Docker Hub
    echo "Pushing Docker image $IMAGE_NAME to Docker Hub..."
    docker push "$IMAGE_NAME"
    echo "Successfully pushed $IMAGE_NAME to Docker Hub."
}

# Build and push backend services
for SERVICE in "${BACKEND_SERVICES[@]}"
do
    SERVICE_PATH="./backend/$SERVICE"
    IMAGE_NAME="$BACKEND_PREFIX-$SERVICE:latest"
    build_and_push "$IMAGE_NAME" "$SERVICE_PATH"
done

# Build and push frontend service
FRONTEND_PATH="./frontend"
FRONTEND_IMAGE="$FRONTEND_REPO:latest"
build_and_push "$FRONTEND_IMAGE" "$FRONTEND_PATH"

# Logout from Docker Hub
docker logout
echo "Logged out from Docker Hub."

echo "All Docker images have been built and pushed successfully!"
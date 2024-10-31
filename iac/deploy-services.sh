#!/bin/bash

# Script to deploy different IAC services

# Define services and paths (update as per your directory structure)
declare -A services
services=(
  ["eureka-server"]="path/to/eureka-server"
  ["api-gateway"]="path/to/api-gateway"
  ["user-service"]="path/to/user-service"
  ["payment-service"]="path/to/payment-service"
  ["notification-service"]="path/to/notification-service"
  ["frontend"]="path/to/frontend"
)

# Usage information
usage() {
  echo "Usage: $0 [service-name | all]"
  echo ""
  echo "Example: $0 eureka-server   # Deploys only the Eureka Server"
  echo "         $0 all             # Deploys all services"
  exit 1
}

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
  echo "Error: Terraform is not installed. Please install it before running this script."
  exit 1
fi

# Deploy a specific service
deploy_service() {
  local service=$1
  local path=${services[$service]}

  echo "Deploying ${service}..."
  cd "$path" || exit
  terraform init
  terraform apply -auto-approve
  echo "${service} deployed successfully."
  cd - > /dev/null || exit
}

# Main deployment function
main() {
  if [ "$1" == "all" ]; then
    for service in "${!services[@]}"; do
      deploy_service "$service"
    done
  elif [[ -n "${services[$1]}" ]]; then
    deploy_service "$1"
  else
    echo "Error: Invalid service name '$1'."
    usage
  fi
}

# Ensure script is called with an argument
if [ "$#" -ne 1 ]; then
  usage
fi

# Call main with the provided argument
main "$1"
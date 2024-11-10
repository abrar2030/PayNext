# Main entry point for Terraform configuration

# Call the VPC module to create networking resources
module "vpc" {
  source = "./vpc"
}

# Call the Kubernetes module to set up the EKS cluster and related resources
module "kubernetes" {
  source       = "./kubernetes"
  cluster_name = var.cluster_name
  vpc_id       = module.vpc.vpc_id
  subnet_ids   = module.vpc.public_subnet_ids
}

# Call the S3 storage module to create an S3 bucket
module "storage" {
  source = "./storage"
}

# Call the service modules for each microservice
module "api_gateway" {
  source       = "./services/api-gateway"
  cluster_name = module.kubernetes.cluster_name
}

module "eureka_server" {
  source       = "./services/eureka-server"
  cluster_name = module.kubernetes.cluster_name
}

module "notification_service" {
  source       = "./services/notification-service"
  cluster_name = module.kubernetes.cluster_name
}

module "payment_service" {
  source       = "./services/payment-service"
  cluster_name = module.kubernetes.cluster_name
}

module "user_service" {
  source       = "./services/user-service"
  cluster_name = module.kubernetes.cluster_name
}

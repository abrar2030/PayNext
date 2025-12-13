terraform {
  required_version = ">= 1.5.0, < 2.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.20"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.10"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
  }

  # Backend configuration for remote state management
  # For local development, state will be stored locally
  # For production, uncomment and configure S3 backend:
  # backend "s3" {
  #   bucket         = "paynext-terraform-state-ENVIRONMENT"
  #   key            = "infrastructure/terraform.tfstate"
  #   region         = "us-west-2"
  #   encrypt        = true
  #   dynamodb_table = "paynext-terraform-locks"
  #   kms_key_id     = "arn:aws:kms:REGION:ACCOUNT:key/KEY-ID"
  # }
}

# Define the AWS provider with the specified region
provider "aws" {
  region = var.aws_region

  # Default tags applied to all resources
  default_tags {
    tags = {
      Project     = "PayNext"
      Environment = var.environment
      ManagedBy   = "Terraform"
      Owner       = "PayNext-DevOps"
      CostCenter  = "Engineering"
    }
  }
}

# DR region provider for cross-region backup and replication
# Used by storage and database modules for disaster recovery
provider "aws" {
  alias  = "dr_region"
  region = var.dr_region

  # Default tags applied to all DR resources
  default_tags {
    tags = {
      Project     = "PayNext"
      Environment = var.environment
      ManagedBy   = "Terraform"
      Owner       = "PayNext-DevOps"
      CostCenter  = "Engineering"
      Purpose     = "DisasterRecovery"
    }
  }
}

# Define the Kubernetes provider for managing Kubernetes resources
# Note: This requires the EKS cluster to be created first
provider "kubernetes" {
  host                   = module.kubernetes.cluster_endpoint
  cluster_ca_certificate = base64decode(module.kubernetes.cluster_ca_certificate)

  exec {
    api_version = "client.authentication.k8s.io/v1"  # Updated from deprecated v1beta1
    command     = "aws"
    args        = ["eks", "get-token", "--cluster-name", module.kubernetes.cluster_name]
  }
}

# Define the Helm provider for managing Helm charts on Kubernetes
# Note: This requires the EKS cluster to be created first
provider "helm" {
  kubernetes {
    host                   = module.kubernetes.cluster_endpoint
    cluster_ca_certificate = base64decode(module.kubernetes.cluster_ca_certificate)

    exec {
      api_version = "client.authentication.k8s.io/v1"  # Updated from deprecated v1beta1
      command     = "aws"
      args        = ["eks", "get-token", "--cluster-name", module.kubernetes.cluster_name]
    }
  }
}

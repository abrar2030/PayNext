# Define the AWS provider with the specified region
provider "aws" {
  region = var.aws_region
}

# Define the Kubernetes provider for managing Kubernetes resources
provider "kubernetes" {
  config_path = "~/.kube/config"
}

# Define the Helm provider for managing Helm charts on Kubernetes
provider "helm" {
  kubernetes {
    config_path = "~/.kube/config"
  }
}

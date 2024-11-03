# Terraform Documentation for PayNext Project

## Overview

This documentation provides a comprehensive guide to the Infrastructure as Code (IaC) setup for the **PayNext** project using **Terraform**. The IaC setup is designed to automate the deployment and management of cloud infrastructure resources required for running the PayNext application, ensuring consistent and repeatable infrastructure provisioning.

## Directory Structure

The IaC directory has the following structure:

```
.
├── IaC_Deployment_Script.md
├── IaC_Documentation.md
├── deploy-services.sh
├── kubernetes
│   ├── eks_cluster.tf
│   ├── helm.tf
│   └── outputs.tf
├── main.tf
├── outputs.tf
├── providers.tf
├── services
│   ├── api-gateway
│   │   └── main.tf
│   ├── eureka-server
│   │   └── main.tf
│   ├── notification-service
│   │   └── main.tf
│   ├── payment-service
│   │   └── main.tf
│   └── user-service
│       └── main.tf
├── storage
│   └── s3_bucket.tf
├── terraform.tfvars
├── variables.tf
└── vpc
    ├── outputs.tf
    ├── security_groups.tf
    └── vpc.tf
```

## Files Description

### 1. `main.tf`

The `main.tf` file serves as the primary entry point for the Terraform configuration. It includes module declarations for VPC, Kubernetes, storage, and services.

- **Modules Included**:
   - VPC
   - Kubernetes (EKS Cluster)
   - Storage (S3 Bucket)
   - Services (API Gateway, Eureka Server, Notification Service, etc.)

### 2. `providers.tf`

Defines all the cloud providers that are used in the project, such as AWS, Kubernetes, and Helm providers.

### 3. `variables.tf`

This file contains all the variables required across the Terraform code. Variables make the code more flexible and easier to manage by parameterizing key configuration settings.

- **Example Variables**:
   - `aws_region`: Defines the AWS region to deploy resources.
   - `cluster_name`: Defines the EKS cluster name.

### 4. `terraform.tfvars`

This file contains the values assigned to the variables defined in `variables.tf`. It is used to customize the infrastructure configuration.

- **Example Variables Set**:
   - `aws_region = "us-west-2"`
   - `cluster_name = "paynext-cluster"`

### 5. `outputs.tf`

Defines outputs for the infrastructure, allowing values like VPC ID and EKS cluster name to be easily queried after deployment.

- **Example Outputs**:
   - `vpc_id`: Outputs the ID of the created VPC.
   - `eks_cluster_name`: Outputs the name of the EKS cluster.

### 6. `vpc/`

Contains Terraform code for creating Virtual Private Cloud (VPC) and related networking resources.

- **`vpc.tf`**: Defines the VPC and subnets.
- **`security_groups.tf`**: Defines security groups for the EKS cluster.
- **`outputs.tf`**: Outputs values related to the VPC, such as VPC ID and subnet IDs.

### 7. `kubernetes/`

Contains the files for configuring the Kubernetes infrastructure.

- **`eks_cluster.tf`**: Creates the EKS cluster using the AWS EKS module.
- **`helm.tf`**: Configures Helm for managing Kubernetes applications.
- **`outputs.tf`**: Outputs related to the Kubernetes resources, like the cluster name.

### 8. `services/`

Contains separate folders for each microservice in the PayNext project. Each folder includes a `main.tf` file that defines the deployment and service configuration for the corresponding service.

- **Microservices**:
   - **API Gateway** (`api-gateway/main.tf`)
   - **Eureka Server** (`eureka-server/main.tf`)
   - **Notification Service** (`notification-service/main.tf`)
   - **Payment Service** (`payment-service/main.tf`)
   - **User Service** (`user-service/main.tf`)

### 9. `storage/s3_bucket.tf`

Defines an S3 bucket for storing application data or configuration files required by the services. The bucket is private and tagged accordingly.

## Deployment Process

1. **Initialize Terraform**: Run the following command to initialize Terraform and download the necessary provider plugins.
   ```sh
   terraform init
   ```

2. **Validate Configuration**: Validate the Terraform configuration files to ensure everything is correct.
   ```sh
   terraform validate
   ```

3. **Plan the Infrastructure**: Create an execution plan to see what actions Terraform will take to create the infrastructure.
   ```sh
   terraform plan
   ```

4. **Apply the Configuration**: Deploy the infrastructure as defined in the Terraform files.
   ```sh
   terraform apply
   ```

## Notes

- **State Management**: Ensure the Terraform state file (`terraform.tfstate`) is securely stored. You can use a remote backend like AWS S3 for better state management.
- **Provider Credentials**: You need valid AWS credentials to run Terraform commands and deploy the infrastructure.

## Best Practices

- **Version Control**: Keep the `.tf` files in version control (e.g., Git) to track infrastructure changes over time.
- **Environment Separation**: Use different workspaces or separate directories for different environments (e.g., `dev`, `staging`, `prod`).
- **Security**: Avoid hardcoding sensitive information, such as credentials, in `.tf` files. Use environment variables or secret management tools like AWS Secrets Manager.

## Conclusion

The IaC setup using Terraform helps to automate the deployment of cloud infrastructure for the PayNext project, ensuring consistent, repeatable, and reliable infrastructure management. This documentation serves as a guide to understanding the structure and purpose of each component in the IaC configuration.
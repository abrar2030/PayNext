
# Infrastructure as Code (IaC) Documentation for PayNext Project

## Overview

This documentation provides an overview of the Infrastructure as Code (IaC) setup for the PayNext project, detailing each file and directory in the IaC directory for configuring, deploying, and managing the project’s infrastructure.

## Directory Structure

The IaC files are organized as follows:

```
iac/
├── main.tf
├── providers.tf
├── variables.tf
├── outputs.tf
├── terraform.tfvars
├── modules/
│   ├── vpc/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── ec2/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── rds/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── eks/
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
└── scripts/
    ├── configure_ec2.sh
    ├── setup_eks.sh
    └── db_init.sql
```

## File Descriptions

- **main.tf**: Contains the root configurations to set up and provision resources.
- **providers.tf**: Specifies the cloud providers and configurations.
- **variables.tf**: Defines input variables for the infrastructure.
- **outputs.tf**: Outputs the values of the configured resources.
- **terraform.tfvars**: Stores the actual values for variables.

### Modules
- **vpc**: Manages Virtual Private Cloud (VPC) settings, subnets, and internet gateways.
- **ec2**: Configures EC2 instances for various services.
- **rds**: Sets up RDS instances for databases.
- **eks**: Manages Elastic Kubernetes Service (EKS) clusters for containerized applications.

### Scripts
- **configure_ec2.sh**: Bootstraps EC2 instances with necessary configurations.
- **setup_eks.sh**: Automates EKS cluster setup and configurations.
- **db_init.sql**: SQL script for initializing the database schema and data.

---

### Usage
To deploy the infrastructure, run the following commands from the `iac` directory:

1. Initialize Terraform:
   ```bash
   terraform init
   ```

2. Preview the plan:
   ```bash
   terraform plan
   ```

3. Apply the configuration:
   ```bash
   terraform apply
   ```

4. Destroy the infrastructure:
   ```bash
   terraform destroy
   ```

Ensure that the `terraform.tfvars` file is properly configured with the correct values before running the apply command.

## Conclusion

This documentation serves as a guide for understanding and deploying the PayNext project infrastructure using Terraform and other supporting scripts.

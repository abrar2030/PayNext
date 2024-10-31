
# PayNext IAC Deployment Script

This deployment script allows you to deploy individual services or all services in the **PayNext Infrastructure as Code (IAC)** setup using Terraform. Each service is deployed independently, making it easy to manage deployments as needed.

## Directory Structure

Ensure your directory structure follows this format for the script to work correctly:

```
iac/
├── eureka-server/
│   ├── main.tf
│   ├── variables.tf
│   └── ...
├── api-gateway/
│   ├── main.tf
│   ├── variables.tf
│   └── ...
├── user-service/
│   ├── main.tf
│   ├── variables.tf
│   └── ...
├── payment-service/
│   ├── main.tf
│   ├── variables.tf
│   └── ...
├── notification-service/
│   ├── main.tf
│   ├── variables.tf
│   └── ...
└── frontend/
    ├── main.tf
    ├── variables.tf
    └── ...
```

Update the paths within the script if your structure differs.

## Prerequisites

- **Terraform**: Ensure Terraform is installed and accessible in your system's PATH.
- **Executable Permission**: Make sure the script has executable permissions.

## Usage

The script allows you to deploy either a single service or all services at once.

### 1. Deploy a Single Service

To deploy an individual service, provide the service name as an argument. For example, to deploy the **Eureka Server**:

```bash
./deploy-services.sh eureka-server
```

### 2. Deploy All Services

To deploy all services, use `all` as the argument:

```bash
./deploy-services.sh all
```

### Example Command Output

Below is an example output for deploying a single service, **user-service**:

```
Deploying user-service...
Initializing Terraform configuration in path/to/user-service
Applying configuration for user-service
user-service deployed successfully.
```

### Script Details

The script performs the following steps for each specified service:
1. Navigates to the specified service's directory.
2. Runs `terraform init` to initialize the configuration.
3. Runs `terraform apply -auto-approve` to deploy the service automatically.

> **Note**: `-auto-approve` automatically approves the changes. If you prefer to manually approve changes, remove this flag from the script.

## Troubleshooting

- **Terraform Not Installed**: Ensure Terraform is installed. You can download it from [terraform.io](https://www.terraform.io/).
- **Invalid Service Name**: If you receive an "Invalid service name" error, verify that the service name matches the ones defined in the script.

---

This README.md serves as documentation for using the `deploy-services.sh` script to manage your IAC deployments easily and efficiently.

# PayNext IaC Deployment Guide

This guide will help you deploy the PayNext infrastructure using Terraform. This Infrastructure as Code (IaC) setup ensures a consistent and automated environment, utilizing AWS and Kubernetes to host and manage the PayNext services.

## Prerequisites

Before deploying the infrastructure, make sure you have the following tools installed:

- **Terraform** (v1.0 or newer)
- **AWS CLI**: To authenticate and manage AWS resources.
- **kubectl**: Kubernetes command-line tool for interacting with the EKS cluster.
- **Helm**: Kubernetes package manager to deploy charts.
- **Docker**: To manage container images locally.

## Deployment Steps

### 1. Set Up AWS Credentials

Ensure you have configured your AWS CLI with proper credentials. Run the following command to set up credentials:

```bash
aws configure
```

Provide the **AWS Access Key**, **Secret Access Key**, **Default Region**, and **Output Format** when prompted.

### 2. Initialize Terraform

Navigate to the IaC directory and initialize Terraform to download the necessary providers and modules.

```bash
cd /path/to/PayNext/iac
terraform init
```

### 3. Set Up Environment Variables

Ensure that you have the necessary environment variables set up for your AWS region and cluster name:

```bash
export TF_VAR_aws_region=us-west-2
export TF_VAR_cluster_name=paynext-cluster
```

### 4. Apply the Terraform Configuration

Run the following command to apply the Terraform configuration and create the infrastructure. Review the plan and type **yes** to confirm:

```bash
terraform apply
```

Terraform will create:
- VPC and Security Groups
- EKS Cluster
- S3 Bucket
- Kubernetes Deployments for all microservices

### 5. Configure Kubernetes

Once the infrastructure is up, configure `kubectl` to use the newly created EKS cluster:

```bash
aws eks --region us-west-2 update-kubeconfig --name paynext-cluster
```

### 6. Deploy Kubernetes Services with Helm

Change to the `kubernetes` directory and use Helm to deploy the services:

```bash
cd kubernetes
helm install paynext ./
```

### 7. Verify the Deployment

Use `kubectl` to verify that the pods, services, and deployments are correctly running:

```bash
kubectl get pods
kubectl get services
```

Ensure all services are in the **Running** state and that external endpoints are accessible.

### 8. Access the PayNext Application

Once deployed, you can access the application through the **API Gateway** or the **Frontend** service. Ensure the correct ports are exposed and accessible via your Kubernetes cluster.

## Troubleshooting

- **Authentication Issues**: Ensure your AWS credentials are properly configured.
- **Cluster Access**: Make sure your IAM user/role has sufficient permissions for managing EKS.
- **Pods Not Starting**: Check pod logs for errors using `kubectl logs <pod-name>`.

## Cleanup

To clean up all the resources created by Terraform and avoid additional charges, run the following command in the IaC directory:

```bash
terraform destroy
```

## Additional Notes

- **Helm Values**: If you need to change configuration values, modify the `values.yaml` file before deploying with Helm.
- **Updating Services**: Redeploy the services using `helm upgrade` if changes are made to the Docker images or other configurations.

## Summary

This guide provides a step-by-step approach to deploying the PayNext infrastructure using Terraform. Following these steps will help you maintain a consistent and scalable environment for your FinTech project.

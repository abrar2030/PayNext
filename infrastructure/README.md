# PayNext Infrastructure

This directory contains the comprehensive, enterprise-grade infrastructure code for PayNext, designed to meet financial industry standards including PCI DSS, GDPR, and SOX compliance.

## Overview

The infrastructure is built using Terraform and provides a secure, scalable, and compliant foundation for financial applications. It includes comprehensive security controls, monitoring, logging, and disaster recovery capabilities.

## Architecture

The infrastructure follows a multi-tier architecture with the following components:

### Core Modules

1. **Security Module** (`modules/security/`)
   - AWS KMS encryption keys
   - AWS Secrets Manager for credential management
   - AWS WAF for web application firewall
   - IAM roles and policies with least privilege access
   - Security groups and NACLs

2. **VPC Module** (`modules/vpc/`)
   - Multi-AZ VPC with public, private, and database subnets
   - NAT Gateways for secure outbound connectivity
   - VPC Flow Logs for network monitoring
   - VPC Endpoints for AWS services
   - Network ACLs for additional security

3. **Monitoring Module** (`modules/monitoring/`)
   - AWS CloudWatch for metrics and logging
   - AWS GuardDuty for threat detection
   - AWS Config for compliance monitoring
   - AWS CloudTrail for API audit logging
   - SNS topics for alerting
   - CloudWatch dashboards

4. **Kubernetes Module** (`modules/kubernetes/`)
   - Amazon EKS cluster with security hardening
   - Node groups with auto-scaling
   - Application Load Balancer
   - Security groups and IAM roles
   - Add-ons (VPC CNI, CoreDNS, EBS CSI)

5. **Database Module** (`modules/database/`)
   - Amazon Aurora PostgreSQL cluster
   - Multi-AZ deployment for high availability
   - Automated backups and point-in-time recovery
   - RDS Proxy for connection pooling
   - Performance Insights and Enhanced Monitoring
   - Cross-region backup for disaster recovery

6. **Storage Module** (`modules/storage/`)
   - S3 buckets with encryption and versioning
   - Lifecycle policies for cost optimization
   - Cross-region replication for disaster recovery
   - EFS for shared file storage
   - CloudWatch monitoring and alerting

## Security Features

### Encryption

- **At Rest**: All data encrypted using AWS KMS with customer-managed keys
- **In Transit**: TLS 1.2+ enforced for all communications
- **Database**: Aurora cluster encrypted with KMS
- **Storage**: S3 buckets encrypted with KMS

### Access Control

- **IAM**: Least privilege access with role-based permissions
- **MFA**: Multi-factor authentication required for sensitive operations
- **Network**: Private subnets for application and database tiers
- **Security Groups**: Restrictive ingress/egress rules

### Monitoring & Compliance

- **Audit Logging**: Comprehensive audit trail with CloudTrail
- **Threat Detection**: GuardDuty for security monitoring
- **Compliance**: AWS Config rules for compliance validation
- **Alerting**: Real-time security alerts via SNS

## Compliance Standards

This infrastructure is designed to meet the following compliance standards:

- **PCI DSS**: Payment Card Industry Data Security Standard
- **GDPR**: General Data Protection Regulation
- **SOX**: Sarbanes-Oxley Act
- **HIPAA**: Health Insurance Portability and Accountability Act (optional)

## Prerequisites

1. **Terraform**: Version 1.5.0 or later
2. **AWS CLI**: Version 2.0 or later
3. **kubectl**: For Kubernetes management
4. **Helm**: For Kubernetes package management

## Quick Start

### 1. Configure AWS Credentials

```bash
aws configure
```

### 2. Initialize Terraform

```bash
cd infrastructure/terraform
terraform init
```

### 3. Create terraform.tfvars

Copy the example file and customize:

```bash
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` with your specific values:

```hcl
# Environment Configuration
environment = "dev"  # or "staging", "prod"
region      = "us-west-2"

# Network Configuration
vpc_cidr = "10.0.0.0/16"
availability_zones = ["us-west-2a", "us-west-2b", "us-west-2c"]

# Contact Information
security_contact_email    = "security@yourcompany.com"
compliance_contact_email  = "compliance@yourcompany.com"

# Database Configuration
db_master_username = "paynext_admin"
db_instance_class  = "db.r6g.large"

# EKS Configuration
cluster_name           = "paynext-cluster"
kubernetes_version     = "1.27"
node_instance_type     = "t3.medium"

# Tags
tags = {
  Project     = "PayNext"
  Environment = "dev"
  Owner       = "Platform Team"
  CostCenter  = "Engineering"
}
```

### 4. Plan and Apply

```bash
# Review the plan
terraform plan

# Apply the infrastructure
terraform apply
```

### 5. Configure kubectl

```bash
aws eks update-kubeconfig --region us-west-2 --name paynext-cluster-dev
```

## Module Documentation

### Security Module

The security module provides foundational security services:

- **KMS Keys**: Customer-managed encryption keys for all services
- **Secrets Manager**: Secure storage for database credentials and API keys
- **WAF**: Web Application Firewall with OWASP Top 10 protection
- **IAM**: Service roles with least privilege access

**Usage:**

```hcl
module "security" {
  source = "./modules/security"

  environment = var.environment
  vpc_id      = module.vpc.vpc_id
  tags        = var.tags
}
```

### VPC Module

The VPC module creates a secure network foundation:

- **Multi-AZ**: Spans multiple availability zones for high availability
- **Tiered Subnets**: Public, private, and database subnet tiers
- **NAT Gateways**: Secure outbound internet access for private subnets
- **VPC Endpoints**: Private connectivity to AWS services

**Usage:**

```hcl
module "vpc" {
  source = "./modules/vpc"

  environment        = var.environment
  vpc_cidr          = var.vpc_cidr
  availability_zones = var.availability_zones
  enable_vpc_flow_logs = true
  tags              = var.tags
}
```

### Monitoring Module

The monitoring module provides comprehensive observability:

- **CloudWatch**: Centralized logging and metrics
- **GuardDuty**: Threat detection and security monitoring
- **Config**: Compliance monitoring and drift detection
- **CloudTrail**: API audit logging

**Usage:**

```hcl
module "monitoring" {
  source = "./modules/monitoring"

  environment               = var.environment
  vpc_id                   = module.vpc.vpc_id
  kms_key_id              = module.security.kms_key_id
  security_contact_email   = var.security_contact_email
  compliance_contact_email = var.compliance_contact_email
  tags                    = var.tags
}
```

### Kubernetes Module

The Kubernetes module deploys a secure EKS cluster:

- **EKS Cluster**: Managed Kubernetes with security hardening
- **Node Groups**: Auto-scaling worker nodes
- **Add-ons**: Essential cluster add-ons (VPC CNI, CoreDNS, EBS CSI)
- **Security**: Pod security policies and network policies

**Usage:**

```hcl
module "kubernetes" {
  source = "./modules/kubernetes"

  cluster_name         = var.cluster_name
  environment         = var.environment
  vpc_id              = module.vpc.vpc_id
  private_subnet_ids  = module.vpc.private_subnet_ids
  public_subnet_ids   = module.vpc.public_subnet_ids
  kms_key_id          = module.security.kms_key_id
  security_group_ids  = module.vpc.security_group_ids
  tags                = var.tags
}
```

### Database Module

The database module provides a secure, highly available database:

- **Aurora Cluster**: PostgreSQL with multi-AZ deployment
- **Encryption**: At-rest and in-transit encryption
- **Backups**: Automated backups with point-in-time recovery
- **Monitoring**: Performance Insights and Enhanced Monitoring

**Usage:**

```hcl
module "database" {
  source = "./modules/database"

  environment            = var.environment
  vpc_id                = module.vpc.vpc_id
  database_subnet_ids   = module.vpc.database_subnet_ids
  kms_key_id           = module.security.kms_key_id
  security_group_ids   = module.vpc.security_group_ids
  db_master_username   = var.db_master_username
  db_instance_class    = var.db_instance_class
  tags                 = var.tags
}
```

### Storage Module

The storage module provides secure, scalable storage:

- **S3 Buckets**: Encrypted buckets with lifecycle policies
- **Versioning**: Object versioning for data protection
- **Replication**: Cross-region replication for disaster recovery
- **EFS**: Shared file storage for Kubernetes

**Usage:**

```hcl
module "storage" {
  source = "./modules/storage"

  environment         = var.environment
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  kms_key_id         = module.security.kms_key_id
  security_group_ids = module.vpc.security_group_ids
  tags               = var.tags
}
```

## Deployment Environments

### Development Environment

- Single AZ deployment for cost optimization
- Smaller instance sizes
- Reduced backup retention
- Public access enabled for testing

### Staging Environment

- Multi-AZ deployment
- Production-like configuration
- Extended backup retention
- Private access only

### Production Environment

- Multi-AZ deployment with maximum availability
- Large instance sizes for performance
- Maximum backup retention (7 years)
- Deletion protection enabled
- Enhanced monitoring and alerting

## Security Best Practices

### Network Security

1. **Private Subnets**: Application and database tiers in private subnets
2. **Security Groups**: Restrictive rules with least privilege access
3. **NACLs**: Additional layer of network security
4. **VPC Flow Logs**: Network traffic monitoring

### Data Protection

1. **Encryption**: All data encrypted at rest and in transit
2. **Key Management**: Customer-managed KMS keys
3. **Backup Encryption**: Encrypted backups with long-term retention
4. **Access Logging**: Comprehensive audit trail

### Access Control

1. **IAM Roles**: Service-specific roles with minimal permissions
2. **MFA**: Multi-factor authentication for sensitive operations
3. **Secrets Management**: Centralized credential management
4. **Regular Rotation**: Automated credential rotation

### Monitoring & Alerting

1. **Real-time Monitoring**: CloudWatch metrics and alarms
2. **Security Monitoring**: GuardDuty threat detection
3. **Compliance Monitoring**: Config rules and assessments
4. **Incident Response**: Automated alerting and response

## Disaster Recovery

### Backup Strategy

- **RDS**: Automated backups with 35-day retention
- **S3**: Cross-region replication to DR region
- **EBS**: Automated snapshots
- **Configuration**: Infrastructure as Code for rapid recovery

### Recovery Procedures

1. **Database Recovery**: Point-in-time recovery from backups
2. **Application Recovery**: Deploy from Infrastructure as Code
3. **Data Recovery**: Restore from cross-region replicas
4. **Network Recovery**: Recreate VPC and networking

### RTO/RPO Targets

- **RTO (Recovery Time Objective)**: 4 hours
- **RPO (Recovery Point Objective)**: 1 hour
- **Data Retention**: 7 years for compliance

## Cost Optimization

### Storage Optimization

- **S3 Lifecycle Policies**: Automatic transition to cheaper storage classes
- **Intelligent Tiering**: Automatic optimization based on access patterns
- **EBS Optimization**: GP3 volumes for better price/performance

### Compute Optimization

- **Auto Scaling**: Automatic scaling based on demand
- **Spot Instances**: Use spot instances for non-critical workloads
- **Reserved Instances**: Reserved capacity for predictable workloads

### Monitoring Costs

- **Cost Allocation Tags**: Track costs by service and environment
- **Budgets**: Set up billing alerts and budgets
- **Cost Explorer**: Regular cost analysis and optimization

## Troubleshooting

### Common Issues

#### Terraform Apply Fails

```bash
# Check AWS credentials
aws sts get-caller-identity

# Verify Terraform version
terraform version

# Re-initialize if needed
terraform init -upgrade
```

#### EKS Cluster Access Issues

```bash
# Update kubeconfig
aws eks update-kubeconfig --region <region> --name <cluster-name>

# Verify access
kubectl get nodes
```

#### Database Connection Issues

```bash
# Check security groups
aws ec2 describe-security-groups --group-ids <sg-id>

# Test connectivity
telnet <rds-endpoint> 5432
```

### Logs and Monitoring

#### CloudWatch Logs

- Application logs: `/aws/paynext/<env>/application`
- Security logs: `/aws/paynext/<env>/security`
- Audit logs: `/aws/paynext/<env>/audit`

#### CloudTrail Events

- API calls: CloudTrail console
- Security events: GuardDuty console
- Compliance: Config console

## Maintenance

### Regular Tasks

1. **Security Updates**: Apply security patches monthly
2. **Backup Verification**: Test backup restoration quarterly
3. **Access Review**: Review IAM permissions quarterly
4. **Cost Review**: Analyze costs monthly

### Automated Tasks

1. **Backup Creation**: Daily automated backups
2. **Log Rotation**: Automatic log retention policies
3. **Certificate Renewal**: Automatic SSL certificate renewal
4. **Security Scanning**: Continuous security monitoring

## Support

### Documentation

- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [Terraform Documentation](https://www.terraform.io/docs/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)

### Monitoring Dashboards

- CloudWatch Dashboard: `PayNext-<environment>-Dashboard`
- Grafana Dashboard: Available after deployment
- Cost Dashboard: AWS Cost Explorer

### Contact Information

- **Security Issues**: security@yourcompany.com
- **Compliance Questions**: compliance@yourcompany.com
- **Technical Support**: platform-team@yourcompany.com

## License

This infrastructure code is proprietary and confidential. Unauthorized use, distribution, or modification is strictly prohibited.

---

**Note**: This infrastructure is designed for financial applications and includes comprehensive security and compliance features. Always review and test thoroughly before deploying to production environments.

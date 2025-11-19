# VPC Outputs
output "vpc_id" {
  description = "ID of the VPC"
  value       = module.vpc.vpc_id
}

output "vpc_cidr_block" {
  description = "CIDR block of the VPC"
  value       = module.vpc.vpc_cidr_block
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value       = module.vpc.private_subnet_ids
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = module.vpc.public_subnet_ids
}

output "database_subnet_ids" {
  description = "IDs of the database subnets"
  value       = module.vpc.database_subnet_ids
}

output "database_subnet_group_name" {
  description = "Name of the database subnet group"
  value       = module.vpc.database_subnet_group_name
}

# Security Outputs
output "security_group_ids" {
  description = "Map of security group IDs"
  value       = module.vpc.security_group_ids
}

output "kms_key_id" {
  description = "ID of the KMS key for encryption"
  value       = module.security.kms_key_id
}

output "kms_key_arn" {
  description = "ARN of the KMS key for encryption"
  value       = module.security.kms_key_arn
}

output "secrets_manager_arn" {
  description = "ARN of the Secrets Manager secret"
  value       = module.security.secrets_manager_arn
  sensitive   = true
}

# Monitoring and Logging Outputs
output "cloudtrail_arn" {
  description = "ARN of the CloudTrail"
  value       = module.monitoring.cloudtrail_arn
}

output "cloudwatch_log_group_arn" {
  description = "ARN of the CloudWatch log group"
  value       = module.monitoring.cloudwatch_log_group_arn
}

output "guardduty_detector_id" {
  description = "ID of the GuardDuty detector"
  value       = module.monitoring.guardduty_detector_id
}

output "config_configuration_recorder_name" {
  description = "Name of the AWS Config configuration recorder"
  value       = module.monitoring.config_configuration_recorder_name
}

# EKS Cluster Outputs
output "cluster_id" {
  description = "ID of the EKS cluster"
  value       = module.kubernetes.cluster_id
}

output "cluster_arn" {
  description = "ARN of the EKS cluster"
  value       = module.kubernetes.cluster_arn
}

output "cluster_endpoint" {
  description = "Endpoint for EKS control plane"
  value       = module.kubernetes.cluster_endpoint
}

output "cluster_security_group_id" {
  description = "Security group ID attached to the EKS cluster"
  value       = module.kubernetes.cluster_security_group_id
}

output "cluster_iam_role_name" {
  description = "IAM role name associated with EKS cluster"
  value       = module.kubernetes.cluster_iam_role_name
}

output "cluster_iam_role_arn" {
  description = "IAM role ARN associated with EKS cluster"
  value       = module.kubernetes.cluster_iam_role_arn
}

output "cluster_certificate_authority_data" {
  description = "Base64 encoded certificate data required to communicate with the cluster"
  value       = module.kubernetes.cluster_certificate_authority_data
}

output "cluster_ca_certificate" {
  description = "Certificate authority data for the cluster"
  value       = module.kubernetes.cluster_ca_certificate
}

output "cluster_name" {
  description = "Name of the EKS cluster"
  value       = module.kubernetes.cluster_name
}

# Node Group Outputs
output "node_groups" {
  description = "Map of EKS node groups"
  value       = module.kubernetes.node_groups
}

output "node_security_group_id" {
  description = "ID of the EKS node shared security group"
  value       = module.kubernetes.node_security_group_id
}

# Storage Outputs
output "s3_bucket_id" {
  description = "ID of the S3 bucket"
  value       = module.storage.s3_bucket_id
}

output "s3_bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = module.storage.s3_bucket_arn
}

output "s3_bucket_domain_name" {
  description = "Domain name of the S3 bucket"
  value       = module.storage.s3_bucket_domain_name
}

output "s3_bucket_regional_domain_name" {
  description = "Regional domain name of the S3 bucket"
  value       = module.storage.s3_bucket_regional_domain_name
}

# WAF Outputs
output "waf_web_acl_id" {
  description = "ID of the WAF Web ACL"
  value       = module.security.waf_web_acl_id
}

output "waf_web_acl_arn" {
  description = "ARN of the WAF Web ACL"
  value       = module.security.waf_web_acl_arn
}

# Load Balancer Outputs
output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = module.kubernetes.alb_dns_name
}

output "alb_zone_id" {
  description = "Zone ID of the Application Load Balancer"
  value       = module.kubernetes.alb_zone_id
}

output "alb_arn" {
  description = "ARN of the Application Load Balancer"
  value       = module.kubernetes.alb_arn
}

# Compliance and Audit Outputs
output "compliance_status" {
  description = "Compliance status summary"
  value = {
    pci_dss_compliant    = var.enable_encryption_at_rest && var.enable_encryption_in_transit && var.enable_waf
    gdpr_compliant       = var.enable_encryption_at_rest && var.enable_cloudtrail && var.data_retention_days >= 365
    sox_compliant        = var.enable_cloudtrail && var.enable_config && var.data_retention_days >= 2555
    iso27001_compliant   = var.enable_guardduty && var.enable_config && var.enable_vpc_flow_logs
  }
}

output "security_features_enabled" {
  description = "Summary of enabled security features"
  value = {
    vpc_flow_logs     = var.enable_vpc_flow_logs
    guardduty         = var.enable_guardduty
    config            = var.enable_config
    cloudtrail        = var.enable_cloudtrail
    waf               = var.enable_waf
    secrets_manager   = var.enable_secrets_manager
    encryption_at_rest = var.enable_encryption_at_rest
    encryption_in_transit = var.enable_encryption_in_transit
    multi_az          = var.enable_multi_az
    cross_region_backup = var.enable_cross_region_backup
  }
}

# Contact Information Outputs
output "security_contact" {
  description = "Security contact information"
  value       = var.security_contact_email
}

output "compliance_contact" {
  description = "Compliance contact information"
  value       = var.compliance_contact_email
}

# Environment Information
output "environment" {
  description = "Deployment environment"
  value       = var.environment
}

output "region" {
  description = "AWS region"
  value       = var.aws_region
}

output "availability_zones" {
  description = "Availability zones in use"
  value       = module.vpc.availability_zones
}

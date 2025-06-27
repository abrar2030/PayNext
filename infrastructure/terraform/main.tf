# Main entry point for Terraform configuration
# This file orchestrates all infrastructure components for PayNext
# with enhanced security, compliance, and monitoring capabilities

# Data sources for availability zones and current AWS account
data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_caller_identity" "current" {}

data "aws_region" "current" {}

# Local values for common configurations
locals {
  availability_zones = length(var.availability_zones) > 0 ? var.availability_zones : slice(data.aws_availability_zones.available.names, 0, 3)
  
  common_tags = merge(
    {
      Project     = "PayNext"
      Environment = var.environment
      ManagedBy   = "Terraform"
      Owner       = var.owner
      CostCenter  = var.cost_center
    },
    var.additional_tags
  )
  
  # Security configuration
  security_config = {
    enable_encryption_at_rest     = var.enable_encryption_at_rest
    enable_encryption_in_transit  = var.enable_encryption_in_transit
    kms_key_deletion_window      = var.kms_key_deletion_window
    data_retention_days          = var.data_retention_days
    log_retention_days           = var.log_retention_days
  }
  
  # Compliance configuration
  compliance_config = {
    standards                = var.compliance_standards
    security_contact_email   = var.security_contact_email
    compliance_contact_email = var.compliance_contact_email
    backup_retention_days    = var.backup_retention_days
  }
}

# Security Module - Core security services and encryption
module "security" {
  source = "./modules/security"
  
  environment                = var.environment
  kms_key_deletion_window   = var.kms_key_deletion_window
  enable_secrets_manager    = var.enable_secrets_manager
  enable_waf                = var.enable_waf
  security_contact_email    = var.security_contact_email
  compliance_contact_email  = var.compliance_contact_email
  
  tags = local.common_tags
}

# VPC Module - Enhanced networking with security controls
module "vpc" {
  source = "./modules/vpc"
  
  vpc_cidr                = var.vpc_cidr
  private_subnet_cidrs    = var.private_subnet_cidrs
  public_subnet_cidrs     = var.public_subnet_cidrs
  database_subnet_cidrs   = var.database_subnet_cidrs
  availability_zones      = local.availability_zones
  environment            = var.environment
  enable_vpc_flow_logs   = var.enable_vpc_flow_logs
  enable_multi_az        = var.enable_multi_az
  allowed_cidr_blocks    = var.allowed_cidr_blocks
  
  # Security dependencies
  kms_key_id = module.security.kms_key_id
  
  tags = local.common_tags
}

# Monitoring Module - Comprehensive logging and monitoring
module "monitoring" {
  source = "./modules/monitoring"
  
  environment                = var.environment
  enable_cloudtrail         = var.enable_cloudtrail
  enable_guardduty          = var.enable_guardduty
  enable_config             = var.enable_config
  log_retention_days        = var.log_retention_days
  data_retention_days       = var.data_retention_days
  security_contact_email    = var.security_contact_email
  compliance_contact_email  = var.compliance_contact_email
  
  # Dependencies
  vpc_id                    = module.vpc.vpc_id
  kms_key_id               = module.security.kms_key_id
  s3_bucket_id             = module.storage.s3_bucket_id
  
  tags = local.common_tags
}

# Storage Module - Secure and compliant storage solutions
module "storage" {
  source = "./modules/storage"
  
  s3_bucket_name            = var.s3_bucket_name
  environment              = var.environment
  enable_encryption_at_rest = var.enable_encryption_at_rest
  backup_retention_days    = var.backup_retention_days
  enable_cross_region_backup = var.enable_cross_region_backup
  dr_region                = var.dr_region
  data_retention_days      = var.data_retention_days
  
  # Security dependencies
  kms_key_id = module.security.kms_key_id
  
  tags = local.common_tags
}

# EKS Kubernetes Module - Secure container orchestration
module "kubernetes" {
  source = "./modules/kubernetes"
  
  cluster_name              = var.cluster_name
  environment              = var.environment
  vpc_id                   = module.vpc.vpc_id
  private_subnet_ids       = module.vpc.private_subnet_ids
  public_subnet_ids        = module.vpc.public_subnet_ids
  enable_encryption_at_rest = var.enable_encryption_at_rest
  enable_detailed_monitoring = var.enable_detailed_monitoring
  
  # Security dependencies
  kms_key_id               = module.security.kms_key_id
  security_group_ids       = module.vpc.security_group_ids
  
  tags = local.common_tags
}

# Database Module - Secure and highly available database infrastructure
module "database" {
  source = "./modules/database"
  
  environment                = var.environment
  vpc_id                    = module.vpc.vpc_id
  database_subnet_ids       = module.vpc.database_subnet_ids
  database_subnet_group_name = module.vpc.database_subnet_group_name
  enable_encryption_at_rest  = var.enable_encryption_at_rest
  enable_multi_az           = var.enable_multi_az
  backup_retention_days     = var.backup_retention_days
  enable_cross_region_backup = var.enable_cross_region_backup
  
  # Security dependencies
  kms_key_id               = module.security.kms_key_id
  security_group_ids       = module.vpc.security_group_ids
  secrets_manager_arn      = module.security.secrets_manager_arn
  
  tags = local.common_tags
}

# Compliance Module - Automated compliance monitoring and reporting
module "compliance" {
  source = "./modules/compliance"
  
  environment              = var.environment
  compliance_standards     = var.compliance_standards
  data_retention_days      = var.data_retention_days
  security_contact_email   = var.security_contact_email
  compliance_contact_email = var.compliance_contact_email
  
  # Dependencies for compliance checks
  vpc_id                   = module.vpc.vpc_id
  kms_key_id              = module.security.kms_key_id
  cloudtrail_arn          = module.monitoring.cloudtrail_arn
  config_recorder_name    = module.monitoring.config_configuration_recorder_name
  guardduty_detector_id   = module.monitoring.guardduty_detector_id
  
  tags = local.common_tags
}

# Service Modules - Enhanced microservices with security controls
module "api_gateway" {
  source = "./services/api-gateway"
  
  cluster_name           = module.kubernetes.cluster_name
  environment           = var.environment
  vpc_id                = module.vpc.vpc_id
  private_subnet_ids    = module.vpc.private_subnet_ids
  enable_waf            = var.enable_waf
  waf_web_acl_arn       = module.security.waf_web_acl_arn
  
  # Security dependencies
  kms_key_id            = module.security.kms_key_id
  security_group_ids    = module.vpc.security_group_ids
  secrets_manager_arn   = module.security.secrets_manager_arn
  
  tags = local.common_tags
}

module "eureka_server" {
  source = "./services/eureka-server"
  
  cluster_name           = module.kubernetes.cluster_name
  environment           = var.environment
  vpc_id                = module.vpc.vpc_id
  private_subnet_ids    = module.vpc.private_subnet_ids
  
  # Security dependencies
  kms_key_id            = module.security.kms_key_id
  security_group_ids    = module.vpc.security_group_ids
  secrets_manager_arn   = module.security.secrets_manager_arn
  
  tags = local.common_tags
}

module "notification_service" {
  source = "./services/notification-service"
  
  cluster_name           = module.kubernetes.cluster_name
  environment           = var.environment
  vpc_id                = module.vpc.vpc_id
  private_subnet_ids    = module.vpc.private_subnet_ids
  
  # Security dependencies
  kms_key_id            = module.security.kms_key_id
  security_group_ids    = module.vpc.security_group_ids
  secrets_manager_arn   = module.security.secrets_manager_arn
  database_endpoint     = module.database.primary_endpoint
  
  tags = local.common_tags
}

module "payment_service" {
  source = "./services/payment-service"
  
  cluster_name           = module.kubernetes.cluster_name
  environment           = var.environment
  vpc_id                = module.vpc.vpc_id
  private_subnet_ids    = module.vpc.private_subnet_ids
  
  # Security dependencies
  kms_key_id            = module.security.kms_key_id
  security_group_ids    = module.vpc.security_group_ids
  secrets_manager_arn   = module.security.secrets_manager_arn
  database_endpoint     = module.database.primary_endpoint
  
  tags = local.common_tags
}

module "user_service" {
  source = "./services/user-service"
  
  cluster_name           = module.kubernetes.cluster_name
  environment           = var.environment
  vpc_id                = module.vpc.vpc_id
  private_subnet_ids    = module.vpc.private_subnet_ids
  
  # Security dependencies
  kms_key_id            = module.security.kms_key_id
  security_group_ids    = module.vpc.security_group_ids
  secrets_manager_arn   = module.security.secrets_manager_arn
  database_endpoint     = module.database.primary_endpoint
  
  tags = local.common_tags
}


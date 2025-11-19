# Core Infrastructure Variables
variable "aws_region" {
  description = "AWS region for resource deployment"
  type        = string
  default     = "us-west-2"

  validation {
    condition = can(regex("^[a-z]{2}-[a-z]+-[0-9]$", var.aws_region))
    error_message = "AWS region must be in the format: us-west-2, eu-west-1, etc."
  }
}

variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

variable "cluster_name" {
  description = "Name of the EKS cluster"
  type        = string
  default     = "paynext-cluster"

  validation {
    condition     = can(regex("^[a-zA-Z][a-zA-Z0-9-]*$", var.cluster_name))
    error_message = "Cluster name must start with a letter and contain only alphanumeric characters and hyphens."
  }
}

# Storage Variables
variable "s3_bucket_name" {
  description = "Name of the S3 bucket for PayNext storage"
  type        = string
  default     = "paynext-storage-bucket"

  validation {
    condition     = can(regex("^[a-z0-9][a-z0-9-]*[a-z0-9]$", var.s3_bucket_name))
    error_message = "S3 bucket name must be lowercase, start and end with alphanumeric characters, and contain only hyphens as special characters."
  }
}

# Security Variables
variable "allowed_cidr_blocks" {
  description = "CIDR blocks allowed to access resources"
  type        = list(string)
  default     = ["10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16"]

  validation {
    condition = alltrue([
      for cidr in var.allowed_cidr_blocks : can(cidrhost(cidr, 0))
    ])
    error_message = "All CIDR blocks must be valid."
  }
}

variable "enable_vpc_flow_logs" {
  description = "Enable VPC Flow Logs for network monitoring"
  type        = bool
  default     = true
}

variable "enable_guardduty" {
  description = "Enable AWS GuardDuty for threat detection"
  type        = bool
  default     = true
}

variable "enable_config" {
  description = "Enable AWS Config for compliance monitoring"
  type        = bool
  default     = true
}

variable "enable_cloudtrail" {
  description = "Enable AWS CloudTrail for API logging"
  type        = bool
  default     = true
}

variable "enable_waf" {
  description = "Enable AWS WAF for web application protection"
  type        = bool
  default     = true
}

variable "enable_secrets_manager" {
  description = "Enable AWS Secrets Manager for secrets management"
  type        = bool
  default     = true
}

# Compliance Variables
variable "compliance_standards" {
  description = "List of compliance standards to adhere to"
  type        = list(string)
  default     = ["PCI-DSS", "GDPR", "SOX", "ISO-27001"]
}

variable "data_retention_days" {
  description = "Number of days to retain logs and audit data"
  type        = number
  default     = 2555  # 7 years for financial compliance

  validation {
    condition     = var.data_retention_days >= 365
    error_message = "Data retention must be at least 365 days for financial compliance."
  }
}

# Encryption Variables
variable "kms_key_deletion_window" {
  description = "Number of days before KMS key deletion (7-30)"
  type        = number
  default     = 30

  validation {
    condition     = var.kms_key_deletion_window >= 7 && var.kms_key_deletion_window <= 30
    error_message = "KMS key deletion window must be between 7 and 30 days."
  }
}

variable "enable_encryption_at_rest" {
  description = "Enable encryption at rest for all data stores"
  type        = bool
  default     = true
}

variable "enable_encryption_in_transit" {
  description = "Enable encryption in transit for all communications"
  type        = bool
  default     = true
}

# Monitoring Variables
variable "log_retention_days" {
  description = "Number of days to retain CloudWatch logs"
  type        = number
  default     = 365

  validation {
    condition     = var.log_retention_days >= 30
    error_message = "Log retention must be at least 30 days."
  }
}

variable "enable_detailed_monitoring" {
  description = "Enable detailed monitoring for EC2 instances"
  type        = bool
  default     = true
}

# Network Security Variables
variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"

  validation {
    condition     = can(cidrhost(var.vpc_cidr, 0))
    error_message = "VPC CIDR must be a valid CIDR block."
  }
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.10.0/24", "10.0.11.0/24", "10.0.12.0/24"]
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}

variable "database_subnet_cidrs" {
  description = "CIDR blocks for database subnets"
  type        = list(string)
  default     = ["10.0.20.0/24", "10.0.21.0/24", "10.0.22.0/24"]
}

# High Availability Variables
variable "availability_zones" {
  description = "List of availability zones to use"
  type        = list(string)
  default     = []  # Will be auto-detected based on region
}

variable "enable_multi_az" {
  description = "Enable multi-AZ deployment for high availability"
  type        = bool
  default     = true
}

# Backup and Disaster Recovery Variables
variable "backup_retention_days" {
  description = "Number of days to retain backups"
  type        = number
  default     = 35

  validation {
    condition     = var.backup_retention_days >= 7
    error_message = "Backup retention must be at least 7 days."
  }
}

variable "enable_cross_region_backup" {
  description = "Enable cross-region backup for disaster recovery"
  type        = bool
  default     = true
}

variable "dr_region" {
  description = "Disaster recovery region"
  type        = string
  default     = "us-east-1"
}

# Tagging Variables
variable "additional_tags" {
  description = "Additional tags to apply to all resources"
  type        = map(string)
  default     = {}
}

variable "cost_center" {
  description = "Cost center for resource billing"
  type        = string
  default     = "Engineering"
}

variable "owner" {
  description = "Owner of the resources"
  type        = string
  default     = "PayNext-DevOps"
}

# Security Contact Information
variable "security_contact_email" {
  description = "Email address for security notifications"
  type        = string
  default     = "security@paynext.com"

  validation {
    condition     = can(regex("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", var.security_contact_email))
    error_message = "Security contact email must be a valid email address."
  }
}

variable "compliance_contact_email" {
  description = "Email address for compliance notifications"
  type        = string
  default     = "compliance@paynext.com"

  validation {
    condition     = can(regex("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", var.compliance_contact_email))
    error_message = "Compliance contact email must be a valid email address."
  }
}

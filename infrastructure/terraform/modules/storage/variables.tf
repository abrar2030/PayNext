# Storage Module Variables

variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

variable "vpc_id" {
  description = "VPC ID where storage resources will be deployed"
  type        = string
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs for EFS mount targets"
  type        = list(string)
  default     = []
}

variable "kms_key_id" {
  description = "KMS key ID for encryption"
  type        = string
}

variable "dr_kms_key_id" {
  description = "KMS key ID for disaster recovery region encryption"
  type        = string
  default     = ""
}

variable "security_group_ids" {
  description = "Map of security group IDs"
  type        = map(string)
  default     = {}
}

# Data Retention and Lifecycle
variable "data_retention_days" {
  description = "Number of days to retain data for compliance"
  type        = number
  default     = 2555  # 7 years for financial compliance

  validation {
    condition     = var.data_retention_days >= 365
    error_message = "Data retention must be at least 365 days for financial compliance."
  }
}

variable "backup_retention_days" {
  description = "Number of days to retain backups"
  type        = number
  default     = 90

  validation {
    condition     = var.backup_retention_days >= 30
    error_message = "Backup retention must be at least 30 days."
  }
}

variable "enable_lifecycle_policies" {
  description = "Enable S3 lifecycle policies for cost optimization"
  type        = bool
  default     = true
}

variable "transition_to_ia_days" {
  description = "Number of days before transitioning to Infrequent Access"
  type        = number
  default     = 30

  validation {
    condition     = var.transition_to_ia_days >= 30
    error_message = "Transition to IA must be at least 30 days."
  }
}

variable "transition_to_glacier_days" {
  description = "Number of days before transitioning to Glacier"
  type        = number
  default     = 90

  validation {
    condition     = var.transition_to_glacier_days >= 90
    error_message = "Transition to Glacier must be at least 90 days."
  }
}

variable "transition_to_deep_archive_days" {
  description = "Number of days before transitioning to Deep Archive"
  type        = number
  default     = 365

  validation {
    condition     = var.transition_to_deep_archive_days >= 180
    error_message = "Transition to Deep Archive must be at least 180 days."
  }
}

# Cross-Region Replication
variable "enable_cross_region_replication" {
  description = "Enable cross-region replication for disaster recovery"
  type        = bool
  default     = true
}

variable "replication_destination_region" {
  description = "Destination region for cross-region replication"
  type        = string
  default     = "us-east-1"
}

# Encryption and Security
variable "enable_bucket_encryption" {
  description = "Enable server-side encryption for S3 buckets"
  type        = bool
  default     = true
}

variable "enable_bucket_versioning" {
  description = "Enable versioning for S3 buckets"
  type        = bool
  default     = true
}

variable "enable_mfa_delete" {
  description = "Enable MFA delete for S3 buckets"
  type        = bool
  default     = false
}

variable "enable_access_logging" {
  description = "Enable access logging for S3 buckets"
  type        = bool
  default     = true
}

variable "enable_object_lock" {
  description = "Enable S3 Object Lock for compliance"
  type        = bool
  default     = false
}

# Monitoring and Alerting
variable "enable_cloudwatch_metrics" {
  description = "Enable CloudWatch metrics for S3 buckets"
  type        = bool
  default     = true
}

variable "enable_s3_notifications" {
  description = "Enable S3 event notifications"
  type        = bool
  default     = true
}

variable "bucket_size_alarm_threshold" {
  description = "Threshold for S3 bucket size alarm (in bytes)"
  type        = number
  default     = 107374182400  # 100 GB

  validation {
    condition     = var.bucket_size_alarm_threshold > 0
    error_message = "Bucket size alarm threshold must be greater than 0."
  }
}

variable "enable_cost_optimization" {
  description = "Enable cost optimization features"
  type        = bool
  default     = true
}

# EFS Configuration
variable "enable_efs" {
  description = "Enable EFS for shared file storage"
  type        = bool
  default     = true
}

variable "efs_performance_mode" {
  description = "Performance mode for EFS"
  type        = string
  default     = "generalPurpose"

  validation {
    condition     = contains(["generalPurpose", "maxIO"], var.efs_performance_mode)
    error_message = "EFS performance mode must be generalPurpose or maxIO."
  }
}

variable "efs_throughput_mode" {
  description = "Throughput mode for EFS"
  type        = string
  default     = "provisioned"

  validation {
    condition     = contains(["bursting", "provisioned"], var.efs_throughput_mode)
    error_message = "EFS throughput mode must be bursting or provisioned."
  }
}

variable "efs_provisioned_throughput" {
  description = "Provisioned throughput for EFS (MiB/s)"
  type        = number
  default     = 100

  validation {
    condition     = var.efs_provisioned_throughput >= 1 && var.efs_provisioned_throughput <= 1024
    error_message = "EFS provisioned throughput must be between 1 and 1024 MiB/s."
  }
}

# Bucket Configuration
variable "primary_bucket_name" {
  description = "Name for the primary S3 bucket (will be suffixed with environment and random string)"
  type        = string
  default     = "paynext-primary"
}

variable "documents_bucket_name" {
  description = "Name for the documents S3 bucket (will be suffixed with environment and random string)"
  type        = string
  default     = "paynext-documents"
}

variable "backup_bucket_name" {
  description = "Name for the backup S3 bucket (will be suffixed with environment and random string)"
  type        = string
  default     = "paynext-backup"
}

variable "audit_logs_bucket_name" {
  description = "Name for the audit logs S3 bucket (will be suffixed with environment and random string)"
  type        = string
  default     = "paynext-audit-logs"
}

# Access Control
variable "enable_bucket_public_access_block" {
  description = "Enable public access block for all S3 buckets"
  type        = bool
  default     = true
}

variable "enable_secure_transport_only" {
  description = "Require secure transport (HTTPS) for all S3 operations"
  type        = bool
  default     = true
}

variable "enable_encryption_in_transit" {
  description = "Require encryption in transit for all S3 operations"
  type        = bool
  default     = true
}

# Compliance Features
variable "enable_compliance_monitoring" {
  description = "Enable compliance monitoring features"
  type        = bool
  default     = true
}

variable "enable_data_classification" {
  description = "Enable data classification tagging"
  type        = bool
  default     = true
}

variable "enable_audit_trail" {
  description = "Enable comprehensive audit trail for storage operations"
  type        = bool
  default     = true
}

# Performance Optimization
variable "enable_transfer_acceleration" {
  description = "Enable S3 Transfer Acceleration"
  type        = bool
  default     = false
}

variable "enable_intelligent_tiering" {
  description = "Enable S3 Intelligent Tiering"
  type        = bool
  default     = true
}

variable "enable_multipart_upload" {
  description = "Enable and configure multipart upload settings"
  type        = bool
  default     = true
}

variable "multipart_upload_threshold" {
  description = "Threshold for multipart upload (in MB)"
  type        = number
  default     = 100

  validation {
    condition     = var.multipart_upload_threshold >= 5 && var.multipart_upload_threshold <= 5000
    error_message = "Multipart upload threshold must be between 5 and 5000 MB."
  }
}

# Disaster Recovery
variable "enable_cross_account_replication" {
  description = "Enable cross-account replication for additional security"
  type        = bool
  default     = false
}

variable "dr_account_id" {
  description = "AWS account ID for disaster recovery"
  type        = string
  default     = ""
}

variable "enable_point_in_time_recovery" {
  description = "Enable point-in-time recovery capabilities"
  type        = bool
  default     = true
}

# Cost Management
variable "enable_cost_allocation_tags" {
  description = "Enable cost allocation tags for billing"
  type        = bool
  default     = true
}

variable "enable_storage_analytics" {
  description = "Enable S3 Storage Analytics"
  type        = bool
  default     = true
}

variable "enable_inventory_reports" {
  description = "Enable S3 Inventory reports"
  type        = bool
  default     = true
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}

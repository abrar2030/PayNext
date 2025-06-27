# Database Module Variables

variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string
  
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

variable "vpc_id" {
  description = "VPC ID where the database will be deployed"
  type        = string
}

variable "database_subnet_ids" {
  description = "List of database subnet IDs"
  type        = list(string)
  
  validation {
    condition     = length(var.database_subnet_ids) >= 2
    error_message = "At least 2 database subnets are required for high availability."
  }
}

variable "database_subnet_group_name" {
  description = "Name of the database subnet group"
  type        = string
}

variable "enable_encryption_at_rest" {
  description = "Enable encryption at rest for the database"
  type        = bool
  default     = true
}

variable "enable_multi_az" {
  description = "Enable multi-AZ deployment for high availability"
  type        = bool
  default     = true
}

variable "backup_retention_days" {
  description = "Number of days to retain backups"
  type        = number
  default     = 35
  
  validation {
    condition     = var.backup_retention_days >= 7 && var.backup_retention_days <= 35
    error_message = "Backup retention must be between 7 and 35 days."
  }
}

variable "enable_cross_region_backup" {
  description = "Enable cross-region backup for disaster recovery"
  type        = bool
  default     = true
}

variable "kms_key_id" {
  description = "KMS key ID for encryption"
  type        = string
}

variable "security_group_ids" {
  description = "Map of security group IDs"
  type        = map(string)
}

variable "secrets_manager_arn" {
  description = "ARN of the Secrets Manager secret"
  type        = string
}

# Database Configuration
variable "db_engine" {
  description = "Database engine"
  type        = string
  default     = "aurora-postgresql"
  
  validation {
    condition     = contains(["aurora-postgresql", "aurora-mysql"], var.db_engine)
    error_message = "Database engine must be aurora-postgresql or aurora-mysql."
  }
}

variable "db_engine_version" {
  description = "Database engine version"
  type        = string
  default     = "15.3"
}

variable "db_family" {
  description = "Database parameter group family"
  type        = string
  default     = "aurora-postgresql15"
}

variable "db_name" {
  description = "Name of the database"
  type        = string
  default     = "paynext"
  
  validation {
    condition     = can(regex("^[a-zA-Z][a-zA-Z0-9_]*$", var.db_name))
    error_message = "Database name must start with a letter and contain only alphanumeric characters and underscores."
  }
}

variable "db_master_username" {
  description = "Master username for the database"
  type        = string
  default     = "paynext_admin"
  
  validation {
    condition     = can(regex("^[a-zA-Z][a-zA-Z0-9_]*$", var.db_master_username))
    error_message = "Master username must start with a letter and contain only alphanumeric characters and underscores."
  }
}

variable "db_instance_class" {
  description = "Instance class for database instances"
  type        = string
  default     = "db.r6g.large"
  
  validation {
    condition     = can(regex("^db\\.", var.db_instance_class))
    error_message = "Instance class must be a valid RDS instance type."
  }
}

variable "db_instance_count" {
  description = "Number of database instances in the cluster"
  type        = number
  default     = 2
  
  validation {
    condition     = var.db_instance_count >= 1 && var.db_instance_count <= 15
    error_message = "Database instance count must be between 1 and 15."
  }
}

# Serverless v2 Configuration
variable "db_min_capacity" {
  description = "Minimum capacity for Aurora Serverless v2"
  type        = number
  default     = 0.5
  
  validation {
    condition     = var.db_min_capacity >= 0.5 && var.db_min_capacity <= 128
    error_message = "Minimum capacity must be between 0.5 and 128 ACUs."
  }
}

variable "db_max_capacity" {
  description = "Maximum capacity for Aurora Serverless v2"
  type        = number
  default     = 16
  
  validation {
    condition     = var.db_max_capacity >= 0.5 && var.db_max_capacity <= 128
    error_message = "Maximum capacity must be between 0.5 and 128 ACUs."
  }
}

# Backup and Maintenance
variable "preferred_backup_window" {
  description = "Preferred backup window"
  type        = string
  default     = "03:00-04:00"
  
  validation {
    condition     = can(regex("^[0-2][0-9]:[0-5][0-9]-[0-2][0-9]:[0-5][0-9]$", var.preferred_backup_window))
    error_message = "Backup window must be in format HH:MM-HH:MM."
  }
}

variable "preferred_maintenance_window" {
  description = "Preferred maintenance window"
  type        = string
  default     = "sun:04:00-sun:05:00"
  
  validation {
    condition     = can(regex("^(mon|tue|wed|thu|fri|sat|sun):[0-2][0-9]:[0-5][0-9]-(mon|tue|wed|thu|fri|sat|sun):[0-2][0-9]:[0-5][0-9]$", var.preferred_maintenance_window))
    error_message = "Maintenance window must be in format ddd:HH:MM-ddd:HH:MM."
  }
}

variable "deletion_protection" {
  description = "Enable deletion protection for the database cluster"
  type        = bool
  default     = true
}

variable "skip_final_snapshot" {
  description = "Skip final snapshot when deleting the cluster"
  type        = bool
  default     = false
}

# Monitoring and Logging
variable "log_retention_days" {
  description = "Number of days to retain database logs"
  type        = number
  default     = 365
  
  validation {
    condition     = var.log_retention_days >= 1
    error_message = "Log retention must be at least 1 day."
  }
}

variable "enable_performance_insights" {
  description = "Enable Performance Insights"
  type        = bool
  default     = true
}

variable "performance_insights_retention_period" {
  description = "Performance Insights retention period in days"
  type        = number
  default     = 7
  
  validation {
    condition     = contains([7, 731], var.performance_insights_retention_period)
    error_message = "Performance Insights retention period must be 7 or 731 days."
  }
}

variable "enable_enhanced_monitoring" {
  description = "Enable enhanced monitoring"
  type        = bool
  default     = true
}

variable "monitoring_interval" {
  description = "Enhanced monitoring interval in seconds"
  type        = number
  default     = 60
  
  validation {
    condition     = contains([0, 1, 5, 10, 15, 30, 60], var.monitoring_interval)
    error_message = "Monitoring interval must be 0, 1, 5, 10, 15, 30, or 60 seconds."
  }
}

# Security
variable "enable_rds_proxy" {
  description = "Enable RDS Proxy for connection pooling"
  type        = bool
  default     = true
}

variable "proxy_idle_client_timeout" {
  description = "RDS Proxy idle client timeout in seconds"
  type        = number
  default     = 1800
  
  validation {
    condition     = var.proxy_idle_client_timeout >= 1 && var.proxy_idle_client_timeout <= 28800
    error_message = "Proxy idle client timeout must be between 1 and 28800 seconds."
  }
}

variable "proxy_max_connections_percent" {
  description = "Maximum connections percentage for RDS Proxy"
  type        = number
  default     = 100
  
  validation {
    condition     = var.proxy_max_connections_percent >= 1 && var.proxy_max_connections_percent <= 100
    error_message = "Proxy max connections percent must be between 1 and 100."
  }
}

variable "proxy_max_idle_connections_percent" {
  description = "Maximum idle connections percentage for RDS Proxy"
  type        = number
  default     = 50
  
  validation {
    condition     = var.proxy_max_idle_connections_percent >= 0 && var.proxy_max_idle_connections_percent <= 100
    error_message = "Proxy max idle connections percent must be between 0 and 100."
  }
}

# Compliance and Audit
variable "enable_audit_logging" {
  description = "Enable audit logging for compliance"
  type        = bool
  default     = true
}

variable "enable_query_logging" {
  description = "Enable query logging for security monitoring"
  type        = bool
  default     = true
}

variable "enable_connection_logging" {
  description = "Enable connection logging for security monitoring"
  type        = bool
  default     = true
}

# Disaster Recovery
variable "dr_region" {
  description = "Disaster recovery region"
  type        = string
  default     = "us-east-1"
}

variable "enable_automated_backups" {
  description = "Enable automated backups using AWS Backup"
  type        = bool
  default     = true
}

variable "backup_schedule" {
  description = "Cron expression for backup schedule"
  type        = string
  default     = "cron(0 5 ? * * *)"  # Daily at 5 AM UTC
}

variable "backup_cold_storage_after_days" {
  description = "Number of days after which backups are moved to cold storage"
  type        = number
  default     = 30
  
  validation {
    condition     = var.backup_cold_storage_after_days >= 1
    error_message = "Cold storage transition must be at least 1 day."
  }
}

# Alerting
variable "cpu_threshold" {
  description = "CPU utilization threshold for alerts"
  type        = number
  default     = 80
  
  validation {
    condition     = var.cpu_threshold >= 1 && var.cpu_threshold <= 100
    error_message = "CPU threshold must be between 1 and 100 percent."
  }
}

variable "connection_threshold" {
  description = "Database connections threshold for alerts"
  type        = number
  default     = 80
  
  validation {
    condition     = var.connection_threshold >= 1
    error_message = "Connection threshold must be at least 1."
  }
}

variable "memory_threshold" {
  description = "Freeable memory threshold for alerts (in bytes)"
  type        = number
  default     = 268435456  # 256 MB
  
  validation {
    condition     = var.memory_threshold >= 1
    error_message = "Memory threshold must be at least 1 byte."
  }
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}


# Monitoring Module Variables

variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string
  
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

variable "enable_cloudtrail" {
  description = "Enable AWS CloudTrail for API logging"
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

variable "log_retention_days" {
  description = "Number of days to retain CloudWatch logs"
  type        = number
  default     = 365
  
  validation {
    condition     = var.log_retention_days >= 30
    error_message = "Log retention must be at least 30 days."
  }
}

variable "data_retention_days" {
  description = "Number of days to retain audit and compliance data"
  type        = number
  default     = 2555  # 7 years for financial compliance
  
  validation {
    condition     = var.data_retention_days >= 365
    error_message = "Data retention must be at least 365 days for financial compliance."
  }
}

variable "security_contact_email" {
  description = "Email address for security notifications"
  type        = string
  
  validation {
    condition     = can(regex("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", var.security_contact_email))
    error_message = "Security contact email must be a valid email address."
  }
}

variable "compliance_contact_email" {
  description = "Email address for compliance notifications"
  type        = string
  
  validation {
    condition     = can(regex("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", var.compliance_contact_email))
    error_message = "Compliance contact email must be a valid email address."
  }
}

variable "vpc_id" {
  description = "VPC ID for monitoring resources"
  type        = string
}

variable "kms_key_id" {
  description = "KMS key ID for encryption"
  type        = string
}

variable "s3_bucket_id" {
  description = "S3 bucket ID for log storage"
  type        = string
}

variable "cloudtrail_s3_key_prefix" {
  description = "S3 key prefix for CloudTrail logs"
  type        = string
  default     = "cloudtrail-logs"
}

variable "config_s3_key_prefix" {
  description = "S3 key prefix for AWS Config"
  type        = string
  default     = "config"
}

variable "guardduty_finding_frequency" {
  description = "Frequency for GuardDuty findings publication"
  type        = string
  default     = "FIFTEEN_MINUTES"
  
  validation {
    condition = contains([
      "FIFTEEN_MINUTES",
      "ONE_HOUR",
      "SIX_HOURS"
    ], var.guardduty_finding_frequency)
    error_message = "GuardDuty finding frequency must be a valid option."
  }
}

variable "config_delivery_frequency" {
  description = "Frequency for AWS Config delivery channel"
  type        = string
  default     = "TwentyFour_Hours"
  
  validation {
    condition = contains([
      "One_Hour",
      "Three_Hours", 
      "Six_Hours",
      "Twelve_Hours",
      "TwentyFour_Hours"
    ], var.config_delivery_frequency)
    error_message = "Config delivery frequency must be a valid option."
  }
}

variable "enable_cloudtrail_insights" {
  description = "Enable CloudTrail Insights for anomaly detection"
  type        = bool
  default     = true
}

variable "enable_guardduty_s3_protection" {
  description = "Enable GuardDuty S3 protection"
  type        = bool
  default     = true
}

variable "enable_guardduty_kubernetes_protection" {
  description = "Enable GuardDuty Kubernetes protection"
  type        = bool
  default     = true
}

variable "enable_guardduty_malware_protection" {
  description = "Enable GuardDuty malware protection"
  type        = bool
  default     = true
}

variable "cloudwatch_alarm_cpu_threshold" {
  description = "CPU utilization threshold for CloudWatch alarms"
  type        = number
  default     = 80
  
  validation {
    condition     = var.cloudwatch_alarm_cpu_threshold >= 50 && var.cloudwatch_alarm_cpu_threshold <= 95
    error_message = "CPU threshold must be between 50 and 95 percent."
  }
}

variable "cloudwatch_alarm_error_threshold" {
  description = "Error count threshold for CloudWatch alarms"
  type        = number
  default     = 10
  
  validation {
    condition     = var.cloudwatch_alarm_error_threshold >= 1
    error_message = "Error threshold must be at least 1."
  }
}

variable "failed_login_threshold" {
  description = "Failed login attempts threshold for security alerts"
  type        = number
  default     = 5
  
  validation {
    condition     = var.failed_login_threshold >= 3 && var.failed_login_threshold <= 20
    error_message = "Failed login threshold must be between 3 and 20."
  }
}

variable "enable_detailed_monitoring" {
  description = "Enable detailed monitoring for resources"
  type        = bool
  default     = true
}

variable "enable_cross_region_cloudtrail" {
  description = "Enable cross-region CloudTrail logging"
  type        = bool
  default     = true
}

variable "cloudtrail_include_global_services" {
  description = "Include global service events in CloudTrail"
  type        = bool
  default     = true
}

variable "enable_log_file_validation" {
  description = "Enable CloudTrail log file validation"
  type        = bool
  default     = true
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}


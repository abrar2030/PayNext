# Storage Module Outputs

# S3 Bucket Outputs
output "primary_bucket_id" {
  description = "ID of the primary S3 bucket"
  value       = aws_s3_bucket.paynext_primary.id
}

output "primary_bucket_arn" {
  description = "ARN of the primary S3 bucket"
  value       = aws_s3_bucket.paynext_primary.arn
}

output "primary_bucket_domain_name" {
  description = "Domain name of the primary S3 bucket"
  value       = aws_s3_bucket.paynext_primary.bucket_domain_name
}

output "primary_bucket_regional_domain_name" {
  description = "Regional domain name of the primary S3 bucket"
  value       = aws_s3_bucket.paynext_primary.bucket_regional_domain_name
}

output "documents_bucket_id" {
  description = "ID of the documents S3 bucket"
  value       = aws_s3_bucket.paynext_documents.id
}

output "documents_bucket_arn" {
  description = "ARN of the documents S3 bucket"
  value       = aws_s3_bucket.paynext_documents.arn
}

output "documents_bucket_domain_name" {
  description = "Domain name of the documents S3 bucket"
  value       = aws_s3_bucket.paynext_documents.bucket_domain_name
}

output "backup_bucket_id" {
  description = "ID of the backup S3 bucket"
  value       = aws_s3_bucket.paynext_backup.id
}

output "backup_bucket_arn" {
  description = "ARN of the backup S3 bucket"
  value       = aws_s3_bucket.paynext_backup.arn
}

output "backup_bucket_domain_name" {
  description = "Domain name of the backup S3 bucket"
  value       = aws_s3_bucket.paynext_backup.bucket_domain_name
}

output "audit_logs_bucket_id" {
  description = "ID of the audit logs S3 bucket"
  value       = aws_s3_bucket.paynext_audit_logs.id
}

output "audit_logs_bucket_arn" {
  description = "ARN of the audit logs S3 bucket"
  value       = aws_s3_bucket.paynext_audit_logs.arn
}

output "audit_logs_bucket_domain_name" {
  description = "Domain name of the audit logs S3 bucket"
  value       = aws_s3_bucket.paynext_audit_logs.bucket_domain_name
}

# Cross-Region Replication Outputs
output "backup_replica_bucket_id" {
  description = "ID of the backup replica S3 bucket"
  value       = var.enable_cross_region_replication ? aws_s3_bucket.paynext_backup_replica[0].id : null
}

output "backup_replica_bucket_arn" {
  description = "ARN of the backup replica S3 bucket"
  value       = var.enable_cross_region_replication ? aws_s3_bucket.paynext_backup_replica[0].arn : null
}

output "replication_role_arn" {
  description = "ARN of the S3 replication IAM role"
  value       = var.enable_cross_region_replication ? aws_iam_role.s3_replication_role[0].arn : null
}

# EFS Outputs
output "efs_file_system_id" {
  description = "ID of the EFS file system"
  value       = var.enable_efs ? aws_efs_file_system.paynext_efs[0].id : null
}

output "efs_file_system_arn" {
  description = "ARN of the EFS file system"
  value       = var.enable_efs ? aws_efs_file_system.paynext_efs[0].arn : null
}

output "efs_dns_name" {
  description = "DNS name of the EFS file system"
  value       = var.enable_efs ? aws_efs_file_system.paynext_efs[0].dns_name : null
}

output "efs_mount_target_ids" {
  description = "IDs of the EFS mount targets"
  value       = var.enable_efs ? aws_efs_mount_target.paynext_efs_mount[*].id : []
}

output "efs_mount_target_dns_names" {
  description = "DNS names of the EFS mount targets"
  value       = var.enable_efs ? aws_efs_mount_target.paynext_efs_mount[*].dns_name : []
}

output "efs_security_group_id" {
  description = "Security group ID for EFS"
  value       = var.enable_efs ? aws_security_group.efs[0].id : null
}

# SNS Topic Outputs
output "s3_notifications_topic_arn" {
  description = "ARN of the S3 notifications SNS topic"
  value       = aws_sns_topic.s3_notifications.arn
}

output "s3_notifications_topic_name" {
  description = "Name of the S3 notifications SNS topic"
  value       = aws_sns_topic.s3_notifications.name
}

# CloudWatch Alarms
output "s3_bucket_size_alarm_arn" {
  description = "ARN of the S3 bucket size CloudWatch alarm"
  value       = aws_cloudwatch_metric_alarm.s3_bucket_size.arn
}

output "s3_bucket_size_alarm_name" {
  description = "Name of the S3 bucket size CloudWatch alarm"
  value       = aws_cloudwatch_metric_alarm.s3_bucket_size.alarm_name
}

# Bucket Summary
output "bucket_summary" {
  description = "Summary of all S3 buckets"
  value = {
    primary_bucket = {
      id                 = aws_s3_bucket.paynext_primary.id
      arn                = aws_s3_bucket.paynext_primary.arn
      domain_name        = aws_s3_bucket.paynext_primary.bucket_domain_name
      versioning_enabled = true
      encryption_enabled = var.enable_bucket_encryption
    }
    documents_bucket = {
      id                 = aws_s3_bucket.paynext_documents.id
      arn                = aws_s3_bucket.paynext_documents.arn
      domain_name        = aws_s3_bucket.paynext_documents.bucket_domain_name
      versioning_enabled = true
      encryption_enabled = var.enable_bucket_encryption
    }
    backup_bucket = {
      id                 = aws_s3_bucket.paynext_backup.id
      arn                = aws_s3_bucket.paynext_backup.arn
      domain_name        = aws_s3_bucket.paynext_backup.bucket_domain_name
      versioning_enabled = true
      encryption_enabled = var.enable_bucket_encryption
    }
    audit_logs_bucket = {
      id                 = aws_s3_bucket.paynext_audit_logs.id
      arn                = aws_s3_bucket.paynext_audit_logs.arn
      domain_name        = aws_s3_bucket.paynext_audit_logs.bucket_domain_name
      versioning_enabled = true
      encryption_enabled = var.enable_bucket_encryption
    }
  }
}

# Security Features Summary
output "security_features_enabled" {
  description = "Summary of enabled security features"
  value = {
    bucket_encryption        = var.enable_bucket_encryption
    bucket_versioning        = var.enable_bucket_versioning
    public_access_blocked    = var.enable_bucket_public_access_block
    secure_transport_only    = var.enable_secure_transport_only
    encryption_in_transit    = var.enable_encryption_in_transit
    cross_region_replication = var.enable_cross_region_replication
    mfa_delete               = var.enable_mfa_delete
    object_lock              = var.enable_object_lock
    access_logging           = var.enable_access_logging
    efs_encryption           = var.enable_efs
  }
}

# Compliance Features Summary
output "compliance_features_enabled" {
  description = "Summary of enabled compliance features"
  value = {
    data_retention_policy   = var.data_retention_days >= 2555
    backup_retention_policy = var.backup_retention_days >= 30
    lifecycle_policies      = var.enable_lifecycle_policies
    compliance_monitoring   = var.enable_compliance_monitoring
    data_classification     = var.enable_data_classification
    audit_trail             = var.enable_audit_trail
    point_in_time_recovery  = var.enable_point_in_time_recovery
    cross_region_backup     = var.enable_cross_region_replication
  }
}

# Cost Optimization Summary
output "cost_optimization_features" {
  description = "Summary of cost optimization features"
  value = {
    lifecycle_policies              = var.enable_lifecycle_policies
    intelligent_tiering             = var.enable_intelligent_tiering
    cost_allocation_tags            = var.enable_cost_allocation_tags
    storage_analytics               = var.enable_storage_analytics
    inventory_reports               = var.enable_inventory_reports
    transfer_acceleration           = var.enable_transfer_acceleration
    multipart_upload                = var.enable_multipart_upload
    transition_to_ia_days           = var.transition_to_ia_days
    transition_to_glacier_days      = var.transition_to_glacier_days
    transition_to_deep_archive_days = var.transition_to_deep_archive_days
  }
}

# Monitoring Summary
output "monitoring_features_enabled" {
  description = "Summary of enabled monitoring features"
  value = {
    cloudwatch_metrics     = var.enable_cloudwatch_metrics
    s3_notifications       = var.enable_s3_notifications
    bucket_size_monitoring = true
    access_logging         = var.enable_access_logging
    cost_optimization      = var.enable_cost_optimization
  }
}

# Storage Configuration Summary
output "storage_configuration" {
  description = "Summary of storage configuration"
  value = {
    total_buckets            = 4
    efs_enabled              = var.enable_efs
    cross_region_replication = var.enable_cross_region_replication
    encryption_at_rest       = var.enable_bucket_encryption
    encryption_in_transit    = var.enable_encryption_in_transit
    versioning_enabled       = var.enable_bucket_versioning
    lifecycle_management     = var.enable_lifecycle_policies
    backup_retention_days    = var.backup_retention_days
    data_retention_days      = var.data_retention_days
  }
}

# Access Endpoints
output "storage_endpoints" {
  description = "Storage access endpoints"
  value = {
    primary_bucket_endpoint    = "https://${aws_s3_bucket.paynext_primary.bucket_domain_name}"
    documents_bucket_endpoint  = "https://${aws_s3_bucket.paynext_documents.bucket_domain_name}"
    backup_bucket_endpoint     = "https://${aws_s3_bucket.paynext_backup.bucket_domain_name}"
    audit_logs_bucket_endpoint = "https://${aws_s3_bucket.paynext_audit_logs.bucket_domain_name}"
    efs_mount_endpoint         = var.enable_efs ? aws_efs_file_system.paynext_efs[0].dns_name : null
  }
}

# Disaster Recovery Information
output "disaster_recovery_info" {
  description = "Disaster recovery configuration"
  value = {
    cross_region_replication_enabled = var.enable_cross_region_replication
    replication_destination_region   = var.replication_destination_region
    backup_replica_bucket_arn        = var.enable_cross_region_replication ? aws_s3_bucket.paynext_backup_replica[0].arn : null
    point_in_time_recovery_enabled   = var.enable_point_in_time_recovery
    backup_retention_days            = var.backup_retention_days
  }
}

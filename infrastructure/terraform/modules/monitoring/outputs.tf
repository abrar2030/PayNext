# Monitoring Module Outputs

# CloudWatch Log Groups
output "application_log_group_arn" {
  description = "ARN of the application CloudWatch log group"
  value       = aws_cloudwatch_log_group.application_logs.arn
}

output "security_log_group_arn" {
  description = "ARN of the security CloudWatch log group"
  value       = aws_cloudwatch_log_group.security_logs.arn
}

output "audit_log_group_arn" {
  description = "ARN of the audit CloudWatch log group"
  value       = aws_cloudwatch_log_group.audit_logs.arn
}

output "performance_log_group_arn" {
  description = "ARN of the performance CloudWatch log group"
  value       = aws_cloudwatch_log_group.performance_logs.arn
}

output "cloudwatch_log_group_arn" {
  description = "ARN of the main CloudWatch log group"
  value       = aws_cloudwatch_log_group.application_logs.arn
}

# CloudTrail Outputs
output "cloudtrail_arn" {
  description = "ARN of the CloudTrail"
  value       = var.enable_cloudtrail ? aws_cloudtrail.paynext_cloudtrail[0].arn : null
}

output "cloudtrail_id" {
  description = "ID of the CloudTrail"
  value       = var.enable_cloudtrail ? aws_cloudtrail.paynext_cloudtrail[0].id : null
}

output "cloudtrail_home_region" {
  description = "Home region of the CloudTrail"
  value       = var.enable_cloudtrail ? aws_cloudtrail.paynext_cloudtrail[0].home_region : null
}

output "cloudtrail_bucket_name" {
  description = "Name of the S3 bucket for CloudTrail logs"
  value       = var.enable_cloudtrail ? aws_s3_bucket.cloudtrail_bucket[0].bucket : null
}

output "cloudtrail_bucket_arn" {
  description = "ARN of the S3 bucket for CloudTrail logs"
  value       = var.enable_cloudtrail ? aws_s3_bucket.cloudtrail_bucket[0].arn : null
}

output "cloudtrail_log_group_arn" {
  description = "ARN of the CloudTrail CloudWatch log group"
  value       = var.enable_cloudtrail ? aws_cloudwatch_log_group.cloudtrail_logs[0].arn : null
}

# GuardDuty Outputs
output "guardduty_detector_id" {
  description = "ID of the GuardDuty detector"
  value       = var.enable_guardduty ? aws_guardduty_detector.paynext_guardduty[0].id : null
}

output "guardduty_detector_arn" {
  description = "ARN of the GuardDuty detector"
  value       = var.enable_guardduty ? aws_guardduty_detector.paynext_guardduty[0].arn : null
}

output "guardduty_account_id" {
  description = "AWS account ID where GuardDuty is enabled"
  value       = var.enable_guardduty ? aws_guardduty_detector.paynext_guardduty[0].account_id : null
}

# AWS Config Outputs
output "config_configuration_recorder_name" {
  description = "Name of the AWS Config configuration recorder"
  value       = var.enable_config ? aws_config_configuration_recorder.paynext_config[0].name : null
}

output "config_delivery_channel_name" {
  description = "Name of the AWS Config delivery channel"
  value       = var.enable_config ? aws_config_delivery_channel.paynext_config[0].name : null
}

output "config_bucket_name" {
  description = "Name of the S3 bucket for AWS Config"
  value       = var.enable_config ? aws_s3_bucket.config_bucket[0].bucket : null
}

output "config_bucket_arn" {
  description = "ARN of the S3 bucket for AWS Config"
  value       = var.enable_config ? aws_s3_bucket.config_bucket[0].arn : null
}

output "config_role_arn" {
  description = "ARN of the IAM role for AWS Config"
  value       = var.enable_config ? aws_iam_role.config_role[0].arn : null
}

# Config Rules
output "config_rules" {
  description = "List of AWS Config rules"
  value = var.enable_config ? [
    aws_config_config_rule.s3_bucket_public_access_prohibited[0].name,
    aws_config_config_rule.encrypted_volumes[0].name,
    aws_config_config_rule.rds_storage_encrypted[0].name,
    aws_config_config_rule.cloudtrail_enabled[0].name
  ] : []
}

# SNS Topic Outputs
output "security_alerts_topic_arn" {
  description = "ARN of the security alerts SNS topic"
  value       = aws_sns_topic.security_alerts.arn
}

output "security_alerts_topic_name" {
  description = "Name of the security alerts SNS topic"
  value       = aws_sns_topic.security_alerts.name
}

# CloudWatch Alarms
output "cloudwatch_alarms" {
  description = "List of CloudWatch alarm names"
  value = [
    aws_cloudwatch_metric_alarm.high_error_rate.alarm_name,
    aws_cloudwatch_metric_alarm.high_cpu_utilization.alarm_name,
    aws_cloudwatch_metric_alarm.failed_login_attempts.alarm_name
  ]
}

output "high_error_rate_alarm_arn" {
  description = "ARN of the high error rate alarm"
  value       = aws_cloudwatch_metric_alarm.high_error_rate.arn
}

output "high_cpu_utilization_alarm_arn" {
  description = "ARN of the high CPU utilization alarm"
  value       = aws_cloudwatch_metric_alarm.high_cpu_utilization.arn
}

output "failed_login_attempts_alarm_arn" {
  description = "ARN of the failed login attempts alarm"
  value       = aws_cloudwatch_metric_alarm.failed_login_attempts.arn
}

# CloudWatch Dashboard
output "cloudwatch_dashboard_url" {
  description = "URL of the CloudWatch dashboard"
  value       = "https://${data.aws_region.current.name}.console.aws.amazon.com/cloudwatch/home?region=${data.aws_region.current.name}#dashboards:name=${aws_cloudwatch_dashboard.paynext_dashboard.dashboard_name}"
}

output "cloudwatch_dashboard_name" {
  description = "Name of the CloudWatch dashboard"
  value       = aws_cloudwatch_dashboard.paynext_dashboard.dashboard_name
}

# Monitoring Summary
output "monitoring_features_enabled" {
  description = "Summary of enabled monitoring features"
  value = {
    cloudtrail              = var.enable_cloudtrail
    guardduty               = var.enable_guardduty
    config                  = var.enable_config
    cloudwatch_logs         = true
    security_alerts         = true
    compliance_monitoring   = var.enable_config
    threat_detection        = var.enable_guardduty
    api_audit_logging       = var.enable_cloudtrail
    detailed_monitoring     = var.enable_detailed_monitoring
    cross_region_cloudtrail = var.enable_cross_region_cloudtrail
    log_file_validation     = var.enable_log_file_validation
  }
}

output "compliance_monitoring_status" {
  description = "Status of compliance monitoring features"
  value = {
    s3_public_access_monitoring = var.enable_config
    encryption_monitoring       = var.enable_config
    cloudtrail_monitoring       = var.enable_config
    security_group_monitoring   = var.enable_config
    data_retention_compliance   = var.data_retention_days >= 2555
    audit_trail_integrity       = var.enable_log_file_validation
  }
}

output "security_monitoring_endpoints" {
  description = "Security monitoring endpoints and contacts"
  value = {
    security_contact_email   = var.security_contact_email
    compliance_contact_email = var.compliance_contact_email
    sns_topic_arn            = aws_sns_topic.security_alerts.arn
    dashboard_url            = "https://${data.aws_region.current.name}.console.aws.amazon.com/cloudwatch/home?region=${data.aws_region.current.name}#dashboards:name=${aws_cloudwatch_dashboard.paynext_dashboard.dashboard_name}"
  }
}

# Log Retention Information
output "log_retention_summary" {
  description = "Summary of log retention policies"
  value = {
    application_logs_retention_days = var.log_retention_days
    security_logs_retention_days    = var.data_retention_days
    audit_logs_retention_days       = var.data_retention_days
    performance_logs_retention_days = var.log_retention_days
    cloudtrail_logs_retention_days  = var.data_retention_days
  }
}

# Security Module Outputs

# KMS Key Outputs
output "kms_key_id" {
  description = "ID of the KMS key"
  value       = aws_kms_key.paynext_key.key_id
}

output "kms_key_arn" {
  description = "ARN of the KMS key"
  value       = aws_kms_key.paynext_key.arn
}

output "kms_key_alias" {
  description = "Alias of the KMS key"
  value       = aws_kms_alias.paynext_key_alias.name
}

# Secrets Manager Outputs
output "secrets_manager_arn" {
  description = "ARN of the Secrets Manager secret"
  value       = var.enable_secrets_manager ? aws_secretsmanager_secret.paynext_secrets[0].arn : null
  sensitive   = true
}

output "secrets_manager_name" {
  description = "Name of the Secrets Manager secret"
  value       = var.enable_secrets_manager ? aws_secretsmanager_secret.paynext_secrets[0].name : null
}

output "secrets_manager_version_id" {
  description = "Version ID of the Secrets Manager secret"
  value       = var.enable_secrets_manager ? aws_secretsmanager_secret_version.paynext_secrets_version[0].version_id : null
  sensitive   = true
}

# WAF Outputs
output "waf_web_acl_id" {
  description = "ID of the WAF Web ACL"
  value       = var.enable_waf ? aws_wafv2_web_acl.paynext_waf[0].id : null
}

output "waf_web_acl_arn" {
  description = "ARN of the WAF Web ACL"
  value       = var.enable_waf ? aws_wafv2_web_acl.paynext_waf[0].arn : null
}

output "waf_web_acl_name" {
  description = "Name of the WAF Web ACL"
  value       = var.enable_waf ? aws_wafv2_web_acl.paynext_waf[0].name : null
}

output "waf_log_group_arn" {
  description = "ARN of the WAF CloudWatch log group"
  value       = var.enable_waf ? aws_cloudwatch_log_group.waf_log_group[0].arn : null
}

# Security Hub Outputs
output "security_hub_account_id" {
  description = "AWS account ID where Security Hub is enabled"
  value       = aws_securityhub_account.paynext_security_hub.id
}

# Config Outputs
output "config_recorder_name" {
  description = "Name of the AWS Config configuration recorder"
  value       = var.enable_config ? aws_config_configuration_recorder.paynext_config_recorder.name : null
}

output "config_delivery_channel_name" {
  description = "Name of the AWS Config delivery channel"
  value       = var.enable_config ? aws_config_delivery_channel.paynext_config_delivery_channel.name : null
}

output "config_bucket_name" {
  description = "Name of the S3 bucket for AWS Config"
  value       = var.enable_config ? aws_s3_bucket.config_bucket.bucket : null
}

output "config_bucket_arn" {
  description = "ARN of the S3 bucket for AWS Config"
  value       = var.enable_config ? aws_s3_bucket.config_bucket.arn : null
}

output "config_role_arn" {
  description = "ARN of the IAM role for AWS Config"
  value       = var.enable_config ? aws_iam_role.config_role.arn : null
}

# Security Summary
output "security_features_enabled" {
  description = "Summary of enabled security features"
  value = {
    kms_encryption    = true
    secrets_manager   = var.enable_secrets_manager
    waf_protection    = var.enable_waf
    security_hub      = var.enable_security_hub
    config_monitoring = var.enable_config
  }
}

output "compliance_features" {
  description = "Compliance features enabled"
  value = {
    encryption_at_rest       = true
    key_rotation             = true
    multi_region_keys        = true
    audit_logging            = var.enable_config
    security_monitoring      = var.enable_security_hub
    web_application_firewall = var.enable_waf
  }
}

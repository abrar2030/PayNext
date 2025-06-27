# Database Module Outputs

# Cluster Outputs
output "cluster_arn" {
  description = "ARN of the RDS cluster"
  value       = aws_rds_cluster.paynext_cluster.arn
}

output "cluster_id" {
  description = "ID of the RDS cluster"
  value       = aws_rds_cluster.paynext_cluster.cluster_identifier
}

output "cluster_identifier" {
  description = "Identifier of the RDS cluster"
  value       = aws_rds_cluster.paynext_cluster.cluster_identifier
}

output "cluster_endpoint" {
  description = "Writer endpoint for the RDS cluster"
  value       = aws_rds_cluster.paynext_cluster.endpoint
}

output "cluster_reader_endpoint" {
  description = "Reader endpoint for the RDS cluster"
  value       = aws_rds_cluster.paynext_cluster.reader_endpoint
}

output "cluster_port" {
  description = "Port on which the database accepts connections"
  value       = aws_rds_cluster.paynext_cluster.port
}

output "cluster_database_name" {
  description = "Name of the default database"
  value       = aws_rds_cluster.paynext_cluster.database_name
}

output "cluster_master_username" {
  description = "Master username for the RDS cluster"
  value       = aws_rds_cluster.paynext_cluster.master_username
  sensitive   = true
}

output "cluster_engine" {
  description = "Database engine"
  value       = aws_rds_cluster.paynext_cluster.engine
}

output "cluster_engine_version" {
  description = "Database engine version"
  value       = aws_rds_cluster.paynext_cluster.engine_version
}

output "cluster_hosted_zone_id" {
  description = "Route53 hosted zone ID for the RDS cluster"
  value       = aws_rds_cluster.paynext_cluster.hosted_zone_id
}

# Primary endpoint (for backward compatibility)
output "primary_endpoint" {
  description = "Primary endpoint for the RDS cluster"
  value       = aws_rds_cluster.paynext_cluster.endpoint
}

output "reader_endpoint" {
  description = "Reader endpoint for the RDS cluster"
  value       = aws_rds_cluster.paynext_cluster.reader_endpoint
}

# Instance Outputs
output "cluster_instances" {
  description = "Map of cluster instances"
  value = {
    for instance in aws_rds_cluster_instance.paynext_cluster_instances : instance.identifier => {
      arn                    = instance.arn
      identifier            = instance.identifier
      endpoint              = instance.endpoint
      port                  = instance.port
      instance_class        = instance.instance_class
      engine                = instance.engine
      engine_version        = instance.engine_version
      publicly_accessible   = instance.publicly_accessible
      availability_zone     = instance.availability_zone
      performance_insights_enabled = instance.performance_insights_enabled
    }
  }
}

output "cluster_instance_endpoints" {
  description = "List of RDS cluster instance endpoints"
  value       = aws_rds_cluster_instance.paynext_cluster_instances[*].endpoint
}

output "cluster_instance_identifiers" {
  description = "List of RDS cluster instance identifiers"
  value       = aws_rds_cluster_instance.paynext_cluster_instances[*].identifier
}

# Security Outputs
output "cluster_security_group_id" {
  description = "Security group ID for the RDS cluster"
  value       = aws_security_group.rds_cluster.id
}

output "cluster_security_group_arn" {
  description = "Security group ARN for the RDS cluster"
  value       = aws_security_group.rds_cluster.arn
}

# Secrets Manager Outputs
output "master_password_secret_arn" {
  description = "ARN of the Secrets Manager secret containing the master password"
  value       = aws_secretsmanager_secret.db_master_password.arn
  sensitive   = true
}

output "master_password_secret_name" {
  description = "Name of the Secrets Manager secret containing the master password"
  value       = aws_secretsmanager_secret.db_master_password.name
  sensitive   = true
}

# RDS Proxy Outputs
output "proxy_arn" {
  description = "ARN of the RDS proxy"
  value       = var.enable_rds_proxy ? aws_db_proxy.paynext_proxy.arn : null
}

output "proxy_endpoint" {
  description = "Endpoint of the RDS proxy"
  value       = var.enable_rds_proxy ? aws_db_proxy.paynext_proxy.endpoint : null
}

output "proxy_id" {
  description = "ID of the RDS proxy"
  value       = var.enable_rds_proxy ? aws_db_proxy.paynext_proxy.id : null
}

output "proxy_security_group_id" {
  description = "Security group ID for the RDS proxy"
  value       = var.enable_rds_proxy ? aws_security_group.rds_proxy.id : null
}

# Subnet Group Outputs
output "db_subnet_group_name" {
  description = "Name of the database subnet group"
  value       = aws_db_subnet_group.paynext_db_subnet_group.name
}

output "db_subnet_group_arn" {
  description = "ARN of the database subnet group"
  value       = aws_db_subnet_group.paynext_db_subnet_group.arn
}

# Parameter Group Outputs
output "cluster_parameter_group_name" {
  description = "Name of the cluster parameter group"
  value       = aws_rds_cluster_parameter_group.paynext_cluster_pg.name
}

output "cluster_parameter_group_arn" {
  description = "ARN of the cluster parameter group"
  value       = aws_rds_cluster_parameter_group.paynext_cluster_pg.arn
}

output "db_parameter_group_name" {
  description = "Name of the database parameter group"
  value       = aws_db_parameter_group.paynext_db_pg.name
}

output "db_parameter_group_arn" {
  description = "ARN of the database parameter group"
  value       = aws_db_parameter_group.paynext_db_pg.arn
}

# Monitoring Outputs
output "enhanced_monitoring_role_arn" {
  description = "ARN of the enhanced monitoring IAM role"
  value       = aws_iam_role.rds_enhanced_monitoring.arn
}

output "cloudwatch_log_group_name" {
  description = "Name of the CloudWatch log group for RDS logs"
  value       = aws_cloudwatch_log_group.rds_log_group.name
}

output "cloudwatch_log_group_arn" {
  description = "ARN of the CloudWatch log group for RDS logs"
  value       = aws_cloudwatch_log_group.rds_log_group.arn
}

# Backup Outputs
output "backup_vault_name" {
  description = "Name of the backup vault"
  value       = var.enable_automated_backups ? aws_backup_vault.paynext_backup_vault.name : null
}

output "backup_vault_arn" {
  description = "ARN of the backup vault"
  value       = var.enable_automated_backups ? aws_backup_vault.paynext_backup_vault.arn : null
}

output "backup_plan_id" {
  description = "ID of the backup plan"
  value       = var.enable_automated_backups ? aws_backup_plan.paynext_backup_plan.id : null
}

output "backup_plan_arn" {
  description = "ARN of the backup plan"
  value       = var.enable_automated_backups ? aws_backup_plan.paynext_backup_plan.arn : null
}

output "backup_role_arn" {
  description = "ARN of the backup IAM role"
  value       = var.enable_automated_backups ? aws_iam_role.backup_role.arn : null
}

# Alerting Outputs
output "database_alerts_topic_arn" {
  description = "ARN of the database alerts SNS topic"
  value       = aws_sns_topic.database_alerts.arn
}

output "database_alerts_topic_name" {
  description = "Name of the database alerts SNS topic"
  value       = aws_sns_topic.database_alerts.name
}

output "cloudwatch_alarms" {
  description = "List of CloudWatch alarm names"
  value = [
    aws_cloudwatch_metric_alarm.database_cpu.alarm_name,
    aws_cloudwatch_metric_alarm.database_connections.alarm_name,
    aws_cloudwatch_metric_alarm.database_freeable_memory.alarm_name
  ]
}

# Cross-Region Backup Outputs
output "backup_cluster_arn" {
  description = "ARN of the backup cluster in DR region"
  value       = var.enable_cross_region_backup ? aws_rds_cluster.paynext_cluster_backup[0].arn : null
}

output "backup_cluster_endpoint" {
  description = "Endpoint of the backup cluster in DR region"
  value       = var.enable_cross_region_backup ? aws_rds_cluster.paynext_cluster_backup[0].endpoint : null
}

# Connection Information
output "connection_info" {
  description = "Database connection information"
  value = {
    primary_endpoint = aws_rds_cluster.paynext_cluster.endpoint
    reader_endpoint  = aws_rds_cluster.paynext_cluster.reader_endpoint
    proxy_endpoint   = var.enable_rds_proxy ? aws_db_proxy.paynext_proxy.endpoint : null
    port            = aws_rds_cluster.paynext_cluster.port
    database_name   = aws_rds_cluster.paynext_cluster.database_name
    engine          = aws_rds_cluster.paynext_cluster.engine
    engine_version  = aws_rds_cluster.paynext_cluster.engine_version
  }
  sensitive = true
}

# Security Summary
output "security_features_enabled" {
  description = "Summary of enabled security features"
  value = {
    encryption_at_rest        = var.enable_encryption_at_rest
    encryption_in_transit     = true  # Always enabled for Aurora
    multi_az                 = var.enable_multi_az
    deletion_protection      = var.deletion_protection
    backup_encryption        = var.enable_encryption_at_rest
    performance_insights     = var.enable_performance_insights
    enhanced_monitoring      = var.enable_enhanced_monitoring
    audit_logging           = var.enable_audit_logging
    query_logging           = var.enable_query_logging
    connection_logging      = var.enable_connection_logging
    rds_proxy               = var.enable_rds_proxy
    automated_backups       = var.enable_automated_backups
    cross_region_backup     = var.enable_cross_region_backup
  }
}

# Compliance Summary
output "compliance_status" {
  description = "Compliance status summary"
  value = {
    pci_dss_compliant = var.enable_encryption_at_rest && var.enable_audit_logging && var.backup_retention_days >= 7
    gdpr_compliant    = var.enable_encryption_at_rest && var.enable_audit_logging && var.backup_retention_days >= 30
    sox_compliant     = var.enable_audit_logging && var.enable_query_logging && var.backup_retention_days >= 35
    hipaa_compliant   = var.enable_encryption_at_rest && var.enable_audit_logging && var.deletion_protection
  }
}

# Performance and Monitoring Summary
output "monitoring_summary" {
  description = "Summary of monitoring and performance features"
  value = {
    performance_insights_enabled     = var.enable_performance_insights
    performance_insights_retention   = var.performance_insights_retention_period
    enhanced_monitoring_enabled     = var.enable_enhanced_monitoring
    monitoring_interval             = var.monitoring_interval
    cloudwatch_logs_enabled         = true
    log_retention_days              = var.log_retention_days
    cpu_alarm_threshold             = var.cpu_threshold
    connection_alarm_threshold      = var.connection_threshold
    memory_alarm_threshold          = var.memory_threshold
  }
}


# Database Module for PayNext
# This module provides secure and highly available database infrastructure

# Data sources
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# Random password for database
resource "random_password" "db_master_password" {
  length  = 32
  special = true
}

# Store database password in Secrets Manager
resource "aws_secretsmanager_secret" "db_master_password" {
  name                    = "paynext/${var.environment}/database/master-password"
  description            = "Master password for PayNext database"
  kms_key_id             = var.kms_key_id
  recovery_window_in_days = 30

  tags = merge(var.tags, {
    Name        = "PayNext-DB-Master-Password-${var.environment}"
    Purpose     = "DatabaseCredentials"
    Compliance  = "PCI-DSS,GDPR,SOX"
  })
}

resource "aws_secretsmanager_secret_version" "db_master_password" {
  secret_id = aws_secretsmanager_secret.db_master_password.id
  secret_string = jsonencode({
    username = var.db_master_username
    password = random_password.db_master_password.result
  })

  lifecycle {
    ignore_changes = [secret_string]
  }
}

# RDS Subnet Group
resource "aws_db_subnet_group" "paynext_db_subnet_group" {
  name       = "paynext-db-subnet-group-${var.environment}"
  subnet_ids = var.database_subnet_ids

  tags = merge(var.tags, {
    Name = "PayNext-DB-Subnet-Group-${var.environment}"
  })
}

# RDS Aurora Cluster Parameter Group
resource "aws_rds_cluster_parameter_group" "paynext_cluster_pg" {
  family      = var.db_family
  name        = "paynext-cluster-pg-${var.environment}"
  description = "PayNext Aurora cluster parameter group"

  # Security and compliance parameters
  parameter {
    name  = "log_statement"
    value = "all"
  }

  parameter {
    name  = "log_min_duration_statement"
    value = "1000"  # Log queries taking more than 1 second
  }

  parameter {
    name  = "shared_preload_libraries"
    value = "pg_stat_statements,pg_audit"
  }

  parameter {
    name  = "log_connections"
    value = "1"
  }

  parameter {
    name  = "log_disconnections"
    value = "1"
  }

  parameter {
    name  = "log_checkpoints"
    value = "1"
  }

  parameter {
    name  = "log_lock_waits"
    value = "1"
  }

  parameter {
    name  = "log_temp_files"
    value = "0"
  }

  parameter {
    name  = "log_autovacuum_min_duration"
    value = "0"
  }

  # Performance parameters
  parameter {
    name  = "shared_buffers"
    value = "{DBInstanceClassMemory/4}"
  }

  parameter {
    name  = "effective_cache_size"
    value = "{DBInstanceClassMemory*3/4}"
  }

  parameter {
    name  = "maintenance_work_mem"
    value = "{DBInstanceClassMemory/16}"
  }

  parameter {
    name  = "checkpoint_completion_target"
    value = "0.9"
  }

  parameter {
    name  = "wal_buffers"
    value = "{DBInstanceClassMemory/32}"
  }

  parameter {
    name  = "default_statistics_target"
    value = "100"
  }

  parameter {
    name  = "random_page_cost"
    value = "1.1"
  }

  parameter {
    name  = "effective_io_concurrency"
    value = "200"
  }

  tags = var.tags
}

# RDS Aurora DB Parameter Group
resource "aws_db_parameter_group" "paynext_db_pg" {
  family = var.db_family
  name   = "paynext-db-pg-${var.environment}"

  # Security parameters
  parameter {
    name  = "log_statement"
    value = "all"
  }

  parameter {
    name  = "log_min_duration_statement"
    value = "1000"
  }

  parameter {
    name  = "shared_preload_libraries"
    value = "pg_stat_statements,pg_audit"
  }

  tags = var.tags
}

# RDS Aurora Cluster
resource "aws_rds_cluster" "paynext_cluster" {
  cluster_identifier              = "paynext-cluster-${var.environment}"
  engine                         = var.db_engine
  engine_version                 = var.db_engine_version
  engine_mode                    = "provisioned"
  database_name                  = var.db_name
  master_username                = var.db_master_username
  manage_master_user_password    = false
  master_password                = random_password.db_master_password.result
  
  # Network and Security
  db_subnet_group_name           = aws_db_subnet_group.paynext_db_subnet_group.name
  vpc_security_group_ids         = [aws_security_group.rds_cluster.id]
  db_cluster_parameter_group_name = aws_rds_cluster_parameter_group.paynext_cluster_pg.name
  
  # Backup and Maintenance
  backup_retention_period        = var.backup_retention_days
  preferred_backup_window        = "03:00-04:00"
  preferred_maintenance_window   = "sun:04:00-sun:05:00"
  copy_tags_to_snapshot         = true
  deletion_protection           = var.environment == "prod" ? true : false
  skip_final_snapshot           = var.environment == "prod" ? false : true
  final_snapshot_identifier     = var.environment == "prod" ? "paynext-cluster-${var.environment}-final-snapshot-${formatdate("YYYY-MM-DD-hhmm", timestamp())}" : null
  
  # Encryption
  storage_encrypted              = var.enable_encryption_at_rest
  kms_key_id                    = var.kms_key_id
  
  # Logging
  enabled_cloudwatch_logs_exports = ["postgresql"]
  
  # Performance Insights
  performance_insights_enabled          = true
  performance_insights_kms_key_id      = var.kms_key_id
  performance_insights_retention_period = 7

  # Serverless v2 scaling (if needed)
  serverlessv2_scaling_configuration {
    max_capacity = var.db_max_capacity
    min_capacity = var.db_min_capacity
  }

  tags = merge(var.tags, {
    Name        = "PayNext-DB-Cluster-${var.environment}"
    Purpose     = "Database"
    Compliance  = "PCI-DSS,GDPR,SOX"
  })

  depends_on = [
    aws_cloudwatch_log_group.rds_log_group
  ]
}

# CloudWatch Log Group for RDS logs
resource "aws_cloudwatch_log_group" "rds_log_group" {
  name              = "/aws/rds/cluster/paynext-cluster-${var.environment}/postgresql"
  retention_in_days = var.log_retention_days
  kms_key_id        = var.kms_key_id

  tags = merge(var.tags, {
    Name = "PayNext-RDS-Logs-${var.environment}"
  })
}

# RDS Aurora Cluster Instances
resource "aws_rds_cluster_instance" "paynext_cluster_instances" {
  count              = var.db_instance_count
  identifier         = "paynext-cluster-instance-${count.index + 1}-${var.environment}"
  cluster_identifier = aws_rds_cluster.paynext_cluster.id
  instance_class     = var.db_instance_class
  engine             = aws_rds_cluster.paynext_cluster.engine
  engine_version     = aws_rds_cluster.paynext_cluster.engine_version

  # Performance and Monitoring
  performance_insights_enabled          = true
  performance_insights_kms_key_id      = var.kms_key_id
  performance_insights_retention_period = 7
  monitoring_interval                   = 60
  monitoring_role_arn                   = aws_iam_role.rds_enhanced_monitoring.arn
  
  # Parameter Group
  db_parameter_group_name = aws_db_parameter_group.paynext_db_pg.name
  
  # Auto Minor Version Upgrade
  auto_minor_version_upgrade = true
  
  # Public Access
  publicly_accessible = false

  tags = merge(var.tags, {
    Name = "PayNext-DB-Instance-${count.index + 1}-${var.environment}"
  })
}

# Security Group for RDS Cluster
resource "aws_security_group" "rds_cluster" {
  name_prefix = "paynext-rds-cluster-${var.environment}-"
  vpc_id      = var.vpc_id
  description = "Security group for PayNext RDS cluster"

  ingress {
    description     = "PostgreSQL from application tier"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [var.security_group_ids["app_tier"]]
  }

  ingress {
    description     = "PostgreSQL from EKS nodes"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [var.security_group_ids["eks_nodes"]]
  }

  egress {
    description = "All outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.tags, {
    Name = "PayNext-RDS-Cluster-SG-${var.environment}"
  })

  lifecycle {
    create_before_destroy = true
  }
}

# IAM Role for RDS Enhanced Monitoring
resource "aws_iam_role" "rds_enhanced_monitoring" {
  name = "paynext-rds-enhanced-monitoring-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "monitoring.rds.amazonaws.com"
        }
      }
    ]
  })

  tags = var.tags
}

resource "aws_iam_role_policy_attachment" "rds_enhanced_monitoring" {
  role       = aws_iam_role.rds_enhanced_monitoring.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}

# RDS Proxy for connection pooling and security
resource "aws_db_proxy" "paynext_proxy" {
  name                   = "paynext-proxy-${var.environment}"
  engine_family         = "POSTGRESQL"
  auth {
    auth_scheme = "SECRETS"
    secret_arn  = aws_secretsmanager_secret.db_master_password.arn
  }
  
  role_arn               = aws_iam_role.rds_proxy.arn
  vpc_subnet_ids         = var.database_subnet_ids
  vpc_security_group_ids = [aws_security_group.rds_proxy.id]
  
  target {
    db_cluster_identifier = aws_rds_cluster.paynext_cluster.cluster_identifier
  }

  require_tls = true
  idle_client_timeout = 1800
  max_connections_percent = 100
  max_idle_connections_percent = 50

  tags = merge(var.tags, {
    Name = "PayNext-RDS-Proxy-${var.environment}"
  })
}

# Security Group for RDS Proxy
resource "aws_security_group" "rds_proxy" {
  name_prefix = "paynext-rds-proxy-${var.environment}-"
  vpc_id      = var.vpc_id
  description = "Security group for PayNext RDS proxy"

  ingress {
    description     = "PostgreSQL from application tier"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [var.security_group_ids["app_tier"]]
  }

  ingress {
    description     = "PostgreSQL from EKS nodes"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [var.security_group_ids["eks_nodes"]]
  }

  egress {
    description     = "PostgreSQL to RDS cluster"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.rds_cluster.id]
  }

  tags = merge(var.tags, {
    Name = "PayNext-RDS-Proxy-SG-${var.environment}"
  })

  lifecycle {
    create_before_destroy = true
  }
}

# IAM Role for RDS Proxy
resource "aws_iam_role" "rds_proxy" {
  name = "paynext-rds-proxy-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "rds.amazonaws.com"
        }
      }
    ]
  })

  tags = var.tags
}

resource "aws_iam_role_policy" "rds_proxy" {
  name = "paynext-rds-proxy-policy-${var.environment}"
  role = aws_iam_role.rds_proxy.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = aws_secretsmanager_secret.db_master_password.arn
      },
      {
        Effect = "Allow"
        Action = [
          "kms:Decrypt"
        ]
        Resource = var.kms_key_id
        Condition = {
          StringEquals = {
            "kms:ViaService" = "secretsmanager.${data.aws_region.current.name}.amazonaws.com"
          }
        }
      }
    ]
  })
}

# Cross-region backup (if enabled)
resource "aws_rds_cluster" "paynext_cluster_backup" {
  count = var.enable_cross_region_backup ? 1 : 0
  
  cluster_identifier              = "paynext-cluster-backup-${var.environment}"
  engine                         = var.db_engine
  engine_version                 = var.db_engine_version
  
  # Restore from snapshot
  snapshot_identifier            = aws_rds_cluster.paynext_cluster.final_snapshot_identifier
  
  # Network (in DR region)
  db_subnet_group_name           = "default"  # Assuming default subnet group exists in DR region
  vpc_security_group_ids         = ["sg-default"]  # Would need to be created in DR region
  
  # Backup settings
  backup_retention_period        = var.backup_retention_days
  copy_tags_to_snapshot         = true
  deletion_protection           = false
  skip_final_snapshot           = true
  
  # Encryption
  storage_encrypted              = var.enable_encryption_at_rest
  kms_key_id                    = var.kms_key_id  # Would need DR region KMS key
  
  tags = merge(var.tags, {
    Name        = "PayNext-DB-Cluster-Backup-${var.environment}"
    Purpose     = "DisasterRecovery"
  })

  provider = aws.dr_region
}

# CloudWatch Alarms for database monitoring
resource "aws_cloudwatch_metric_alarm" "database_cpu" {
  alarm_name          = "paynext-database-cpu-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors database CPU utilization"
  alarm_actions       = [aws_sns_topic.database_alerts.arn]

  dimensions = {
    DBClusterIdentifier = aws_rds_cluster.paynext_cluster.cluster_identifier
  }

  tags = var.tags
}

resource "aws_cloudwatch_metric_alarm" "database_connections" {
  alarm_name          = "paynext-database-connections-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "DatabaseConnections"
  namespace           = "AWS/RDS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors database connections"
  alarm_actions       = [aws_sns_topic.database_alerts.arn]

  dimensions = {
    DBClusterIdentifier = aws_rds_cluster.paynext_cluster.cluster_identifier
  }

  tags = var.tags
}

resource "aws_cloudwatch_metric_alarm" "database_freeable_memory" {
  alarm_name          = "paynext-database-freeable-memory-${var.environment}"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "FreeableMemory"
  namespace           = "AWS/RDS"
  period              = "300"
  statistic           = "Average"
  threshold           = "268435456"  # 256 MB in bytes
  alarm_description   = "This metric monitors database freeable memory"
  alarm_actions       = [aws_sns_topic.database_alerts.arn]

  dimensions = {
    DBClusterIdentifier = aws_rds_cluster.paynext_cluster.cluster_identifier
  }

  tags = var.tags
}

# SNS Topic for database alerts
resource "aws_sns_topic" "database_alerts" {
  name              = "paynext-database-alerts-${var.environment}"
  kms_master_key_id = var.kms_key_id

  tags = merge(var.tags, {
    Name = "PayNext-Database-Alerts-${var.environment}"
  })
}

# Database backup automation using AWS Backup
resource "aws_backup_vault" "paynext_backup_vault" {
  name        = "paynext-backup-vault-${var.environment}"
  kms_key_arn = var.kms_key_id

  tags = merge(var.tags, {
    Name = "PayNext-Backup-Vault-${var.environment}"
  })
}

resource "aws_backup_plan" "paynext_backup_plan" {
  name = "paynext-backup-plan-${var.environment}"

  rule {
    rule_name         = "daily_backup"
    target_vault_name = aws_backup_vault.paynext_backup_vault.name
    schedule          = "cron(0 5 ? * * *)"  # Daily at 5 AM UTC

    recovery_point_tags = var.tags

    lifecycle {
      cold_storage_after = 30
      delete_after       = var.backup_retention_days
    }

    copy_action {
      destination_vault_arn = aws_backup_vault.paynext_backup_vault.arn
      
      lifecycle {
        cold_storage_after = 30
        delete_after       = var.backup_retention_days
      }
    }
  }

  tags = var.tags
}

resource "aws_backup_selection" "paynext_backup_selection" {
  iam_role_arn = aws_iam_role.backup_role.arn
  name         = "paynext-backup-selection-${var.environment}"
  plan_id      = aws_backup_plan.paynext_backup_plan.id

  resources = [
    aws_rds_cluster.paynext_cluster.arn
  ]

  condition {
    string_equals {
      key   = "aws:ResourceTag/Environment"
      value = var.environment
    }
  }
}

# IAM Role for AWS Backup
resource "aws_iam_role" "backup_role" {
  name = "paynext-backup-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "backup.amazonaws.com"
        }
      }
    ]
  })

  tags = var.tags
}

resource "aws_iam_role_policy_attachment" "backup_policy" {
  role       = aws_iam_role.backup_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSBackupServiceRolePolicyForBackup"
}

resource "aws_iam_role_policy_attachment" "restore_policy" {
  role       = aws_iam_role.backup_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSBackupServiceRolePolicyForRestores"
}


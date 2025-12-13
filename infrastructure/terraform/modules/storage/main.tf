# Storage Module for PayNext
# This module provides secure and compliant storage infrastructure

# Data sources
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# Primary S3 bucket for application data
resource "aws_s3_bucket" "paynext_primary" {
  bucket        = "paynext-primary-${var.environment}-${random_string.bucket_suffix.result}"
  force_destroy = var.environment != "prod"

  tags = merge(var.tags, {
    Name       = "PayNext-Primary-Storage-${var.environment}"
    Purpose    = "ApplicationData"
    Compliance = "PCI-DSS,GDPR,SOX"
  })
}

# S3 bucket for document storage
resource "aws_s3_bucket" "paynext_documents" {
  bucket        = "paynext-documents-${var.environment}-${random_string.bucket_suffix.result}"
  force_destroy = var.environment != "prod"

  tags = merge(var.tags, {
    Name       = "PayNext-Documents-${var.environment}"
    Purpose    = "DocumentStorage"
    Compliance = "PCI-DSS,GDPR,SOX"
  })
}

# S3 bucket for backup storage
resource "aws_s3_bucket" "paynext_backup" {
  bucket        = "paynext-backup-${var.environment}-${random_string.bucket_suffix.result}"
  force_destroy = false

  tags = merge(var.tags, {
    Name       = "PayNext-Backup-Storage-${var.environment}"
    Purpose    = "BackupStorage"
    Compliance = "PCI-DSS,GDPR,SOX"
  })
}

# S3 bucket for audit logs
resource "aws_s3_bucket" "paynext_audit_logs" {
  bucket        = "paynext-audit-logs-${var.environment}-${random_string.bucket_suffix.result}"
  force_destroy = false

  tags = merge(var.tags, {
    Name       = "PayNext-Audit-Logs-${var.environment}"
    Purpose    = "AuditLogging"
    Compliance = "PCI-DSS,GDPR,SOX"
  })
}

# Encryption configuration for primary bucket
resource "aws_s3_bucket_server_side_encryption_configuration" "paynext_primary_encryption" {
  bucket = aws_s3_bucket.paynext_primary.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = var.kms_key_id
      sse_algorithm     = "aws:kms"
    }
    bucket_key_enabled = true
  }
}

# Encryption configuration for documents bucket
resource "aws_s3_bucket_server_side_encryption_configuration" "paynext_documents_encryption" {
  bucket = aws_s3_bucket.paynext_documents.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = var.kms_key_id
      sse_algorithm     = "aws:kms"
    }
    bucket_key_enabled = true
  }
}

# Encryption configuration for backup bucket
resource "aws_s3_bucket_server_side_encryption_configuration" "paynext_backup_encryption" {
  bucket = aws_s3_bucket.paynext_backup.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = var.kms_key_id
      sse_algorithm     = "aws:kms"
    }
    bucket_key_enabled = true
  }
}

# Encryption configuration for audit logs bucket
resource "aws_s3_bucket_server_side_encryption_configuration" "paynext_audit_logs_encryption" {
  bucket = aws_s3_bucket.paynext_audit_logs.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = var.kms_key_id
      sse_algorithm     = "aws:kms"
    }
    bucket_key_enabled = true
  }
}

# Versioning for all buckets
resource "aws_s3_bucket_versioning" "paynext_primary_versioning" {
  bucket = aws_s3_bucket.paynext_primary.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_versioning" "paynext_documents_versioning" {
  bucket = aws_s3_bucket.paynext_documents.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_versioning" "paynext_backup_versioning" {
  bucket = aws_s3_bucket.paynext_backup.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_versioning" "paynext_audit_logs_versioning" {
  bucket = aws_s3_bucket.paynext_audit_logs.id
  versioning_configuration {
    status = "Enabled"
  }
}

# Public access block for all buckets
resource "aws_s3_bucket_public_access_block" "paynext_primary_pab" {
  bucket = aws_s3_bucket.paynext_primary.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_public_access_block" "paynext_documents_pab" {
  bucket = aws_s3_bucket.paynext_documents.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_public_access_block" "paynext_backup_pab" {
  bucket = aws_s3_bucket.paynext_backup.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_public_access_block" "paynext_audit_logs_pab" {
  bucket = aws_s3_bucket.paynext_audit_logs.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Lifecycle configuration for primary bucket
resource "aws_s3_bucket_lifecycle_configuration" "paynext_primary_lifecycle" {
  bucket = aws_s3_bucket.paynext_primary.id

  rule {
    id     = "primary_lifecycle"
    status = "Enabled"

    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 90
      storage_class = "GLACIER"
    }

    transition {
      days          = 365
      storage_class = "DEEP_ARCHIVE"
    }

    noncurrent_version_transition {
      noncurrent_days = 30
      storage_class   = "STANDARD_IA"
    }

    noncurrent_version_transition {
      noncurrent_days = 90
      storage_class   = "GLACIER"
    }

    noncurrent_version_expiration {
      noncurrent_days = var.data_retention_days
    }

    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
  }
}

# Lifecycle configuration for documents bucket
resource "aws_s3_bucket_lifecycle_configuration" "paynext_documents_lifecycle" {
  bucket = aws_s3_bucket.paynext_documents.id

  rule {
    id     = "documents_lifecycle"
    status = "Enabled"

    transition {
      days          = 90
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 365
      storage_class = "GLACIER"
    }

    transition {
      days          = 2555 # 7 years
      storage_class = "DEEP_ARCHIVE"
    }

    noncurrent_version_transition {
      noncurrent_days = 90
      storage_class   = "GLACIER"
    }

    noncurrent_version_expiration {
      noncurrent_days = var.data_retention_days
    }

    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
  }
}

# Lifecycle configuration for backup bucket
resource "aws_s3_bucket_lifecycle_configuration" "paynext_backup_lifecycle" {
  bucket = aws_s3_bucket.paynext_backup.id

  rule {
    id     = "backup_lifecycle"
    status = "Enabled"

    transition {
      days          = 30
      storage_class = "GLACIER"
    }

    transition {
      days          = 90
      storage_class = "DEEP_ARCHIVE"
    }

    expiration {
      days = var.backup_retention_days
    }

    noncurrent_version_expiration {
      noncurrent_days = 30
    }

    abort_incomplete_multipart_upload {
      days_after_initiation = 1
    }
  }
}

# Lifecycle configuration for audit logs bucket
resource "aws_s3_bucket_lifecycle_configuration" "paynext_audit_logs_lifecycle" {
  bucket = aws_s3_bucket.paynext_audit_logs.id

  rule {
    id     = "audit_logs_lifecycle"
    status = "Enabled"

    transition {
      days          = 90
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 365
      storage_class = "GLACIER"
    }

    transition {
      days          = 2555 # 7 years for compliance
      storage_class = "DEEP_ARCHIVE"
    }

    # Never delete audit logs automatically
    noncurrent_version_transition {
      noncurrent_days = 90
      storage_class   = "GLACIER"
    }

    abort_incomplete_multipart_upload {
      days_after_initiation = 1
    }
  }
}

# S3 bucket policies
resource "aws_s3_bucket_policy" "paynext_primary_policy" {
  bucket = aws_s3_bucket.paynext_primary.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "DenyInsecureConnections"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:*"
        Resource = [
          aws_s3_bucket.paynext_primary.arn,
          "${aws_s3_bucket.paynext_primary.arn}/*"
        ]
        Condition = {
          Bool = {
            "aws:SecureTransport" = "false"
          }
        }
      },
      {
        Sid       = "DenyUnencryptedObjectUploads"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:PutObject"
        Resource  = "${aws_s3_bucket.paynext_primary.arn}/*"
        Condition = {
          StringNotEquals = {
            "s3:x-amz-server-side-encryption" = "aws:kms"
          }
        }
      }
    ]
  })
}

# Cross-region replication for backup bucket
resource "aws_s3_bucket" "paynext_backup_replica" {
  count = var.enable_cross_region_replication ? 1 : 0

  provider      = aws.dr_region
  bucket        = "paynext-backup-replica-${var.environment}-${random_string.bucket_suffix.result}"
  force_destroy = false

  tags = merge(var.tags, {
    Name       = "PayNext-Backup-Replica-${var.environment}"
    Purpose    = "DisasterRecovery"
    Compliance = "PCI-DSS,GDPR,SOX"
  })
}

resource "aws_s3_bucket_versioning" "paynext_backup_replica_versioning" {
  count = var.enable_cross_region_replication ? 1 : 0

  provider = aws.dr_region
  bucket   = aws_s3_bucket.paynext_backup_replica[0].id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "paynext_backup_replica_encryption" {
  count = var.enable_cross_region_replication ? 1 : 0

  provider = aws.dr_region
  bucket   = aws_s3_bucket.paynext_backup_replica[0].id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = var.dr_kms_key_id
      sse_algorithm     = "aws:kms"
    }
    bucket_key_enabled = true
  }
}

# IAM role for S3 replication
resource "aws_iam_role" "s3_replication_role" {
  count = var.enable_cross_region_replication ? 1 : 0

  name = "paynext-s3-replication-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "s3.amazonaws.com"
        }
      }
    ]
  })

  tags = var.tags
}

resource "aws_iam_role_policy" "s3_replication_policy" {
  count = var.enable_cross_region_replication ? 1 : 0

  name = "paynext-s3-replication-policy-${var.environment}"
  role = aws_iam_role.s3_replication_role[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObjectVersionForReplication",
          "s3:GetObjectVersionAcl",
          "s3:GetObjectVersionTagging"
        ]
        Resource = "${aws_s3_bucket.paynext_backup.arn}/*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:ListBucket"
        ]
        Resource = aws_s3_bucket.paynext_backup.arn
      },
      {
        Effect = "Allow"
        Action = [
          "s3:ReplicateObject",
          "s3:ReplicateDelete",
          "s3:ReplicateTags"
        ]
        Resource = "${aws_s3_bucket.paynext_backup_replica[0].arn}/*"
      },
      {
        Effect = "Allow"
        Action = [
          "kms:Decrypt"
        ]
        Resource = var.kms_key_id
      },
      {
        Effect = "Allow"
        Action = [
          "kms:GenerateDataKey"
        ]
        Resource = var.dr_kms_key_id
      }
    ]
  })
}

# S3 replication configuration
resource "aws_s3_bucket_replication_configuration" "paynext_backup_replication" {
  count = var.enable_cross_region_replication ? 1 : 0

  role   = aws_iam_role.s3_replication_role[0].arn
  bucket = aws_s3_bucket.paynext_backup.id

  rule {
    id     = "backup_replication"
    status = "Enabled"

    destination {
      bucket        = aws_s3_bucket.paynext_backup_replica[0].arn
      storage_class = "STANDARD_IA"

      encryption_configuration {
        replica_kms_key_id = var.dr_kms_key_id
      }
    }
  }

  depends_on = [aws_s3_bucket_versioning.paynext_backup_versioning]
}

# CloudWatch metrics for S3 buckets
resource "aws_s3_bucket_metric" "paynext_primary_metrics" {
  bucket = aws_s3_bucket.paynext_primary.id
  name   = "primary-bucket-metrics"
}

resource "aws_s3_bucket_metric" "paynext_documents_metrics" {
  bucket = aws_s3_bucket.paynext_documents.id
  name   = "documents-bucket-metrics"
}

# S3 bucket notifications for security monitoring
resource "aws_s3_bucket_notification" "paynext_primary_notification" {
  bucket = aws_s3_bucket.paynext_primary.id

  topic {
    topic_arn = aws_sns_topic.s3_notifications.arn
    events    = ["s3:ObjectCreated:*", "s3:ObjectRemoved:*"]
  }

  depends_on = [aws_sns_topic_policy.s3_notifications_policy]
}

# SNS topic for S3 notifications
resource "aws_sns_topic" "s3_notifications" {
  name              = "paynext-s3-notifications-${var.environment}"
  kms_master_key_id = var.kms_key_id

  tags = merge(var.tags, {
    Name = "PayNext-S3-Notifications-${var.environment}"
  })
}

resource "aws_sns_topic_policy" "s3_notifications_policy" {
  arn = aws_sns_topic.s3_notifications.arn

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "s3.amazonaws.com"
        }
        Action   = "SNS:Publish"
        Resource = aws_sns_topic.s3_notifications.arn
        Condition = {
          StringEquals = {
            "aws:SourceAccount" = data.aws_caller_identity.current.account_id
          }
        }
      }
    ]
  })
}

# CloudWatch alarms for S3 monitoring
resource "aws_cloudwatch_metric_alarm" "s3_bucket_size" {
  alarm_name          = "paynext-s3-bucket-size-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "BucketSizeBytes"
  namespace           = "AWS/S3"
  period              = "86400" # 24 hours
  statistic           = "Average"
  threshold           = var.bucket_size_alarm_threshold
  alarm_description   = "This metric monitors S3 bucket size"
  alarm_actions       = [aws_sns_topic.s3_notifications.arn]

  dimensions = {
    BucketName  = aws_s3_bucket.paynext_primary.bucket
    StorageType = "StandardStorage"
  }

  tags = var.tags
}

# EFS file system for shared storage
resource "aws_efs_file_system" "paynext_efs" {
  count = var.enable_efs ? 1 : 0

  creation_token                  = "paynext-efs-${var.environment}"
  performance_mode                = "generalPurpose"
  throughput_mode                 = "provisioned"
  provisioned_throughput_in_mibps = 100
  encrypted                       = true
  kms_key_id                      = var.kms_key_id

  tags = merge(var.tags, {
    Name = "PayNext-EFS-${var.environment}"
  })
}

# EFS mount targets
resource "aws_efs_mount_target" "paynext_efs_mount" {
  count = var.enable_efs ? length(var.private_subnet_ids) : 0

  file_system_id  = aws_efs_file_system.paynext_efs[0].id
  subnet_id       = var.private_subnet_ids[count.index]
  security_groups = [aws_security_group.efs[0].id]
}

# Security group for EFS
resource "aws_security_group" "efs" {
  count = var.enable_efs ? 1 : 0

  name_prefix = "paynext-efs-${var.environment}-"
  vpc_id      = var.vpc_id
  description = "Security group for PayNext EFS"

  ingress {
    description     = "NFS from EKS nodes"
    from_port       = 2049
    to_port         = 2049
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
    Name = "PayNext-EFS-SG-${var.environment}"
  })

  lifecycle {
    create_before_destroy = true
  }
}

# Random string for unique bucket naming
resource "random_string" "bucket_suffix" {
  length  = 8
  special = false
  upper   = false
}

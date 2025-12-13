# Monitoring Module for PayNext
# This module provides comprehensive monitoring, logging, and security detection capabilities

# Data sources
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}
data "aws_partition" "current" {}

# CloudWatch Log Groups for centralized logging
resource "aws_cloudwatch_log_group" "application_logs" {
  name              = "/aws/paynext/${var.environment}/application"
  retention_in_days = var.log_retention_days
  kms_key_id        = var.kms_key_id

  tags = merge(var.tags, {
    Name       = "PayNext-Application-Logs-${var.environment}"
    LogType    = "Application"
    Compliance = "PCI-DSS,GDPR,SOX"
  })
}

resource "aws_cloudwatch_log_group" "security_logs" {
  name              = "/aws/paynext/${var.environment}/security"
  retention_in_days = var.data_retention_days
  kms_key_id        = var.kms_key_id

  tags = merge(var.tags, {
    Name       = "PayNext-Security-Logs-${var.environment}"
    LogType    = "Security"
    Compliance = "PCI-DSS,GDPR,SOX"
  })
}

resource "aws_cloudwatch_log_group" "audit_logs" {
  name              = "/aws/paynext/${var.environment}/audit"
  retention_in_days = var.data_retention_days
  kms_key_id        = var.kms_key_id

  tags = merge(var.tags, {
    Name       = "PayNext-Audit-Logs-${var.environment}"
    LogType    = "Audit"
    Compliance = "PCI-DSS,GDPR,SOX"
  })
}

resource "aws_cloudwatch_log_group" "performance_logs" {
  name              = "/aws/paynext/${var.environment}/performance"
  retention_in_days = var.log_retention_days
  kms_key_id        = var.kms_key_id

  tags = merge(var.tags, {
    Name    = "PayNext-Performance-Logs-${var.environment}"
    LogType = "Performance"
  })
}

# CloudTrail for comprehensive API logging
resource "aws_s3_bucket" "cloudtrail_bucket" {
  count = var.enable_cloudtrail ? 1 : 0

  bucket        = "paynext-cloudtrail-${var.environment}-${random_string.bucket_suffix.result}"
  force_destroy = false

  tags = merge(var.tags, {
    Name       = "PayNext-CloudTrail-Bucket-${var.environment}"
    Purpose    = "AuditLogging"
    Compliance = "PCI-DSS,GDPR,SOX"
  })
}

resource "aws_s3_bucket_server_side_encryption_configuration" "cloudtrail_bucket_encryption" {
  count = var.enable_cloudtrail ? 1 : 0

  bucket = aws_s3_bucket.cloudtrail_bucket[0].id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = var.kms_key_id
      sse_algorithm     = "aws:kms"
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "cloudtrail_bucket_pab" {
  count = var.enable_cloudtrail ? 1 : 0

  bucket = aws_s3_bucket.cloudtrail_bucket[0].id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "cloudtrail_bucket_versioning" {
  count = var.enable_cloudtrail ? 1 : 0

  bucket = aws_s3_bucket.cloudtrail_bucket[0].id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "cloudtrail_bucket_lifecycle" {
  count = var.enable_cloudtrail ? 1 : 0

  bucket = aws_s3_bucket.cloudtrail_bucket[0].id

  rule {
    id     = "cloudtrail_lifecycle"
    status = "Enabled"

    expiration {
      days = var.data_retention_days
    }

    noncurrent_version_expiration {
      noncurrent_days = 90
    }

    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
  }
}

resource "aws_s3_bucket_policy" "cloudtrail_bucket_policy" {
  count = var.enable_cloudtrail ? 1 : 0

  bucket = aws_s3_bucket.cloudtrail_bucket[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AWSCloudTrailAclCheck"
        Effect = "Allow"
        Principal = {
          Service = "cloudtrail.amazonaws.com"
        }
        Action   = "s3:GetBucketAcl"
        Resource = aws_s3_bucket.cloudtrail_bucket[0].arn
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = "arn:${data.aws_partition.current.partition}:cloudtrail:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:trail/paynext-cloudtrail-${var.environment}"
          }
        }
      },
      {
        Sid    = "AWSCloudTrailWrite"
        Effect = "Allow"
        Principal = {
          Service = "cloudtrail.amazonaws.com"
        }
        Action   = "s3:PutObject"
        Resource = "${aws_s3_bucket.cloudtrail_bucket[0].arn}/*"
        Condition = {
          StringEquals = {
            "s3:x-amz-acl"  = "bucket-owner-full-control"
            "AWS:SourceArn" = "arn:${data.aws_partition.current.partition}:cloudtrail:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:trail/paynext-cloudtrail-${var.environment}"
          }
        }
      }
    ]
  })
}

resource "aws_cloudtrail" "paynext_cloudtrail" {
  count = var.enable_cloudtrail ? 1 : 0

  name           = "paynext-cloudtrail-${var.environment}"
  s3_bucket_name = aws_s3_bucket.cloudtrail_bucket[0].bucket
  s3_key_prefix  = "cloudtrail-logs"

  event_selector {
    read_write_type                  = "All"
    include_management_events        = true
    exclude_management_event_sources = []

    data_resource {
      type   = "AWS::S3::Object"
      values = ["arn:aws:s3:::*/*"]
    }

    data_resource {
      type   = "AWS::Lambda::Function"
      values = ["arn:aws:lambda:*"]
    }
  }

  insight_selector {
    insight_type = "ApiCallRateInsight"
  }

  kms_key_id                    = var.kms_key_id
  include_global_service_events = true
  is_multi_region_trail         = true
  enable_logging                = true
  enable_log_file_validation    = true

  cloud_watch_logs_group_arn = "${aws_cloudwatch_log_group.cloudtrail_logs[0].arn}:*"
  cloud_watch_logs_role_arn  = aws_iam_role.cloudtrail_logs_role[0].arn

  tags = merge(var.tags, {
    Name       = "PayNext-CloudTrail-${var.environment}"
    Purpose    = "AuditLogging"
    Compliance = "PCI-DSS,GDPR,SOX"
  })

  depends_on = [aws_s3_bucket_policy.cloudtrail_bucket_policy]
}

# CloudWatch Log Group for CloudTrail
resource "aws_cloudwatch_log_group" "cloudtrail_logs" {
  count = var.enable_cloudtrail ? 1 : 0

  name              = "/aws/cloudtrail/paynext-${var.environment}"
  retention_in_days = var.data_retention_days
  kms_key_id        = var.kms_key_id

  tags = merge(var.tags, {
    Name = "PayNext-CloudTrail-Logs-${var.environment}"
  })
}

# IAM Role for CloudTrail CloudWatch Logs
resource "aws_iam_role" "cloudtrail_logs_role" {
  count = var.enable_cloudtrail ? 1 : 0

  name = "paynext-cloudtrail-logs-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "cloudtrail.amazonaws.com"
        }
      }
    ]
  })

  tags = var.tags
}

resource "aws_iam_role_policy" "cloudtrail_logs_policy" {
  count = var.enable_cloudtrail ? 1 : 0

  name = "paynext-cloudtrail-logs-policy-${var.environment}"
  role = aws_iam_role.cloudtrail_logs_role[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:PutLogEvents",
          "logs:CreateLogGroup",
          "logs:CreateLogStream"
        ]
        Resource = "${aws_cloudwatch_log_group.cloudtrail_logs[0].arn}:*"
      }
    ]
  })
}

# GuardDuty for threat detection
resource "aws_guardduty_detector" "paynext_guardduty" {
  count = var.enable_guardduty ? 1 : 0

  enable                       = true
  finding_publishing_frequency = "FIFTEEN_MINUTES"

  datasources {
    s3_logs {
      enable = true
    }
    kubernetes {
      audit_logs {
        enable = true
      }
    }
    malware_protection {
      scan_ec2_instance_with_findings {
        ebs_volumes {
          enable = true
        }
      }
    }
  }

  tags = merge(var.tags, {
    Name       = "PayNext-GuardDuty-${var.environment}"
    Purpose    = "ThreatDetection"
    Compliance = "PCI-DSS,SOX"
  })
}

# GuardDuty CloudWatch Event Rule for findings
resource "aws_cloudwatch_event_rule" "guardduty_findings" {
  count = var.enable_guardduty ? 1 : 0

  name        = "paynext-guardduty-findings-${var.environment}"
  description = "Capture GuardDuty findings"

  event_pattern = jsonencode({
    source      = ["aws.guardduty"]
    detail-type = ["GuardDuty Finding"]
  })

  tags = var.tags
}

resource "aws_cloudwatch_event_target" "guardduty_sns" {
  count = var.enable_guardduty ? 1 : 0

  rule      = aws_cloudwatch_event_rule.guardduty_findings[0].name
  target_id = "SendToSNS"
  arn       = aws_sns_topic.security_alerts.arn
}

# AWS Config for compliance monitoring
resource "aws_config_configuration_recorder" "paynext_config" {
  count = var.enable_config ? 1 : 0

  name     = "paynext-config-recorder-${var.environment}"
  role_arn = aws_iam_role.config_role[0].arn

  recording_group {
    all_supported                 = true
    include_global_resource_types = true
    recording_mode {
      recording_frequency = "CONTINUOUS"
      recording_mode_override {
        description         = "Override for specific resource types"
        recording_frequency = "DAILY"
        resource_types      = ["AWS::EC2::Volume", "AWS::EC2::VPC"]
      }
    }
  }

  depends_on = [aws_config_delivery_channel.paynext_config]
}

resource "aws_config_delivery_channel" "paynext_config" {
  count = var.enable_config ? 1 : 0

  name           = "paynext-config-delivery-channel-${var.environment}"
  s3_bucket_name = aws_s3_bucket.config_bucket[0].bucket
  s3_key_prefix  = "config"

  snapshot_delivery_properties {
    delivery_frequency = "TwentyFour_Hours"
  }
}

# S3 bucket for AWS Config
resource "aws_s3_bucket" "config_bucket" {
  count = var.enable_config ? 1 : 0

  bucket        = "paynext-config-${var.environment}-${random_string.bucket_suffix.result}"
  force_destroy = false

  tags = merge(var.tags, {
    Name       = "PayNext-Config-Bucket-${var.environment}"
    Purpose    = "ComplianceMonitoring"
    Compliance = "PCI-DSS,GDPR,SOX"
  })
}

resource "aws_s3_bucket_server_side_encryption_configuration" "config_bucket_encryption" {
  count = var.enable_config ? 1 : 0

  bucket = aws_s3_bucket.config_bucket[0].id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = var.kms_key_id
      sse_algorithm     = "aws:kms"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "config_bucket_pab" {
  count = var.enable_config ? 1 : 0

  bucket = aws_s3_bucket.config_bucket[0].id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "config_bucket_versioning" {
  count = var.enable_config ? 1 : 0

  bucket = aws_s3_bucket.config_bucket[0].id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_policy" "config_bucket_policy" {
  count = var.enable_config ? 1 : 0

  bucket = aws_s3_bucket.config_bucket[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AWSConfigBucketPermissionsCheck"
        Effect = "Allow"
        Principal = {
          Service = "config.amazonaws.com"
        }
        Action   = "s3:GetBucketAcl"
        Resource = aws_s3_bucket.config_bucket[0].arn
        Condition = {
          StringEquals = {
            "AWS:SourceAccount" = data.aws_caller_identity.current.account_id
          }
        }
      },
      {
        Sid    = "AWSConfigBucketExistenceCheck"
        Effect = "Allow"
        Principal = {
          Service = "config.amazonaws.com"
        }
        Action   = "s3:ListBucket"
        Resource = aws_s3_bucket.config_bucket[0].arn
        Condition = {
          StringEquals = {
            "AWS:SourceAccount" = data.aws_caller_identity.current.account_id
          }
        }
      },
      {
        Sid    = "AWSConfigBucketDelivery"
        Effect = "Allow"
        Principal = {
          Service = "config.amazonaws.com"
        }
        Action   = "s3:PutObject"
        Resource = "${aws_s3_bucket.config_bucket[0].arn}/*"
        Condition = {
          StringEquals = {
            "s3:x-amz-acl"      = "bucket-owner-full-control"
            "AWS:SourceAccount" = data.aws_caller_identity.current.account_id
          }
        }
      }
    ]
  })
}

# IAM Role for AWS Config
resource "aws_iam_role" "config_role" {
  count = var.enable_config ? 1 : 0

  name = "paynext-config-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "config.amazonaws.com"
        }
      }
    ]
  })

  tags = var.tags
}

resource "aws_iam_role_policy_attachment" "config_role_policy" {
  count = var.enable_config ? 1 : 0

  role       = aws_iam_role.config_role[0].name
  policy_arn = "arn:aws:iam::aws:policy/service-role/ConfigRole"
}

resource "aws_iam_role_policy" "config_s3_policy" {
  count = var.enable_config ? 1 : 0

  name = "paynext-config-s3-policy-${var.environment}"
  role = aws_iam_role.config_role[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetBucketAcl",
          "s3:GetBucketLocation",
          "s3:ListBucket"
        ]
        Resource = aws_s3_bucket.config_bucket[0].arn
      },
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject"
        ]
        Resource = "${aws_s3_bucket.config_bucket[0].arn}/*"
      }
    ]
  })
}

# Config Rules for compliance monitoring
resource "aws_config_config_rule" "s3_bucket_public_access_prohibited" {
  count = var.enable_config ? 1 : 0

  name = "s3-bucket-public-access-prohibited"

  source {
    owner             = "AWS"
    source_identifier = "S3_BUCKET_PUBLIC_ACCESS_PROHIBITED"
  }

  depends_on = [aws_config_configuration_recorder.paynext_config]
}

resource "aws_config_config_rule" "encrypted_volumes" {
  count = var.enable_config ? 1 : 0

  name = "encrypted-volumes"

  source {
    owner             = "AWS"
    source_identifier = "ENCRYPTED_VOLUMES"
  }

  depends_on = [aws_config_configuration_recorder.paynext_config]
}

resource "aws_config_config_rule" "rds_storage_encrypted" {
  count = var.enable_config ? 1 : 0

  name = "rds-storage-encrypted"

  source {
    owner             = "AWS"
    source_identifier = "RDS_STORAGE_ENCRYPTED"
  }

  depends_on = [aws_config_configuration_recorder.paynext_config]
}

resource "aws_config_config_rule" "cloudtrail_enabled" {
  count = var.enable_config ? 1 : 0

  name = "cloudtrail-enabled"

  source {
    owner             = "AWS"
    source_identifier = "CLOUD_TRAIL_ENABLED"
  }

  depends_on = [aws_config_configuration_recorder.paynext_config]
}

# SNS Topic for security alerts
resource "aws_sns_topic" "security_alerts" {
  name              = "paynext-security-alerts-${var.environment}"
  kms_master_key_id = var.kms_key_id

  tags = merge(var.tags, {
    Name    = "PayNext-Security-Alerts-${var.environment}"
    Purpose = "SecurityAlerting"
  })
}

resource "aws_sns_topic_subscription" "security_email" {
  topic_arn = aws_sns_topic.security_alerts.arn
  protocol  = "email"
  endpoint  = var.security_contact_email
}

resource "aws_sns_topic_subscription" "compliance_email" {
  topic_arn = aws_sns_topic.security_alerts.arn
  protocol  = "email"
  endpoint  = var.compliance_contact_email
}

# CloudWatch Alarms for critical metrics
resource "aws_cloudwatch_metric_alarm" "high_error_rate" {
  alarm_name          = "paynext-high-error-rate-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "4XXError"
  namespace           = "AWS/ApplicationELB"
  period              = "300"
  statistic           = "Sum"
  threshold           = "10"
  alarm_description   = "This metric monitors application error rate"
  alarm_actions       = [aws_sns_topic.security_alerts.arn]

  dimensions = {
    LoadBalancer = "app/paynext-alb-${var.environment}"
  }

  tags = var.tags
}

resource "aws_cloudwatch_metric_alarm" "high_cpu_utilization" {
  alarm_name          = "paynext-high-cpu-utilization-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors ec2 cpu utilization"
  alarm_actions       = [aws_sns_topic.security_alerts.arn]

  tags = var.tags
}

resource "aws_cloudwatch_metric_alarm" "failed_login_attempts" {
  alarm_name          = "paynext-failed-login-attempts-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "FailedLoginAttempts"
  namespace           = "PayNext/Security"
  period              = "300"
  statistic           = "Sum"
  threshold           = "5"
  alarm_description   = "This metric monitors failed login attempts"
  alarm_actions       = [aws_sns_topic.security_alerts.arn]
  treat_missing_data  = "notBreaching"

  tags = var.tags
}

# CloudWatch Dashboard for monitoring
resource "aws_cloudwatch_dashboard" "paynext_dashboard" {
  dashboard_name = "PayNext-${var.environment}-Dashboard"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/ApplicationELB", "RequestCount"],
            [".", "TargetResponseTime"],
            [".", "HTTPCode_Target_2XX_Count"],
            [".", "HTTPCode_Target_4XX_Count"],
            [".", "HTTPCode_Target_5XX_Count"]
          ]
          view    = "timeSeries"
          stacked = false
          region  = data.aws_region.current.name
          title   = "Application Load Balancer Metrics"
          period  = 300
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 6
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/EKS", "cluster_failed_request_count"],
            [".", "cluster_request_total"]
          ]
          view    = "timeSeries"
          stacked = false
          region  = data.aws_region.current.name
          title   = "EKS Cluster Metrics"
          period  = 300
        }
      },
      {
        type   = "log"
        x      = 0
        y      = 12
        width  = 24
        height = 6

        properties = {
          query  = "SOURCE '/aws/paynext/${var.environment}/security' | fields @timestamp, @message | sort @timestamp desc | limit 100"
          region = data.aws_region.current.name
          title  = "Recent Security Events"
        }
      }
    ]
  })
}

# Random string for unique bucket naming
resource "random_string" "bucket_suffix" {
  length  = 8
  special = false
  upper   = false
}

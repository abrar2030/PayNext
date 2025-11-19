# Security Module - Core security services for PayNext
# This module provides encryption, secrets management, and web application firewall

# KMS Key for encryption at rest
resource "aws_kms_key" "paynext_key" {
  description              = "PayNext encryption key for ${var.environment}"
  deletion_window_in_days  = var.kms_key_deletion_window
  enable_key_rotation     = true
  multi_region            = true

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "Enable IAM User Permissions"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        }
        Action   = "kms:*"
        Resource = "*"
      },
      {
        Sid    = "Allow CloudTrail to encrypt logs"
        Effect = "Allow"
        Principal = {
          Service = "cloudtrail.amazonaws.com"
        }
        Action = [
          "kms:GenerateDataKey*",
          "kms:DescribeKey"
        ]
        Resource = "*"
      },
      {
        Sid    = "Allow CloudWatch Logs"
        Effect = "Allow"
        Principal = {
          Service = "logs.amazonaws.com"
        }
        Action = [
          "kms:Encrypt",
          "kms:Decrypt",
          "kms:ReEncrypt*",
          "kms:GenerateDataKey*",
          "kms:DescribeKey"
        ]
        Resource = "*"
      },
      {
        Sid    = "Allow S3 Service"
        Effect = "Allow"
        Principal = {
          Service = "s3.amazonaws.com"
        }
        Action = [
          "kms:Decrypt",
          "kms:GenerateDataKey"
        ]
        Resource = "*"
      },
      {
        Sid    = "Allow RDS Service"
        Effect = "Allow"
        Principal = {
          Service = "rds.amazonaws.com"
        }
        Action = [
          "kms:Decrypt",
          "kms:GenerateDataKey"
        ]
        Resource = "*"
      },
      {
        Sid    = "Allow EKS Service"
        Effect = "Allow"
        Principal = {
          Service = "eks.amazonaws.com"
        }
        Action = [
          "kms:Decrypt",
          "kms:GenerateDataKey"
        ]
        Resource = "*"
      }
    ]
  })

  tags = merge(var.tags, {
    Name        = "PayNext-KMS-Key-${var.environment}"
    Purpose     = "Encryption"
    Compliance  = "PCI-DSS,GDPR,SOX"
  })
}

resource "aws_kms_alias" "paynext_key_alias" {
  name          = "alias/paynext-${var.environment}"
  target_key_id = aws_kms_key.paynext_key.key_id
}

# Secrets Manager for secure credential storage
resource "aws_secretsmanager_secret" "paynext_secrets" {
  count = var.enable_secrets_manager ? 1 : 0

  name                    = "paynext/${var.environment}/application-secrets"
  description            = "PayNext application secrets for ${var.environment}"
  kms_key_id             = aws_kms_key.paynext_key.arn
  recovery_window_in_days = 30

  replica {
    region = "us-east-1"
    kms_key_id = aws_kms_key.paynext_key.arn
  }

  tags = merge(var.tags, {
    Name        = "PayNext-Secrets-${var.environment}"
    Purpose     = "SecretsManagement"
    Compliance  = "PCI-DSS,GDPR,SOX"
  })
}

# Initial secret version with placeholder values
resource "aws_secretsmanager_secret_version" "paynext_secrets_version" {
  count = var.enable_secrets_manager ? 1 : 0

  secret_id = aws_secretsmanager_secret.paynext_secrets[0].id
  secret_string = jsonencode({
    database_password     = "CHANGE_ME_IN_PRODUCTION"
    jwt_secret           = "CHANGE_ME_IN_PRODUCTION"
    api_key              = "CHANGE_ME_IN_PRODUCTION"
    encryption_key       = "CHANGE_ME_IN_PRODUCTION"
    payment_gateway_key  = "CHANGE_ME_IN_PRODUCTION"
    notification_api_key = "CHANGE_ME_IN_PRODUCTION"
  })

  lifecycle {
    ignore_changes = [secret_string]
  }
}

# WAF Web ACL for application protection
resource "aws_wafv2_web_acl" "paynext_waf" {
  count = var.enable_waf ? 1 : 0

  name  = "paynext-waf-${var.environment}"
  scope = "REGIONAL"

  default_action {
    allow {}
  }

  # AWS Managed Rules - Core Rule Set
  rule {
    name     = "AWSManagedRulesCommonRuleSet"
    priority = 1

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "CommonRuleSetMetric"
      sampled_requests_enabled   = true
    }
  }

  # AWS Managed Rules - Known Bad Inputs
  rule {
    name     = "AWSManagedRulesKnownBadInputsRuleSet"
    priority = 2

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesKnownBadInputsRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "KnownBadInputsRuleSetMetric"
      sampled_requests_enabled   = true
    }
  }

  # AWS Managed Rules - SQL Injection
  rule {
    name     = "AWSManagedRulesSQLiRuleSet"
    priority = 3

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesSQLiRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "SQLiRuleSetMetric"
      sampled_requests_enabled   = true
    }
  }

  # Rate limiting rule
  rule {
    name     = "RateLimitRule"
    priority = 4

    action {
      block {}
    }

    statement {
      rate_based_statement {
        limit              = 2000
        aggregate_key_type = "IP"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "RateLimitRule"
      sampled_requests_enabled   = true
    }
  }

  # Geo-blocking rule (example: block traffic from high-risk countries)
  rule {
    name     = "GeoBlockRule"
    priority = 5

    action {
      block {}
    }

    statement {
      geo_match_statement {
        country_codes = ["CN", "RU", "KP", "IR"]  # Example high-risk countries
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "GeoBlockRule"
      sampled_requests_enabled   = true
    }
  }

  tags = merge(var.tags, {
    Name        = "PayNext-WAF-${var.environment}"
    Purpose     = "WebApplicationFirewall"
    Compliance  = "PCI-DSS,OWASP"
  })

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "PayNextWAF"
    sampled_requests_enabled   = true
  }
}

# WAF Logging Configuration
resource "aws_wafv2_web_acl_logging_configuration" "paynext_waf_logging" {
  count = var.enable_waf ? 1 : 0

  resource_arn            = aws_wafv2_web_acl.paynext_waf[0].arn
  log_destination_configs = [aws_cloudwatch_log_group.waf_log_group[0].arn]

  redacted_fields {
    single_header {
      name = "authorization"
    }
  }

  redacted_fields {
    single_header {
      name = "cookie"
    }
  }
}

# CloudWatch Log Group for WAF logs
resource "aws_cloudwatch_log_group" "waf_log_group" {
  count = var.enable_waf ? 1 : 0

  name              = "/aws/wafv2/paynext-${var.environment}"
  retention_in_days = 365
  kms_key_id        = aws_kms_key.paynext_key.arn

  tags = merge(var.tags, {
    Name    = "PayNext-WAF-Logs-${var.environment}"
    Purpose = "WAFLogging"
  })
}

# IAM Role for WAF logging
resource "aws_iam_role" "waf_logging_role" {
  count = var.enable_waf ? 1 : 0

  name = "paynext-waf-logging-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "wafv2.amazonaws.com"
        }
      }
    ]
  })

  tags = var.tags
}

resource "aws_iam_role_policy" "waf_logging_policy" {
  count = var.enable_waf ? 1 : 0

  name = "paynext-waf-logging-policy-${var.environment}"
  role = aws_iam_role.waf_logging_role[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = aws_cloudwatch_log_group.waf_log_group[0].arn
      }
    ]
  })
}

# Security Hub for centralized security findings
resource "aws_securityhub_account" "paynext_security_hub" {
  enable_default_standards = true
}

# Enable AWS Config for compliance monitoring
resource "aws_config_configuration_recorder" "paynext_config_recorder" {
  name     = "paynext-config-recorder-${var.environment}"
  role_arn = aws_iam_role.config_role.arn

  recording_group {
    all_supported                 = true
    include_global_resource_types = true
  }

  depends_on = [aws_config_delivery_channel.paynext_config_delivery_channel]
}

resource "aws_config_delivery_channel" "paynext_config_delivery_channel" {
  name           = "paynext-config-delivery-channel-${var.environment}"
  s3_bucket_name = aws_s3_bucket.config_bucket.bucket
}

# S3 bucket for AWS Config
resource "aws_s3_bucket" "config_bucket" {
  bucket        = "paynext-config-${var.environment}-${random_string.bucket_suffix.result}"
  force_destroy = true

  tags = merge(var.tags, {
    Name    = "PayNext-Config-Bucket-${var.environment}"
    Purpose = "ConfigDelivery"
  })
}

resource "aws_s3_bucket_server_side_encryption_configuration" "config_bucket_encryption" {
  bucket = aws_s3_bucket.config_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.paynext_key.arn
      sse_algorithm     = "aws:kms"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "config_bucket_pab" {
  bucket = aws_s3_bucket.config_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "config_bucket_versioning" {
  bucket = aws_s3_bucket.config_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

# IAM Role for AWS Config
resource "aws_iam_role" "config_role" {
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
  role       = aws_iam_role.config_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/ConfigRole"
}

resource "aws_iam_role_policy" "config_s3_policy" {
  name = "paynext-config-s3-policy-${var.environment}"
  role = aws_iam_role.config_role.id

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
        Resource = aws_s3_bucket.config_bucket.arn
      },
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject"
        ]
        Resource = "${aws_s3_bucket.config_bucket.arn}/*"
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

# Data sources
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

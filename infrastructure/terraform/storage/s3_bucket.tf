resource "aws_s3_bucket" "paynext_bucket" {
  bucket = var.s3_bucket_name
  acl    = "private"

  tags = {
    Name        = "PayNext S3 Bucket"
    Environment = var.environment
  }
}

# Enable versioning on the S3 bucket
resource "aws_s3_bucket_versioning" "paynext_bucket_versioning" {
  bucket = aws_s3_bucket.paynext_bucket.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Configure server-side encryption using AES-256
resource "aws_s3_bucket_server_side_encryption_configuration" "paynext_bucket_encryption" {
  bucket = aws_s3_bucket.paynext_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Define an optional bucket policy
resource "aws_s3_bucket_policy" "paynext_bucket_policy" {
  bucket = aws_s3_bucket.paynext_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = ["s3:GetObject"]
        Effect    = "Allow"
        Resource  = ["${aws_s3_bucket.paynext_bucket.arn}/*"]
        Principal = "*"
        Condition = {
          IpAddress = { "aws:SourceIp" : var.allowed_ip }
        }
      }
    ]
  })
  depends_on = [aws_s3_bucket.paynext_bucket]
}

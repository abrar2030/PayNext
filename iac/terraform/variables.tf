variable "s3_bucket_name" {
  description = "Name of the S3 bucket for PayNext storage"
  type        = string
  default     = "paynext-storage-bucket"
}

variable "environment" {
  description = "Deployment environment (e.g., dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "allowed_ip" {
  description = "IP address allowed to access the S3 bucket (optional)"
  type        = string
  default     = "0.0.0.0/0" # Update to restrict access to specific IP if needed
}

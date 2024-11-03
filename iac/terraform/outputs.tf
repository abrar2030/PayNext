# Output the VPC ID created in the VPC module
output "vpc_id" {
  description = "The ID of the VPC"
  value       = module.vpc.vpc_id
}

# Output the public subnet IDs
output "public_subnet_ids" {
  description = "The IDs of the public subnets in the VPC"
  value       = module.vpc.public_subnet_ids
}

# Output the EKS cluster name
output "eks_cluster_name" {
  description = "The name of the EKS cluster"
  value       = module.kubernetes.cluster_name
}

# Output the S3 bucket name
output "s3_bucket_name" {
  description = "The name of the S3 bucket for storage"
  value       = module.storage.s3_bucket_name
}

# Output security group IDs for reference
output "eks_security_group_id" {
  description = "Security Group ID for EKS cluster"
  value       = module.vpc.eks_security_group_id
}

output "app_security_group_id" {
  description = "Security Group ID for application services"
  value       = module.vpc.app_security_group_id
}

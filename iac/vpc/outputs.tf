output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.paynext_vpc.id
}

output "public_subnet_ids" {
  description = "List of public subnet IDs"
  value       = [aws_subnet.public_subnet_a.id, aws_subnet.public_subnet_b.id]
}

output "eks_security_group_id" {
  description = "Security Group ID for EKS cluster"
  value       = aws_security_group.eks_security_group.id
}

output "alb_security_group_id" {
  description = "Security Group ID for ALB"
  value       = aws_security_group.alb_security_group.id
}

output "app_security_group_id" {
  description = "Security Group ID for application services"
  value       = aws_security_group.app_security_group.id
}

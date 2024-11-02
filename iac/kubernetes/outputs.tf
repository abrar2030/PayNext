# Output the name of the EKS cluster
output "cluster_name" {
  description = "Name of the EKS cluster"
  value       = module.eks.cluster_id
}

# Output the cluster endpoint URL
output "cluster_endpoint" {
  description = "Endpoint for the EKS Kubernetes API"
  value       = module.eks.cluster_endpoint
}

# Output the security group ID for the EKS cluster
output "cluster_security_group_id" {
  description = "Security Group ID associated with the EKS cluster"
  value       = module.eks.cluster_security_group_id
}

# Output the IAM Role ARN for the EKS cluster
output "eks_cluster_role_arn" {
  description = "IAM Role ARN for the EKS cluster"
  value       = module.eks.cluster_iam_role_arn
}

# Output the node group name
output "node_group_name" {
  description = "Node group name within the EKS cluster"
  value       = module.eks.node_groups["paynext_nodes"]
}

# Output the subnet IDs
output "subnet_ids" {
  description = "List of subnet IDs created in the VPC"
  value       = module.vpc.public_subnets
}

# Output the Prometheus service URL (if deployed as LoadBalancer)
output "prometheus_url" {
  description = "URL for accessing the Prometheus service (LoadBalancer IP)"
  value       = helm_release.prometheus.status.load_balancer[0].ingress[0].hostname
}

# Output the Grafana service URL (if deployed as LoadBalancer)
output "grafana_url" {
  description = "URL for accessing the Grafana service (LoadBalancer IP)"
  value       = helm_release.grafana.status.load_balancer[0].ingress[0].hostname
}

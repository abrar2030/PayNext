# Kubernetes/EKS Module Outputs

# Cluster Outputs
output "cluster_id" {
  description = "ID of the EKS cluster"
  value       = aws_eks_cluster.paynext_cluster.id
}

output "cluster_arn" {
  description = "ARN of the EKS cluster"
  value       = aws_eks_cluster.paynext_cluster.arn
}

output "cluster_name" {
  description = "Name of the EKS cluster"
  value       = aws_eks_cluster.paynext_cluster.name
}

output "cluster_endpoint" {
  description = "Endpoint for EKS control plane"
  value       = aws_eks_cluster.paynext_cluster.endpoint
}

output "cluster_version" {
  description = "Kubernetes version of the EKS cluster"
  value       = aws_eks_cluster.paynext_cluster.version
}

output "cluster_platform_version" {
  description = "Platform version for the EKS cluster"
  value       = aws_eks_cluster.paynext_cluster.platform_version
}

output "cluster_status" {
  description = "Status of the EKS cluster"
  value       = aws_eks_cluster.paynext_cluster.status
}

output "cluster_security_group_id" {
  description = "Security group ID attached to the EKS cluster"
  value       = aws_eks_cluster.paynext_cluster.vpc_config[0].cluster_security_group_id
}

output "cluster_certificate_authority_data" {
  description = "Base64 encoded certificate data required to communicate with the cluster"
  value       = aws_eks_cluster.paynext_cluster.certificate_authority[0].data
}

output "cluster_ca_certificate" {
  description = "Certificate authority data for the cluster"
  value       = aws_eks_cluster.paynext_cluster.certificate_authority[0].data
}

# IAM Outputs
output "cluster_iam_role_name" {
  description = "IAM role name associated with EKS cluster"
  value       = aws_iam_role.eks_cluster_role.name
}

output "cluster_iam_role_arn" {
  description = "IAM role ARN associated with EKS cluster"
  value       = aws_iam_role.eks_cluster_role.arn
}

output "node_group_iam_role_name" {
  description = "IAM role name associated with EKS node groups"
  value       = aws_iam_role.eks_node_group_role.name
}

output "node_group_iam_role_arn" {
  description = "IAM role ARN associated with EKS node groups"
  value       = aws_iam_role.eks_node_group_role.arn
}

# OIDC Provider Outputs
output "oidc_provider_arn" {
  description = "ARN of the OIDC Provider for the EKS cluster"
  value       = aws_iam_openid_connect_provider.eks.arn
}

output "oidc_provider_url" {
  description = "URL of the OIDC Provider for the EKS cluster"
  value       = aws_iam_openid_connect_provider.eks.url
}

output "cluster_oidc_issuer_url" {
  description = "The URL on the EKS cluster OIDC Issuer"
  value       = aws_eks_cluster.paynext_cluster.identity[0].oidc[0].issuer
}

# Node Group Outputs
output "node_groups" {
  description = "Map of EKS node groups"
  value = {
    for k, v in aws_eks_node_group.paynext_nodes : k => {
      arn           = v.arn
      status        = v.status
      capacity_type = v.capacity_type
      instance_types = v.instance_types
      ami_type      = v.ami_type
      node_role_arn = v.node_role_arn
      subnet_ids    = v.subnet_ids
      scaling_config = v.scaling_config
      update_config = v.update_config
      labels        = v.labels
      taints        = v.taints
    }
  }
}

output "node_security_group_id" {
  description = "ID of the EKS node shared security group"
  value       = aws_security_group.eks_nodes.id
}

output "node_security_group_arn" {
  description = "ARN of the EKS node shared security group"
  value       = aws_security_group.eks_nodes.arn
}

# Add-on Outputs
output "addons" {
  description = "Map of EKS add-ons"
  value = {
    vpc_cni = {
      arn           = aws_eks_addon.vpc_cni.arn
      status        = aws_eks_addon.vpc_cni.status
      addon_version = aws_eks_addon.vpc_cni.addon_version
    }
    coredns = {
      arn           = aws_eks_addon.coredns.arn
      status        = aws_eks_addon.coredns.status
      addon_version = aws_eks_addon.coredns.addon_version
    }
    kube_proxy = {
      arn           = aws_eks_addon.kube_proxy.arn
      status        = aws_eks_addon.kube_proxy.status
      addon_version = aws_eks_addon.kube_proxy.addon_version
    }
    ebs_csi_driver = {
      arn           = aws_eks_addon.ebs_csi_driver.arn
      status        = aws_eks_addon.ebs_csi_driver.status
      addon_version = aws_eks_addon.ebs_csi_driver.addon_version
    }
  }
}

# Load Balancer Outputs
output "alb_arn" {
  description = "ARN of the Application Load Balancer"
  value       = aws_lb.paynext_alb.arn
}

output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = aws_lb.paynext_alb.dns_name
}

output "alb_zone_id" {
  description = "Zone ID of the Application Load Balancer"
  value       = aws_lb.paynext_alb.zone_id
}

output "alb_security_group_id" {
  description = "Security group ID of the Application Load Balancer"
  value       = aws_security_group.alb.id
}

output "alb_logs_bucket_name" {
  description = "Name of the S3 bucket for ALB access logs"
  value       = aws_s3_bucket.alb_logs.bucket
}

output "alb_logs_bucket_arn" {
  description = "ARN of the S3 bucket for ALB access logs"
  value       = aws_s3_bucket.alb_logs.arn
}

# CloudWatch Logs
output "cluster_cloudwatch_log_group_name" {
  description = "Name of the CloudWatch log group for cluster logs"
  value       = aws_cloudwatch_log_group.eks_cluster_logs.name
}

output "cluster_cloudwatch_log_group_arn" {
  description = "ARN of the CloudWatch log group for cluster logs"
  value       = aws_cloudwatch_log_group.eks_cluster_logs.arn
}

# Launch Template
output "launch_template_id" {
  description = "ID of the launch template for EKS nodes"
  value       = aws_launch_template.eks_nodes.id
}

output "launch_template_arn" {
  description = "ARN of the launch template for EKS nodes"
  value       = aws_launch_template.eks_nodes.arn
}

output "launch_template_latest_version" {
  description = "Latest version of the launch template"
  value       = aws_launch_template.eks_nodes.latest_version
}

# Service Account Role ARNs
output "vpc_cni_role_arn" {
  description = "ARN of the VPC CNI service account role"
  value       = aws_iam_role.vpc_cni_role.arn
}

output "ebs_csi_role_arn" {
  description = "ARN of the EBS CSI service account role"
  value       = aws_iam_role.ebs_csi_role.arn
}

# Cluster Configuration Summary
output "cluster_config_summary" {
  description = "Summary of cluster configuration"
  value = {
    cluster_name                = aws_eks_cluster.paynext_cluster.name
    kubernetes_version          = aws_eks_cluster.paynext_cluster.version
    endpoint_private_access     = aws_eks_cluster.paynext_cluster.vpc_config[0].endpoint_private_access
    endpoint_public_access      = aws_eks_cluster.paynext_cluster.vpc_config[0].endpoint_public_access
    public_access_cidrs        = aws_eks_cluster.paynext_cluster.vpc_config[0].public_access_cidrs
    encryption_enabled         = length(aws_eks_cluster.paynext_cluster.encryption_config) > 0
    logging_enabled            = length(aws_eks_cluster.paynext_cluster.enabled_cluster_log_types) > 0
    node_groups_count          = length(aws_eks_node_group.paynext_nodes)
    addons_count              = 4  # vpc-cni, coredns, kube-proxy, ebs-csi-driver
  }
}

# Security Features Summary
output "security_features_enabled" {
  description = "Summary of enabled security features"
  value = {
    secrets_encryption         = var.enable_encryption_at_rest
    private_endpoint           = true
    public_endpoint_restricted = !var.enable_public_access || length(var.public_access_cidrs) < 2
    cluster_logging           = length(var.cluster_log_types) > 0
    node_security_groups      = true
    iam_roles_for_service_accounts = true
    encrypted_ebs_volumes     = true
    security_hardened_nodes   = true
  }
}

# Kubectl Configuration
output "kubectl_config" {
  description = "kubectl configuration command"
  value       = "aws eks update-kubeconfig --region ${data.aws_region.current.name} --name ${aws_eks_cluster.paynext_cluster.name}"
}

# Cluster Access Information
output "cluster_access_info" {
  description = "Information for accessing the cluster"
  value = {
    cluster_endpoint = aws_eks_cluster.paynext_cluster.endpoint
    cluster_name     = aws_eks_cluster.paynext_cluster.name
    region          = data.aws_region.current.name
    oidc_issuer     = aws_eks_cluster.paynext_cluster.identity[0].oidc[0].issuer
    kubectl_command = "aws eks update-kubeconfig --region ${data.aws_region.current.name} --name ${aws_eks_cluster.paynext_cluster.name}"
  }
}

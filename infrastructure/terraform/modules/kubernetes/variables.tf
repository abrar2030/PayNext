# Kubernetes/EKS Module Variables

variable "cluster_name" {
  description = "Name of the EKS cluster"
  type        = string

  validation {
    condition     = can(regex("^[a-zA-Z][a-zA-Z0-9-]*$", var.cluster_name))
    error_message = "Cluster name must start with a letter and contain only alphanumeric characters and hyphens."
  }
}

variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

variable "vpc_id" {
  description = "VPC ID where the cluster will be deployed"
  type        = string
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs for the EKS cluster"
  type        = list(string)

  validation {
    condition     = length(var.private_subnet_ids) >= 2
    error_message = "At least 2 private subnets are required for high availability."
  }
}

variable "public_subnet_ids" {
  description = "List of public subnet IDs for the EKS cluster"
  type        = list(string)

  validation {
    condition     = length(var.public_subnet_ids) >= 2
    error_message = "At least 2 public subnets are required for high availability."
  }
}

variable "kubernetes_version" {
  description = "Kubernetes version for the EKS cluster"
  type        = string
  default     = "1.27"

  validation {
    condition     = can(regex("^1\\.(2[4-9]|[3-9][0-9])$", var.kubernetes_version))
    error_message = "Kubernetes version must be 1.24 or higher."
  }
}

variable "enable_encryption_at_rest" {
  description = "Enable encryption at rest for EKS secrets"
  type        = bool
  default     = true
}

variable "enable_detailed_monitoring" {
  description = "Enable detailed monitoring for EKS nodes"
  type        = bool
  default     = true
}

variable "kms_key_id" {
  description = "KMS key ID for encryption"
  type        = string
}

variable "security_group_ids" {
  description = "Map of security group IDs"
  type        = map(string)
}

variable "enable_public_access" {
  description = "Enable public access to the EKS cluster endpoint"
  type        = bool
  default     = false
}

variable "public_access_cidrs" {
  description = "CIDR blocks allowed to access the public EKS endpoint"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "allowed_ssh_cidrs" {
  description = "CIDR blocks allowed SSH access to nodes"
  type        = list(string)
  default     = ["10.0.0.0/8"]
}

variable "node_groups" {
  description = "Map of EKS node group configurations"
  type = map(object({
    instance_types             = list(string)
    capacity_type              = string
    ami_type                   = string
    disk_size                  = number
    desired_size               = number
    max_size                   = number
    min_size                   = number
    max_unavailable_percentage = number
    labels                     = map(string)
    taints = list(object({
      key    = string
      value  = string
      effect = string
    }))
  }))
  default = {
    general = {
      instance_types             = ["t3.medium"]
      capacity_type              = "ON_DEMAND"
      ami_type                   = "AL2_x86_64"
      disk_size                  = 50
      desired_size               = 2
      max_size                   = 10
      min_size                   = 1
      max_unavailable_percentage = 25
      labels = {
        role = "general"
      }
      taints = []
    }
  }
}

variable "node_instance_type" {
  description = "Instance type for EKS nodes"
  type        = string
  default     = "t3.medium"
}

variable "node_disk_size" {
  description = "Disk size for EKS nodes (GB)"
  type        = number
  default     = 50

  validation {
    condition     = var.node_disk_size >= 20
    error_message = "Node disk size must be at least 20 GB."
  }
}

variable "bootstrap_arguments" {
  description = "Additional arguments for the EKS bootstrap script"
  type        = string
  default     = ""
}

# EKS Add-on versions
variable "vpc_cni_version" {
  description = "Version of the VPC CNI add-on"
  type        = string
  default     = "v1.13.4-eksbuild.1"
}

variable "coredns_version" {
  description = "Version of the CoreDNS add-on"
  type        = string
  default     = "v1.10.1-eksbuild.1"
}

variable "kube_proxy_version" {
  description = "Version of the kube-proxy add-on"
  type        = string
  default     = "v1.27.3-eksbuild.1"
}

variable "ebs_csi_version" {
  description = "Version of the EBS CSI driver add-on"
  type        = string
  default     = "v1.21.0-eksbuild.1"
}

# Load Balancer Configuration
variable "enable_alb" {
  description = "Enable Application Load Balancer"
  type        = bool
  default     = true
}

variable "alb_deletion_protection" {
  description = "Enable deletion protection for ALB"
  type        = bool
  default     = false
}

variable "enable_alb_access_logs" {
  description = "Enable access logs for ALB"
  type        = bool
  default     = true
}

# Cluster Logging
variable "cluster_log_types" {
  description = "List of control plane log types to enable"
  type        = list(string)
  default     = ["api", "audit", "authenticator", "controllerManager", "scheduler"]
}

variable "cluster_log_retention_days" {
  description = "Number of days to retain cluster logs"
  type        = number
  default     = 365

  validation {
    condition     = var.cluster_log_retention_days >= 30
    error_message = "Cluster log retention must be at least 30 days."
  }
}

# Service Mesh Configuration
variable "enable_istio" {
  description = "Enable Istio service mesh"
  type        = bool
  default     = false
}

variable "enable_linkerd" {
  description = "Enable Linkerd service mesh"
  type        = bool
  default     = false
}

# Monitoring and Observability
variable "enable_prometheus" {
  description = "Enable Prometheus monitoring"
  type        = bool
  default     = true
}

variable "enable_grafana" {
  description = "Enable Grafana dashboards"
  type        = bool
  default     = true
}

variable "enable_jaeger" {
  description = "Enable Jaeger tracing"
  type        = bool
  default     = false
}

# Security
variable "enable_pod_security_policy" {
  description = "Enable Pod Security Policy"
  type        = bool
  default     = true
}

variable "enable_network_policy" {
  description = "Enable Kubernetes Network Policy"
  type        = bool
  default     = true
}

variable "enable_rbac" {
  description = "Enable Role-Based Access Control"
  type        = bool
  default     = true
}

variable "enable_admission_controllers" {
  description = "Enable additional admission controllers"
  type        = bool
  default     = true
}

# Backup and Disaster Recovery
variable "enable_velero" {
  description = "Enable Velero for backup and disaster recovery"
  type        = bool
  default     = true
}

variable "backup_retention_days" {
  description = "Number of days to retain backups"
  type        = number
  default     = 30
}

# Auto Scaling
variable "enable_cluster_autoscaler" {
  description = "Enable Cluster Autoscaler"
  type        = bool
  default     = true
}

variable "enable_vertical_pod_autoscaler" {
  description = "Enable Vertical Pod Autoscaler"
  type        = bool
  default     = false
}

variable "enable_horizontal_pod_autoscaler" {
  description = "Enable Horizontal Pod Autoscaler"
  type        = bool
  default     = true
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}

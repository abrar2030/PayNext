# Kubernetes provider configuration
provider "kubernetes" {
  host                   = module.eks.cluster_endpoint
  token                  = data.aws_eks_cluster_auth.cluster.token
  cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
  load_config_file       = false
}

# Helm provider configuration
provider "helm" {
  kubernetes {
    host                   = module.eks.cluster_endpoint
    token                  = data.aws_eks_cluster_auth.cluster.token
    cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
  }
}

# Install NGINX Ingress Controller for handling ingress traffic
resource "helm_release" "nginx_ingress" {
  name       = "nginx-ingress"
  repository = "https://kubernetes.github.io/ingress-nginx"
  chart      = "ingress-nginx"
  version    = "4.2.5"

  namespace = "kube-system"

  values = [
    <<EOF
controller:
  service:
    type: LoadBalancer
EOF
  ]

  depends_on = [module.eks]
}

# Deploy Prometheus for monitoring and metrics
resource "helm_release" "prometheus" {
  name       = "prometheus"
  repository = "https://prometheus-community.github.io/helm-charts"
  chart      = "prometheus"
  version    = "14.5.0"

  namespace        = "monitoring"
  create_namespace = true

  values = [
    <<EOF
server:
  service:
    type: LoadBalancer
EOF
  ]

  depends_on = [module.eks]
}

# Deploy Grafana for monitoring visualization
resource "helm_release" "grafana" {
  name       = "grafana"
  repository = "https://grafana.github.io/helm-charts"
  chart      = "grafana"
  version    = "6.16.14"

  namespace = "monitoring"

  values = [
    <<EOF
service:
  type: LoadBalancer
EOF
  ]

  depends_on = [module.eks]
}

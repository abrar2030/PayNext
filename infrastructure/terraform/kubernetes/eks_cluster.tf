module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  version         = "18.29.0" # Update as per latest available
  cluster_name    = var.cluster_name
  cluster_version = "1.21" # Specify the EKS version
  subnets         = module.vpc.public_subnets
  vpc_id          = module.vpc.vpc_id

  # Worker nodes configuration
  node_groups = {
    paynext_nodes = {
      desired_capacity = 2
      max_capacity     = 3
      min_capacity     = 1

      instance_type = "t3.medium"
      key_name      = var.key_pair_name # Make sure to specify your key pair in vars

      tags = {
        Name = "paynext-eks-node"
      }
    }
  }

  # Enable necessary Kubernetes features for the EKS cluster
  enable_irsa            = true
  manage_aws_auth        = true

  tags = {
    Environment = "production"
    Project     = "PayNext"
  }
}

# IAM Role for the EKS cluster to allow Kubernetes to access AWS services
resource "aws_iam_role_policy_attachment" "eks_iam_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = module.eks.eks_cluster_iam_role_name
}

resource "aws_iam_role_policy_attachment" "eks_service_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSServicePolicy"
  role       = module.eks.eks_cluster_iam_role_name
}

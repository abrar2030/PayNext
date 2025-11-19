# Enhanced VPC Module for PayNext
# This module provides secure networking infrastructure with comprehensive security controls

# Data sources
data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_caller_identity" "current" {}

data "aws_region" "current" {}

# Local values
locals {
  azs = length(var.availability_zones) > 0 ? var.availability_zones : slice(data.aws_availability_zones.available.names, 0, 3)

  # Calculate subnet counts based on AZ count
  az_count = length(local.azs)

  # Ensure we have enough subnet CIDRs for all AZs
  public_subnet_cidrs   = slice(var.public_subnet_cidrs, 0, local.az_count)
  private_subnet_cidrs  = slice(var.private_subnet_cidrs, 0, local.az_count)
  database_subnet_cidrs = slice(var.database_subnet_cidrs, 0, local.az_count)
}

# VPC
resource "aws_vpc" "paynext_vpc" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = merge(var.tags, {
    Name                = "PayNext-VPC-${var.environment}"
    Environment         = var.environment
    Tier               = "Network"
    "kubernetes.io/cluster/${var.environment}-cluster" = "shared"
  })
}

# Internet Gateway
resource "aws_internet_gateway" "paynext_igw" {
  vpc_id = aws_vpc.paynext_vpc.id

  tags = merge(var.tags, {
    Name = "PayNext-IGW-${var.environment}"
  })
}

# Public Subnets
resource "aws_subnet" "public" {
  count = local.az_count

  vpc_id                  = aws_vpc.paynext_vpc.id
  cidr_block              = local.public_subnet_cidrs[count.index]
  availability_zone       = local.azs[count.index]
  map_public_ip_on_launch = true

  tags = merge(var.tags, {
    Name = "PayNext-Public-Subnet-${count.index + 1}-${var.environment}"
    Type = "Public"
    Tier = "Public"
    "kubernetes.io/cluster/${var.environment}-cluster" = "shared"
    "kubernetes.io/role/elb" = "1"
  })
}

# Private Subnets
resource "aws_subnet" "private" {
  count = local.az_count

  vpc_id            = aws_vpc.paynext_vpc.id
  cidr_block        = local.private_subnet_cidrs[count.index]
  availability_zone = local.azs[count.index]

  tags = merge(var.tags, {
    Name = "PayNext-Private-Subnet-${count.index + 1}-${var.environment}"
    Type = "Private"
    Tier = "Application"
    "kubernetes.io/cluster/${var.environment}-cluster" = "owned"
    "kubernetes.io/role/internal-elb" = "1"
  })
}

# Database Subnets
resource "aws_subnet" "database" {
  count = local.az_count

  vpc_id            = aws_vpc.paynext_vpc.id
  cidr_block        = local.database_subnet_cidrs[count.index]
  availability_zone = local.azs[count.index]

  tags = merge(var.tags, {
    Name = "PayNext-Database-Subnet-${count.index + 1}-${var.environment}"
    Type = "Database"
    Tier = "Database"
  })
}

# Database Subnet Group
resource "aws_db_subnet_group" "paynext_db_subnet_group" {
  name       = "paynext-db-subnet-group-${var.environment}"
  subnet_ids = aws_subnet.database[*].id

  tags = merge(var.tags, {
    Name = "PayNext-DB-Subnet-Group-${var.environment}"
  })
}

# Elastic IPs for NAT Gateways
resource "aws_eip" "nat" {
  count = var.enable_multi_az ? local.az_count : 1

  domain = "vpc"

  depends_on = [aws_internet_gateway.paynext_igw]

  tags = merge(var.tags, {
    Name = "PayNext-NAT-EIP-${count.index + 1}-${var.environment}"
  })
}

# NAT Gateways
resource "aws_nat_gateway" "paynext_nat" {
  count = var.enable_multi_az ? local.az_count : 1

  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id

  tags = merge(var.tags, {
    Name = "PayNext-NAT-Gateway-${count.index + 1}-${var.environment}"
  })

  depends_on = [aws_internet_gateway.paynext_igw]
}

# Route Tables
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.paynext_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.paynext_igw.id
  }

  tags = merge(var.tags, {
    Name = "PayNext-Public-RT-${var.environment}"
    Type = "Public"
  })
}

resource "aws_route_table" "private" {
  count = var.enable_multi_az ? local.az_count : 1

  vpc_id = aws_vpc.paynext_vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.paynext_nat[count.index].id
  }

  tags = merge(var.tags, {
    Name = "PayNext-Private-RT-${count.index + 1}-${var.environment}"
    Type = "Private"
  })
}

resource "aws_route_table" "database" {
  vpc_id = aws_vpc.paynext_vpc.id

  tags = merge(var.tags, {
    Name = "PayNext-Database-RT-${var.environment}"
    Type = "Database"
  })
}

# Route Table Associations
resource "aws_route_table_association" "public" {
  count = local.az_count

  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "private" {
  count = local.az_count

  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = var.enable_multi_az ? aws_route_table.private[count.index].id : aws_route_table.private[0].id
}

resource "aws_route_table_association" "database" {
  count = local.az_count

  subnet_id      = aws_subnet.database[count.index].id
  route_table_id = aws_route_table.database.id
}

# VPC Flow Logs
resource "aws_flow_log" "paynext_vpc_flow_log" {
  count = var.enable_vpc_flow_logs ? 1 : 0

  iam_role_arn    = aws_iam_role.flow_log[0].arn
  log_destination = aws_cloudwatch_log_group.vpc_flow_log[0].arn
  traffic_type    = "ALL"
  vpc_id          = aws_vpc.paynext_vpc.id

  tags = merge(var.tags, {
    Name = "PayNext-VPC-Flow-Log-${var.environment}"
  })
}

# CloudWatch Log Group for VPC Flow Logs
resource "aws_cloudwatch_log_group" "vpc_flow_log" {
  count = var.enable_vpc_flow_logs ? 1 : 0

  name              = "/aws/vpc/flowlogs-${var.environment}"
  retention_in_days = 365
  kms_key_id        = var.kms_key_id

  tags = merge(var.tags, {
    Name = "PayNext-VPC-Flow-Logs-${var.environment}"
  })
}

# IAM Role for VPC Flow Logs
resource "aws_iam_role" "flow_log" {
  count = var.enable_vpc_flow_logs ? 1 : 0

  name = "paynext-flow-log-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "vpc-flow-logs.amazonaws.com"
        }
      }
    ]
  })

  tags = var.tags
}

resource "aws_iam_role_policy" "flow_log" {
  count = var.enable_vpc_flow_logs ? 1 : 0

  name = "paynext-flow-log-policy-${var.environment}"
  role = aws_iam_role.flow_log[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogGroups",
          "logs:DescribeLogStreams"
        ]
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })
}

# Security Groups
resource "aws_security_group" "web_tier" {
  name_prefix = "paynext-web-tier-${var.environment}-"
  vpc_id      = aws_vpc.paynext_vpc.id
  description = "Security group for web tier (ALB)"

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "All outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.tags, {
    Name = "PayNext-Web-Tier-SG-${var.environment}"
    Tier = "Web"
  })

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_security_group" "app_tier" {
  name_prefix = "paynext-app-tier-${var.environment}-"
  vpc_id      = aws_vpc.paynext_vpc.id
  description = "Security group for application tier"

  ingress {
    description     = "HTTP from web tier"
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.web_tier.id]
  }

  ingress {
    description     = "HTTPS from web tier"
    from_port       = 8443
    to_port         = 8443
    protocol        = "tcp"
    security_groups = [aws_security_group.web_tier.id]
  }

  ingress {
    description = "SSH from bastion"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.allowed_cidr_blocks
  }

  egress {
    description = "All outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.tags, {
    Name = "PayNext-App-Tier-SG-${var.environment}"
    Tier = "Application"
  })

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_security_group" "database_tier" {
  name_prefix = "paynext-database-tier-${var.environment}-"
  vpc_id      = aws_vpc.paynext_vpc.id
  description = "Security group for database tier"

  ingress {
    description     = "MySQL/Aurora from app tier"
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.app_tier.id]
  }

  ingress {
    description     = "PostgreSQL from app tier"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.app_tier.id]
  }

  egress {
    description = "All outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.tags, {
    Name = "PayNext-Database-Tier-SG-${var.environment}"
    Tier = "Database"
  })

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_security_group" "eks_cluster" {
  name_prefix = "paynext-eks-cluster-${var.environment}-"
  vpc_id      = aws_vpc.paynext_vpc.id
  description = "Security group for EKS cluster"

  ingress {
    description = "HTTPS from nodes"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    self        = true
  }

  egress {
    description = "All outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.tags, {
    Name = "PayNext-EKS-Cluster-SG-${var.environment}"
    Tier = "Kubernetes"
  })

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_security_group" "eks_nodes" {
  name_prefix = "paynext-eks-nodes-${var.environment}-"
  vpc_id      = aws_vpc.paynext_vpc.id
  description = "Security group for EKS nodes"

  ingress {
    description = "Node to node communication"
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    self        = true
  }

  ingress {
    description     = "Pod to pod communication"
    from_port       = 1025
    to_port         = 65535
    protocol        = "tcp"
    security_groups = [aws_security_group.eks_cluster.id]
  }

  ingress {
    description = "SSH access"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.allowed_cidr_blocks
  }

  egress {
    description = "All outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.tags, {
    Name = "PayNext-EKS-Nodes-SG-${var.environment}"
    Tier = "Kubernetes"
  })

  lifecycle {
    create_before_destroy = true
  }
}

# Network ACLs for additional security
resource "aws_network_acl" "public" {
  vpc_id     = aws_vpc.paynext_vpc.id
  subnet_ids = aws_subnet.public[*].id

  # Allow HTTP inbound
  ingress {
    protocol   = "tcp"
    rule_no    = 100
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 80
    to_port    = 80
  }

  # Allow HTTPS inbound
  ingress {
    protocol   = "tcp"
    rule_no    = 110
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 443
    to_port    = 443
  }

  # Allow ephemeral ports inbound
  ingress {
    protocol   = "tcp"
    rule_no    = 120
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 1024
    to_port    = 65535
  }

  # Allow all outbound
  egress {
    protocol   = "-1"
    rule_no    = 100
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 0
    to_port    = 0
  }

  tags = merge(var.tags, {
    Name = "PayNext-Public-NACL-${var.environment}"
  })
}

resource "aws_network_acl" "private" {
  vpc_id     = aws_vpc.paynext_vpc.id
  subnet_ids = aws_subnet.private[*].id

  # Allow inbound from VPC
  ingress {
    protocol   = "-1"
    rule_no    = 100
    action     = "allow"
    cidr_block = var.vpc_cidr
    from_port  = 0
    to_port    = 0
  }

  # Allow ephemeral ports from internet (for outbound responses)
  ingress {
    protocol   = "tcp"
    rule_no    = 110
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 1024
    to_port    = 65535
  }

  # Allow all outbound
  egress {
    protocol   = "-1"
    rule_no    = 100
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 0
    to_port    = 0
  }

  tags = merge(var.tags, {
    Name = "PayNext-Private-NACL-${var.environment}"
  })
}

resource "aws_network_acl" "database" {
  vpc_id     = aws_vpc.paynext_vpc.id
  subnet_ids = aws_subnet.database[*].id

  # Allow inbound from private subnets only
  ingress {
    protocol   = "tcp"
    rule_no    = 100
    action     = "allow"
    cidr_block = var.vpc_cidr
    from_port  = 3306
    to_port    = 3306
  }

  ingress {
    protocol   = "tcp"
    rule_no    = 110
    action     = "allow"
    cidr_block = var.vpc_cidr
    from_port  = 5432
    to_port    = 5432
  }

  # Allow ephemeral ports outbound
  egress {
    protocol   = "tcp"
    rule_no    = 100
    action     = "allow"
    cidr_block = var.vpc_cidr
    from_port  = 1024
    to_port    = 65535
  }

  tags = merge(var.tags, {
    Name = "PayNext-Database-NACL-${var.environment}"
  })
}

# VPC Endpoints for secure AWS service access
resource "aws_vpc_endpoint" "s3" {
  vpc_id       = aws_vpc.paynext_vpc.id
  service_name = "com.amazonaws.${data.aws_region.current.name}.s3"

  tags = merge(var.tags, {
    Name = "PayNext-S3-VPC-Endpoint-${var.environment}"
  })
}

resource "aws_vpc_endpoint" "dynamodb" {
  vpc_id       = aws_vpc.paynext_vpc.id
  service_name = "com.amazonaws.${data.aws_region.current.name}.dynamodb"

  tags = merge(var.tags, {
    Name = "PayNext-DynamoDB-VPC-Endpoint-${var.environment}"
  })
}

resource "aws_vpc_endpoint" "ec2" {
  vpc_id              = aws_vpc.paynext_vpc.id
  service_name        = "com.amazonaws.${data.aws_region.current.name}.ec2"
  vpc_endpoint_type   = "Interface"
  subnet_ids          = aws_subnet.private[*].id
  security_group_ids  = [aws_security_group.vpc_endpoints.id]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = "*"
        Effect    = "Allow"
        Resource  = "*"
        Principal = "*"
      }
    ]
  })

  tags = merge(var.tags, {
    Name = "PayNext-EC2-VPC-Endpoint-${var.environment}"
  })
}

# Security group for VPC endpoints
resource "aws_security_group" "vpc_endpoints" {
  name_prefix = "paynext-vpc-endpoints-${var.environment}-"
  vpc_id      = aws_vpc.paynext_vpc.id
  description = "Security group for VPC endpoints"

  ingress {
    description = "HTTPS from VPC"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  egress {
    description = "All outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.tags, {
    Name = "PayNext-VPC-Endpoints-SG-${var.environment}"
  })

  lifecycle {
    create_before_destroy = true
  }
}

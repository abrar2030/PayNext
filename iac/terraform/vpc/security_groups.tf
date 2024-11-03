resource "aws_security_group" "eks_security_group" {
  vpc_id = aws_vpc.paynext_vpc.id
  description = "Security group for EKS cluster"
  ingress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port = 443
    to_port = 443
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = {
    Name = "PayNext EKS Security Group"
  }
}

resource "aws_security_group" "alb_security_group" {
  vpc_id = aws_vpc.paynext_vpc.id
  description = "Security group for ALB"
  ingress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = {
    Name = "PayNext ALB Security Group"
  }
}

resource "aws_security_group" "app_security_group" {
  vpc_id = aws_vpc.paynext_vpc.id
  description = "Security group for application services"
  ingress {
    from_port = 8000
    to_port = 9000
    protocol = "tcp"
    security_groups = [aws_security_group.eks_security_group.id]
  }
  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = {
    Name = "PayNext Application Security Group"
  }
}

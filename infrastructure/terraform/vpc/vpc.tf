resource "aws_vpc" "paynext_vpc" {
  cidr_block = "10.0.0.0/16"
  enable_dns_support = true
  enable_dns_hostnames = true
  tags = {
    Name = "PayNext VPC"
    Project = "PayNext"
    Environment = "production"
  }
}

resource "aws_subnet" "public_subnet_a" {
  vpc_id = aws_vpc.paynext_vpc.id
  cidr_block = "10.0.1.0/24"
  availability_zone = "${var.aws_region}a"
  map_public_ip_on_launch = true
  tags = {
    Name = "PayNext Public Subnet A"
  }
}

resource "aws_subnet" "public_subnet_b" {
  vpc_id = aws_vpc.paynext_vpc.id
  cidr_block = "10.0.2.0/24"
  availability_zone = "${var.aws_region}b"
  map_public_ip_on_launch = true
  tags = {
    Name = "PayNext Public Subnet B"
  }
}

resource "aws_internet_gateway" "internet_gateway" {
  vpc_id = aws_vpc.paynext_vpc.id
  tags = {
    Name = "PayNext Internet Gateway"
  }
}

resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.paynext_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.internet_gateway.id
  }
  tags = {
    Name = "PayNext Public Route Table"
  }
}

resource "aws_route_table_association" "public_a" {
  subnet_id = aws_subnet.public_subnet_a.id
  route_table_id = aws_route_table.public_route_table.id
}

resource "aws_route_table_association" "public_b" {
  subnet_id = aws_subnet.public_subnet_b.id
  route_table_id = aws_route_table.public_route_table.id
}

# Define additional subnets, NAT gateway, or private route tables as needed for private networking.
# vpc.tf content placeholder

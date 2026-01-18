# Installation Guide

This guide covers all installation methods for PayNext, including local development, Docker, and production deployment.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation Options](#installation-options)
- [Quick Start](#quick-start)
- [Local Development Setup](#local-development-setup)
- [Docker Installation](#docker-installation)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Post-Installation](#post-installation)

## Prerequisites

### System Requirements

| Component | Minimum               | Recommended      |
| --------- | --------------------- | ---------------- |
| CPU       | 4 cores               | 8+ cores         |
| RAM       | 8 GB                  | 16+ GB           |
| Storage   | 20 GB                 | 50+ GB SSD       |
| OS        | Linux, macOS, Windows | Ubuntu 22.04 LTS |

### Required Software

| Software       | Version | Purpose                       |
| -------------- | ------- | ----------------------------- |
| Java JDK       | 17+     | Backend services              |
| Maven          | 3.8+    | Build tool                    |
| Node.js        | 18+     | Frontend applications         |
| Docker         | 20.10+  | Containerization              |
| Docker Compose | 2.0+    | Multi-container orchestration |
| Git            | 2.30+   | Version control               |

### Optional Software

| Software   | Version | Purpose                     |
| ---------- | ------- | --------------------------- |
| Kubernetes | 1.26+   | Production orchestration    |
| Terraform  | 1.5+    | Infrastructure provisioning |
| Python     | 3.9+    | ML services                 |

## Installation Options

### Option 1: Docker (Recommended for Quick Start)

Best for: Testing, development, quick demos

```bash
# Clone repository
git clone https://github.com/quantsingularity/PayNext.git
cd PayNext

# Copy environment configuration
cp backend/.env.example backend/.env

# Start all services
docker-compose up -d

# Verify services are running
docker-compose ps
```

Access points:

- Web Dashboard: http://localhost:3000
- API Gateway: http://localhost:8002
- Eureka Dashboard: http://localhost:8001

### Option 2: Local Development

Best for: Active development, debugging, customization

```bash
# 1. Clone and navigate
git clone https://github.com/quantsingularity/PayNext.git
cd PayNext

# 2. Install dependencies
./scripts/dev_environment_setup.sh

# 3. Start infrastructure services
docker-compose up -d mysql redis rabbitmq

# 4. Build and start backend services
cd backend
mvn clean install
cd ..
./scripts/paynext.sh build
./scripts/paynext.sh start

# 5. Start web frontend
cd web-frontend
npm install
npm start
```

### Option 3: Kubernetes Production

Best for: Production deployment, high availability, scalability

See [Kubernetes Deployment](examples/05-kubernetes-deployment.md) for complete guide.

## Installation by Platform

| OS / Platform      | Recommended install command                                                                           | Notes                    |
| ------------------ | ----------------------------------------------------------------------------------------------------- | ------------------------ |
| **Ubuntu 22.04+**  | `sudo apt update && sudo apt install -y openjdk-17-jdk maven nodejs npm docker.io docker-compose git` | Default package manager  |
| **macOS**          | `brew install openjdk@17 maven node docker docker-compose git`                                        | Requires Homebrew        |
| **Windows 10/11**  | Install via Chocolatey: `choco install openjdk17 maven nodejs docker-desktop git`                     | Requires WSL2 for Docker |
| **RHEL/CentOS 8+** | `sudo dnf install -y java-17-openjdk maven nodejs docker docker-compose git`                          | Use dnf package manager  |
| **Arch Linux**     | `sudo pacman -S jdk17-openjdk maven nodejs npm docker docker-compose git`                             | Rolling release          |

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/quantsingularity/PayNext.git
cd PayNext
```

### 2. Environment Configuration

```bash
# Copy example environment file
cp backend/.env.example backend/.env

# Edit configuration (optional)
nano backend/.env
```

Key environment variables to configure:

```bash
# JWT Security
JWT_SECRET=your-256-bit-secret-key-here

# Database
USER_DB_URL=jdbc:mysql://localhost:3306/user_db
PAYMENT_DB_URL=jdbc:mysql://localhost:3306/payment_db

# Email (for notifications)
MAIL_HOST=smtp.gmail.com
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-specific-password
```

### 3. Start Services

**Option A: Docker (Recommended)**

```bash
docker-compose up -d
```

**Option B: Local Development**

```bash
# Start infrastructure
docker-compose up -d mysql redis rabbitmq

# Build and start backend
./scripts/paynext.sh build
./scripts/paynext.sh start

# Start frontend (in new terminal)
cd web-frontend
npm install && npm start
```

### 4. Verify Installation

```bash
# Check service health
curl http://localhost:8001  # Eureka
curl http://localhost:8002/actuator/health  # API Gateway

# View service status
./scripts/paynext.sh list
```

## Local Development Setup

### Backend Services

```bash
# Navigate to backend
cd backend

# Build all services
mvn clean install

# Start individual service
cd user-service
mvn spring-boot:run

# Or use management script
cd ../..
./scripts/paynext.sh start user-service
```

### Frontend Applications

**Web Frontend**

```bash
cd web-frontend

# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

**Mobile Frontend**

```bash
cd mobile-frontend

# Install dependencies (pnpm recommended)
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

### ML Services

```bash
cd ml_services

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start fraud detection service
cd fraud
uvicorn fraud_detection_api:app --host 0.0.0.0 --port 5000

# Or use Docker
docker-compose up fraud-detection-service
```

## Docker Installation

### Complete Stack

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes (clean start)
docker-compose down -v
```

### Individual Services

```bash
# Start specific services
docker-compose up -d eureka-server api-gateway user-service

# Scale services
docker-compose up -d --scale payment-service=3

# Rebuild specific service
docker-compose build user-service
docker-compose up -d user-service
```

### Custom Docker Network

```bash
# Create network
docker network create paynext-network

# Run services on custom network
docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d
```

## Kubernetes Deployment

### Prerequisites

```bash
# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/

# Install Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

### Deploy with Helm

```bash
cd infrastructure/kubernetes

# Install PayNext
helm install paynext . --namespace paynext --create-namespace

# Upgrade deployment
helm upgrade paynext . --namespace paynext

# Uninstall
helm uninstall paynext --namespace paynext
```

### Manual Deployment

```bash
# Create namespace
kubectl create namespace paynext

# Apply configurations
kubectl apply -f infrastructure/kubernetes/templates/ --recursive

# Verify deployment
kubectl get pods -n paynext
kubectl get services -n paynext
```

## Post-Installation

### Database Initialization

Databases are automatically created on first run. To manually initialize:

```bash
# Connect to MySQL
docker exec -it mysql mysql -u root -p

# Create databases
CREATE DATABASE IF NOT EXISTS user_db;
CREATE DATABASE IF NOT EXISTS payment_db;
CREATE DATABASE IF NOT EXISTS notification_db;
CREATE DATABASE IF NOT EXISTS fraud_detection_db;
```

### Service Verification

```bash
# Check Eureka dashboard
open http://localhost:8001

# Test API Gateway
curl http://localhost:8002/actuator/health

# Test User Service
curl -X POST http://localhost:8002/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"SecurePass123!"}'
```

### Access Points

| Service          | URL                                   | Credentials          |
| ---------------- | ------------------------------------- | -------------------- |
| Web Dashboard    | http://localhost:3000                 | Register new account |
| API Gateway      | http://localhost:8002                 | JWT token required   |
| Eureka Dashboard | http://localhost:8001                 | No auth (dev mode)   |
| Swagger UI       | http://localhost:8002/swagger-ui.html | No auth              |

### Monitoring Setup

```bash
# Start monitoring stack
docker-compose -f infrastructure/docker-compose-monitoring.yml up -d

# Access dashboards
# Prometheus: http://localhost:9090
# Grafana: http://localhost:3001 (admin/admin)
```

## Troubleshooting

### Port Conflicts

If ports are already in use, modify `docker-compose.yml` or use environment variables:

```bash
# Change API Gateway port
GATEWAY_PORT=8082 docker-compose up -d api-gateway
```

### Database Connection Issues

```bash
# Verify MySQL is running
docker-compose ps mysql

# Check logs
docker-compose logs mysql

# Test connection
docker exec -it mysql mysql -u root -p -e "SELECT 1"
```

### Service Discovery Issues

```bash
# Restart Eureka server
docker-compose restart eureka-server

# Wait 30 seconds for registration
sleep 30

# Check registered services
curl http://localhost:8001/eureka/apps
```

### Memory Issues

Increase Docker memory allocation:

```bash
# Edit Docker Desktop settings
# Set memory to 8GB minimum
# Restart Docker
```

For more troubleshooting, see [Troubleshooting Guide](TROUBLESHOOTING.md).

## Next Steps

- [Configuration Guide](CONFIGURATION.md) - Configure services for your needs
- [Usage Guide](USAGE.md) - Learn common workflows
- [API Reference](API.md) - Explore available APIs
- [Examples](examples/) - Working code examples

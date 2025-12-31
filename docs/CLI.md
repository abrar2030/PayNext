# CLI Reference

Command-line interface documentation for PayNext management scripts and tools.

## Table of Contents

- [Overview](#overview)
- [Service Management CLI](#service-management-cli)
- [Testing CLI](#testing-cli)
- [Database Management CLI](#database-management-cli)
- [Docker Management CLI](#docker-management-cli)
- [Deployment CLI](#deployment-cli)

## Overview

PayNext provides several command-line scripts for managing services, running tests, and deploying the platform. All scripts are located in the `scripts/` directory.

## Service Management CLI

### paynext.sh

Main service management script for building, starting, and stopping backend services.

**Location**: `scripts/paynext.sh`

#### Commands

| Command | Arguments | Description                            | Example                                   |
| ------- | --------- | -------------------------------------- | ----------------------------------------- |
| `build` | [service] | Build all services or specific service | `./scripts/paynext.sh build`              |
| `start` | [service] | Start all services or specific service | `./scripts/paynext.sh start user-service` |
| `stop`  | [service] | Stop all services or specific service  | `./scripts/paynext.sh stop`               |
| `list`  | -         | List all service PIDs and statuses     | `./scripts/paynext.sh list`               |

#### Available Services

- `eureka-server` - Service discovery server
- `api-gateway` - API gateway and routing
- `user-service` - User management service
- `payment-service` - Payment processing service
- `notification-service` - Notification service

#### Service Ports

| Service              | Port | Description          |
| -------------------- | ---- | -------------------- |
| eureka-server        | 8001 | Service registry     |
| api-gateway          | 8002 | API gateway          |
| user-service         | 8003 | User service         |
| payment-service      | 8004 | Payment service      |
| notification-service | 8005 | Notification service |

#### Examples

**Build All Services**

```bash
./scripts/paynext.sh build
```

Output:

```
2025-01-01 10:00:00 [INFO] Building eureka-server
2025-01-01 10:00:05 [SUCCESS] eureka-server built successfully
2025-01-01 10:00:05 [INFO] Building api-gateway
...
```

**Start Specific Service**

```bash
./scripts/paynext.sh start payment-service
```

Output:

```
2025-01-01 10:05:00 [INFO] Starting payment-service on port 8004...
2025-01-01 10:05:05 [INFO] [payment-service] started with PID 12345
2025-01-01 10:05:10 [SUCCESS] [payment-service] started successfully
```

**Check Service Status**

```bash
./scripts/paynext.sh list
```

Output:

```
Service              PID        Status
-------              ---        ------
eureka-server        12340      Running
api-gateway          12341      Running
user-service         12342      Running
payment-service      12345      Running
notification-service 12346      Running
```

**Stop All Services**

```bash
./scripts/paynext.sh stop
```

#### Log Files

Service logs are stored in `backend/logs/`:

```bash
# View service logs
tail -f backend/logs/payment-service.log

# View all logs
tail -f backend/logs/*.log
```

#### PID Files

Process IDs stored in `backend/pids/`:

```bash
# Check specific service PID
cat backend/pids/payment-service.pid
```

### manage-services.sh

Advanced service management with health checks and restart capabilities.

**Location**: `scripts/manage-services.sh`

#### Commands

| Command   | Arguments | Description                     | Example                                                |
| --------- | --------- | ------------------------------- | ------------------------------------------------------ |
| `start`   | [service] | Start service with health check | `./scripts/manage-services.sh start all`               |
| `stop`    | [service] | Gracefully stop service         | `./scripts/manage-services.sh stop api-gateway`        |
| `restart` | [service] | Restart service                 | `./scripts/manage-services.sh restart payment-service` |
| `status`  | -         | Show detailed service status    | `./scripts/manage-services.sh status`                  |
| `health`  | -         | Check health of all services    | `./scripts/manage-services.sh health`                  |
| `logs`    | service   | View service logs               | `./scripts/manage-services.sh logs user-service`       |

#### Examples

**Start All Services with Health Check**

```bash
./scripts/manage-services.sh start all
```

**Restart Specific Service**

```bash
./scripts/manage-services.sh restart api-gateway
```

**Check Service Health**

```bash
./scripts/manage-services.sh health
```

Output:

```
Checking service health...
✓ eureka-server: UP (http://localhost:8001/actuator/health)
✓ api-gateway: UP (http://localhost:8002/actuator/health)
✓ user-service: UP (http://localhost:8003/actuator/health)
✓ payment-service: UP (http://localhost:8004/actuator/health)
✓ notification-service: UP (http://localhost:8005/actuator/health)
```

## Testing CLI

### run_all_tests.sh

Comprehensive test runner for all project components.

**Location**: `scripts/run_all_tests.sh`

#### Usage

```bash
# Run all tests
./scripts/run_all_tests.sh

# Run with custom project directory
./scripts/run_all_tests.sh -d /path/to/project
```

#### Components Tested

- Backend services (Maven tests)
- Web frontend (Jest tests)
- Mobile frontend (Jest tests)
- Integration tests
- End-to-end tests

#### Example Output

```
======================================================================
 Starting All Component Test Run
======================================================================
2025-01-01 10:00:00 [INFO] Component: payment-service
2025-01-01 10:00:00 [INFO] Executing: mvn clean verify
2025-01-01 10:02:30 [SUCCESS] PASS: payment-service in 150s

======================================================================
 Test Summary (Audit Report)
======================================================================
Component            Status     Duration (s)
---------            ------     ------------
payment-service      PASS       150
user-service         PASS       120
web-frontend         PASS       45
mobile-frontend      PASS       60
api-gateway          PASS       90
notification-service PASS       75

All test suites passed successfully! System is compliant.
```

#### Test Reports

Test reports saved in:

- `test-logs/` - Test execution logs
- `test-reports/` - Coverage and detailed reports

```bash
# View test logs
cat test-logs/payment-service.log

# View coverage reports
open test-reports/payment-service-coverage/index.html
```

### run_tests.sh

Flexible test runner with filtering options.

**Location**: `scripts/run_tests.sh`

#### Options

| Flag | Description                      | Example              |
| ---- | -------------------------------- | -------------------- |
| `-s` | Specific service to test         | `-s payment-service` |
| `-t` | Test type (unit/integration/e2e) | `-t integration`     |
| `-c` | Generate coverage report         | `-c`                 |
| `-v` | Verbose output                   | `-v`                 |

#### Examples

**Run Unit Tests for Service**

```bash
./scripts/run_tests.sh -s user-service -t unit
```

**Run Integration Tests with Coverage**

```bash
./scripts/run_tests.sh -t integration -c
```

**Run All Tests Verbosely**

```bash
./scripts/run_tests.sh -v
```

## Database Management CLI

### db_manager.sh

Database administration tool for backup, restore, and maintenance.

**Location**: `scripts/db_manager.sh`

#### Commands

| Command   | Arguments            | Description         | Example                                                 |
| --------- | -------------------- | ------------------- | ------------------------------------------------------- |
| `create`  | database_name        | Create new database | `./scripts/db_manager.sh create test_db`                |
| `drop`    | database_name        | Drop database       | `./scripts/db_manager.sh drop test_db`                  |
| `backup`  | database_name [file] | Backup database     | `./scripts/db_manager.sh backup payment_db backup.sql`  |
| `restore` | database_name file   | Restore from backup | `./scripts/db_manager.sh restore payment_db backup.sql` |
| `list`    | -                    | List all databases  | `./scripts/db_manager.sh list`                          |
| `migrate` | database_name        | Run migrations      | `./scripts/db_manager.sh migrate user_db`               |

#### Examples

**Create Database**

```bash
./scripts/db_manager.sh create payment_db
```

**Backup Database**

```bash
./scripts/db_manager.sh backup payment_db /backups/payment_db_2025-01-01.sql
```

**Restore Database**

```bash
./scripts/db_manager.sh restore payment_db /backups/payment_db_2025-01-01.sql
```

**List Databases**

```bash
./scripts/db_manager.sh list
```

Output:

```
Databases:
- user_db (size: 45 MB)
- payment_db (size: 128 MB)
- notification_db (size: 23 MB)
- fraud_detection_db (size: 89 MB)
```

## Docker Management CLI

### docker-build-and-compose.sh

Build Docker images and manage Docker Compose stack.

**Location**: `scripts/docker-build-and-compose.sh`

#### Usage

```bash
# Build and start all services
./scripts/docker-build-and-compose.sh

# Build specific services
./scripts/docker-build-and-compose.sh user-service payment-service

# Force rebuild
./scripts/docker-build-and-compose.sh --rebuild
```

#### Options

| Flag         | Description              |
| ------------ | ------------------------ |
| `--rebuild`  | Force rebuild all images |
| `--no-cache` | Build without cache      |
| `--pull`     | Pull latest base images  |

#### Examples

**Build and Start Stack**

```bash
./scripts/docker-build-and-compose.sh
```

**Force Rebuild with No Cache**

```bash
./scripts/docker-build-and-compose.sh --rebuild --no-cache
```

### docker-auto-build-push.sh

Automated Docker image building and pushing to registry.

**Location**: `scripts/docker-auto-build-push.sh`

#### Usage

```bash
# Build and push all images
./scripts/docker-auto-build-push.sh

# Build and push specific service
./scripts/docker-auto-build-push.sh payment-service

# Specify registry
./scripts/docker-auto-build-push.sh --registry gcr.io/myproject
```

#### Environment Variables

| Variable          | Description         | Default     |
| ----------------- | ------------------- | ----------- |
| `DOCKER_REGISTRY` | Docker registry URL | `docker.io` |
| `IMAGE_TAG`       | Image tag           | `latest`    |
| `DOCKER_USERNAME` | Registry username   | -           |
| `DOCKER_PASSWORD` | Registry password   | -           |

#### Examples

**Build and Push to Docker Hub**

```bash
export DOCKER_REGISTRY=docker.io
export DOCKER_USERNAME=myusername
export DOCKER_PASSWORD=mypassword
./scripts/docker-auto-build-push.sh
```

**Build and Push with Custom Tag**

```bash
export IMAGE_TAG=v1.0.0
./scripts/docker-auto-build-push.sh
```

## Deployment CLI

### kubernetes-auto-deploy.sh

Automated Kubernetes deployment script.

**Location**: `scripts/kubernetes-auto-deploy.sh`

#### Usage

```bash
# Deploy to Kubernetes
./scripts/kubernetes-auto-deploy.sh

# Deploy to specific namespace
./scripts/kubernetes-auto-deploy.sh --namespace production

# Deploy with custom values
./scripts/kubernetes-auto-deploy.sh --values prod-values.yaml
```

#### Options

| Flag          | Description                  | Example                     |
| ------------- | ---------------------------- | --------------------------- |
| `--namespace` | Kubernetes namespace         | `--namespace production`    |
| `--values`    | Custom values file           | `--values prod-values.yaml` |
| `--dry-run`   | Simulate deployment          | `--dry-run`                 |
| `--rollback`  | Rollback to previous version | `--rollback`                |

#### Examples

**Deploy to Production**

```bash
./scripts/kubernetes-auto-deploy.sh \
  --namespace production \
  --values infrastructure/kubernetes/prod-values.yaml
```

**Dry Run Deployment**

```bash
./scripts/kubernetes-auto-deploy.sh --dry-run
```

**Rollback Deployment**

```bash
./scripts/kubernetes-auto-deploy.sh --rollback --namespace production
```

### Development Environment Setup

**dev_environment_setup.sh**

Automated development environment setup.

**Location**: `scripts/dev_environment_setup.sh`

#### Usage

```bash
# Run setup
./scripts/dev_environment_setup.sh
```

This script:

1. Checks system prerequisites (Java, Maven, Node.js, Docker)
2. Installs missing dependencies
3. Configures environment variables
4. Initializes databases
5. Builds all services
6. Starts development environment

#### Example

```bash
./scripts/dev_environment_setup.sh
```

Output:

```
Checking prerequisites...
✓ Java 17 found
✓ Maven 3.8.6 found
✓ Node.js 18.12.0 found
✓ Docker 20.10.21 found

Setting up environment...
✓ Created .env file
✓ Started MySQL container
✓ Started Redis container
✓ Started RabbitMQ container

Building services...
✓ Built eureka-server
✓ Built api-gateway
✓ Built user-service
✓ Built payment-service

Development environment ready!

Access points:
- Web Dashboard: http://localhost:3000
- API Gateway: http://localhost:8002
- Eureka: http://localhost:8001
```

## Common CLI Patterns

### Chaining Commands

```bash
# Build, start, and check status
./scripts/paynext.sh build && \
./scripts/paynext.sh start && \
./scripts/paynext.sh list
```

### Running Tests After Build

```bash
# Build and test
./scripts/paynext.sh build && \
./scripts/run_all_tests.sh
```

### Backup Before Deployment

```bash
# Backup databases before deploy
./scripts/db_manager.sh backup user_db && \
./scripts/db_manager.sh backup payment_db && \
./scripts/kubernetes-auto-deploy.sh
```

## Logging and Debugging

### Enable Verbose Logging

```bash
# Set log level
export LOG_LEVEL=DEBUG

# Run command with verbose output
./scripts/paynext.sh start 2>&1 | tee service-start.log
```

### View Real-time Logs

```bash
# Follow service logs
tail -f backend/logs/payment-service.log

# Follow all logs
tail -f backend/logs/*.log

# Docker logs
docker-compose logs -f payment-service
```

## Environment Variables

### Common Variables

| Variable                 | Description            | Default           |
| ------------------------ | ---------------------- | ----------------- |
| `PAYNEXT_HOME`           | Project root directory | Current directory |
| `LOG_LEVEL`              | Logging level          | `INFO`            |
| `SPRING_PROFILES_ACTIVE` | Spring profile         | `dev`             |
| `DOCKER_REGISTRY`        | Docker registry        | `docker.io`       |

### Setting Variables

```bash
# Temporary (current session)
export SPRING_PROFILES_ACTIVE=prod

# Permanent (add to ~/.bashrc or ~/.zshrc)
echo 'export SPRING_PROFILES_ACTIVE=prod' >> ~/.bashrc
source ~/.bashrc
```

## Troubleshooting CLI Issues

### Permission Denied

```bash
# Make scripts executable
chmod +x scripts/*.sh
```

### Command Not Found

```bash
# Add scripts to PATH
export PATH="$PATH:$(pwd)/scripts"
```

### Service Won't Start

```bash
# Check logs
cat backend/logs/service-name.log

# Check if port is in use
lsof -i :8004

# Kill process on port
kill $(lsof -t -i:8004)
```

## Next Steps

- [Usage Guide](USAGE.md) - Common usage workflows
- [Configuration](CONFIGURATION.md) - Environment configuration
- [Troubleshooting](TROUBLESHOOTING.md) - Problem resolution

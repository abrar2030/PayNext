# PayNext Automation Scripts

This directory contains automation scripts designed to streamline development workflows for the PayNext repository.

## Available Scripts

### 1. Developer Environment Setup (`dev_environment_setup.sh`)

A unified script that automates the complete setup process for the PayNext development environment, including:

- Prerequisites checking
- Environment variables configuration
- Infrastructure services (MySQL, MongoDB, RabbitMQ, Redis)
- Backend services build and startup
- Frontend applications build and startup

**Usage:**

```bash
./dev_environment_setup.sh
```

### 2. Testing Automation (`run_tests.sh`)

An enhanced testing script that provides comprehensive test execution across all components:

- Backend unit and integration tests
- Frontend unit and end-to-end tests
- Test report generation
- Selective component testing

**Usage:**

```bash
# Run all tests
./run_tests.sh

# Run specific test types
./run_tests.sh --type unit
./run_tests.sh --type integration
./run_tests.sh --type e2e

# Run tests for specific components
./run_tests.sh --component backend
./run_tests.sh --component web-frontend
./run_tests.sh --component mobile-frontend

# Run tests for specific backend service
./run_tests.sh --component backend --service user-service

# Generate HTML test report
./run_tests.sh --report
```

### 3. Database Management (`db_manager.sh`)

A comprehensive database management script for development databases:

- Database initialization
- Schema migration
- Data seeding
- Backup and restore
- Database reset

**Usage:**

```bash
# MySQL operations
./db_manager.sh mysql-init
./db_manager.sh mysql-migrate [migrations_directory]
./db_manager.sh mysql-seed [seed_file]
./db_manager.sh mysql-backup [backup_directory]
./db_manager.sh mysql-restore <backup_file>
./db_manager.sh mysql-reset

# MongoDB operations
./db_manager.sh mongodb-init
./db_manager.sh mongodb-seed [seed_file]
./db_manager.sh mongodb-backup [backup_directory]
./db_manager.sh mongodb-restore <backup_file>
./db_manager.sh mongodb-reset

# Combined operations
./db_manager.sh init-all
./db_manager.sh seed-all
./db_manager.sh backup-all [backup_directory]
./db_manager.sh reset-all
```

## Cross-Platform Compatibility

These scripts are designed to work across different operating systems:

- Linux
- macOS
- Windows (via Git Bash, WSL, or similar Unix-like environment)

## Prerequisites

The scripts will check for and inform you about any missing prerequisites, which may include:

- Java 17+
- Maven
- Node.js and npm
- Docker and Docker Compose
- MySQL client
- MongoDB shell
- Netcat (for service health checks)

## Getting Started

1. Make the scripts executable:

   ```bash
   chmod +x dev_environment_setup.sh run_tests.sh db_manager.sh
   ```

2. Run the developer environment setup:

   ```bash
   ./dev_environment_setup.sh
   ```

3. Run tests:

   ```bash
   ./run_tests.sh
   ```

4. Manage databases:
   ```bash
   ./db_manager.sh init-all
   ```

## Troubleshooting

If you encounter any issues:

1. Check that all prerequisites are installed
2. Ensure Docker services are running
3. Check log files in the respective directories
4. Verify environment variables in the `.env` file

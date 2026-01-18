# Troubleshooting Guide

Common issues and solutions for PayNext platform.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Service Startup Issues](#service-startup-issues)
- [Database Issues](#database-issues)
- [API & Integration Issues](#api--integration-issues)
- [Performance Issues](#performance-issues)
- [Security Issues](#security-issues)

## Installation Issues

### Maven Build Failures

**Problem**: `mvn clean install` fails with compilation errors

**Solutions**:

```bash
# Ensure Java 17 is installed
java -version

# Clean Maven cache
rm -rf ~/.m2/repository
mvn clean install

# Skip tests if needed
mvn clean install -DskipTests
```

### Node.js Dependency Issues

**Problem**: `npm install` fails

**Solutions**:

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Use specific Node version
nvm install 18
nvm use 18
```

### Docker Installation Issues

**Problem**: Docker containers won't start

**Solutions**:

```bash
# Check Docker is running
docker info

# Increase Docker memory (min 8GB)
# Docker Desktop → Settings → Resources → Memory

# Remove old containers and volumes
docker-compose down -v
docker system prune -a
```

## Service Startup Issues

### Port Already in Use

**Problem**: `Address already in use: bind`

**Solutions**:

```bash
# Find process using port
lsof -i :8002  # Replace with your port

# Kill process
kill -9 <PID>

# Or use different port
export API_GATEWAY_PORT=8082
./scripts/paynext.sh start api-gateway
```

### Eureka Server Connection Failure

**Problem**: Services can't connect to Eureka

**Solutions**:

```bash
# 1. Verify Eureka is running
curl http://localhost:8001

# 2. Check Eureka URL in config
echo $EUREKA_CLIENT_SERVICEURL_DEFAULTZONE

# 3. Restart Eureka first
./scripts/paynext.sh stop eureka-server
./scripts/paynext.sh start eureka-server

# Wait 30 seconds then start other services
```

### Service Registration Issues

**Problem**: Services not showing in Eureka dashboard

**Solutions**:

```bash
# 1. Check service logs
cat backend/logs/user-service.log

# 2. Verify Eureka configuration
cat backend/user-service/src/main/resources/application.properties

# 3. Ensure prefer-ip-address is true
eureka.instance.prefer-ip-address=true
```

## Database Issues

### Connection Refused

**Problem**: `java.sql.SQLException: Connection refused`

**Solutions**:

```bash
# 1. Start MySQL container
docker-compose up -d mysql

# 2. Verify MySQL is running
docker ps | grep mysql

# 3. Test connection
docker exec -it mysql mysql -u root -p

# 4. Check connection string
echo $USER_DB_URL
```

### Database Not Found

**Problem**: `Unknown database 'user_db'`

**Solutions**:

```bash
# Create databases manually
docker exec -it mysql mysql -u root -p

CREATE DATABASE IF NOT EXISTS user_db;
CREATE DATABASE IF NOT EXISTS payment_db;
CREATE DATABASE IF NOT EXISTS notification_db;
```

### Migration Failures

**Problem**: Flyway/Liquibase migration errors

**Solutions**:

```bash
# Drop and recreate database (DEV ONLY)
docker exec -it mysql mysql -u root -p -e "DROP DATABASE user_db; CREATE DATABASE user_db;"

# Or repair migration
mvn flyway:repair
```

## API & Integration Issues

### 401 Unauthorized

**Problem**: API returns 401 Unauthorized

**Solutions**:

```bash
# 1. Verify token is included
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8002/api/payments

# 2. Check token expiry
# Tokens expire after 1 hour, login again

# 3. Verify JWT secret matches
echo $JWT_SECRET
```

### 404 Not Found

**Problem**: API endpoint returns 404

**Solutions**:

```bash
# 1. Check service is registered
curl http://localhost:8001/eureka/apps

# 2. Verify correct URL
# Use: http://localhost:8002/api/payments
# Not: http://localhost:8004/api/payments

# 3. Check Gateway routing
cat backend/api-gateway/src/main/resources/application.properties
```

### CORS Issues

**Problem**: CORS policy blocking requests

**Solutions**:

```bash
# Add CORS configuration in API Gateway
cors.allowed-origins=http://localhost:3000
cors.allowed-methods=GET,POST,PUT,DELETE
cors.allowed-headers=*
```

## Performance Issues

### Slow API Response

**Problem**: API requests taking too long

**Solutions**:

```bash
# 1. Check database connection pool
spring.datasource.hikari.maximum-pool-size=10

# 2. Enable caching
spring.cache.type=redis

# 3. Monitor with Actuator
curl http://localhost:8002/actuator/metrics/http.server.requests
```

### Out of Memory Errors

**Problem**: `java.lang.OutOfMemoryError`

**Solutions**:

```bash
# Increase JVM heap size
export JAVA_OPTS="-Xms512m -Xmx2048m"

# Or in Docker Compose
environment:
  - JAVA_OPTS=-Xms512m -Xmx2048m
```

### High CPU Usage

**Problem**: Services consuming high CPU

**Solutions**:

```bash
# 1. Profile application
jstack <PID>

# 2. Check for infinite loops
# Review recent code changes

# 3. Scale horizontally
kubectl scale deployment payment-service --replicas=3
```

## Security Issues

### JWT Token Issues

**Problem**: Invalid or expired tokens

**Solutions**:

```bash
# 1. Generate new secret
openssl rand -base64 32

# 2. Update .env
JWT_SECRET=<new_secret>

# 3. Restart services
./scripts/paynext.sh stop && ./scripts/paynext.sh start
```

### SSL/TLS Errors

**Problem**: HTTPS connection errors

**Solutions**:

```bash
# 1. Check certificate validity
openssl x509 -in cert.pem -text -noout

# 2. Update certificates
# Copy new cert.pem and key.pem

# 3. Restart services
```

## Common Error Messages

| Error                                   | Cause                        | Solution                    |
| --------------------------------------- | ---------------------------- | --------------------------- |
| `BeanCreationException`                 | Dependency injection failure | Check autowired beans       |
| `BindException: Address already in use` | Port conflict                | Kill process or change port |
| `UnknownHostException`                  | DNS resolution failure       | Check service names         |
| `TimeoutException`                      | Service not responding       | Check service health        |
| `DataAccessException`                   | Database error               | Check DB connection         |

## Logging & Debugging

### Enable Debug Logging

```bash
# In .env
LOGGING_LEVEL_ROOT=DEBUG
LOGGING_LEVEL_FINTECH=TRACE

# Restart services
```

### View Service Logs

```bash
# Local deployment
tail -f backend/logs/payment-service.log

# Docker
docker-compose logs -f payment-service

# Kubernetes
kubectl logs -f payment-service-pod-name
```

### Health Checks

```bash
# Check all services
curl http://localhost:8001  # Eureka
curl http://localhost:8002/actuator/health  # Gateway
curl http://localhost:8003/actuator/health  # User Service
```

## Getting Help

- **GitHub Issues**: [Report bugs](https://github.com/quantsingularity/PayNext/issues)
- **Documentation**: [Full docs](README.md)
- **Logs**: Always include logs when reporting issues

## Next Steps

- [Configuration Guide](CONFIGURATION.md)
- [Installation Guide](INSTALLATION.md)
- [API Reference](API.md)

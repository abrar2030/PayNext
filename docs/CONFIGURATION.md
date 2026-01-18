# Configuration Guide

Complete configuration reference for PayNext platform services and components.

## Table of Contents

- [Environment Variables](#environment-variables)
- [Service Configuration](#service-configuration)
- [Database Configuration](#database-configuration)
- [Security Configuration](#security-configuration)
- [Integration Configuration](#integration-configuration)

## Environment Variables

### Core Configuration

Configuration file: `backend/.env`

| Option                               | Type   | Default                       | Description                             | Where to set (env/file) |
| ------------------------------------ | ------ | ----------------------------- | --------------------------------------- | ----------------------- |
| SPRING_PROFILES_ACTIVE               | string | dev                           | Active Spring profile (dev, test, prod) | .env file               |
| JWT_SECRET                           | string | -                             | JWT signing secret (min 256 bits)       | .env file (required)    |
| EUREKA_CLIENT_SERVICEURL_DEFAULTZONE | string | http://localhost:8001/eureka/ | Eureka server URL                       | .env file               |

### Database Configuration

| Option              | Type   | Default                                        | Description                                                | Where to set (env/file) |
| ------------------- | ------ | ---------------------------------------------- | ---------------------------------------------------------- | ----------------------- |
| USER_DB_URL         | string | jdbc:mysql://localhost:3306/user_db            | User service database URL                                  | .env file               |
| USER_DB_USERNAME    | string | root                                           | Database username                                          | .env file               |
| USER_DB_PASSWORD    | string | -                                              | Database password                                          | .env file (required)    |
| PAYMENT_DB_URL      | string | jdbc:mysql://localhost:3306/payment_db         | Payment service database URL                               | .env file               |
| PAYMENT_DB_USERNAME | string | root                                           | Database username                                          | .env file               |
| PAYMENT_DB_PASSWORD | string | -                                              | Database password                                          | .env file (required)    |
| FRAUD_DB_URL        | string | jdbc:mysql://localhost:3306/fraud_detection_db | Fraud detection database URL                               | .env file               |
| NOTIFICATION_DB_URL | string | jdbc:mysql://localhost:3306/notification_db    | Notification service database URL                          | .env file               |
| JPA_DDL_AUTO        | string | update                                         | JPA DDL mode (none, validate, update, create, create-drop) | .env file               |

### Email Configuration

| Option        | Type    | Default        | Description                | Where to set (env/file) |
| ------------- | ------- | -------------- | -------------------------- | ----------------------- |
| MAIL_HOST     | string  | smtp.gmail.com | SMTP server host           | .env file               |
| MAIL_PORT     | integer | 587            | SMTP server port           | .env file               |
| MAIL_USERNAME | string  | -              | SMTP username              | .env file (required)    |
| MAIL_PASSWORD | string  | -              | SMTP password/app password | .env file (required)    |

### Redis Configuration

| Option     | Type    | Default   | Description       | Where to set (env/file) |
| ---------- | ------- | --------- | ----------------- | ----------------------- |
| REDIS_HOST | string  | localhost | Redis server host | .env file               |
| REDIS_PORT | integer | 6379      | Redis server port | .env file               |

### Kafka Configuration

| Option                  | Type   | Default        | Description             | Where to set (env/file) |
| ----------------------- | ------ | -------------- | ----------------------- | ----------------------- |
| KAFKA_BOOTSTRAP_SERVERS | string | localhost:9092 | Kafka bootstrap servers | .env file               |

### Service Ports

| Option                       | Type    | Default | Description                  | Where to set (env/file) |
| ---------------------------- | ------- | ------- | ---------------------------- | ----------------------- |
| EUREKA_PORT                  | integer | 8001    | Eureka server port           | .env file               |
| API_GATEWAY_PORT             | integer | 8002    | API Gateway port             | .env file               |
| USER_SERVICE_PORT            | integer | 8003    | User service port            | .env file               |
| PAYMENT_SERVICE_PORT         | integer | 8004    | Payment service port         | .env file               |
| NOTIFICATION_SERVICE_PORT    | integer | 8005    | Notification service port    | .env file               |
| FRAUD_DETECTION_SERVICE_PORT | integer | 8006    | Fraud detection service port | .env file               |

### Logging Configuration

| Option                | Type   | Default | Description               | Where to set (env/file) |
| --------------------- | ------ | ------- | ------------------------- | ----------------------- |
| LOGGING_LEVEL_ROOT    | string | INFO    | Root logging level        | .env file               |
| LOGGING_LEVEL_FINTECH | string | DEBUG   | Application logging level | .env file               |

### Security Configuration

| Option             | Type    | Default | Description                   | Where to set (env/file) |
| ------------------ | ------- | ------- | ----------------------------- | ----------------------- |
| SECURITY_ENABLED   | boolean | true    | Enable/disable security       | .env file               |
| H2_CONSOLE_ENABLED | boolean | true    | Enable H2 console in dev mode | .env file               |
| EUREKA_ENABLED     | boolean | true    | Enable/disable Eureka client  | .env file               |

## Service Configuration

### API Gateway Configuration

**File**: `backend/api-gateway/src/main/resources/application.properties`

```properties
# Server
server.port=8002

# Eureka
eureka.client.service-url.defaultZone=${EUREKA_CLIENT_SERVICEURL_DEFAULTZONE:http://localhost:8001/eureka/}
eureka.instance.prefer-ip-address=true

# Application
spring.application.name=api-gateway

# JWT
jwt.secret=${JWT_SECRET:defaultSecretKeyForDevelopment}
jwt.expiration-time=3600000

# Web Application Type
spring.main.web-application-type=reactive
```

### User Service Configuration

**File**: `backend/user-service/src/main/resources/application.properties`

```properties
# Server
server.port=8003

# Database
spring.datasource.url=${USER_DB_URL}
spring.datasource.username=${USER_DB_USERNAME}
spring.datasource.password=${USER_DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=${JPA_DDL_AUTO:update}

# Eureka
eureka.client.service-url.defaultZone=${EUREKA_CLIENT_SERVICEURL_DEFAULTZONE}
spring.application.name=user-service
```

### Payment Service Configuration

**File**: `backend/payment-service/src/main/resources/application.properties`

```properties
# Server
server.port=8004

# Database
spring.datasource.url=${PAYMENT_DB_URL}
spring.datasource.username=${PAYMENT_DB_USERNAME}
spring.datasource.password=${PAYMENT_DB_PASSWORD}

# Redis Cache
spring.redis.host=${REDIS_HOST:localhost}
spring.redis.port=${REDIS_PORT:6379}

# Kafka
spring.kafka.bootstrap-servers=${KAFKA_BOOTSTRAP_SERVERS:localhost:9092}
```

## Docker Configuration

### Docker Compose

**File**: `docker-compose.yml`

Key configuration sections:

```yaml
services:
  api-gateway:
    environment:
      - EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8001/eureka/
      - JWT_SECRET=${JWT_SECRET:-changeme}
    ports:
      - "8002:8002"
    networks:
      - fintech-network
```

### Docker Environment

Create `.env` file in project root:

```bash
# Docker configuration
COMPOSE_PROJECT_NAME=paynext
DOCKER_REGISTRY=docker.io

# Service versions
EUREKA_IMAGE_TAG=latest
GATEWAY_IMAGE_TAG=latest
```

## Kubernetes Configuration

### Helm Values

**File**: `infrastructure/kubernetes/values.yaml`

```yaml
# Global settings
global:
  environment: production
  registry: docker.io/quantsingularity

# Service replicas
replicaCount:
  apiGateway: 3
  userService: 2
  paymentService: 3

# Resource limits
resources:
  limits:
    cpu: 1000m
    memory: 1Gi
  requests:
    cpu: 500m
    memory: 512Mi

# Ingress
ingress:
  enabled: true
  host: api.paynext.com
  tls:
    enabled: true
    secretName: paynext-tls
```

## Database Configuration

### MySQL Configuration

**Connection String Format**:

```
jdbc:mysql://<host>:<port>/<database>?useSSL=false&allowPublicKeyRetrieval=true
```

**Recommended Settings**:

```properties
# Connection pool
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000

# Performance
spring.jpa.properties.hibernate.jdbc.batch_size=20
spring.jpa.properties.hibernate.order_inserts=true
spring.jpa.properties.hibernate.order_updates=true
```

## Security Configuration

### JWT Configuration

```properties
# JWT Settings
jwt.secret=${JWT_SECRET}
jwt.expiration-time=3600000
jwt.refresh-expiration=86400000
```

**Generating Secure JWT Secret**:

```bash
# Generate 256-bit secret
openssl rand -base64 32
```

### CORS Configuration

```properties
# CORS
cors.allowed-origins=http://localhost:3000,https://paynext.com
cors.allowed-methods=GET,POST,PUT,DELETE
cors.allowed-headers=*
cors.max-age=3600
```

## Integration Configuration

### Payment Gateway Integration

```properties
# Stripe
stripe.api.key=${STRIPE_API_KEY}
stripe.webhook.secret=${STRIPE_WEBHOOK_SECRET}

# PayPal
paypal.client.id=${PAYPAL_CLIENT_ID}
paypal.client.secret=${PAYPAL_CLIENT_SECRET}
paypal.mode=sandbox
```

### Email Service

```properties
# Gmail SMTP
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

### ML Services

```properties
# Fraud Detection Service
fraud.detection.url=http://localhost:5000
fraud.detection.timeout=5000

# Credit Scoring Service
credit.scoring.url=http://localhost:5005
credit.scoring.timeout=3000
```

## Monitoring Configuration

### Prometheus

```yaml
# prometheus.yml
scrape_configs:
  - job_name: "paynext-services"
    metrics_path: "/actuator/prometheus"
    static_configs:
      - targets:
          - "api-gateway:8002"
          - "user-service:8003"
          - "payment-service:8004"
```

### Grafana

```yaml
# grafana-datasource.yml
datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
```

## Performance Tuning

### JVM Options

```bash
# Production JVM settings
JAVA_OPTS="-Xms512m -Xmx1024m -XX:+UseG1GC -XX:MaxGCPauseMillis=200"
```

### Spring Boot Actuator

```properties
# Actuator endpoints
management.endpoints.web.exposure.include=health,info,metrics,prometheus
management.endpoint.health.show-details=when-authorized
```

## Example Configuration Files

### Development (.env.dev)

```bash
SPRING_PROFILES_ACTIVE=dev
JWT_SECRET=dev-secret-key-for-development-only
USER_DB_URL=jdbc:mysql://localhost:3306/user_db
PAYMENT_DB_URL=jdbc:mysql://localhost:3306/payment_db
MAIL_HOST=smtp.mailtrap.io
LOGGING_LEVEL_ROOT=DEBUG
```

### Production (.env.prod)

```bash
SPRING_PROFILES_ACTIVE=prod
JWT_SECRET=${SECRET_FROM_VAULT}
USER_DB_URL=jdbc:mysql://prod-db.example.com:3306/user_db
PAYMENT_DB_URL=jdbc:mysql://prod-db.example.com:3306/payment_db
MAIL_HOST=smtp.sendgrid.net
LOGGING_LEVEL_ROOT=INFO
```

## Configuration Best Practices

1. **Never commit `.env` files** - Use `.env.example` as template
2. **Use environment-specific profiles** - dev, test, prod
3. **Store secrets securely** - Use vault services (AWS Secrets Manager, HashiCorp Vault)
4. **Validate configuration** - Check configs before deployment
5. **Document all options** - Keep configuration documented
6. **Use strong JWT secrets** - Minimum 256-bit keys
7. **Enable SSL/TLS** - Always in production
8. **Configure rate limiting** - Protect against abuse
9. **Set connection timeouts** - Prevent hanging connections
10. **Monitor configuration changes** - Track config modifications

## Next Steps

- [Installation Guide](INSTALLATION.md) - Setup instructions
- [CLI Reference](CLI.md) - Command-line tools
- [Troubleshooting](TROUBLESHOOTING.md) - Configuration issues

# Use a lightweight base image with OpenJDK
FROM openjdk:11

# Set working directory
WORKDIR /app

# Add the built JAR files for each module
# Note: You should build the project first to generate JARs for each module.
ADD backend/eureka-server/target/eureka-server-1.0.0.jar eureka-server.jar
ADD backend/api-gateway/target/api-gateway-1.0.0.jar api-gateway.jar
ADD backend/user-service/target/user-service-1.0.0.jar user-service.jar
ADD backend/payment-service/target/payment-service-1.0.0.jar payment-service.jar
ADD backend/notification-service/target/notification-service-1.0.0.jar notification-service.jar

# Expose ports for each service
EXPOSE 8001 8002 8003 8004 8005

# Define an entrypoint script to allow choosing which module to run
COPY start-service.sh /app/start-service.sh
RUN chmod +x /app/start-service.sh
ENTRYPOINT ["/app/start-service.sh"]
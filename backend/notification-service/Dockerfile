# Use a lightweight base image with OpenJDK
FROM openjdk:17-jdk-alpine

# Copy the built JAR file from the host into the Docker image
COPY target/notification-service-1.0.0.jar ./notification-service.jar

# Expose the Notification Service port
EXPOSE 8005

# Define the entrypoint to run the Notification Service
ENTRYPOINT ["java", "-jar", "notification-service.jar"]

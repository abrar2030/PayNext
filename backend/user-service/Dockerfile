# Use a lightweight base image with OpenJDK
FROM openjdk:17-jdk-alpine

# Copy the built JAR file from the host into the Docker image
COPY target/user-service-1.0.0.jar ./user-service.jar

# Expose the User Service port
EXPOSE 8003

# Define the entrypoint to run the User Service
ENTRYPOINT ["java", "-jar", "user-service.jar"]

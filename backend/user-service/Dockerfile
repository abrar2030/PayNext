# Use a lightweight base image with OpenJDK
FROM openjdk:17-jdk-alpine

# Set the working directory
WORKDIR /app

# Copy the built JAR file from the host into the Docker image
COPY user-service/target/user-service-1.0.0.jar ./user-service.jar

# Expose the Eureka Server port (default: 8761)
EXPOSE 8760

# Define the entrypoint to run the Eureka Server
ENTRYPOINT ["java", "-jar", "user-service.jar"]

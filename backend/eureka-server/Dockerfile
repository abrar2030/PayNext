# Use a lightweight base image with OpenJDK
FROM openjdk:17-jdk-alpine

# Copy the built JAR file from the host into the Docker image
COPY target/eureka-server-1.0.0.jar eureka-server.jar

# Expose the Eureka Server port
EXPOSE 8001

# Define the entrypoint to run the Eureka Server
ENTRYPOINT ["java", "-jar", "eureka-server.jar"]

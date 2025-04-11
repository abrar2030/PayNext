# Use a lightweight base image with OpenJDK
FROM openjdk:17-jdk-alpine

# Copy the built JAR file from the host into the Docker image
COPY target/payment-service-1.0.0.jar ./payment-service.jar

# Expose the Payment Service port
EXPOSE 8004

# Define the entrypoint to run the Payment Service
ENTRYPOINT ["java", "-jar", "payment-service.jar"]

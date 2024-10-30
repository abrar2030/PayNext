# Use a lightweight base image with OpenJDK
FROM openjdk:11

# Add the built JAR file from the host into the Docker image
ADD target/payment-service-1.0.0.jar ./payment-service.jar

# Expose the Eureka Server port (default: 8001)
EXPOSE 8004

# Define the entrypoint to run the Eureka Server
ENTRYPOINT ["java", "-jar", "payment-service.jar"]
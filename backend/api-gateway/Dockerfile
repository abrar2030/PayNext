# Stage 1: Build
FROM maven:3.8.6-openjdk-17 AS builder

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src

RUN mvn clean package -DskipTests

# Stage 2: Run
FROM openjdk:17-jdk-alpine

ENV JAVA_OPTS=""

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

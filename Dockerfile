FROM openjdk:11

WORKDIR /app

ADD backend/eureka-server/target/eureka-server-1.0.0.jar eureka-server.jar
ADD backend/api-gateway/target/api-gateway-1.0.0.jar api-gateway.jar
ADD backend/user-service/target/user-service-1.0.0.jar user-service.jar
ADD backend/payment-service/target/payment-service-1.0.0.jar payment-service.jar
ADD backend/notification-service/target/notification-service-1.0.0.jar notification-service.jar

EXPOSE 8001 8002 8003 8004 8005

COPY start-service.sh /app/start-service.sh
RUN chmod +x /app/start-service.sh
ENTRYPOINT ["/app/start-service.sh"]

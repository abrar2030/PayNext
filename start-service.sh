#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: $0 {eureka-server|api-gateway|user-service|payment-service|notification-service}"
  exit 1
fi

case "$1" in
  eureka-server)
    java -jar eureka-server.jar
    ;;
  api-gateway)
    java -jar api-gateway.jar
    ;;
  user-service)
    java -jar user-service.jar
    ;;
  payment-service)
    java -jar payment-service.jar
    ;;
  notification-service)
    java -jar notification-service.jar
    ;;
  *)
    echo "Invalid service name: $1"
    echo "Usage: $0 {eureka-server|api-gateway|user-service|payment-service|notification-service}"
    exit 1
    ;;
esac

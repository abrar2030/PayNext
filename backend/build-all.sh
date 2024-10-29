#!/bin/bash

SERVICES=("eureka-server" "api-gateway" "user-service" "payment-service" "notification-service")

for SERVICE in "${SERVICES[@]}"
do
    echo "Building $SERVICE..."
    # shellcheck disable=SC2164
    cd /mnt/c/Users/36202/OneDrive/Desktop/PayNext/backend/"$SERVICE"
    mvn clean install
    # shellcheck disable=SC2181
    if [ $? -ne 0 ]; then
        echo "Build failed for $SERVICE. Exiting."
        exit 1
    fi
    echo "$SERVICE built successfully."
    cd ../..
done

echo "All services built successfully."

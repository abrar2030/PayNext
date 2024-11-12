# Project Overview

This file provides an overview of the directory structure of the **PayNext** project to help understand the organization of files and services in the project. The structure highlights the backend microservices, frontend application, and Kubernetes deployment configuration.

```
.
├── HELP.md
├── LICENSE
├── README.md
├── backend
│   ├── api-gateway
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   └── src
│   │       ├── main
│   │       │   ├── java
│   │       │   │   ├── ApiGatewayApplication.java
│   │       │   │   └── com
│   │       │   │       └── fintech
│   │       │   │           └── apigateway
│   │       │   │               ├── config
│   │       │   │               │   ├── RouteConfig.java
│   │       │   │               │   └── SecurityConfig.java
│   │       │   │               └── filter
│   │       │   │                   └── JwtAuthenticationFilter.java
│   │       │   └── resources
│   │       │       └── application.properties
│   │       └── test
│   ├── eureka-server
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   └── src
│   │       ├── main
│   │       │   ├── java
│   │       │   │   ├── EurekaServerApplication.java
│   │       │   │   └── com
│   │       │   │       └── fintech
│   │       │   │           └── eurekaserver
│   │       │   └── resources
│   │       │       └── application.properties
│   │       └── test
│   ├── notification-service
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   └── src
│   │       ├── main
│   │       │   ├── java
│   │       │   │   ├── NotificationServiceApplication.java
│   │       │   │   └── com
│   │       │   │       └── fintech
│   │       │   │           └── notificationservice
│   │       │   │               ├── controller
│   │       │   │               │   └── NotificationController.java
│   │       │   │               ├── model
│   │       │   │               │   └── NotificationRequest.java
│   │       │   │               └── service
│   │       │   │                   ├── EmailNotificationService.java
│   │       │   │                   └── NotificationService.java
│   │       │   └── resources
│   │       │       └── application.properties
│   │       └── test
│   ├── payment-service
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   └── src
│   │       ├── main
│   │       │   ├── java
│   │       │   │   ├── PaymentServiceApplication.java
│   │       │   │   └── com
│   │       │   │       └── fintech
│   │       │   │           └── paymentservice
│   │       │   │               ├── client
│   │       │   │               │   ├── NotificationClient.java
│   │       │   │               │   └── UserClient.java
│   │       │   │               ├── controller
│   │       │   │               │   └── PaymentController.java
│   │       │   │               ├── dto
│   │       │   │               │   └── UserDTO.java
│   │       │   │               ├── model
│   │       │   │               │   ├── NotificationRequest.java
│   │       │   │               │   └── Payment.java
│   │       │   │               ├── repository
│   │       │   │               │   └── PaymentRepository.java
│   │       │   │               └── service
│   │       │   │                   ├── PaymentService.java
│   │       │   │                   └── PaymentServiceImpl.java
│   │       │   └── resources
│   │       │       └── application.properties
│   │       └── test
│   ├── user-service
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   └── src
│   │       ├── main
│   │       │   ├── java
│   │       │   │   ├── UserServiceApplication.java
│   │       │   │   └── com
│   │       │   │       └── fintech
│   │       │   │           └── userservice
│   │       │   │               ├── config
│   │       │   │               │   └── SecurityConfig.java
│   │       │   │               ├── controller
│   │       │   │               │   └── UserController.java
│   │       │   │               ├── filter
│   │       │   │               │   └── JwtAuthenticationFilter.java
│   │       │   │               ├── model
│   │       │   │               │   └── User.java
│   │       │   │               ├── repository
│   │       │   │               │   └── UserRepository.java
│   │       │   │               ├── service
│   │       │   │               │   ├── UserDetailsServiceImpl.java
│   │       │   │               │   ├── UserPrincipal.java
│   │       │   │               │   ├── UserService.java
│   │       │   │               │   └── UserServiceImpl.java
│   │       │   │               └── util
│   │       │   │                   └── JwtUtil.java
│   │       │   └── resources
│   │       │       └── application.properties
│   │       └── test
├── frontend
│   ├── Dockerfile
│   ├── fintech-payment-frontend
│   │   ├── README.md
│   │   ├── public
│   │   │   ├── favicon.ico
│   │   │   ├── index.html
│   │   │   ├── logo192.png
│   │   │   ├── logo512.png
│   │   │   ├── manifest.json
│   │   │   └── robots.txt
│   │   └── src
│   │       ├── App.css
│   │       ├── App.js
│   │       ├── App.test.js
│   │       ├── components
│   │       │   ├── Auth
│   │       │   │   ├── Login.js
│   │       │   │   └── Register.js
│   │       │   ├── Dashboard
│   │       │   │   └── Dashboard.js
│   │       │   ├── Payments
│   │       │   │   ├── PaymentForm.js
│   │       │   │   └── PaymentHistory.js
│   │       │   └── Profile
│   │       │       └── Profile.js
│   │       ├── index.css
│   │       ├── index.js
│   │       ├── logo.svg
│   │       ├── reportWebVitals.js
│   │       ├── services
│   │       │   ├── AuthService.js
│   │       │   ├── PaymentService.js
│   │       │   └── UserService.js
│   │       └── setupTests.js
├── kubernetes
│   ├── Chart.yaml
│   ├── templates
│   │   ├── deployment-api-gateway.yaml
│   │   ├── deployment-eureka-server.yaml
│   │   ├── deployment-notification-service.yaml
│   │   ├── deployment-payment-service.yaml
│   │   ├── deployment-user-service.yaml
│   │   ├── service-api-gateway.yaml
│   │   ├── service-eureka-server.yaml
│   │   ├── service-notification-service.yaml
│   │   ├── service-payment-service.yaml
│   │   └── service-user-service.yaml
│   └── values.yaml
├── docker-compose.yml
└── build-and-run.sh
```
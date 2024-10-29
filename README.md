# Microservices-Based FinTech Payment Solution

## Overview

This project is a microservices-based payment solution built with Spring Boot and React.js. It consists of multiple backend microservices and a frontend application to provide a comprehensive FinTech payment platform.

## Table of Contents

- [Architecture](#architecture)
- [Services](#services)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Using the Application](#using-the-application)
- [API Endpoints](#api-endpoints)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Architecture

The application follows a microservices architecture, consisting of:

- **Eureka Server**: Service registry for microservices.
- **API Gateway**: Routes external requests to appropriate microservices.
- **User Service**: Manages user accounts and authentication.
- **Payment Service**: Handles payment transactions.
- **Notification Service**: Sends notifications to users.
- **Frontend Application**: Built with React.js to provide a user interface.

## Services

### Backend Services

- **Eureka Server** (`eureka-server`): Runs on port `8761`.
- **API Gateway** (`api-gateway`): Runs on port `8080`.
- **User Service** (`user-service`): Runs on port `9001`.
- **Payment Service** (`payment-service`): Runs on port `9002`.
- **Notification Service** (`notification-service`): Runs on port `9003`.

### Frontend Application

- **React.js Application** (`fintech-payment-frontend`): Runs on port `3000`.

## Prerequisites

- **Java 11** or higher installed.
- **Node.js** and **npm** installed.
- **Docker** and **Docker Compose** installed.
- **MySQL** (optional if not using Docker for databases).

## Installation

### Clone the Repository

```bash
git clone https://github.com/abrar2030/PayNext.git
cd PayNext

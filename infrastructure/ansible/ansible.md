# Ansible Documentation for PayNext Project

This documentation provides an overview of the Ansible playbooks, roles, and configurations used in the PayNext project to automate the deployment and configuration of various services. The directory structure, individual roles, and files are outlined for better understanding.

## Table of Contents

- [Directory Structure](#directory-structure)
- [Inventories](#inventories)
- [Roles](#roles)
- [Ansible Configuration](#ansible-configuration)
- [Playbooks](#playbooks)

## Directory Structure

The directory structure for Ansible in the PayNext project is as follows:

```
ansible/
├── ansible.cfg
├── inventories
│   ├── dev
│   │   ├── hosts
│   │   └── group_vars
│   │       └── all.yml
│   ├── staging
│   │   ├── hosts
│   │   └── group_vars
│   │       └── all.yml
│   └── prod
│       ├── hosts
│       └── group_vars
│           └── all.yml
├── playbooks
│   ├── deploy.yml
│   └── rollback.yml
└── roles
    ├── common
    │   ├── tasks
    │   │   └── main.yml
    │   ├── handlers
    │   │   └── main.yml
    │   ├── templates
    │   │   └── common_config.j2
    │   └── vars
    │       └── main.yml
    ├── api-gateway
    │   ├── tasks
    │   │   └── main.yml
    │   ├── handlers
    │   │   └── main.yml
    │   ├── templates
    │   │   └── api_gateway_config.j2
    │   └── vars
    │       └── main.yml
    ├── eureka-server
    │   ├── tasks
    │   │   └── main.yml
    │   ├── handlers
    │   │   └── main.yml
    │   ├── templates
    │   │   └── eureka_server_config.j2
    │   └── vars
    │       └── main.yml
    ├── notification-service
    │   ├── tasks
    │   │   └── main.yml
    │   ├── handlers
    │   │   └── main.yml
    │   ├── templates
    │   │   └── notification_config.j2
    │   └── vars
    │       └── main.yml
    ├── payment-service
    │   ├── tasks
    │   │   └── main.yml
    │   ├── handlers
    │   │   └── main.yml
    │   ├── templates
    │   │   └── payment_config.j2
    │   └── vars
    │       └── main.yml
    └── user-service
        ├── tasks
        │   └── main.yml
        ├── handlers
        │   └── main.yml
        ├── templates
        │   └── user_service_config.j2
        └── vars
            └── main.yml
```

## Inventories

The inventories are divided into three environments:

- **Development (dev)**: Contains inventory files and variables specific to the development environment.
- **Staging (staging)**: Contains inventory files and variables for the staging environment, used for testing before production.
- **Production (prod)**: Contains inventory files and variables for the production environment.

Each inventory folder includes a `hosts` file that lists the hosts in that environment, and a `group_vars` directory that contains global variables for the hosts.

## Roles

Roles are used to encapsulate the tasks, handlers, templates, and variables required to configure and deploy each service in the PayNext project.

### Common Role

The `common` role contains tasks, handlers, templates, and variables that are common across all services, such as setting up a common environment and installing dependencies.

- **Tasks**: The `main.yml` file in `tasks/` defines the common setup actions.
- **Handlers**: The `main.yml` file in `handlers/` defines handlers for tasks like service restart.
- **Templates**: The `common_config.j2` file contains a template for common configurations.
- **Vars**: The `main.yml` file in `vars/` defines variables shared across all services.

### API Gateway Role

The `api-gateway` role manages the deployment and configuration of the API Gateway service.

- **Tasks**: Defined in `tasks/main.yml`.
- **Handlers**: Handlers for the API Gateway, such as restarting the service.
- **Templates**: The `api_gateway_config.j2` file contains configuration specific to the API Gateway.
- **Vars**: Variables specific to the API Gateway are defined in `vars/main.yml`.

### Eureka Server Role

The `eureka-server` role is responsible for the Eureka server configuration and deployment.

- **Tasks**: The main deployment tasks are defined in `tasks/main.yml`.
- **Handlers**: Handlers such as service notifications.
- **Templates**: The `eureka_server_config.j2` file contains configuration for the Eureka server.
- **Vars**: Variables specific to the Eureka server are defined in `vars/main.yml`.

### Notification, Payment, and User Service Roles

These roles follow a similar structure to the `api-gateway` and `eureka-server` roles, with their own tasks, handlers, templates, and variables for deploying and configuring each service.

## Ansible Configuration

The `ansible.cfg` file contains the Ansible configuration for the PayNext project. This includes inventory paths, logging settings, and SSH options for the deployment.

Example `ansible.cfg`:

```ini
[defaults]
inventory      = ./inventories/dev/hosts
remote_user    = ubuntu
host_key_checking = False
```

## Playbooks

### deploy.yml

The `deploy.yml` playbook is used to deploy all services in the PayNext project. It runs the necessary roles to set up the infrastructure, configure each service, and ensure everything is running correctly.

### rollback.yml

The `rollback.yml` playbook is used to roll back deployments if any issues occur. It reverts services to the previous stable state.

## Usage Instructions

1. **Set Up Inventories**: Update the `hosts` and `group_vars` files in each inventory folder to reflect your environment's servers and settings.
2. **Run Playbook**: Use the following command to deploy:
   ```bash
   ansible-playbook playbooks/deploy.yml
   ```
3. **Rollback**: In case of issues, run the rollback playbook:
   ```bash
   ansible-playbook playbooks/rollback.yml
   ```

## Summary

The Ansible setup for the PayNext project is designed to facilitate easy deployment and configuration of all services. Each role is tailored to a specific microservice, ensuring modularity and ease of maintenance.

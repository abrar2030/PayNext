# PayNext Kubernetes Helm Chart

This directory contains the Helm chart for deploying the PayNext microservice application on a Kubernetes cluster.

### Key Changes:

*   **Consolidated Templates**: The separate `deployment-*.yaml` and `service-*.yaml` files for each microservice have been replaced with two generic, parameterized templates:
    *   `templates/_deployment.tpl`
    *   `templates/_service.tpl`
*   **Service-Centric Configuration**: All microservice-specific configurations (image, ports, replicas, probes) are now managed centrally in the `values.yaml` file under the `services` map.
*   **Enhanced Deployments**: The generic deployment template includes:
    *   Conditional inclusion of **Resource Limits and Requests** via the `resources` block in `values.yaml`.
    *   Conditional inclusion of **Liveness and Readiness Probes**, with sensible defaults provided for the Java-based services in `values.yaml` (assuming Spring Boot Actuator endpoints).

## Usage

### Prerequisites

*   Kubernetes cluster (v1.20+)
*   Helm (v3.0.0+)
*   `kubeconfig` file configured to connect to your cluster.

### Installation

1.  **Review Configuration**: Customize the `values.yaml` file to match your deployment environment, particularly the Docker image tags and service ports.
2.  **Install/Upgrade the Chart**:
    ```bash
    # Install the chart for the first time
    helm install paynext ./kubernetes -f ./kubernetes/values.yaml --namespace paynext --create-namespace

    # Upgrade an existing release
    helm upgrade paynext ./kubernetes -f ./kubernetes/values.yaml --namespace paynext
    ```

### Configuration

All microservice configurations are managed through the `services` map in `values.yaml`.

| Service Key | Description |
| :--- | :--- |
| `services.<name>.enabled` | Boolean to enable/disable deployment of the service. |
| `services.<name>.replicaCount` | Number of pod replicas for the service. |
| `services.<name>.image.repository` | Docker image repository (e.g., `abrar2030/backend-api-gateway`). |
| `services.<name>.image.tag` | Docker image tag (e.g., `latest` or a specific build number). |
| `services.<name>.service` | Kubernetes Service configuration (type, ports, nodePort). |
| `services.<name>.resources` | CPU/Memory requests and limits. |
| `services.<name>.livenessProbe` | Liveness probe configuration. |
| `services.<name>.readinessProbe` | Readiness probe configuration. |

---
**Note:** The original comprehensive README content (covering compliance, architecture, monitoring, etc.) has been preserved and is available in the full repository. This updated section focuses on the usage and configuration of the refactored Helm chart structure.


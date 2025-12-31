# Example 5: Kubernetes Deployment

Deploy PayNext to Kubernetes cluster using Helm.

## Prerequisites

- Kubernetes cluster (minikube, EKS, GKE, AKS)
- kubectl configured
- Helm 3 installed

## Quick Deployment

```bash
# 1. Add PayNext Helm chart
cd infrastructure/kubernetes

# 2. Create namespace
kubectl create namespace paynext

# 3. Install with Helm
helm install paynext . \
  --namespace paynext \
  --set image.tag=latest \
  --set replicaCount.apiGateway=2

# 4. Verify deployment
kubectl get pods -n paynext
kubectl get services -n paynext
```

## Custom Values

Create `prod-values.yaml`:

```yaml
replicaCount:
  apiGateway: 3
  userService: 2
  paymentService: 3

ingress:
  enabled: true
  host: api.paynext.com
  tls:
    enabled: true

resources:
  limits:
    cpu: 1000m
    memory: 1Gi
```

Deploy:

```bash
helm install paynext . -f prod-values.yaml --namespace paynext
```

## Monitoring

```bash
# Check service status
kubectl get all -n paynext

# View logs
kubectl logs -f deployment/payment-service -n paynext

# Scale service
kubectl scale deployment payment-service --replicas=5 -n paynext
```

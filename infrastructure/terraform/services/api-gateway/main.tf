provider "kubernetes" {
  config_path = "~/.kube/config"
}

resource "kubernetes_deployment" "api_gateway" {
  metadata {
    name      = "api-gateway"
    namespace = "default"
    labels = {
      app = "api-gateway"
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "api-gateway"
      }
    }

    template {
      metadata {
        labels = {
          app = "api-gateway"
        }
      }

      spec {
        container {
          name  = "api-gateway"
          image = "abrar2030/backend:api-gateway"

          ports {
            container_port = 8002
          }

          env {
            name  = "EUREKA_SERVER_URL"
            value = "http://eureka-server:8001/eureka"
          }
          env {
            name  = "JWT_SECRET"
            value = "your_jwt_secret_here"
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "api_gateway" {
  metadata {
    name      = "api-gateway"
    namespace = "default"
    labels = {
      app = "api-gateway"
    }
  }

  spec {
    selector = {
      app = "api-gateway"
    }

    port {
      port        = 8002
      target_port = 8002
    }

    type = "ClusterIP"
  }
}
# main.tf content placeholder

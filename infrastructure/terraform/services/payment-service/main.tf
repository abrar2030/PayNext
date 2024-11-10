provider "kubernetes" {
  config_path = "~/.kube/config"
}

resource "kubernetes_deployment" "payment_service" {
  metadata {
    name      = "payment-service"
    namespace = "default"
    labels = {
      app = "payment-service"
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "payment-service"
      }
    }

    template {
      metadata {
        labels = {
          app = "payment-service"
        }
      }

      spec {
        container {
          name  = "payment-service"
          image = "abrar2030/backend:payment-service"

          ports {
            container_port = 8004
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

resource "kubernetes_service" "payment_service" {
  metadata {
    name      = "payment-service"
    namespace = "default"
    labels = {
      app = "payment-service"
    }
  }

  spec {
    selector = {
      app = "payment-service"
    }

    port {
      port        = 8004
      target_port = 8004
    }

    type = "ClusterIP"
  }
}

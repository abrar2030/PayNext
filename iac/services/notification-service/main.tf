provider "kubernetes" {
  config_path = "~/.kube/config"
}

resource "kubernetes_deployment" "notification_service" {
  metadata {
    name      = "notification-service"
    namespace = "default"
    labels = {
      app = "notification-service"
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "notification-service"
      }
    }

    template {
      metadata {
        labels = {
          app = "notification-service"
        }
      }

      spec {
        container {
          name  = "notification-service"
          image = "abrar2030/backend:notification-service"

          ports {
            container_port = 8005
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

resource "kubernetes_service" "notification_service" {
  metadata {
    name      = "notification-service"
    namespace = "default"
    labels = {
      app = "notification-service"
    }
  }

  spec {
    selector = {
      app = "notification-service"
    }

    port {
      port        = 8005
      target_port = 8005
    }

    type = "ClusterIP"
  }
}

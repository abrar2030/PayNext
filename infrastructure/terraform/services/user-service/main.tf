provider "kubernetes" {
  config_path = "~/.kube/config"
}

resource "kubernetes_deployment" "user_service" {
  metadata {
    name      = "user-service"
    namespace = "default"
    labels = {
      app = "user-service"
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "user-service"
      }
    }

    template {
      metadata {
        labels = {
          app = "user-service"
        }
      }

      spec {
        container {
          name  = "user-service"
          image = "quantsingularity/backend:user-service"

          ports {
            container_port = 8003
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

resource "kubernetes_service" "user_service" {
  metadata {
    name      = "user-service"
    namespace = "default"
    labels = {
      app = "user-service"
    }
  }

  spec {
    selector = {
      app = "user-service"
    }

    port {
      port        = 8003
      target_port = 8003
    }

    type = "ClusterIP"
  }
}

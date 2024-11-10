provider "kubernetes" {
  config_path = "~/.kube/config"
}

resource "kubernetes_deployment" "eureka_server" {
  metadata {
    name      = "eureka-server"
    namespace = "default"
    labels = {
      app = "eureka-server"
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "eureka-server"
      }
    }

    template {
      metadata {
        labels = {
          app = "eureka-server"
        }
      }

      spec {
        container {
          name  = "eureka-server"
          image = "abrar2030/backend:eureka-server"

          ports {
            container_port = 8001
          }

          env {
            name  = "EUREKA_SERVER_PORT"
            value = "8001"
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "eureka_server" {
  metadata {
    name      = "eureka-server"
    namespace = "default"
    labels = {
      app = "eureka-server"
    }
  }

  spec {
    selector = {
      app = "eureka-server"
    }

    port {
      port        = 8001
      target_port = 8001
    }

    type = "ClusterIP"
  }
}

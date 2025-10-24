{{- define "paynext.service" -}}
{{- $service := .Values.services.{{ .serviceName }} -}}
apiVersion: v1
kind: Service
metadata:
  name: {{ .serviceName }}
  labels:
    {{- include "paynext.labels" . | nindent 4 }}
    app.kubernetes.io/component: {{ .serviceName }}
spec:
  type: {{ $service.service.type | default "ClusterIP" }}
  ports:
    {{- range $service.service.ports }}
    - port: {{ .port }}
      targetPort: {{ .targetPort }}
      protocol: {{ .protocol | default "TCP" }}
      {{- if .nodePort }}
      nodePort: {{ .nodePort }}
      {{- end }}
    {{- end }}
  selector:
    app.kubernetes.io/name: {{ include "paynext.name" . }}
    app.kubernetes.io/instance: {{ .Release.Name }}
    app.kubernetes.io/component: {{ .serviceName }}
{{- end -}}

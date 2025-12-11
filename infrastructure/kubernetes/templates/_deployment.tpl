{{- define "paynext.deployment" -}}
{{- $service := .Values.services.{{ .serviceName }} -}}
{{- $fullName := include "paynext.fullname" . -}}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .serviceName }}
  labels:
    {{- include "paynext.labels" . | nindent 4 }}
    app.kubernetes.io/component: {{ .serviceName }}
spec:
  replicas: {{ $service.replicaCount | default 1 }}
  selector:
    matchLabels:
      app.kubernetes.io/name: {{ include "paynext.name" . }}
      app.kubernetes.io/instance: {{ .Release.Name }}
      app.kubernetes.io/component: {{ .serviceName }}
  template:
    metadata:
      labels:
        {{- include "paynext.selectorLabels" . | nindent 8 }}
        app.kubernetes.io/component: {{ .serviceName }}
    spec:
      {{- with .Values.imagePullSecrets }}
      imagePullSecrets:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      serviceAccountName: {{ include "paynext.serviceAccountName" . }}
      securityContext:
        {{- toYaml .Values.podSecurityContext | nindent 8 }}
      containers:
        - name: {{ .serviceName }}
          securityContext:
            {{- toYaml .Values.securityContext | nindent 12 }}
          image: "{{ $service.image.repository }}:{{ $service.image.tag | default .Chart.AppVersion }}"
          imagePullPolicy: {{ $service.image.pullPolicy | default .Values.image.pullPolicy }}
          ports:
            {{- range $service.ports }}
            - name: {{ .name }}
              containerPort: {{ .containerPort }}
              protocol: {{ .protocol | default "TCP" }}
            {{- end }}
          env:
            {{- range $service.env }}
            - name: {{ .name }}
              value: {{ .value | quote }}
            {{- end }}
          {{- with $service.resources }}
          resources:
            {{- toYaml . | nindent 12 }}
          {{- end }}
          {{- with $service.livenessProbe }}
          livenessProbe:
            {{- toYaml . | nindent 12 }}
          {{- end }}
          {{- with $service.readinessProbe }}
          readinessProbe:
            {{- toYaml . | nindent 12 }}
          {{- end }}
      {{- with .Values.nodeSelector }}
      nodeSelector:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.affinity }}
      affinity:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.tolerations }}
      tolerations:
        {{- toYaml . | nindent 8 }}
      {{- end }}
{{- end -}}

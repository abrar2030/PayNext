{{- define "paynext.labels" -}}
app.kubernetes.io/name: {{ .Release.Name }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version }}
{{- end -}}

{{- define "paynext.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "paynext.fullname" -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}

{{- define "paynext.labels" -}}
helm.sh/chart: {{ include "paynext.chart" . }}
{{ include "paynext.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{- define "paynext.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "paynext.selectorLabels" -}}
app.kubernetes.io/name: {{ include "paynext.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}

{{- define "paynext.namespace" -}}
{{- .Values.global.namespace | default .Release.Namespace -}}
{{- end -}}

{{- define "paynext.serviceAccountName" -}}
{{- if .Values.serviceAccount.create -}}
    {{ default (include "paynext.fullname" .) .Values.serviceAccount.name }}
{{- else -}}
    {{ default "default" .Values.serviceAccount.name }}
{{- end -}}
{{- end -}}

{{- define "paynext.securityContext" -}}
{{- if .securityContext.enabled -}}
securityContext:
  runAsNonRoot: {{ .securityContext.runAsNonRoot }}
  runAsUser: {{ .securityContext.runAsUser }}
  {{- if .securityContext.fsGroup }}
  fsGroup: {{ .securityContext.fsGroup }}
  {{- end }}
  {{- if .securityContext.capabilities }}
  capabilities:
    {{- toYaml .securityContext.capabilities | nindent 4 }}
  {{- end }}
{{- end -}}
{{- end -}}

{{- define "paynext.resources" -}}
{{- if and .resources .resources.requests -}}
resources:
  {{- if .resources.requests }}
  requests:
    memory: {{ .resources.requests.memory | quote }}
    cpu: {{ .resources.requests.cpu | quote }}
  {{- end }}
  {{- if .resources.limits }}
  limits:
    memory: {{ .resources.limits.memory | quote }}
    cpu: {{ .resources.limits.cpu | quote }}
  {{- end }}
{{- end -}}
{{- end -}}

{{- define "paynext.probes" -}}
{{- if .livenessProbe.enabled -}}
livenessProbe:
  httpGet:
    path: /actuator/health
    port: {{ .service.port }}
  initialDelaySeconds: {{ .livenessProbe.initialDelaySeconds }}
  periodSeconds: {{ .livenessProbe.periodSeconds }}
  timeoutSeconds: {{ .livenessProbe.timeoutSeconds }}
  failureThreshold: {{ .livenessProbe.failureThreshold }}
{{- end -}}
{{- if .readinessProbe.enabled -}}
readinessProbe:
  httpGet:
    path: /actuator/health
    port: {{ .service.port }}
  initialDelaySeconds: {{ .readinessProbe.initialDelaySeconds }}
  periodSeconds: {{ .readinessProbe.periodSeconds }}
  timeoutSeconds: {{ .readinessProbe.timeoutSeconds }}
  failureThreshold: {{ .readinessProbe.failureThreshold }}
{{- end -}}
{{- end -}}

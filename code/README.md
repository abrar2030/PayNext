# PayNext - Backend Monorepo

```
code/
├── backend/           Java microservices (Spring Boot)
│   ├── api-gateway/         Port 8002 - reactive gateway + JWT validation
│   ├── common-module/       Shared JWT utilities + PasswordValidator
│   ├── eureka-server/       Port 8001 - service registry
│   ├── notification-service/ Port 8005 - email notifications (Thymeleaf)
│   ├── payment-service/     Port 8004 - payment processing
│   ├── user-service/        Port 8003 - auth, OTP, audit logging
│   └── pom.xml              Parent Maven POM
│
├── ml-services/       Python ML services (FastAPI)
│   ├── anomaly-detection-service/   Port 9002 - IsolationForest anomaly detection
│   ├── categorization-service/      Port 9005 - TF-IDF + SVC transaction categorization
│   ├── churn-prediction-service/    Port 9003 - LightGBM churn prediction
│   ├── credit-scoring-service/      Port 9006 - RandomForest credit risk scoring
│   ├── data-analytics-service/      Port 9007 - KMeans segmentation + trend analysis
│   ├── fraud-detection-service/     Port 9001 - RF + IsolationForest + AutoEncoder fraud
│   ├── ml-common/                   Shared synthetic data generators
│   └── recommendation-service/      Port 9004 - KMeans + TF-IDF recommendations
│
├── docker-compose.yml  Full stack (infrastructure + all services)
├── scripts/
│   └── init-db.sql     MySQL database initialisation
└── run-all.sh          Train models → build Java → docker-compose up
```

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Java 17+ and Maven (for local builds only; Docker builds are self-contained)
- Python 3.11+ (for local ML training only)

### 1. Train ML models (first run only)

```bash
cd ml-services
python train_all.py
```

### 2. Start everything

```bash
# From code/
docker-compose up --build -d
```

Or use the helper script:

```bash
./run-all.sh
```

### 3. Service ports

| Service                   | Port |
| ------------------------- | ---- |
| Eureka Server             | 8001 |
| API Gateway               | 8002 |
| User Service              | 8003 |
| Payment Service           | 8004 |
| Notification Service      | 8005 |
| Fraud Detection Service   | 9001 |
| Anomaly Detection Service | 9002 |
| Churn Prediction Service  | 9003 |
| Recommendation Service    | 9004 |
| Categorization Service    | 9005 |
| Credit Scoring Service    | 9006 |
| Data Analytics Service    | 9007 |

## Environment Variables

Copy `.env.example` to `.env` and configure:

```
JWT_SECRET=<minimum 32-char secret>
DB_PASSWORD=<mysql password>
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your@email.com
MAIL_PASSWORD=your-app-password
TWILIO_ACCOUNT_SID=<optional>
TWILIO_AUTH_TOKEN=<optional>
FRAUD_THRESHOLD_HIGH=0.6
FRAUD_THRESHOLD_CRITICAL=0.8
```

## Building Java services locally

```bash
cd backend
mvn clean package -DskipTests
```

## Running individual ML services locally

```bash
cd ml-services/<service-name>
pip install -r requirements.txt
# Train model first if .joblib files are absent
python <model_script>.py
# Start API
uvicorn <api_script>:app --host 0.0.0.0 --port <port>
```

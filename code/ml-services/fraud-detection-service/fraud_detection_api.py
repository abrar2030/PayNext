"""
Fraud Detection Service - FastAPI Application Entry Point
=========================================================
Service name : fraud-detection-service
Port         : 9001

Exposes every endpoint from the original Java FraudDetectionController
PLUS the /predict_fraud ML endpoint from the original Python fraud service,
all served from this single consolidated service.

Endpoint map
────────────
GET  /health                                  Service health + model status
POST /api/fraud-detection/analyze             Full analysis (persist + Kafka)
POST /api/fraud-detection/score               Real-time score (no persistence)
GET  /api/fraud-detection/user/{id}/profile   User behaviour profile
GET  /api/fraud-detection/stats               Aggregate fraud stats (24 h)
GET  /api/fraud-detection/high-risk           High/critical risk transactions
POST /api/fraud-detection/review/{id}         Analyst feedback (fraud / FP)
POST /api/fraud-detection/retrain             Trigger ML model retraining
"""

import logging
import os
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import Dict, List, Optional

import fraud_detection_service as svc
from database import get_db, init_db
from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from models import TransactionAnalysis
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


# ─── Lifespan ────────────────────────────────────────────────────────────────


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting fraud-detection-service …")
    init_db()
    loaded = svc.load_models()
    if not loaded:
        logger.warning(
            "ML models not found - train them with: "
            "python fraud_detection_model.py --data ../ml-common/synthetic_transactions.csv  "
            "Rule-based scoring is active in the meantime."
        )
    yield
    logger.info("fraud-detection-service stopped.")


# ─── App ─────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="PayNext Fraud Detection Service",
    description=(
        "Unified fraud detection combining ML ensemble inference "
        "(Random Forest + Isolation Forest + AutoEncoder) with rule-based "
        "velocity, behavioural, geolocation, device, amount and time-of-day "
        "scoring.  Results are persisted to MySQL, cached in Redis, and "
        "published to Kafka."
    ),
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Pydantic schemas ─────────────────────────────────────────────────────────


class TransactionAnalysisRequest(BaseModel):
    """Full analysis - persists to DB and publishes a Kafka event."""

    transaction_id: str
    user_id: str
    transaction_amount: float = Field(..., gt=0)
    transaction_time: datetime
    currency: str = "USD"
    merchant_id: Optional[str] = None
    merchant_category: Optional[str] = None
    merchant: Optional[str] = None
    transaction_type: str = "purchase"
    payment_method: str = "card"
    ip_address: Optional[str] = None
    device_fingerprint: Optional[str] = None
    location_country: Optional[str] = None
    location_city: Optional[str] = None
    location: Optional[str] = None
    # Pre-computed rolling features (optional; enhance ML model accuracy)
    time_since_last_txn: float = Field(default=0.0, ge=0)
    user_avg_txn_amount_24h: float = Field(default=0.0, ge=0)
    user_txn_count_24h: int = Field(default=0, ge=0)
    user_avg_txn_amount_7d: float = Field(default=0.0, ge=0)
    user_txn_count_7d: int = Field(default=0, ge=0)


class RealtimeScoreRequest(BaseModel):
    """Lightweight score - no DB write, no Kafka event."""

    transaction_id: Optional[str] = None
    user_id: str
    transaction_amount: float = Field(..., gt=0)
    transaction_time: datetime
    transaction_type: str = "purchase"
    payment_method: str = "card"
    location: Optional[str] = None
    location_country: Optional[str] = None
    location_city: Optional[str] = None
    merchant: Optional[str] = None
    merchant_category: Optional[str] = None
    ip_address: Optional[str] = None
    device_fingerprint: Optional[str] = None
    time_since_last_txn: float = 0.0
    user_avg_txn_amount_24h: float = 0.0
    user_txn_count_24h: int = 0
    user_avg_txn_amount_7d: float = 0.0
    user_txn_count_7d: int = 0


class TransactionAnalysisResponse(BaseModel):
    id: Optional[int]
    transaction_id: str
    user_id: str
    amount: float
    currency: str
    risk_score: float
    risk_level: str
    fraud_status: str
    # ML scores
    ml_score_rf: Optional[float]
    ml_score_if: Optional[float]
    ml_score_ae: Optional[float]
    ml_combined_score: Optional[float]
    # Rule-based scores
    velocity_score: Optional[float]
    behavioral_score: Optional[float]
    geolocation_score: Optional[float]
    device_score: Optional[float]
    amount_score: Optional[float]
    time_of_day_score: Optional[float]
    # Metadata
    fraud_indicators: Optional[Dict[str, str]]
    ml_model_version: Optional[str]
    analysis_duration_ms: Optional[int]
    # Review
    reviewed_by: Optional[str]
    reviewed_at: Optional[datetime]
    review_notes: Optional[str]
    created_at: Optional[datetime]

    class Config:
        from_attributes = True


def _orm_to_response(a: TransactionAnalysis) -> TransactionAnalysisResponse:
    return TransactionAnalysisResponse(
        id=a.id,
        transaction_id=a.transaction_id,
        user_id=a.user_id,
        amount=a.amount,
        currency=a.currency,
        risk_score=a.risk_score,
        risk_level=a.risk_level.value,
        fraud_status=a.fraud_status.value,
        ml_score_rf=a.ml_score_rf,
        ml_score_if=a.ml_score_if,
        ml_score_ae=a.ml_score_ae,
        ml_combined_score=a.ml_combined_score,
        velocity_score=a.velocity_score,
        behavioral_score=a.behavioral_score,
        geolocation_score=a.geolocation_score,
        device_score=a.device_score,
        amount_score=a.amount_score,
        time_of_day_score=a.time_of_day_score,
        fraud_indicators=a.fraud_indicators,
        ml_model_version=a.ml_model_version,
        analysis_duration_ms=a.analysis_duration_ms,
        reviewed_by=a.reviewed_by,
        reviewed_at=a.reviewed_at,
        review_notes=a.review_notes,
        created_at=a.created_at,
    )


# ─── Health ───────────────────────────────────────────────────────────────────


@app.get("/health", tags=["Health"])
async def health_check():
    """Service liveness check including ML model availability."""
    return {
        "status": "UP",
        "service": "fraud-detection-service",
        "models_loaded": svc._models_loaded,
        "timestamp": datetime.now(timezone.utc).replace(tzinfo=None).isoformat(),
    }


# ─── 1. Analysis & Scoring ────────────────────────────────────────────────────


@app.post(
    "/api/fraud-detection/analyze",
    response_model=TransactionAnalysisResponse,
    tags=["Analysis"],
    summary="Analyze a transaction (full pipeline)",
    description=(
        "Runs ML inference + all rule-based sub-scores, persists to MySQL, "
        "busts the Redis profile cache, and publishes a Kafka event. "
        "Use for every real payment transaction."
    ),
)
async def analyze_transaction(
    request: TransactionAnalysisRequest,
    db: Session = Depends(get_db),
):
    logger.info("Analyze: txn=%s user=%s", request.transaction_id, request.user_id)
    try:
        analysis = svc.analyze_transaction(request.model_dump(), db)
        return _orm_to_response(analysis)
    except Exception as exc:
        logger.error("Analyze error: %s", exc, exc_info=True)
        raise HTTPException(status_code=500, detail=str(exc))


@app.post(
    "/api/fraud-detection/score",
    tags=["Analysis"],
    summary="Real-time fraud score (no persistence)",
    description=(
        "Returns a fraud score in < 50 ms without writing to the database. "
        "Ideal for pre-authorisation checks where latency is critical."
    ),
)
async def realtime_score(
    request: RealtimeScoreRequest,
    db: Session = Depends(get_db),
):
    try:
        return svc.get_realtime_score(request.model_dump(), db)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


# ─── 2. User Profiles ─────────────────────────────────────────────────────────


@app.get(
    "/api/fraud-detection/user/{user_id}/profile",
    tags=["Profiles"],
    summary="Get user behaviour profile",
    description="Returns the historical behavioural profile used for rule-based anomaly scoring.",
)
async def get_user_profile(user_id: str, db: Session = Depends(get_db)):
    profile = svc.get_user_behavior_profile(user_id, db)
    if profile is None:
        raise HTTPException(
            status_code=404, detail=f"No profile found for user '{user_id}'"
        )
    return {
        "user_id": profile.user_id,
        "avg_transaction_amount": profile.avg_transaction_amount,
        "max_transaction_amount": profile.max_transaction_amount,
        "daily_transaction_count": profile.daily_transaction_count,
        "total_transactions": profile.total_transactions,
        "frequent_countries": profile.frequent_countries,
        "frequent_cities": profile.frequent_cities,
        "frequent_categories": profile.frequent_categories,
        "preferred_payment_methods": profile.preferred_payment_methods,
        "known_devices": profile.known_devices,
        "base_risk_score": profile.base_risk_score,
        "fraud_incidents": profile.fraud_incidents,
        "false_positives": profile.false_positives,
        "last_transaction_date": profile.last_transaction_date,
        "profile_updated_at": profile.profile_updated_at,
    }


# ─── 3. Analytics ─────────────────────────────────────────────────────────────


@app.get(
    "/api/fraud-detection/stats",
    tags=["Analytics"],
    summary="Aggregate fraud detection stats (last 24 h)",
)
async def fraud_stats(db: Session = Depends(get_db)):
    return svc.get_fraud_stats(db)


@app.get(
    "/api/fraud-detection/high-risk",
    response_model=List[TransactionAnalysisResponse],
    tags=["Analytics"],
    summary="List HIGH / CRITICAL risk transactions awaiting review",
)
async def high_risk_transactions(
    limit: int = Query(default=50, ge=1, le=500),
    db: Session = Depends(get_db),
):
    results = svc.get_high_risk_transactions(limit, db)
    return [_orm_to_response(a) for a in results]


# ─── 4. Analyst Feedback ──────────────────────────────────────────────────────


@app.post(
    "/api/fraud-detection/review/{transaction_id}",
    tags=["Feedback"],
    summary="Mark a transaction as fraud or legitimate",
    description=(
        "Analyst feedback endpoint.  Updates fraud_status, records who reviewed "
        "it and when, and stores optional notes for audit purposes."
    ),
)
async def review_transaction(
    transaction_id: str,
    is_fraud: bool = Query(..., description="true = fraud, false = legitimate"),
    reviewed_by: str = Query(..., description="Analyst identifier / username"),
    notes: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
):
    result = svc.mark_transaction_fraud(
        transaction_id, is_fraud, reviewed_by, notes, db
    )
    if result is None:
        raise HTTPException(
            status_code=404, detail=f"Transaction '{transaction_id}' not found"
        )
    return {
        "status": "success",
        "message": "Transaction review recorded",
        "transaction_id": transaction_id,
        "decision": "fraud" if is_fraud else "legitimate",
        "reviewed_by": reviewed_by,
    }


# ─── 5. Model Management ──────────────────────────────────────────────────────


@app.post(
    "/api/fraud-detection/retrain",
    tags=["Model Management"],
    summary="Trigger background ML model retraining",
    description=(
        "Starts a daemon thread that retrains all three models on the latest "
        "data and hot-reloads them without downtime."
    ),
)
async def retrain_model():
    svc.retrain_model()
    return {"status": "success", "message": "Model retraining initiated in background"}


# ─── Entry point ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "fraud_detection_api:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", "9001")),
        reload=False,
    )

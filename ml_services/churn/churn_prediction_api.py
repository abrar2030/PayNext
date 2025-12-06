import os
from typing import List

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from core.logging import get_logger

logger = get_logger(__name__)

app = FastAPI(title="Churn Prediction API")

# Define the path to the models relative to the current file
model_dir = os.path.join(
    os.path.dirname(__file__), ".."
)  # Go up one level to ml_services
churn_model_path = os.path.join(model_dir, "churn_model.joblib")
churn_scaler_path = os.path.join(model_dir, "churn_scaler.joblib")
churn_model_features_path = os.path.join(model_dir, "churn_model_features.joblib")

churn_model = None
churn_scaler = None
churn_model_features = None

try:
    churn_model = joblib.load(churn_model_path)
    churn_scaler = joblib.load(churn_scaler_path)
    churn_model_features = joblib.load(churn_model_features_path)
    logger.info("Churn Prediction Model, Scaler, and Features loaded successfully.")
except FileNotFoundError:
    logger.info(
        f"Churn model, scaler, or features file not found at {model_dir}. Please train the model first."
    )
except Exception as e:
    logger.info(f"Error loading Churn Prediction Model components: {e}")


class ChurnPredictionInput(BaseModel):
    avg_transactions_per_month: float
    avg_logins_per_month: float
    avg_feature_usage_score: float
    total_months_active: int
    tenure_months: float = 0.0
    avg_transactions_diff: float = 0.0
    avg_logins_diff: float = 0.0
    avg_feature_usage_diff: float = 0.0
    max_transactions_per_month: float = 0.0
    min_transactions_per_month: float = 0.0
    avg_rolling_avg_transactions_3m: float = 0.0
    avg_rolling_std_transactions_3m: float = 0.0
    avg_rolling_avg_logins_3m: float = 0.0
    avg_rolling_std_logins_3m: float = 0.0


@app.get("/health")
async def health_check():
    return {"status": "ok", "model_loaded": churn_model is not None}


@app.post("/predict_churn/")
async def predict_churn(user_data: ChurnPredictionInput):
    if churn_model is None or churn_scaler is None or churn_model_features is None:
        raise HTTPException(
            status_code=500,
            detail="Churn prediction model not loaded. Please train the model.",
        )

    try:
        input_df = pd.DataFrame([user_data.dict()])

        # Ensure columns are in the same order as during training
        # Fill missing new features with 0 if they are not provided in the request (handled by Pydantic defaults)
        input_df = input_df[churn_model_features]

        # Scale the input features
        input_scaled = churn_scaler.transform(input_df)

        prediction_proba = churn_model.predict_proba(input_scaled)[:, 1][
            0
        ]  # Probability of churning
        is_churn = bool(churn_model.predict(input_scaled)[0])

        return {
            "is_churn_risk": is_churn,
            "churn_probability": round(prediction_proba, 4),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

import os
from datetime import datetime
from typing import Optional

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="Fraud Detection API")

# Define the path to the models relative to the current file
model_dir = os.path.join(
    os.path.dirname(__file__), ".."
)  # Go up one level to ml_services

fraud_model_rf_path = os.path.join(model_dir, "fraud_model.joblib")
fraud_model_if_path = os.path.join(model_dir, "fraud_isolation_forest_model.joblib")
fraud_model_ae_path = os.path.join(model_dir, "fraud_autoencoder_model.joblib")
fraud_scaler_path = os.path.join(model_dir, "fraud_scaler.joblib")
fraud_model_features_path = os.path.join(model_dir, "fraud_model_features.joblib")

location_encoder_path = os.path.join(model_dir, "location_encoder.joblib")
merchant_encoder_path = os.path.join(model_dir, "merchant_encoder.joblib")
transaction_type_encoder_path = os.path.join(
    model_dir, "transaction_type_encoder.joblib"
)
user_id_encoder_path = os.path.join(model_dir, "user_id_encoder.joblib")

fraud_model_rf = None
fraud_model_if = None
fraud_model_ae = None
fraud_scaler = None
fraud_model_features = None
location_encoder = None
merchant_encoder = None
transaction_type_encoder = None
user_id_encoder = None

try:
    fraud_model_rf = joblib.load(fraud_model_rf_path)
    fraud_model_if = joblib.load(fraud_model_if_path)
    fraud_model_ae = joblib.load(fraud_model_ae_path)
    fraud_scaler = joblib.load(fraud_scaler_path)
    fraud_model_features = joblib.load(fraud_model_features_path)

    location_encoder = joblib.load(location_encoder_path)
    merchant_encoder = joblib.load(merchant_encoder_path)
    transaction_type_encoder = joblib.load(transaction_type_encoder_path)
    user_id_encoder = joblib.load(user_id_encoder_path)
    print("Fraud Detection Models and Encoders loaded successfully.")
except FileNotFoundError as e:
    print(
        f"Fraud detection model or encoder file not found: {e}. Please train the models first."
    )
except Exception as e:
    print(f"Error loading Fraud Detection Model components: {e}")


class FraudPredictionInput(BaseModel):
    transaction_amount: float
    transaction_time: datetime
    location: str
    merchant: str
    transaction_type: str
    user_id: str
    time_since_last_txn: float = 0.0
    user_avg_txn_amount_24h: float = 0.0
    user_txn_count_24h: int = 0
    user_avg_txn_amount_7d: float = 0.0
    user_txn_count_7d: int = 0


@app.get("/health")
async def health_check():
    return {"status": "ok", "model_loaded": fraud_model_rf is not None}


@app.post("/predict_fraud/")
async def predict_fraud(transaction: FraudPredictionInput):
    if any(
        m is None
        for m in [
            fraud_model_rf,
            fraud_model_if,
            fraud_model_ae,
            fraud_scaler,
            fraud_model_features,
            location_encoder,
            merchant_encoder,
            transaction_type_encoder,
            user_id_encoder,
        ]
    ):
        raise HTTPException(
            status_code=500,
            detail="Fraud detection models or encoders not loaded. Please train the models.",
        )

    try:
        hour = transaction.transaction_time.hour
        day_of_week = transaction.transaction_time.weekday()
        month = transaction.transaction_time.month
        day_of_month = transaction.transaction_time.day

        def get_encoded_value(encoder, value):
            try:
                return encoder.transform([value])[0]
            except ValueError:
                # Assign a consistent value for unseen labels, e.g., a value outside the trained range
                # A more robust solution might involve a separate 'unknown' category or retraining
                return -1  # Or len(encoder.classes_) if you want to add a new category

        location_encoded = get_encoded_value(location_encoder, transaction.location)
        merchant_encoded = get_encoded_value(merchant_encoder, transaction.merchant)
        transaction_type_encoded = get_encoded_value(
            transaction_type_encoder, transaction.transaction_type
        )
        user_id_encoded = get_encoded_value(user_id_encoder, transaction.user_id)

        input_data_dict = {
            "transaction_amount": transaction.transaction_amount,
            "hour": hour,
            "day_of_week": day_of_week,
            "month": month,
            "day_of_month": day_of_month,
            "location": location_encoded,
            "merchant": merchant_encoded,
            "transaction_type": transaction_type_encoded,
            "user_id": user_id_encoded,
            "time_since_last_txn": transaction.time_since_last_txn,
            "user_avg_txn_amount_24h": transaction.user_avg_txn_amount_24h,
            "user_txn_count_24h": transaction.user_txn_count_24h,
            "user_avg_txn_amount_7d": transaction.user_avg_txn_amount_7d,
            "user_txn_count_7d": transaction.user_txn_count_7d,
        }

        input_df = pd.DataFrame([input_data_dict])

        # Ensure columns are in the same order as during training
        input_df = input_df[fraud_model_features]

        # Scale the input features
        input_scaled = fraud_scaler.transform(input_df)
        input_scaled_df = pd.DataFrame(input_scaled, columns=fraud_model_features)

        # Predict with RandomForest
        prediction_proba_rf = fraud_model_rf.predict_proba(input_scaled_df)[:, 1][0]

        # Predict with Isolation Forest (anomaly score)
        anomaly_score_if = -fraud_model_if.decision_function(input_scaled_df)[0]

        # Predict with Autoencoder (reconstruction error)
        reconstruction = fraud_model_ae.predict(input_scaled_df)
        mse = np.mean(np.power(input_scaled_df - reconstruction, 2), axis=1)[0]

        # Combine predictions (simple weighted average for demonstration)
        # Normalize IF and AE scores to a 0-1 range for easier combination.
        # Using sigmoid for normalization. Adjust thresholds as needed.
        normalized_anomaly_score_if = 1 / (1 + np.exp(-anomaly_score_if))
        normalized_anomaly_score_ae = 1 / (1 + np.exp(-mse))

        # Example combination: 50% RF, 25% IF, 25% AE
        combined_fraud_probability = (
            prediction_proba_rf * 0.5
            + normalized_anomaly_score_if * 0.25
            + normalized_anomaly_score_ae * 0.25
        )
        is_fraud = bool(combined_fraud_probability > 0.5)  # Example threshold

        return {
            "is_fraud": is_fraud,
            "fraud_probability_rf": round(prediction_proba_rf, 4),
            "anomaly_score_if": round(anomaly_score_if, 4),
            "anomaly_score_ae": round(mse, 4),
            "combined_fraud_probability": round(combined_fraud_probability, 4),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

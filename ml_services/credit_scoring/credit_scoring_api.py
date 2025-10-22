from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import joblib
import os

app = FastAPI(title="Credit Scoring API")

# Define the path to the models relative to the current file
model_dir = os.path.join(os.path.dirname(__file__), "..") # Go up one level to ml_services
credit_scoring_model_path = os.path.join(model_dir, "credit_scoring_model.joblib")
credit_scoring_scaler_path = os.path.join(model_dir, "credit_scoring_scaler.joblib")
credit_scoring_features_path = os.path.join(model_dir, "credit_scoring_features.joblib")

credit_scoring_model = None
credit_scoring_scaler = None
credit_scoring_features = None

try:
    credit_scoring_model = joblib.load(credit_scoring_model_path)
    credit_scoring_scaler = joblib.load(credit_scoring_scaler_path)
    credit_scoring_features = joblib.load(credit_scoring_features_path)
    print("Credit Scoring Model, Scaler, and Features loaded successfully.")
except FileNotFoundError:
    print(f"Credit scoring model, scaler, or features file not found at {model_dir}. Please train the model first.")
except Exception as e:
    print(f"Error loading Credit Scoring Model components: {e}")

class CreditScoringInput(BaseModel):
    total_transaction_amount: float
    avg_transaction_amount: float
    num_transactions: int
    max_transaction_amount: float
    min_transaction_amount: float
    unique_merchants: int
    avg_daily_transactions: float

@app.get("/health")
async def health_check():
    return {"status": "ok", "model_loaded": credit_scoring_model is not None}

@app.post("/predict_credit_risk/")
async def predict_credit_risk(user_data: CreditScoringInput):
    if credit_scoring_model is None or credit_scoring_scaler is None or credit_scoring_features is None:
        raise HTTPException(status_code=500, detail="Credit scoring model not loaded. Please train the model.")

    try:
        input_df = pd.DataFrame([user_data.dict()])

        # Ensure columns are in the same order as during training
        input_df = input_df[credit_scoring_features]

        # Scale the input features
        scaled_input = credit_scoring_scaler.transform(input_df)
        scaled_input_df = pd.DataFrame(scaled_input, columns=credit_scoring_features)

        # Make prediction
        prediction = credit_scoring_model.predict(scaled_input_df)[0]
        prediction_proba = credit_scoring_model.predict_proba(scaled_input_df)[:, 1][0] # Probability of being high risk

        risk_label = "High Risk" if prediction == 1 else "Low Risk"

        return {
            "predicted_credit_risk": risk_label,
            "high_risk_probability": round(prediction_proba, 4)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


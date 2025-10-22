
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
from datetime import datetime
import joblib
import os

# Assuming anomaly_detection_model.py is in the same directory or accessible
from .anomaly_detection.anomaly_detection_model import AnomalyDetector

app = FastAPI(title="Anomaly Detection API")

@app.get("/health")
async def health_check():
    return {"status": "ok", "model_loaded": anomaly_detector is not None}

# Load the pre-trained model
model_path = os.path.join(os.path.dirname(__file__), "anomaly_detection", "anomaly_detector_model.joblib")

try:
    # Attempt to load the model
    anomaly_detector = AnomalyDetector.load_model(model_path)
    print("Anomaly Detection Model loaded successfully.")
except FileNotFoundError:
    print(f"Model file not found at {model_path}. Training a new model for demonstration.")
    # If model not found, train a dummy one for demonstration purposes
    from anomaly_detection.anomaly_data_generator import generate_synthetic_transaction_data
    synthetic_df = generate_synthetic_transaction_data(num_transactions=10000, num_users=100, anomaly_ratio=0.01)
    anomaly_detector = AnomalyDetector(contamination=0.01)
    X_train = anomaly_detector.preprocess(synthetic_df)
    anomaly_detector.train(X_train)
    anomaly_detector.save_model(model_path) # Save it for future runs
    print("New Anomaly Detection Model trained and saved.")
except Exception as e:
    print(f"Error loading Anomaly Detection Model: {e}")
    # Fallback to an untrained model if loading fails critically
    anomaly_detector = AnomalyDetector()


class Transaction(BaseModel):
    user_id: str
    timestamp: datetime
    amount: float
    merchant: str
    transaction_type: str
    location: str

@app.post("/predict_anomaly/")
async def predict_anomaly(transaction: Transaction):
    try:
        # Convert incoming transaction data to DataFrame format expected by the model
        transaction_df = pd.DataFrame([transaction.dict()])

        # Preprocess the transaction data
        processed_transaction = anomaly_detector.preprocess(transaction_df)

        # Predict anomaly
        prediction = anomaly_detector.predict(processed_transaction)[0]

        return {"is_anomaly": bool(prediction), "prediction_score": float(anomaly_detector.model.decision_function(processed_transaction)[0])}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



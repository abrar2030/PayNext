
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
from datetime import datetime
import joblib
import os
from typing import List, Dict, Optional

# Assuming data_analytics_service.py is in the same directory or accessible
from .data_analytics.data_analytics_service import DataAnalyticsService
from .anomaly_detection.anomaly_data_generator import generate_synthetic_transaction_data # For initial data

app = FastAPI(title="Data Analytics API")

# Load the pre-trained models for analytics
model_path = os.path.join(os.path.dirname(__file__), "data_analytics", "analytics_models.joblib")

try:
    analytics_service = DataAnalyticsService.load_models(model_path)
    print("Data Analytics Models loaded successfully.")
except FileNotFoundError:
    print(f"Analytics model file not found at {model_path}. Training a new model for demonstration.")
    # If model not found, train a dummy one for demonstration purposes
    synthetic_df = generate_synthetic_transaction_data(num_transactions=100000, num_users=500, anomaly_ratio=0.0)
    analytics_service = DataAnalyticsService()
    analytics_service.train_user_segmentation_model(synthetic_df, n_clusters=4)
    analytics_service.save_models(model_path) # Save it for future runs
    print("New Data Analytics Models trained and saved.")
except Exception as e:
    print(f"Error loading Data Analytics Models: {e}")
    analytics_service = DataAnalyticsService()

# In a real application, you'd load actual transaction data here or connect to a DB
# For demonstration, we'll use a global synthetic dataframe
# This should ideally be handled by a proper data loading mechanism or database connection
# For now, let's generate a base dataframe for trend and geospatial analysis
GLOBAL_TRANSACTION_DATA = generate_synthetic_transaction_data(num_transactions=200000, num_users=1000, anomaly_ratio=0.0)
GLOBAL_TRANSACTION_DATA["timestamp"] = pd.to_datetime(GLOBAL_TRANSACTION_DATA["timestamp"])

class TransactionInput(BaseModel):
    user_id: str
    timestamp: datetime
    amount: float
    merchant: str
    transaction_type: str
    location: str

@app.post("/analyze/user_segmentation/")
async def get_user_segmentation(transactions: List[TransactionInput]):
    try:
        df = pd.DataFrame([t.dict() for t in transactions])
        segments = analytics_service.predict_user_segment(df)
        return segments.to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/analyze/transaction_trends/")
async def get_transaction_trends(time_granularity: str = "daily"): # e.g., daily, weekly, monthly
    try:
        trends = analytics_service.analyze_transaction_trends(GLOBAL_TRANSACTION_DATA, time_granularity)
        trends.index = trends.index.astype(str) # Convert datetime index to string for JSON serialization
        return trends.to_dict(orient="index")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/analyze/geospatial_patterns/")
async def get_geospatial_patterns():
    try:
        patterns = analytics_service.analyze_geospatial_patterns(GLOBAL_TRANSACTION_DATA)
        return patterns.to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



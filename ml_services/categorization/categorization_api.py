from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import joblib
import os

app = FastAPI(title="Transaction Categorization API")

# Define the path to the models relative to the current file
model_dir = os.path.join(os.path.dirname(__file__), "..") # Go up one level to ml_services
category_model_path = os.path.join(model_dir, "category_model.joblib")
category_vectorizer_path = os.path.join(model_dir, "category_vectorizer.joblib")

category_model = None
category_vectorizer = None

try:
    category_model = joblib.load(category_model_path)
    category_vectorizer = joblib.load(category_vectorizer_path)
    print("Categorization Model and Vectorizer loaded successfully.")
except FileNotFoundError:
    print(f"Categorization model or vectorizer file not found at {model_dir}. Please train the model first.")
except Exception as e:
    print(f"Error loading Categorization Model or Vectorizer: {e}")

class TransactionCategorizationInput(BaseModel):
    merchant: str
    description: str

@app.get("/health")
async def health_check():
    return {"status": "ok", "model_loaded": category_model is not None}

@app.post("/categorize_transaction/")
async def categorize_transaction(transaction: TransactionCategorizationInput):
    if category_model is None or category_vectorizer is None:
        raise HTTPException(status_code=500, detail="Categorization model not loaded. Please train the model.")

    try:
        text_features = [f"{transaction.merchant} {transaction.description}"]
        text_features_vec = category_vectorizer.transform(text_features)

        prediction = category_model.predict(text_features_vec)[0]
        prediction_proba = category_model.predict_proba(text_features_vec).max() # Probability of the predicted class

        return {
            "merchant": transaction.merchant,
            "description": transaction.description,
            "predicted_category": prediction,
            "prediction_probability": round(prediction_proba, 4)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


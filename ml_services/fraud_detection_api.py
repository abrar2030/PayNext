
import pandas as pd
from flask import Flask, request, jsonify
import joblib
from datetime import datetime
import numpy as np

app = Flask(__name__)

# Load the trained models, encoders, and scaler
try:
    fraud_model_rf = joblib.load("PayNext/ml_services/fraud_model.joblib")
    fraud_model_if = joblib.load("PayNext/ml_services/fraud_isolation_forest_model.joblib")
    fraud_scaler = joblib.load("PayNext/ml_services/fraud_scaler.joblib")
    fraud_model_features = joblib.load("PayNext/ml_services/fraud_model_features.joblib")
    
    location_encoder = joblib.load("PayNext/ml_services/location_encoder.joblib")
    merchant_encoder = joblib.load("PayNext/ml_services/merchant_encoder.joblib")
    transaction_type_encoder = joblib.load("PayNext/ml_services/transaction_type_encoder.joblib")
    user_id_encoder = joblib.load("PayNext/ml_services/user_id_encoder.joblib")
except Exception as e:
    print(f"Error loading model or encoders: {e}")
    fraud_model_rf = None
    fraud_model_if = None

@app.route("/predict_fraud", methods=["POST"])
def predict_fraud():
    if fraud_model_rf is None or fraud_model_if is None:
        return jsonify({"error": "Models not loaded"}), 500

    data = request.get_json(force=True)
    if not data:
        return jsonify({"error": "No data provided"}), 400

    try:
        # Extract features from request
        transaction_amount = data.get("transaction_amount")
        transaction_time_str = data.get("transaction_time") 
        location = data.get("location")
        merchant = data.get("merchant")
        transaction_type = data.get("transaction_type")
        user_id = data.get("user_id")
        
        # New features from the updated model
        time_since_last_txn = data.get("time_since_last_txn", 0) # Assume 0 if not provided for first txn
        user_avg_txn_amount_24h = data.get("user_avg_txn_amount_24h", 0)
        user_txn_count_24h = data.get("user_txn_count_24h", 0)
        user_avg_txn_amount_7d = data.get("user_avg_txn_amount_7d", 0)
        user_txn_count_7d = data.get("user_txn_count_7d", 0)

        if not all([transaction_amount, transaction_time_str, location, merchant, transaction_type, user_id]):
            return jsonify({"error": "Missing required fields"}), 400

        transaction_time = datetime.fromisoformat(transaction_time_str)
        hour = transaction_time.hour
        day_of_week = transaction_time.weekday()
        month = transaction_time.month
        day_of_month = transaction_time.day

        # Encode categorical features, handling unknown categories
        def get_encoded_value(encoder, value):
            try:
                return encoder.transform([value])[0]
            except ValueError:
                # Handle unseen labels during inference by assigning a default or treating as unknown
                # For simplicity, we'll assign -1, but a more robust solution might involve a separate 'unknown' category
                return -1 

        location_encoded = get_encoded_value(location_encoder, location)
        merchant_encoded = get_encoded_value(merchant_encoder, merchant)
        transaction_type_encoded = get_encoded_value(transaction_type_encoder, transaction_type)
        user_id_encoded = get_encoded_value(user_id_encoder, user_id)
        
        input_data_dict = {
            "transaction_amount": transaction_amount,
            "hour": hour,
            "day_of_week": day_of_week,
            "month": month,
            "day_of_month": day_of_month,
            "location": location_encoded,
            "merchant": merchant_encoded,
            "transaction_type": transaction_type_encoded,
            "user_id": user_id_encoded,
            "time_since_last_txn": time_since_last_txn,
            "user_avg_txn_amount_24h": user_avg_txn_amount_24h,
            "user_txn_count_24h": user_txn_count_24h,
            "user_avg_txn_amount_7d": user_avg_txn_amount_7d,
            "user_txn_count_7d": user_txn_count_7d
        }

        input_df = pd.DataFrame([input_data_dict])

        # Ensure columns are in the same order as during training
        input_df = input_df[fraud_model_features]

        # Scale the input features
        input_scaled = fraud_scaler.transform(input_df)
        input_scaled_df = pd.DataFrame(input_scaled, columns=fraud_model_features)

        # Predict with RandomForest
        prediction_rf = fraud_model_rf.predict(input_scaled_df)[0]
        prediction_proba_rf = fraud_model_rf.predict_proba(input_scaled_df)[:, 1][0]
        
        # Predict with Isolation Forest (anomaly score)
        # Lower score indicates higher anomaly (fraud) likelihood
        anomaly_score_if = -fraud_model_if.decision_function(input_scaled_df)[0]
        # We can normalize this score or use a threshold. For simplicity, we'll return the raw score.
        # A higher anomaly_score_if suggests higher fraud probability from Isolation Forest.

        # Combine predictions (simple average for now, can be improved)
        # For example, if both models agree, or if one is strongly confident
        combined_fraud_probability = (prediction_proba_rf + (anomaly_score_if / (anomaly_score_if + 1))) / 2 # Simple normalization for IF score
        is_fraud = bool(prediction_rf) or (anomaly_score_if > 0.5) # Example thresholding for IF

        return jsonify({
            "is_fraud": is_fraud,
            "fraud_probability_rf": round(prediction_proba_rf, 4),
            "anomaly_score_if": round(anomaly_score_if, 4),
            "combined_fraud_probability": round(combined_fraud_probability, 4)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)


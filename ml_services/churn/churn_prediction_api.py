
import pandas as pd
from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

# Load the trained model and scaler
try:
    churn_model = joblib.load("PayNext/ml_services/churn_model.joblib")
    churn_scaler = joblib.load("PayNext/ml_services/churn_scaler.joblib")
    churn_model_features = joblib.load("PayNext/ml_services/churn_model_features.joblib")
except Exception as e:
    print(f"Error loading churn model or scaler: {e}")
    churn_model = None

@app.route("/predict_churn", methods=["POST"])
def predict_churn():
    if churn_model is None:
        return jsonify({"error": "Churn model not loaded"}), 500

    data = request.get_json(force=True)
    if not data:
        return jsonify({"error": "No data provided"}), 400

    try:
        # Expected input: avg_transactions_per_month, avg_logins_per_month, avg_feature_usage_score, total_months_active
        # Plus new features: avg_transactions_diff, avg_logins_diff, avg_feature_usage_diff,
        # max_transactions_per_month, min_transactions_per_month
        # New rolling window features
        # avg_rolling_avg_transactions_3m, avg_rolling_std_transactions_3m,
        # avg_rolling_avg_logins_3m, avg_rolling_std_logins_3m
        input_data = pd.DataFrame([data])

        # Ensure columns are in the same order as during training
        # Fill missing new features with 0 if they are not provided in the request
        for feature in churn_model_features:
            if feature not in input_data.columns:
                input_data[feature] = 0
        
        input_data = input_data[churn_model_features]

        # Scale the input features
        input_scaled = churn_scaler.transform(input_data)

        prediction_proba = churn_model.predict_proba(input_scaled)[:, 1][0] # Probability of churning
        is_churn = bool(churn_model.predict(input_scaled)[0])

        return jsonify({
            "is_churn_risk": is_churn,
            "churn_probability": round(prediction_proba, 4)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5003)


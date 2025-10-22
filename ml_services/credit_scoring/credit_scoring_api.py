
from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

# Load the trained model, scaler, and feature list
try:
    credit_scoring_model = joblib.load("PayNext/ml_services/credit_scoring_model.joblib")
    credit_scoring_scaler = joblib.load("PayNext/ml_services/credit_scoring_scaler.joblib")
    credit_scoring_features = joblib.load("PayNext/ml_services/credit_scoring_features.joblib")
except Exception as e:
    print(f"Error loading credit scoring model or scaler: {e}")
    credit_scoring_model = None

@app.route("/predict_credit_risk", methods=["POST"])
def predict_credit_risk():
    if credit_scoring_model is None:
        return jsonify({"error": "Credit scoring model not loaded"}), 500

    data = request.get_json(force=True)
    if not data:
        return jsonify({"error": "No data provided"}), 400

    # Ensure all required features are present in the input data
    # For a real application, this would involve more robust data validation
    # and potentially feature engineering based on raw transaction data.
    try:
        input_df = pd.DataFrame([data])
        # Reorder columns to match the training features
        input_df = input_df[credit_scoring_features]
    except KeyError as e:
        return jsonify({"error": f"Missing feature in input data: {e}"}), 400

    # Scale the input features
    scaled_input = credit_scoring_scaler.transform(input_df)
    scaled_input_df = pd.DataFrame(scaled_input, columns=credit_scoring_features)

    # Make prediction
    prediction = credit_scoring_model.predict(scaled_input_df)[0]
    prediction_proba = credit_scoring_model.predict_proba(scaled_input_df)[:, 1][0] # Probability of being high risk

    risk_label = "High Risk" if prediction == 1 else "Low Risk"

    return jsonify({
        "predicted_credit_risk": risk_label,
        "high_risk_probability": round(prediction_proba, 4)
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5005)


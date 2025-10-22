
import pandas as pd
from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

# Load the trained model and vectorizer
try:
    category_model = joblib.load("PayNext/ml_services/category_model.joblib")
    category_vectorizer = joblib.load("PayNext/ml_services/category_vectorizer.joblib")
except Exception as e:
    print(f"Error loading categorization model or vectorizer: {e}")
    category_model = None

@app.route("/categorize_transaction", methods=["POST"])
def categorize_transaction():
    if category_model is None:
        return jsonify({"error": "Categorization model not loaded"}), 500

    data = request.get_json(force=True)
    if not data or "merchant" not in data or "description" not in data:
        return jsonify({"error": "Missing merchant or description in request"}), 400

    merchant = data.get("merchant")
    description = data.get("description")

    text_features = [f"{merchant} {description}"]
    text_features_vec = category_vectorizer.transform(text_features)

    prediction = category_model.predict(text_features_vec)[0]
    prediction_proba = category_model.predict_proba(text_features_vec).max() # Probability of the predicted class

    return jsonify({
        "merchant": merchant,
        "description": description,
        "predicted_category": prediction,
        "prediction_probability": round(prediction_proba, 4)
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002)


import pandas as pd
from flask import Flask, request, jsonify
import joblib
from datetime import datetime

app = Flask(__name__)

# Load the trained model and encoders
try:
    fraud_model = joblib.load('/home/ubuntu/PayNext/ml_services/fraud_model.joblib')
    fraud_model_features = joblib.load('/home/ubuntu/PayNext/ml_services/fraud_model_features.joblib')
    location_encoder = joblib.load('/home/ubuntu/PayNext/ml_services/location_encoder.joblib')
    merchant_encoder = joblib.load('/home/ubuntu/PayNext/ml_services/merchant_encoder.joblib')
    transaction_type_encoder = joblib.load('/home/ubuntu/PayNext/ml_services/transaction_type_encoder.joblib')
    user_id_encoder = joblib.load('/home/ubuntu/PayNext/ml_services/user_id_encoder.joblib')
except Exception as e:
    print(f"Error loading model or encoders: {e}")
    fraud_model = None

@app.route('/predict_fraud', methods=['POST'])
def predict_fraud():
    if fraud_model is None:
        return jsonify({'error': 'Model not loaded'}), 500

    data = request.get_json(force=True)
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    try:
        # Prepare data for prediction
        transaction_amount = data.get('transaction_amount')
        transaction_time_str = data.get('transaction_time') # Assuming ISO format string
        location = data.get('location')
        merchant = data.get('merchant')
        transaction_type = data.get('transaction_type')
        user_id = data.get('user_id')

        if not all([transaction_amount, transaction_time_str, location, merchant, transaction_type, user_id]):
            return jsonify({'error': 'Missing required fields'}), 400

        transaction_time = datetime.fromisoformat(transaction_time_str)
        hour = transaction_time.hour
        day_of_week = transaction_time.weekday()
        month = transaction_time.month

        # Encode categorical features, handling unknown categories
        try:
            location_encoded = location_encoder.transform([location])[0]
        except ValueError:
            location_encoded = -1 # Or some other default/handling for unknown
        try:
            merchant_encoded = merchant_encoder.transform([merchant])[0]
        except ValueError:
            merchant_encoded = -1
        try:
            transaction_type_encoded = transaction_type_encoder.transform([transaction_type])[0]
        except ValueError:
            transaction_type_encoded = -1
        try:
            user_id_encoded = user_id_encoder.transform([user_id])[0]
        except ValueError:
            user_id_encoded = -1

        input_data = pd.DataFrame([{
            'transaction_amount': transaction_amount,
            'hour': hour,
            'day_of_week': day_of_week,
            'month': month,
            'location': location_encoded,
            'merchant': merchant_encoded,
            'transaction_type': transaction_type_encoded,
            'user_id': user_id_encoded
        }])

        # Ensure columns are in the same order as during training
        input_data = input_data[fraud_model_features]

        prediction = fraud_model.predict(input_data)[0]
        prediction_proba = fraud_model.predict_proba(input_data)[:, 1][0] # Probability of being fraud

        return jsonify({
            'is_fraud': bool(prediction),
            'fraud_probability': round(prediction_proba, 4)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)


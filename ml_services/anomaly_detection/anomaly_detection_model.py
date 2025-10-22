
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import LabelEncoder, StandardScaler
import joblib
from datetime import datetime

class AnomalyDetector:
    def __init__(self, contamination=0.01, random_state=42):
        self.model = IsolationForest(contamination=contamination, random_state=random_state)
        self.label_encoders = {}
        self.scaler = None
        self.features = [
            'amount',
            'timestamp_hour',
            'timestamp_day_of_week',
            'timestamp_month',
            'user_id_encoded',
            'merchant_encoded',
            'transaction_type_encoded',
            'location_encoded'
        ]

    def preprocess(self, df):
        if df.empty:
            return pd.DataFrame(columns=self.features) # Return empty DataFrame with expected columns
        df_processed = df.copy()

        # Convert timestamp to datetime and extract features
        df_processed['timestamp'] = pd.to_datetime(df_processed['timestamp'])
        df_processed['timestamp_hour'] = df_processed['timestamp'].dt.hour
        df_processed['timestamp_day_of_week'] = df_processed['timestamp'].dt.dayofweek
        df_processed['timestamp_month'] = df_processed['timestamp'].dt.month

        # Encode categorical features
        categorical_cols = ['user_id', 'merchant', 'transaction_type', 'location']
        for col in categorical_cols:
            if col in df_processed.columns:
                if col not in self.label_encoders:
                    self.label_encoders[col] = LabelEncoder()
                    df_processed[f'{col}_encoded'] = self.label_encoders[col].fit_transform(df_processed[col])
                else:
                    known_labels = list(self.label_encoders[col].classes_)
                    # For inference, assign a consistent value for unseen labels. 
                    # This value should be distinct from existing encoded labels.
                    # A common practice is to assign a value larger than any existing label.
                    max_encoded_value = len(known_labels)
                    df_processed[f'{col}_encoded'] = df_processed[col].apply(
                        lambda x: self.label_encoders[col].transform([x])[0] 
                        if x in known_labels else max_encoded_value
                    )
                    # During training, if new labels appear, the LabelEncoder should ideally be refit or updated.
                    # For inference, we just map to an 'unknown' category.
            else:
                # If a categorical column is missing, add a column of zeros
                df_processed[f'{col}_encoded'] = 0

        # Scale numerical features
        numerical_cols = ['amount', 'timestamp_hour', 'timestamp_day_of_week', 'timestamp_month']
        if self.scaler is None:
            self.scaler = StandardScaler()
            df_processed[numerical_cols] = self.scaler.fit_transform(df_processed[numerical_cols])
        else:
            df_processed[numerical_cols] = self.scaler.transform(df_processed[numerical_cols])

        return df_processed[self.features]

    def train(self, X_train):
        self.model.fit(X_train)

    def predict(self, X_test):
        # Isolation Forest returns -1 for anomalies and 1 for normal observations
        predictions = self.model.predict(X_test)
        return np.where(predictions == -1, 1, 0) # Convert to 1 for anomaly, 0 for normal

    def save_model(self, path):
        joblib.dump({
            'model': self.model,
            'label_encoders': self.label_encoders,
            'scaler': self.scaler,
            'features': self.features
        }, path)

    @classmethod
    def load_model(cls, path):
        data = joblib.load(path)
        detector = cls()
        detector.model = data['model']
        detector.label_encoders = data['label_encoders']
        detector.scaler = data['scaler']
        detector.features = data['features']
        return detector

if __name__ == '__main__':
    # Generate some synthetic data for demonstration
    from anomaly_data_generator import generate_synthetic_transaction_data
    print("Generating synthetic data...")
    synthetic_df = generate_synthetic_transaction_data(num_transactions=50000, num_users=200, anomaly_ratio=0.005)
    print("Synthetic data generated.")

    # Train the model
    detector = AnomalyDetector(contamination=0.005) # Set contamination based on expected anomaly ratio
    X_train = detector.preprocess(synthetic_df)
    print("Training Anomaly Detection model...")
    detector.train(X_train)
    print("Model trained.")

    # Save the model
    model_path = 'anomaly_detector_model.joblib'
    detector.save_model(model_path)
    print(f"Model saved to {model_path}")

    # Load and test the model
    loaded_detector = AnomalyDetector.load_model(model_path)
    print("Model loaded.")

    # Make predictions on new data (can be the same synthetic data for testing)
    X_test = loaded_detector.preprocess(synthetic_df)
    predictions = loaded_detector.predict(X_test)

    print("Predictions made.")
    print(f"Total transactions: {len(predictions)}")
    print(f"Detected anomalies: {np.sum(predictions)}")
    
    # Evaluate (simple check)
    true_anomalies = synthetic_df['is_anomaly'].sum()
    detected_anomalies_correctly = np.sum(predictions[synthetic_df['is_anomaly'] == 1])
    
    print(f"True anomalies in data: {true_anomalies}")
    print(f"Anomalies detected that were true anomalies: {detected_anomalies_correctly}")
    print(f"False positives (normal transactions predicted as anomaly): {np.sum(predictions[synthetic_df['is_anomaly'] == 0])}")

    # Example of a single transaction prediction
    print("\nPredicting a single transaction:")
    sample_normal_transaction = pd.DataFrame([{
        'user_id': 'user_001',
        'timestamp': datetime.now(),
        'amount': 50.0,
        'merchant': 'GroceryStoreA',
        'transaction_type': 'purchase',
        'location': 'city_1',
        'is_anomaly': 0
    }])

    sample_anomaly_transaction = pd.DataFrame([{
        'user_id': 'user_002',
        'timestamp': datetime.now().replace(hour=3), # Unusual time
        'amount': 5000.0, # High value
        'merchant': 'DarkWebVendor',
        'transaction_type': 'transfer',
        'location': 'city_9',
        'is_anomaly': 1
    }])

    processed_normal = loaded_detector.preprocess(sample_normal_transaction)
    processed_anomaly = loaded_detector.preprocess(sample_anomaly_transaction)

    normal_pred = loaded_detector.predict(processed_normal)
    anomaly_pred = loaded_detector.predict(processed_anomaly)

    print(f"Normal transaction prediction: {normal_pred[0]} (0=Normal, 1=Anomaly)")
    print(f"Anomaly transaction prediction: {anomaly_pred[0]} (0=Normal, 1=Anomaly)")



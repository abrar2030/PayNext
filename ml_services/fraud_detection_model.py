import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.preprocessing import LabelEncoder
import joblib

def train_fraud_model(data_path='PayNext/ml_services/synthetic_transactions.csv'):
    df = pd.read_csv(data_path)

    # Feature Engineering
    df["transaction_time"] = pd.to_datetime(df["transaction_time"])
    df["hour"] = df["transaction_time"].dt.hour
    df["day_of_week"] = df["transaction_time"].dt.dayofweek
    df["month"] = df["transaction_time"].dt.month

    # Label Encoding for categorical features
    for col in ["location", "merchant", "transaction_type", "user_id"]:
        if col in df.columns:
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col])
            joblib.dump(le, f'PayNext/ml_services/{col}_encoder.joblib')

    X = df[["transaction_amount", "hour", "day_of_week", "month", "location", "merchant", "transaction_type", "user_id"]]
    y = df["is_fraud"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)

    # Train a RandomForestClassifier
    model = RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced')
    model.fit(X_train, y_train)

    # Evaluate the model
    y_pred = model.predict(X_test)
    print("Fraud Detection Model Report:")
    print(classification_report(y_test, y_pred))
    print("Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred))

    # Save the model
    joblib.dump(model, 'PayNext/ml_services/fraud_model.joblib')
    print("Fraud detection model trained and saved to PayNext/ml_services/fraud_model.joblib")

    # Save feature columns for consistent input during inference
    joblib.dump(X.columns.tolist(), 'PayNext/ml_services/fraud_model_features.joblib')

if __name__ == '__main__':
    train_fraud_model()


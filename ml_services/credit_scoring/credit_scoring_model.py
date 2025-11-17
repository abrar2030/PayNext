
import os

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler


def train_credit_scoring_model(data_path=os.path.join(os.path.dirname(__file__), \'..\', \'common\', \'synthetic_transactions.csv\')):
    df = pd.read_csv(data_path)

    # For credit scoring, we'll need to aggregate transaction data per user
    # and potentially combine with other user-specific data if available.
    # For this example, we'll derive features solely from transactions.

    # Convert transaction_time to datetime
    df["transaction_time"] = pd.to_datetime(df["transaction_time"])
    df = df.sort_values(by=["user_id", "transaction_time"])

    # Feature Engineering based on user's transaction history
    user_features = df.groupby('user_id').agg(
        total_transaction_amount=('transaction_amount', 'sum'),
        avg_transaction_amount=('transaction_amount', 'mean'),
        num_transactions=('transaction_amount', 'count'),
        max_transaction_amount=('transaction_amount', 'max'),
        min_transaction_amount=('transaction_amount', 'min'),
        unique_merchants=('merchant', lambda x: x.nunique()),
        avg_daily_transactions=('transaction_time', lambda x: x.dt.date.nunique() / (x.max() - x.min()).days if (x.max() - x.min()).days > 0 else 0),
        # Add a simple 'risk_score' proxy for demonstration - this would be a target variable
        # In a real scenario, this would come from external data or a more complex derivation
        risk_score=('is_fraud', 'sum') # Sum of fraudulent transactions as a proxy for risk
    ).reset_index()

    # A simple target for credit scoring: users with 0 fraud transactions are 'low_risk' (0), otherwise 'high_risk' (1)
    user_features['credit_risk'] = (user_features['risk_score'] > 0).astype(int)

    # Define features and target
    features = [
        'total_transaction_amount',
        'avg_transaction_amount',
        'num_transactions',
        'max_transaction_amount',
        'min_transaction_amount',
        'unique_merchants',
        'avg_daily_transactions'
    ]
    X = user_features[features]
    y = user_features['credit_risk']

    # Scale numerical features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    model_dir = os.path.join(os.path.dirname(__file__), \'..\')
    joblib.dump(scaler, os.path.join(model_dir, \'credit_scoring_scaler.joblib\'))
    X = pd.DataFrame(X_scaled, columns=features)

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)

    # Train a RandomForestClassifier
    model = RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced')
    model.fit(X_train, y_train)

    # Evaluate model
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]
    print("\nCredit Scoring Model Report:")
    print(classification_report(y_test, y_pred))
    print("ROC AUC Score:", roc_auc_score(y_test, y_proba))

    # Save the model
    joblib.dump(model, os.path.join(model_dir, \'credit_scoring_model.joblib\'))
    joblib.dump(features, os.path.join(model_dir, \'credit_scoring_features.joblib\'))
    print("Credit scoring model trained and saved to PayNext/ml_services/credit_scoring_model.joblib")

if __name__ == '__main__':
    train_credit_scoring_model()



import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
from sklearn.preprocessing import LabelEncoder, StandardScaler
import joblib
import numpy as np

def train_fraud_model(data_path='PayNext/ml_services/synthetic_transactions.csv'):
    df = pd.read_csv(data_path)

    # Convert transaction_time to datetime
    df["transaction_time"] = pd.to_datetime(df["transaction_time"])
    df = df.sort_values(by=["user_id", "transaction_time"])

    # Advanced Feature Engineering
    df["hour"] = df["transaction_time"].dt.hour
    df["day_of_week"] = df["transaction_time"].dt.dayofweek
    df["month"] = df["transaction_time"].dt.month
    df["day_of_month"] = df["transaction_time"].dt.day

    # Time-based features (e.g., transaction velocity, time since last transaction)
    df["time_since_last_txn"] = df.groupby("user_id")["transaction_time"].diff().dt.total_seconds().fillna(0)

    # Calculate rolling features within each user group
    df["user_avg_txn_amount_24h"] = df.groupby("user_id")["transaction_amount"]\
                                       .rolling("24h", on="transaction_time").mean().reset_index(level=0, drop=True)
    df["user_txn_count_24h"] = df.groupby("user_id")["transaction_amount"]\
                                    .rolling("24h", on="transaction_time").count().reset_index(level=0, drop=True)
    df["user_avg_txn_amount_7d"] = df.groupby("user_id")["transaction_amount"]\
                                      .rolling("7D", on="transaction_time").mean().reset_index(level=0, drop=True)
    df["user_txn_count_7d"] = df.groupby("user_id")["transaction_amount"]\
                                   .rolling("7D", on="transaction_time").count().reset_index(level=0, drop=True)

    # Fill NaN values created by rolling windows (for initial transactions)
    df.fillna(0, inplace=True)

    # Label Encoding for categorical features
    categorical_cols = ["location", "merchant", "transaction_type", "user_id"]
    encoders = {}
    for col in categorical_cols:
        if col in df.columns:
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col])
            encoders[col] = le
            joblib.dump(le, f'PayNext/ml_services/{col}_encoder.joblib')

    # Define features and target
    features = ["transaction_amount", "hour", "day_of_week", "month", "day_of_month",
                "location", "merchant", "transaction_type", "user_id",
                "time_since_last_txn", "user_avg_txn_amount_24h", "user_txn_count_24h",
                "user_avg_txn_amount_7d", "user_txn_count_7d"]
    X = df[features]
    y = df["is_fraud"]

    # Scale numerical features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    joblib.dump(scaler, 'PayNext/ml_services/fraud_scaler.joblib')
    X = pd.DataFrame(X_scaled, columns=features)

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)

    # Train a RandomForestClassifier (improved with more features)
    model_rf = RandomForestClassifier(n_estimators=200, random_state=42, class_weight='balanced', max_depth=10, min_samples_leaf=5)
    model_rf.fit(X_train, y_train)

    # Evaluate RandomForest model
    y_pred_rf = model_rf.predict(X_test)
    y_proba_rf = model_rf.predict_proba(X_test)[:, 1]
    print("\nRandomForest Fraud Detection Model Report:")
    print(classification_report(y_test, y_pred_rf))
    print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred_rf))
    print("ROC AUC Score:", roc_auc_score(y_test, y_proba_rf))

    # Train an Isolation Forest for anomaly detection (unsupervised, good for fraud)
    # Note: Isolation Forest doesn't use 'y' for training, but we can evaluate its performance
    # by treating 'is_fraud' as the anomaly label for evaluation purposes.
    model_if = IsolationForest(random_state=42, contamination=y_train.sum() / len(y_train)) # contamination is the proportion of outliers in the data set
    model_if.fit(X_train)

    # Evaluate Isolation Forest model
    # Isolation Forest predicts -1 for anomalies (fraud) and 1 for inliers (non-fraud)
    y_pred_if = model_if.predict(X_test)
    y_pred_if_binary = np.where(y_pred_if == -1, 1, 0) # Convert -1/1 to 1/0 for fraud/non-fraud
    print("\nIsolation Forest Anomaly Detection Report:")
    print(classification_report(y_test, y_pred_if_binary))
    print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred_if_binary))
    # For Isolation Forest, decision_function gives anomaly score. Lower score is more anomalous.
    # We can use negative of decision_function as a 'fraud probability' for ROC AUC.
    y_proba_if = -model_if.decision_function(X_test)
    print("ROC AUC Score:", roc_auc_score(y_test, y_proba_if))

    # Save the best performing model (e.g., RandomForest if ROC AUC is higher, or Isolation Forest for pure anomaly detection)
    # For this example, we'll save RandomForest, but in a real scenario, a meta-learner or ensemble could combine both.
    joblib.dump(model_rf, 'PayNext/ml_services/fraud_model.joblib')
    joblib.dump(model_if, 'PayNext/ml_services/fraud_isolation_forest_model.joblib') # Save IF model as well
    print("Fraud detection RandomForest model trained and saved to PayNext/ml_services/fraud_model.joblib")
    print("Fraud detection Isolation Forest model trained and saved to PayNext/ml_services/fraud_isolation_forest_model.joblib")

    # Save feature columns and scaler for consistent input during inference
    joblib.dump(features, 'PayNext/ml_services/fraud_model_features.joblib')

if __name__ == '__main__':
    train_fraud_model()


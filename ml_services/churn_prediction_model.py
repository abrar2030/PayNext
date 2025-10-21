import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.preprocessing import StandardScaler
import joblib

def train_churn_model(data_path='PayNext/ml_services/synthetic_churn_data.csv'):
    df = pd.read_csv(data_path)

    # For churn prediction, we want to predict churn for the *next* period based on *current* period data.
    # This simplified example will predict if a user is churned in *any* future month based on their last active month.
    # In a real scenario, this would involve more complex time-series feature engineering.

    # Aggregate data per user to get overall behavior metrics
    user_agg = df.groupby('user_id').agg(
        avg_transactions_per_month=('transactions_per_month', 'mean'),
        avg_logins_per_month=('logins_per_month', 'mean'),
        avg_feature_usage_score=('feature_usage_score', 'mean'),
        total_months_active=('month', 'count'),
        ever_churned=('is_churned', 'max') # If a user churned at least once, they are considered churned
    ).reset_index()

    # Define features (X) and target (y)
    X = user_agg[[
        'avg_transactions_per_month',
        'avg_logins_per_month',
        'avg_feature_usage_score',
        'total_months_active'
    ]]
    y = user_agg['ever_churned']

    # Scale numerical features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    joblib.dump(scaler, 'PayNext/ml_services/churn_scaler.joblib')

    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.3, random_state=42, stratify=y)

    # Train a Gradient Boosting Classifier
    model = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=3, random_state=42)
    model.fit(X_train, y_train)

    # Evaluate the model
    y_pred = model.predict(X_test)
    print("Churn Prediction Model Report:")
    print(classification_report(y_test, y_pred))
    print("Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred))

    # Save the model
    joblib.dump(model, 'PayNext/ml_services/churn_model.joblib')
    print("Churn prediction model trained and saved to PayNext/ml_services/churn_model.joblib")

    # Save feature columns for consistent input during inference
    joblib.dump(X.columns.tolist(), 'PayNext/ml_services/churn_model_features.joblib')

if __name__ == '__main__':
    train_churn_model()


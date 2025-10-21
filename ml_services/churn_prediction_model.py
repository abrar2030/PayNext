
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
from sklearn.preprocessing import StandardScaler
import joblib
import lightgbm as lgb 

def train_churn_model(data_path=\'PayNext/ml_services/synthetic_churn_data.csv\'):
    df = pd.read_csv(data_path)

    # Convert month to datetime for time-series features
    df["month_dt"] = pd.to_datetime(df["month"], format=\'%Y-%m\')
    df = df.sort_values(by=["user_id", "month_dt"])

    # Advanced Feature Engineering
    # Lag features for previous month\'s activity
    df["prev_transactions_per_month"] = df.groupby(\'user_id\')[\"transactions_per_month\"]
                                            .shift(1).fillna(0)
    df["prev_logins_per_month"] = df.groupby(\'user_id\')[\"logins_per_month\"]
                                        .shift(1).fillna(0)
    df["prev_feature_usage_score"] = df.groupby(\'user_id\')[\"feature_usage_score\"]
                                           .shift(1).fillna(0)

    # Difference features
    df["transactions_diff"] = df["transactions_per_month"] - df["prev_transactions_per_month"]
    df["logins_diff"] = df["logins_per_month"] - df["prev_logins_per_month"]
    df["feature_usage_diff"] = df["feature_usage_score"] - df["prev_feature_usage_score"]

    # Aggregate data per user to get overall behavior metrics, including new features
    user_agg = df.groupby(\'user_id\').agg(
        avg_transactions_per_month=(\'transactions_per_month\', \'mean\'),
        avg_logins_per_month=(\'logins_per_month\', \'mean\'),
        avg_feature_usage_score=(\'feature_usage_score\', \'mean\'),
        total_months_active=(\'month\', \'count\'),
        ever_churned=(\'is_churned\', \'max\'), # If a user churned at least once, they are considered churned
        # Aggregations for new features
        avg_transactions_diff=(\'transactions_diff\', \'mean\'),
        avg_logins_diff=(\'logins_diff\', \'mean\'),
        avg_feature_usage_diff=(\'feature_usage_diff\', \'mean\'),
        max_transactions_per_month=(\'transactions_per_month\', \'max\'),
        min_transactions_per_month=(\'transactions_per_month\', \'min\')
    ).reset_index()

    # Define features (X) and target (y)
    X = user_agg[[
        "avg_transactions_per_month",
        "avg_logins_per_month",
        "avg_feature_usage_score",
        "total_months_active",
        "avg_transactions_diff",
        "avg_logins_diff",
        "avg_feature_usage_diff",
        "max_transactions_per_month",
        "min_transactions_per_month"
    ]]
    y = user_agg[\"ever_churned\"]

    # Scale numerical features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    joblib.dump(scaler, \'PayNext/ml_services/churn_scaler.joblib\')
    X_scaled_df = pd.DataFrame(X_scaled, columns=X.columns)

    X_train, X_test, y_train, y_test = train_test_split(X_scaled_df, y, test_size=0.3, random_state=42, stratify=y)

    # Train a LightGBM Classifier (often outperforms GradientBoosting and RandomForest)
    model_lgb = lgb.LGBMClassifier(random_state=42, n_estimators=200, learning_rate=0.05, num_leaves=31)
    model_lgb.fit(X_train, y_train)

    # Evaluate LightGBM model
    y_pred_lgb = model_lgb.predict(X_test)
    y_proba_lgb = model_lgb.predict_proba(X_test)[:, 1]
    print("\nLightGBM Churn Prediction Model Report:")
    print(classification_report(y_test, y_pred_lgb))
    print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred_lgb))
    print("ROC AUC Score:", roc_auc_score(y_test, y_proba_lgb))

    # Save the LightGBM model
    joblib.dump(model_lgb, \'PayNext/ml_services/churn_model.joblib\')
    print("Churn prediction LightGBM model trained and saved to PayNext/ml_services/churn_model.joblib")

    # Save feature columns for consistent input during inference
    joblib.dump(X.columns.tolist(), \'PayNext/ml_services/churn_model_features.joblib\')

if __name__ == \'__main__\':
    train_churn_model()


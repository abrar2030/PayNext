
import os

import joblib
import lightgbm as lgb
import pandas as pd
from sklearn.metrics import (classification_report, confusion_matrix,
                             roc_auc_score)
from sklearn.model_selection import GridSearchCV, train_test_split
from sklearn.preprocessing import StandardScaler


def train_churn_model(data_path=os.path.join(os.path.dirname(__file__), \'..\', \'synthetic_churn_data.csv\')):
    df = pd.read_csv(data_path)

    # Convert month to datetime for time-series features
    df["month_dt"] = pd.to_datetime(df["month"], format=\'%Y-%m\')
    df = df.sort_values(by=["user_id", "month_dt"])

    # Rolling window features for user activity trends
    df["rolling_avg_transactions_3m"] = df.groupby("user_id")["transactions_per_month"].rolling(window=3).mean().reset_index(level=0, drop=True)
    df["rolling_std_transactions_3m"] = df.groupby("user_id")["transactions_per_month"].rolling(window=3).std().reset_index(level=0, drop=True)
    df["rolling_avg_logins_3m"] = df.groupby("user_id")["logins_per_month"].rolling(window=3).mean().reset_index(level=0, drop=True)
    df["rolling_std_logins_3m"] = df.groupby("user_id")["logins_per_month"].rolling(window=3).std().reset_index(level=0, drop=True)

    # Fill NaN values created by rolling windows (for initial months)
    df.fillna(0, inplace=True)

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
        # Add a feature for user tenure (e.g., months since first transaction)
        tenure_months=(\'month_dt\', lambda x: (x.max() - x.min()).days / 30.0 if len(x) > 1 else 0),
        ever_churned=(\'is_churned\', \'max\'), # If a user churned at least once, they are considered churned
        # Aggregations for new features
        avg_transactions_diff=(\'transactions_diff\', \'mean\'),
        avg_logins_diff=(\'logins_diff\', \'mean\'),
        avg_feature_usage_diff=(\'feature_usage_diff\', \'mean\'),
        max_transactions_per_month=(\'transactions_per_month\', \'max\'),
        min_transactions_per_month=("transactions_per_month", "min"),
        avg_rolling_avg_transactions_3m=("rolling_avg_transactions_3m", "mean"),
        avg_rolling_std_transactions_3m=("rolling_std_transactions_3m", "mean"),
        avg_rolling_avg_logins_3m=("rolling_avg_logins_3m", "mean"),
        avg_rolling_std_logins_3m=("rolling_std_logins_3m", "mean")
    ).reset_index()

    # Define features (X) and target (y)
    X = user_agg[[
        "avg_transactions_per_month",
        "avg_logins_per_month",
        "avg_feature_usage_score",
        "total_months_active",
        "tenure_months",
        "avg_transactions_diff",
        "avg_logins_diff",
        "avg_feature_usage_diff",
        "max_transactions_per_month",
        "min_transactions_per_month",
        "avg_rolling_avg_transactions_3m",
        "avg_rolling_std_transactions_3m",
        "avg_rolling_avg_logins_3m",
        "avg_rolling_std_logins_3m"
    ]]
    y = user_agg[\"ever_churned\"]

    # Scale numerical features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    model_dir = os.path.join(os.path.dirname(__file__), \'..\')
    joblib.dump(scaler, os.path.join(model_dir, \'churn_scaler.joblib\'))
    X_scaled_df = pd.DataFrame(X_scaled, columns=X.columns)

    X_train, X_test, y_train, y_test = train_test_split(X_scaled_df, y, test_size=0.3, random_state=42, stratify=y)

    # Train a LightGBM Classifier (often outperforms GradientBoosting and RandomForest)
    # Train a LightGBM Classifier with GridSearchCV for hyperparameter tuning
    param_grid = {
        'n_estimators': [100, 200, 300],
        'learning_rate': [0.01, 0.05, 0.1],
        'num_leaves': [20, 31, 40],
        'max_depth': [-1, 10, 20]
    }
    
    lgbm = lgb.LGBMClassifier(random_state=42, class_weight='balanced') # Add class_weight for imbalanced data
    grid_search = GridSearchCV(lgbm, param_grid, cv=3, scoring='roc_auc', verbose=1, n_jobs=-1)
    grid_search.fit(X_train, y_train)
    
    model_lgb = grid_search.best_estimator_
    print(f"Best LightGBM parameters: {grid_search.best_params_}")

    # Evaluate LightGBM model
    y_pred_lgb = model_lgb.predict(X_test)
    y_proba_lgb = model_lgb.predict_proba(X_test)[:, 1]
    print("\nLightGBM Churn Prediction Model Report:")
    print(classification_report(y_test, y_pred_lgb))
    print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred_lgb))
    print("ROC AUC Score:", roc_auc_score(y_test, y_proba_lgb))

    # Save the LightGBM model
    joblib.dump(model_lgb, os.path.join(model_dir, \'churn_model.joblib\'))
    print("Churn prediction LightGBM model trained and saved to PayNext/ml_services/churn_model.joblib")

    # Save feature columns for consistent input during inference
    joblib.dump(X.columns.tolist(), os.path.join(model_dir, \'churn_model_features.joblib\'))

if __name__ == \'__main__\':
    train_churn_model()


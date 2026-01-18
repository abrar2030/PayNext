import os
import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from core.logging import get_logger

logger = get_logger(__name__)


def train_credit_scoring_model(
    data_path: str = os.path.join(
        os.path.dirname(__file__), "..", "common", "synthetic_transactions.csv"
    )
) -> Any:
    """
    Train a RandomForestClassifier for credit scoring based on user transaction history.

    Args:
        data_path: Path to synthetic transaction CSV containing 'user_id', 'transaction_amount', 'merchant',
                   'transaction_time', and 'is_fraud' columns.
    """
    df = pd.read_csv(data_path)
    df["transaction_time"] = pd.to_datetime(df["transaction_time"])
    df = df.sort_values(by=["user_id", "transaction_time"])
    user_features = (
        df.groupby("user_id")
        .agg(
            total_transaction_amount=("transaction_amount", "sum"),
            avg_transaction_amount=("transaction_amount", "mean"),
            num_transactions=("transaction_amount", "count"),
            max_transaction_amount=("transaction_amount", "max"),
            min_transaction_amount=("transaction_amount", "min"),
            unique_merchants=("merchant", lambda x: x.nunique()),
            avg_daily_transactions=(
                "transaction_time",
                lambda x: x.dt.date.nunique() / ((x.max() - x.min()).days or 1),
            ),
            risk_score=("is_fraud", "sum"),
        )
        .reset_index()
    )
    user_features["credit_risk"] = (user_features["risk_score"] > 0).astype(int)
    feature_cols = [
        "total_transaction_amount",
        "avg_transaction_amount",
        "num_transactions",
        "max_transaction_amount",
        "min_transaction_amount",
        "unique_merchants",
        "avg_daily_transactions",
    ]
    X = user_features[feature_cols]
    y = user_features["credit_risk"]
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    model_dir = os.path.join(os.path.dirname(__file__), "..")
    joblib.dump(scaler, os.path.join(model_dir, "credit_scoring_scaler.joblib"))
    X = pd.DataFrame(X_scaled, columns=feature_cols)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=42, stratify=y
    )
    model = RandomForestClassifier(
        n_estimators=100, random_state=42, class_weight="balanced"
    )
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]
    logger.info(
        "Credit Scoring Model Report:\n" + classification_report(y_test, y_pred)
    )
    logger.info(f"ROC AUC Score: {roc_auc_score(y_test, y_proba):.4f}")
    joblib.dump(model, os.path.join(model_dir, "credit_scoring_model.joblib"))
    joblib.dump(feature_cols, os.path.join(model_dir, "credit_scoring_features.joblib"))
    logger.info("Credit scoring model, scaler, and features saved successfully.")


if __name__ == "__main__":
    train_credit_scoring_model()

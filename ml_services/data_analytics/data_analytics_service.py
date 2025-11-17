import joblib
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler


class DataAnalyticsService:
    def __init__(self):
        self.user_scaler = None
        self.kmeans_model = None
        self.segment_features = [
            "total_amount",
            "transaction_count",
            "avg_transaction_amount",
            "unique_merchants",
            "unique_transaction_types",
        ]

    def preprocess_transactions_for_segmentation(self, df):
        # Aggregate transaction data per user
        user_data = (
            df.groupby("user_id")
            .agg(
                total_amount=("amount", "sum"),
                transaction_count=("amount", "count"),
                avg_transaction_amount=("amount", "mean"),
                unique_merchants=("merchant", lambda x: x.nunique()),
                unique_transaction_types=("transaction_type", lambda x: x.nunique()),
            )
            .reset_index()
        )

        # Handle potential NaN values after aggregation (e.g., if a user has no transactions)
        user_data = user_data.fillna(0)

        # Scale numerical features for clustering
        if self.user_scaler is None:
            self.user_scaler = StandardScaler()
            scaled_features = self.user_scaler.fit_transform(
                user_data[self.segment_features]
            )
        else:
            scaled_features = self.user_scaler.transform(
                user_data[self.segment_features]
            )

        scaled_df = pd.DataFrame(
            scaled_features, columns=self.segment_features, index=user_data["user_id"]
        )
        return scaled_df, user_data[["user_id"]]

    def train_user_segmentation_model(self, df, n_clusters=5, random_state=42):
        X_scaled, user_ids_df = self.preprocess_transactions_for_segmentation(df)
        self.kmeans_model = KMeans(
            n_clusters=n_clusters, random_state=random_state, n_init=10
        )  # n_init to suppress warning
        self.kmeans_model.fit(X_scaled)
        user_segments = user_ids_df.copy()
        user_segments["segment"] = self.kmeans_model.labels_
        return user_segments

    def predict_user_segment(self, df):
        if self.kmeans_model is None or self.user_scaler is None:
            raise ValueError(
                "Model not trained. Please train the user segmentation model first."
            )

        X_scaled, user_ids_df = self.preprocess_transactions_for_segmentation(df)
        user_segments = user_ids_df.copy()
        user_segments["segment"] = self.kmeans_model.predict(X_scaled)
        return user_segments

    def analyze_transaction_trends(self, df, time_granularity="daily"):
        df_copy = df.copy()
        df_copy["timestamp"] = pd.to_datetime(df_copy["timestamp"])
        df_copy = df_copy.set_index("timestamp")

        if time_granularity == "daily":
            resampled_df = df_copy.resample("D")
        elif time_granularity == "weekly":
            resampled_df = df_copy.resample("W")
        elif time_granularity == "monthly":
            resampled_df = df_copy.resample("M")
        else:
            raise ValueError("time_granularity must be 'daily', 'weekly', or 'monthly'")

        trends = resampled_df.agg(
            total_transactions=("amount", "count"),
            total_amount_spent=("amount", "sum"),
            average_transaction_amount=("amount", "mean"),
        ).fillna(0)
        return trends

    def analyze_geospatial_patterns(self, df):
        location_summary = (
            df.groupby("location")
            .agg(
                total_transactions=("amount", "count"),
                total_amount_spent=("amount", "sum"),
                average_transaction_amount=("amount", "mean"),
            )
            .reset_index()
        )
        return location_summary.sort_values(by="total_amount_spent", ascending=False)

    def save_models(self, path):
        joblib.dump(
            {
                "user_scaler": self.user_scaler,
                "kmeans_model": self.kmeans_model,
                "segment_features": self.segment_features,
            },
            path,
        )

    @classmethod
    def load_models(cls, path):
        data = joblib.load(path)
        service = cls()
        service.user_scaler = data["user_scaler"]
        service.kmeans_model = data["kmeans_model"]
        service.segment_features = data["segment_features"]
        return service


if __name__ == "__main__":
    # Generate synthetic data (assuming anomaly_data_generator can be reused or adapted)
    # For this example, we'll use the anomaly_data_generator for transaction data
    try:
        from ..anomaly_detection.anomaly_data_generator import \
            generate_synthetic_transaction_data
    except ImportError:
        # Fallback for direct script execution
        import os
        import sys

        sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
        from anomaly_detection.anomaly_data_generator import \
            generate_synthetic_transaction_data
    print("Generating synthetic transaction data for analytics...")
    synthetic_transactions_df = generate_synthetic_transaction_data(
        num_transactions=100000, num_users=500, anomaly_ratio=0.0
    )
    print("Synthetic data generated.")

    analytics_service = DataAnalyticsService()

    # --- User Segmentation ---
    print("\nTraining User Segmentation model...")
    user_segments_df = analytics_service.train_user_segmentation_model(
        synthetic_transactions_df, n_clusters=4
    )
    print("User Segmentation trained and segments assigned.")
    print("User segments head:")
    print(user_segments_df.head())
    print("Segment distribution:")
    print(user_segments_df["segment"].value_counts())

    # Save and load segmentation model
    analytics_service.save_models("analytics_models.joblib")
    loaded_analytics_service = DataAnalyticsService.load_models(
        "analytics_models.joblib"
    )
    print("Analytics models saved and loaded.")

    # Predict segments for new data (or same data for demo)
    predicted_segments = loaded_analytics_service.predict_user_segment(
        synthetic_transactions_df.sample(100)
    )
    print("\nPredicted segments for a sample of users:")
    print(predicted_segments.head())

    # --- Transaction Trend Analysis ---
    print("\nPerforming Daily Transaction Trend Analysis...")
    daily_trends = analytics_service.analyze_transaction_trends(
        synthetic_transactions_df, time_granularity="daily"
    )
    print("Daily Trends head:")
    print(daily_trends.head())

    print("\nPerforming Monthly Transaction Trend Analysis...")
    monthly_trends = analytics_service.analyze_transaction_trends(
        synthetic_transactions_df, time_granularity="monthly"
    )
    print("Monthly Trends head:")
    print(monthly_trends.head())

    # --- Geospatial Pattern Analysis ---
    print("\nPerforming Geospatial Pattern Analysis...")
    geospatial_summary = analytics_service.analyze_geospatial_patterns(
        synthetic_transactions_df
    )
    print("Geospatial Summary head:")
    print(geospatial_summary.head())

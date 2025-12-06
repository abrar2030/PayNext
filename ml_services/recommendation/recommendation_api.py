import os
from typing import Dict, List

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from core.logging import get_logger

logger = get_logger(__name__)

app = FastAPI(title="Recommendation API")

# Define the path to the models and data relative to the current file
model_dir = os.path.join(
    os.path.dirname(__file__), ".."
)  # Go up one level to ml_services
kmeans_model_path = os.path.join(model_dir, "recommendation_kmeans_model.joblib")
scaler_path = os.path.join(model_dir, "recommendation_scaler.joblib")
user_spending_clusters_path = os.path.join(model_dir, "user_spending_clusters.csv")
recommendation_features_path = os.path.join(model_dir, "recommendation_features.joblib")

kmeans_model = None
scaler = None
user_spending_clusters = None
recommendation_features = None
cluster_characteristics: Dict = {}

try:
    kmeans_model = joblib.load(kmeans_model_path)
    scaler = joblib.load(scaler_path)
    user_spending_clusters = pd.read_csv(user_spending_clusters_path)
    recommendation_features = joblib.load(recommendation_features_path)
    logger.info("Recommendation Model, Scaler, and Data loaded successfully.")

    # Pre-compute cluster characteristics for more dynamic recommendations
    def get_cluster_characteristics(df):
        if df is None:
            return {}
        cluster_cols = [col for col in df.columns if col not in ["user_id", "cluster"]]
        return df.groupby("cluster")[cluster_cols].mean().to_dict("index")

    cluster_characteristics = get_cluster_characteristics(user_spending_clusters)

except FileNotFoundError as e:
    logger.info(
        f"Recommendation model or data file not found: {e}. Please train the model first."
    )
except Exception as e:
    logger.info(f"Error loading Recommendation Model components: {e}")


class UserRecommendationInput(BaseModel):
    user_id: str


@app.get("/health")
async def health_check():
    return {"status": "ok", "model_loaded": kmeans_model is not None}


@app.post("/get_recommendations/")
async def get_recommendations(user_input: UserRecommendationInput):
    if (
        kmeans_model is None
        or not cluster_characteristics
        or user_spending_clusters is None
    ):
        raise HTTPException(
            status_code=500,
            detail="Recommendation model or data not loaded. Please train the model.",
        )

    user_id = user_input.user_id

    # Fetch user's data from the pre-computed clusters file
    user_data = user_spending_clusters[user_spending_clusters["user_id"] == user_id]

    if user_data.empty:
        # In a real app, you might fetch live transaction data, process it, and predict the cluster
        raise HTTPException(
            status_code=404,
            detail="User not found or no spending data available for recommendations.",
        )

    user_cluster = user_data["cluster"].iloc[0]
    user_metrics = user_data.iloc[0]

    # Generate dynamic recommendations based on cluster characteristics
    recommendations = []
    cluster_avg = cluster_characteristics.get(user_cluster, {})

    # Example of dynamic recommendations
    # Check if 'total_spent' exists in user_metrics and cluster_avg before comparison
    user_total_spent = user_metrics.get("total_spent", 0)
    cluster_avg_total_spent = cluster_avg.get("total_spent", 0)
    if user_total_spent > cluster_avg_total_spent * 1.5:
        recommendations.append(
            "Your spending is significantly higher than others in your segment. Consider reviewing your budget."
        )

    # Find the top spending category for the user
    spending_cols = [col for col in user_metrics.index if "spent_on_" in col]
    if spending_cols:
        top_category = max(spending_cols, key=lambda col: user_metrics.get(col, 0))
        recommendations.append(
            f"Your highest spending is in '{top_category.replace('spent_on_', '')}'. Look for deals or cashback offers in this category."
        )

    # Check if 'num_transactions' exists before comparison
    user_num_transactions = user_metrics.get("num_transactions", 0)
    cluster_avg_num_transactions = cluster_avg.get("num_transactions", 0)
    if user_num_transactions < cluster_avg_num_transactions * 0.7:
        recommendations.append(
            "You make fewer transactions than your peers. Are you taking full advantage of our payment features?"
        )

    # Generic recommendations based on cluster, as a fallback
    if not recommendations:
        if user_cluster == 0:
            recommendations.append(
                "As a low-frequency user, explore our features for bill payments and subscriptions."
            )
        elif user_cluster in [1, 4]:
            recommendations.append(
                "You are a power user! Check out our premium features for even more benefits."
            )
        elif user_cluster == 2:
            recommendations.append(
                "You seem to be a frequent traveler. Look into our travel insurance and FX rate offers."
            )
        else:
            recommendations.append(
                "Review your monthly statements to find opportunities for savings."
            )

    return {
        "user_id": user_id,
        "cluster": int(user_cluster),
        "recommendations": recommendations,
    }

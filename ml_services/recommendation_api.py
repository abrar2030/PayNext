_api.py
import pandas as pd
from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

# Load the trained KMeans model, scaler, and feature list
try:
    kmeans_model = joblib.load("PayNext/ml_services/recommendation_kmeans_model.joblib")
    scaler = joblib.load("PayNext/ml_services/recommendation_scaler.joblib")
    user_spending_clusters = pd.read_csv("PayNext/ml_services/user_spending_clusters.csv")
    recommendation_features = joblib.load("PayNext/ml_services/recommendation_features.joblib")
except Exception as e:
    print(f"Error loading recommendation model or data: {e}")
    kmeans_model = None

# Pre-compute cluster characteristics for more dynamic recommendations
def get_cluster_characteristics(df):
    if df is None:
        return {}
    # Exclude user_id and cluster columns before calculating means
    cluster_cols = [col for col in df.columns if col not in ['user_id', 'cluster']]
    return df.groupby('cluster')[cluster_cols].mean().to_dict('index')

cluster_characteristics = get_cluster_characteristics(user_spending_clusters)

@app.route("/get_recommendations", methods=["POST"])
def get_recommendations():
    if kmeans_model is None or not cluster_characteristics:
        return jsonify({"error": "Recommendation model or data not loaded"}), 500

    data = request.get_json(force=True)
    if not data or "user_id" not in data:
        return jsonify({"error": "No user_id provided"}), 400

    user_id = data.get("user_id")

    # Fetch user's data from the pre-computed clusters file
    user_data = user_spending_clusters[user_spending_clusters["user_id"] == user_id]

    if user_data.empty:
        # In a real app, you might fetch live transaction data, process it, and predict the cluster
        return jsonify({"message": "User not found or no spending data available for recommendations.", "recommendations": []}), 404

    user_cluster = user_data["cluster"].iloc[0]
    user_metrics = user_data.iloc[0]

    # Generate dynamic recommendations based on cluster characteristics
    recommendations = []
    cluster_avg = cluster_characteristics.get(user_cluster, {})

    # Example of dynamic recommendations
    if user_metrics.get('total_spent', 0) > cluster_avg.get('total_spent', 0) * 1.5:
        recommendations.append("Your spending is significantly higher than others in your segment. Consider reviewing your budget.")

    # Find the top spending category for the user
    spending_cols = [col for col in user_metrics.index if 'spent_on_' in col]
    if spending_cols:
        top_category = max(spending_cols, key=lambda col: user_metrics.get(col, 0))
        recommendations.append(f"Your highest spending is in '{top_category.replace('spent_on_','')}'. Look for deals or cashback offers in this category.")

    if user_metrics.get('num_transactions', 0) < cluster_avg.get('num_transactions', 0) * 0.7:
        recommendations.append("You make fewer transactions than your peers. Are you taking full advantage of our payment features?")
    
    # Generic recommendations based on cluster, as a fallback
    if not recommendations:
        if user_cluster == 0:
            recommendations.append("As a low-frequency user, explore our features for bill payments and subscriptions.")
        elif user_cluster in [1, 4]:
            recommendations.append("You are a power user! Check out our premium features for even more benefits.")
        elif user_cluster == 2:
            recommendations.append("You seem to be a frequent traveler. Look into our travel insurance and FX rate offers.")
        else:
            recommendations.append("Review your monthly statements to find opportunities for savings.")

    return jsonify({
        "user_id": user_id,
        "cluster": int(user_cluster),
        "recommendations": recommendations
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)


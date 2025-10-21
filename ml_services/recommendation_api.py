from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

# Load the trained KMeans model and scaler
try:
    kmeans_model = joblib.load("/home/ubuntu/PayNext/ml_services/recommendation_kmeans_model.joblib")
    scaler = joblib.load("/home/ubuntu/PayNext/ml_services/recommendation_scaler.joblib")
    user_spending_clusters = pd.read_csv("/home/ubuntu/PayNext/ml_services/user_spending_clusters.csv")
except Exception as e:
    print(f"Error loading recommendation model or scaler: {e}")
    kmeans_model = None

@app.route("/get_recommendations", methods=["POST"])
def get_recommendations():
    if kmeans_model is None:
        return jsonify({"error": "Recommendation model not loaded"}), 500

    data = request.get_json(force=True)
    if not data or "user_id" not in data:
        return jsonify({"error": "No user_id provided"}), 400

    user_id = data.get("user_id")

    # In a real application, you would fetch the user's current spending data
    # For this example, we'll look up the user's cluster from the pre-computed data
    user_data = user_spending_clusters[user_spending_clusters["user_id"] == user_id]

    if user_data.empty:
        return jsonify({"message": "User not found or no spending data available for recommendations.", "recommendations": []}), 404

    user_cluster = user_data["cluster"].iloc[0]

    # Generate recommendations based on the cluster
    # This is a simplified example; real recommendations would be more sophisticated
    recommendations = []
    if user_cluster == 0:
        recommendations = ["Consider investing in low-risk savings accounts.", "Review your subscription services for potential savings."]
    elif user_cluster == 1:
        recommendations = ["Explore options for travel rewards credit cards.", "Look into international money transfer services."]
    elif user_cluster == 2:
        recommendations = ["Focus on reducing discretionary spending.", "Utilize budgeting tools to track expenses."]
    elif user_cluster == 3:
        recommendations = ["You have a high spending on online shopping, consider setting a budget for it.", "Explore cashback options for your frequent purchases."]
    elif user_cluster == 4:
        recommendations = ["Consider setting up an emergency fund.", "Look for opportunities to invest in diversified portfolios."]
    else:
        recommendations = ["No specific recommendations available for your spending pattern at this time."]

    return jsonify({
        "user_id": user_id,
        "cluster": int(user_cluster),
        "recommendations": recommendations
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)


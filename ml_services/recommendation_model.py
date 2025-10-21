import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import joblib

def train_recommendation_model(data_path='PayNext/ml_services/synthetic_transactions.csv', num_clusters=5):
    df = pd.read_csv(data_path)

    # Aggregate transaction data by user to get spending patterns
    user_spending = df.groupby('user_id').agg(
        total_spent=('transaction_amount', 'sum'),
        avg_transaction_amount=('transaction_amount', 'mean'),
        num_transactions=('user_id', 'count')
    ).reset_index()

    # Feature Engineering for recommendations
    X = user_spending[["total_spent", "avg_transaction_amount", "num_transactions"]]

    # Scale the features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    joblib.dump(scaler, 'PayNext/ml_services/recommendation_scaler.joblib')

    # Train KMeans clustering model
    kmeans = KMeans(n_clusters=num_clusters, random_state=42, n_init=10)
    user_spending["cluster"] = kmeans.fit_predict(X_scaled)

    # Save the KMeans model
    joblib.dump(kmeans, 'PayNext/ml_services/recommendation_kmeans_model.joblib')
    print(f"Recommendation KMeans model trained with {num_clusters} clusters and saved to PayNext/ml_services/recommendation_kmeans_model.joblib")

    # Save user spending with clusters for potential analysis or initial recommendations
    user_spending.to_csv('PayNext/ml_services/user_spending_clusters.csv', index=False)
    print("User spending with clusters saved to PayNext/ml_services/user_spending_clusters.csv")
    print(user_spending.head())

if __name__ == '__main__':
    train_recommendation_model()



import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import joblib

def train_recommendation_model(data_path=\'PayNext/ml_services/synthetic_transactions.csv\'
                               , num_clusters=7): # Increased number of clusters for more granularity
    df_transactions = pd.read_csv(data_path)

    # Convert transaction_time to datetime if available and needed for future time-based features
    if \'transaction_time\' in df_transactions.columns:
        df_transactions["transaction_time"] = pd.to_datetime(df_transactions["transaction_time"])

    # Aggregate transaction data by user to get overall spending patterns
    user_spending = df_transactions.groupby(\'user_id\').agg(
        total_spent=(\'transaction_amount\', \'sum\'),
        avg_transaction_amount=(\'transaction_amount\', \'mean\'),
        num_transactions=(\'user_id\', \'count\'),
        max_transaction_amount=(\'transaction_amount\', \'max\'),
        min_transaction_amount=(\'transaction_amount\', \'min\'),
        unique_merchants=(\'merchant\', lambda x: x.nunique()),
        # Calculate average daily transactions over the period the user is active
        avg_daily_transactions=(\'transaction_time\', lambda x: x.dt.date.nunique() / (x.max() - x.min()).days if (x.max() - x.min()).days > 0 else 0)
    ).reset_index()

    # Incorporate spending patterns by transaction type (as a proxy for categories)
    # Pivot table to get spending per transaction type for each user
    spending_by_type = df_transactions.groupby([\'user_id\', \'transaction_type\'])[\'transaction_amount\'].sum().unstack(fill_value=0)
    spending_by_type.columns = [f\'spent_on_{col}\' for col in spending_by_type.columns]
    user_spending = user_spending.merge(spending_by_type, on=\'user_id\', how=\'left\')
    user_spending.fillna(0, inplace=True)

    # Define features for clustering
    # Exclude \'user_id\' and potentially \'avg_daily_transactions\' if it\'s mostly zeros or NaN
    features = [col for col in user_spending.columns if col not in [\'user_id\']]
    X = user_spending[features]

    # Scale the features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    joblib.dump(scaler, \'PayNext/ml_services/recommendation_scaler.joblib\')

    # Train KMeans clustering model
    kmeans = KMeans(n_clusters=num_clusters, random_state=42, n_init=10)
    user_spending["cluster"] = kmeans.fit_predict(X_scaled)

    # Save the KMeans model
    joblib.dump(kmeans, \'PayNext/ml_services/recommendation_kmeans_model.joblib\')
    print(f"Recommendation KMeans model trained with {num_clusters} clusters and saved to PayNext/ml_services/recommendation_kmeans_model.joblib")

    # Save user spending with clusters for potential analysis or initial recommendations
    user_spending.to_csv(\'PayNext/ml_services/user_spending_clusters.csv\', index=False)
    print("User spending with clusters saved to PayNext/ml_services/user_spending_clusters.csv")
    print(user_spending.head())

    # Save the list of features used for consistent input during inference
    joblib.dump(features, \'PayNext/ml_services/recommendation_features.joblib\')

if __name__ == \'__main__\':
    train_recommendation_model()


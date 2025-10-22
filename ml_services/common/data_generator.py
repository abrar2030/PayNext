
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_synthetic_data(num_transactions=10000):
    np.random.seed(42)

    # Generate user IDs
    user_ids = [f'user_{i:04d}' for i in range(1000)]

    data = []
    start_date = datetime(2024, 1, 1)

    for i in range(num_transactions):
        user_id = np.random.choice(user_ids)
        transaction_amount = round(np.random.uniform(5, 2000), 2)
        transaction_time = start_date + timedelta(minutes=np.random.randint(0, 365 * 24 * 60))
        location = np.random.choice(['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Remote'])
        merchant = np.random.choice(['Starbucks', 'Amazon', 'Walmart', 'Shell', 'Netflix', 'Local Store', 'Online Service'])
        transaction_type = np.random.choice(['purchase', 'withdrawal', 'transfer'])

        # Introduce some fraudulent transactions
        is_fraud = 0
        if np.random.rand() < 0.02:  # 2% of transactions are potentially fraudulent
            is_fraud = 1
            # Make fraudulent transactions stand out (e.g., unusually high amount, unusual location)
            if np.random.rand() < 0.5: # High amount fraud
                transaction_amount = round(np.random.uniform(2000, 10000), 2)
            else: # Unusual location/time fraud
                location = np.random.choice(['Nigeria', 'Russia', 'Unknown IP'])
                transaction_time = transaction_time + timedelta(hours=np.random.randint(24, 72)) # Delay

        data.append([
            user_id,
            transaction_amount,
            transaction_time,
            location,
            merchant,
            transaction_type,
            is_fraud
        ])

    df = pd.DataFrame(data, columns=[
        'user_id',
        'transaction_amount',
        'transaction_time',
        'location',
        'merchant',
        'transaction_type',
        'is_fraud'
    ])
    return df

if __name__ == '__main__':
    df = generate_synthetic_data(num_transactions=50000)
    df.to_csv('PayNext/ml_services/synthetic_transactions.csv', index=False)
    print("Synthetic transaction data generated and saved to PayNext/ml_services/synthetic_transactions.csv")
    print(df.head())
    print(df['is_fraud'].value_counts())


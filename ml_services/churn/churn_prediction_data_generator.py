
import pandas as pd
import os
import numpy as np
from datetime import datetime, timedelta

def generate_churn_data(num_users=1000, num_months=12):
    np.random.seed(44)

    user_ids = [f'user_{i:04d}' for i in range(num_users)]
    start_date = datetime(2024, 1, 1)

    all_user_data = []

    for user_id in user_ids:
        # Initial activity level
        base_transactions_per_month = np.random.randint(5, 30)
        base_logins_per_month = np.random.randint(10, 60)
        base_feature_usage_score = np.random.uniform(0.1, 1.0)

        churn_month = -1 # -1 means no churn
        if np.random.rand() < 0.15: # 15% of users will churn
            churn_month = np.random.randint(3, num_months - 1) # Churn between month 3 and num_months-1

        for month_offset in range(num_months):
            current_month = start_date + timedelta(days=30 * month_offset)

            transactions_per_month = base_transactions_per_month * (1 + np.random.uniform(-0.2, 0.2))
            logins_per_month = base_logins_per_month * (1 + np.random.uniform(-0.2, 0.2))
            feature_usage_score = base_feature_usage_score * (1 + np.random.uniform(-0.1, 0.1))

            is_churned = 0
            if churn_month != -1 and month_offset >= churn_month:
                # Activity drops significantly after churn month
                transactions_per_month *= np.random.uniform(0.0, 0.1)
                logins_per_month *= np.random.uniform(0.0, 0.1)
                feature_usage_score *= np.random.uniform(0.0, 0.1)
                is_churned = 1

            all_user_data.append([
                user_id,
                current_month.strftime("%Y-%m"),
                max(0, round(transactions_per_month)),
                max(0, round(logins_per_month)),
                round(feature_usage_score, 2),
                is_churned
            ])

    df = pd.DataFrame(all_user_data, columns=[
        'user_id',
        'month',
        'transactions_per_month',
        'logins_per_month',
        'feature_usage_score',
        'is_churned'
    ])
    return df

if __name__ == '__main__':
    df = generate_churn_data(num_users=5000, num_months=12)
    output_path = os.path.join(os.path.dirname(__file__), \'synthetic_churn_data.csv\')
    df.to_csv(output_path, index=False)
    print(f"Synthetic churn data generated and saved to {output_path}")
    print(df.head())
    print(df['is_churned'].value_counts())


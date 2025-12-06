import os
from datetime import datetime, timedelta

import numpy as np
import pandas as pd

from core.logging import get_logger

logger = get_logger(__name__)


def generate_churn_data(num_users: int = 1000, num_months: int = 12) -> pd.DataFrame:
    """
    Generate synthetic user churn dataset.

    Args:
        num_users: Number of users to simulate.
        num_months: Number of months to simulate for each user.

    Returns:
        pd.DataFrame: DataFrame containing user activity and churn labels.
    """
    np.random.seed(44)

    user_ids = [f"user_{i:04d}" for i in range(num_users)]
    start_date = datetime(2024, 1, 1)

    all_user_data = []

    for user_id in user_ids:
        # Initial activity levels
        base_transactions = np.random.randint(5, 30)
        base_logins = np.random.randint(10, 60)
        base_feature_usage = np.random.uniform(0.1, 1.0)

        # Determine churn month (-1 = no churn)
        churn_month = -1
        if np.random.rand() < 0.15:  # 15% churn probability
            churn_month = np.random.randint(3, num_months - 1)

        for month_offset in range(num_months):
            current_month = start_date + timedelta(days=30 * month_offset)

            transactions = base_transactions * (1 + np.random.uniform(-0.2, 0.2))
            logins = base_logins * (1 + np.random.uniform(-0.2, 0.2))
            feature_usage = base_feature_usage * (1 + np.random.uniform(-0.1, 0.1))

            is_churned = 0
            if churn_month != -1 and month_offset >= churn_month:
                # Activity drops significantly after churn
                transactions *= np.random.uniform(0.0, 0.1)
                logins *= np.random.uniform(0.0, 0.1)
                feature_usage *= np.random.uniform(0.0, 0.1)
                is_churned = 1

            all_user_data.append(
                [
                    user_id,
                    current_month.strftime("%Y-%m"),
                    max(0, round(transactions)),
                    max(0, round(logins)),
                    round(feature_usage, 2),
                    is_churned,
                ]
            )

    df = pd.DataFrame(
        all_user_data,
        columns=[
            "user_id",
            "month",
            "transactions_per_month",
            "logins_per_month",
            "feature_usage_score",
            "is_churned",
        ],
    )
    return df


if __name__ == "__main__":
    df = generate_churn_data(num_users=5000, num_months=12)
    output_path = os.path.join(os.path.dirname(__file__), "synthetic_churn_data.csv")
    df.to_csv(output_path, index=False)

    logger.info(f"Synthetic churn data generated and saved to {output_path}")
    logger.info("Preview of generated data:")
    logger.info(df.head())
    logger.info("Churn label distribution:")
    logger.info(df["is_churned"].value_counts())

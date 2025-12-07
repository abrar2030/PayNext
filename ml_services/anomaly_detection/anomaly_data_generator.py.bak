from datetime import datetime, timedelta

import numpy as np
import pandas as pd

from core.logging import get_logger

logger = get_logger(__name__)


def generate_synthetic_transaction_data(
    num_transactions=10000, num_users=100, anomaly_ratio=0.02
):
    np.random.seed(42)

    users = [f"user_{i:03d}" for i in range(num_users)]
    merchants = [
        "GroceryStoreA",
        "RestaurantB",
        "OnlineShopC",
        "UtilityCoD",
        "GasStationE",
        "CoffeeShopF",
        "BookStoreG",
        "TravelAgencyH",
    ]
    transaction_types = ["purchase", "withdrawal", "transfer", "bill_payment"]

    data = []
    start_date = datetime(2024, 1, 1)

    for i in range(num_transactions):
        user_id = np.random.choice(users)
        timestamp = start_date + timedelta(minutes=np.random.randint(0, 365 * 24 * 60))
        amount = np.random.normal(loc=50, scale=30)  # Most transactions are smaller
        amount = max(1, round(amount, 2))  # Ensure amount is positive
        merchant = np.random.choice(merchants)
        transaction_type = np.random.choice(transaction_types)
        location = f"city_{np.random.randint(1, 10)}"

        is_anomaly = False
        if np.random.rand() < anomaly_ratio:
            is_anomaly = True
            anomaly_type = np.random.choice(
                ["high_value", "unusual_time", "unusual_merchant", "unusual_frequency"]
            )

            if anomaly_type == "high_value":
                amount = np.random.uniform(2000, 10000)  # Very high value transaction
            elif anomaly_type == "unusual_time":
                timestamp = timestamp.replace(
                    hour=np.random.choice([2, 3, 4]), minute=np.random.randint(0, 60)
                )  # Middle of the night
            elif anomaly_type == "unusual_merchant":
                merchant = np.random.choice(
                    ["DarkWebVendor", "OffshoreService", "RareCollectibleStore"]
                )  # Unusual merchant
            elif anomaly_type == "unusual_frequency":
                # Simulate multiple transactions in a very short period
                # For simplicity, just make this one transaction an anomaly, the model will need to detect patterns
                amount = np.random.uniform(100, 500)

        data.append(
            [
                user_id,
                timestamp,
                amount,
                merchant,
                transaction_type,
                location,
                int(is_anomaly),  # 1 for anomaly, 0 for normal
            ]
        )

    df = pd.DataFrame(
        data,
        columns=[
            "user_id",
            "timestamp",
            "amount",
            "merchant",
            "transaction_type",
            "location",
            "is_anomaly",
        ],
    )
    return df


if __name__ == "__main__":
    df = generate_synthetic_transaction_data(
        num_transactions=100000, num_users=500, anomaly_ratio=0.01
    )
    df.to_csv("synthetic_transaction_anomalies.csv", index=False)
    logger.info("Generated synthetic_transaction_anomalies.csv")
    logger.info(df.head())
    logger.info(df["is_anomaly"].value_counts())

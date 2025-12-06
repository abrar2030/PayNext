import os
from datetime import datetime, timedelta

import numpy as np
import pandas as pd

from core.logging import get_logger

logger = get_logger(__name__)


def generate_categorization_data(num_transactions: int = 10000) -> pd.DataFrame:
    """
    Generate synthetic transaction data with categories and merchants.

    Args:
        num_transactions: Number of transactions to generate.

    Returns:
        pd.DataFrame: DataFrame containing synthetic transactions.
    """
    np.random.seed(43)

    # Generate user IDs
    user_ids = [f"user_{i:04d}" for i in range(1000)]

    # Define categories and associated keywords/merchants
    categories = {
        "Groceries": [
            "Walmart",
            "Target",
            "Kroger",
            "Whole Foods",
            "Trader Joe's",
            "Local Grocer",
        ],
        "Utilities": [
            "Con Edison",
            "PG&E",
            "Water Bill",
            "Electricity Co.",
            "Gas Company",
        ],
        "Transport": ["Uber", "Lyft", "Taxi", "Metro", "Bus Ticket", "Gas Station"],
        "Entertainment": [
            "Netflix",
            "Spotify",
            "Cinema",
            "Concert Tickets",
            "Restaurant",
            "Bar",
            "Gaming Store",
        ],
        "Shopping": [
            "Amazon",
            "Ebay",
            "Zara",
            "H&M",
            "Online Shop",
            "Department Store",
        ],
        "Healthcare": [
            "Pharmacy",
            "Doctor Visit",
            "Hospital",
            "Dentist",
            "Medical Supply",
        ],
        "Rent/Mortgage": ["Rent Payment", "Mortgage", "Landlord", "Housing Co."],
        "Salary": ["Payroll", "Employer", "Freelance Income"],
        "Transfer": ["Bank Transfer", "P2P Transfer"],
        "Other": ["Misc", "Various", "Uncategorized"],
    }

    data = []
    start_date = datetime(2024, 1, 1)

    for _ in range(num_transactions):
        user_id = np.random.choice(user_ids)
        transaction_amount = round(np.random.uniform(5, 500), 2)
        transaction_time = start_date + timedelta(
            minutes=np.random.randint(0, 365 * 24 * 60)
        )

        # Randomly assign a category and pick a merchant/description
        category = np.random.choice(list(categories.keys()))
        merchant = np.random.choice(categories[category])
        description = (
            f"{merchant} purchase"
            if category not in ["Salary", "Transfer"]
            else merchant
        )

        data.append(
            [
                user_id,
                transaction_amount,
                transaction_time,
                merchant,
                description,
                category,
            ]
        )

    df = pd.DataFrame(
        data,
        columns=[
            "user_id",
            "transaction_amount",
            "transaction_time",
            "merchant",
            "description",
            "category",
        ],
    )

    return df


if __name__ == "__main__":
    df = generate_categorization_data(num_transactions=50000)
    output_path = os.path.join(
        os.path.dirname(__file__), "synthetic_categorization_data.csv"
    )
    df.to_csv(output_path, index=False)
    logger.info(
        f"Synthetic transaction categorization data generated and saved to {output_path}"
    )
    logger.info("Preview of generated data:")
    logger.info(df.head())
    logger.info("Category counts:")
    logger.info(df["category"].value_counts())

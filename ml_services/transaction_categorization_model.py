import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
import joblib

def train_categorization_model(data_path='PayNext/ml_services/synthetic_categorization_data.csv'):
    df = pd.read_csv(data_path)

    # Combine merchant and description for text features
    df["text_features"] = df["merchant"] + " " + df["description"]

    X = df["text_features"]
    y = df["category"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)

    # TF-IDF Vectorization
    vectorizer = TfidfVectorizer(max_features=1000)
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)
    joblib.dump(vectorizer, 'PayNext/ml_services/category_vectorizer.joblib')

    # Train a Logistic Regression model
    model = LogisticRegression(random_state=42, max_iter=200)
    model.fit(X_train_vec, y_train)

    # Evaluate the model
    y_pred = model.predict(X_test_vec)
    print("Transaction Categorization Model Report:")
    print(classification_report(y_test, y_pred))

    # Save the model
    joblib.dump(model, 'PayNext/ml_services/category_model.joblib')
    print("Transaction categorization model trained and saved to PayNext/ml_services/category_model.joblib")

if __name__ == '__main__':
    train_categorization_model()



import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import SVC
from sklearn.metrics import classification_report
import joblib
import os

def train_categorization_model(data_path=os.path.join(os.path.dirname(__file__), 'synthetic_categorization_data.csv')):
    df = pd.read_csv(data_path)

    # Combine merchant and description for text features
    df["text_features"] = df["merchant"] + " " + df["description"]

    X = df["text_features"]
    y = df["category"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)

    # TF-IDF Vectorization
    vectorizer = TfidfVectorizer(max_features=2000, ngram_range=(1, 2)) # Using n-grams for more context
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)
    model_dir = os.path.join(os.path.dirname(__file__), "..")
    joblib.dump(vectorizer, os.path.join(model_dir, 'category_vectorizer.joblib'))

    # Hyperparameter tuning for SVC
    param_grid = {
        'C': [0.1, 1, 10],
        'gamma': ['scale', 'auto'],
        'kernel': ['rbf', 'linear']
    }
    grid_search = GridSearchCV(SVC(random_state=42, probability=True), param_grid, refit=True, verbose=2, cv=3)
    grid_search.fit(X_train_vec, y_train)

    best_model = grid_search.best_estimator_
    print(f"Best SVC parameters: {grid_search.best_params_}")

    # Evaluate the best model
    y_pred = best_model.predict(X_test_vec)
    print("\nTransaction Categorization Model Report (SVC):")
    print(classification_report(y_test, y_pred))

    # Save the best model
    joblib.dump(best_model, os.path.join(model_dir, 'category_model.joblib'))
    print(f"Transaction categorization model (SVC) trained and saved to {os.path.join(model_dir, 'category_model.joblib')}")

if __name__ == '__main__':
    train_categorization_model()


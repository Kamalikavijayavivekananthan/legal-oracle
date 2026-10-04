import pandas as pd
import numpy as np
import pickle

from pathlib import Path
from sentence_transformers import SentenceTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.metrics import classification_report


DATA_DIR = Path(__file__).parent / "data"
MODEL_DIR = Path(__file__).parent / "models"

INPUT_FILE = DATA_DIR / "balanced_training_pairs.csv"
MODEL_FILE = MODEL_DIR / "contradiction_classifier.pkl"

MODEL_DIR.mkdir(exist_ok=True)


# ---------------------------------------------------------
# 1. Load training data
# ---------------------------------------------------------

df = pd.read_csv(INPUT_FILE)

df = df.dropna(subset=["clause1", "clause2", "label"])

df["label"] = df["label"].astype(int)

print("Training examples:", len(df))
print("Label distribution:")
print(df["label"].value_counts())


# ---------------------------------------------------------
# 2. Load MiniLM
# ---------------------------------------------------------

print()
print("Loading MiniLM...")

encoder = SentenceTransformer("all-MiniLM-L6-v2")


# ---------------------------------------------------------
# 3. Create pair features
# ---------------------------------------------------------

print("Creating embeddings...")

emb1 = encoder.encode(
    df["clause1"].tolist(),
    show_progress_bar=True
)

emb2 = encoder.encode(
    df["clause2"].tolist(),
    show_progress_bar=True
)


# Combine both embeddings + absolute difference
X = np.concatenate(
    [
        emb1,
        emb2,
        np.abs(emb1 - emb2)
    ],
    axis=1
)

y = df["label"].values


# ---------------------------------------------------------
# 4. Train classifier
# ---------------------------------------------------------

print()
print("Training Logistic Regression classifier...")

classifier = LogisticRegression(
    max_iter=2000,
    class_weight="balanced",
    random_state=42
)

classifier.fit(X, y)


# ---------------------------------------------------------
# 5. Cross-validation
# ---------------------------------------------------------

print()
print("Running 5-fold cross-validation...")

cv = StratifiedKFold(
    n_splits=5,
    shuffle=True,
    random_state=42
)

scores = cross_val_score(
    classifier,
    X,
    y,
    cv=cv,
    scoring="f1"
)

print("F1 scores:", np.round(scores, 3))
print("Mean F1:", round(scores.mean(), 3))


# ---------------------------------------------------------
# 6. Training-set report
# ---------------------------------------------------------

predictions = classifier.predict(X)

print()
print("Training classification report:")
print(
    classification_report(
        y,
        predictions,
        digits=3,
        zero_division=0
    )
)


# ---------------------------------------------------------
# 7. Save model
# ---------------------------------------------------------

model_data = {
    "classifier": classifier,
    "encoder_name": "all-MiniLM-L6-v2"
}

with open(MODEL_FILE, "wb") as f:
    pickle.dump(model_data, f)


print()
print("Model saved successfully.")
print("Model:", MODEL_FILE)
import pandas as pd
from pathlib import Path

DATA_DIR = Path(__file__).parent / "data"

file = DATA_DIR / "absolute_vs_conditional_review_batch_100.csv"

df = pd.read_csv(file)

print("Total rows:", len(df))
print("\nLabels:")
print(df["label"].value_counts(dropna=False))

print("\nLabeled rows:", df["label"].notna().sum())
print("Positive (1):", (df["label"] == 1).sum())
print("Negative (0):", (df["label"] == 0).sum())
print("Unlabeled:", df["label"].isna().sum())
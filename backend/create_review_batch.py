import pandas as pd
from pathlib import Path

DATA_DIR = Path(__file__).parent / "data"

INPUT_FILE = DATA_DIR / "candidate_pairs.csv"
OUTPUT_FILE = DATA_DIR / "review_batch_100.csv"

df = pd.read_csv(INPUT_FILE)

# Highest-similarity candidates first
df = df.sort_values(
    by="similarity",
    ascending=False
).reset_index(drop=True)

# Take first 100 for manual review
review = df.head(100).copy()

# Keep label empty for human review
review["label"] = ""

review.to_csv(
    OUTPUT_FILE,
    index=False,
    encoding="utf-8-sig"
)

print("Review batch created!")
print("Candidates selected:", len(review))
print("Output:", OUTPUT_FILE)

print()
print("Categories:")
print(review["category"].value_counts().to_string())
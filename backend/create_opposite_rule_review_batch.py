import pandas as pd
from pathlib import Path

DATA_DIR = Path(__file__).parent / "data"

INPUT_FILE = DATA_DIR / "opposite_rule_candidates.csv"
OUTPUT_FILE = DATA_DIR / "opposite_rule_review_batch_100.csv"

df = pd.read_csv(INPUT_FILE)

# Remove duplicate candidate rows
df = df.drop_duplicates(
    subset=[
        "category",
        "filename1",
        "filename2",
        "clause1",
        "clause2"
    ]
).reset_index(drop=True)

# Stronger similarity first
df = df.sort_values(
    by="similarity",
    ascending=False
).reset_index(drop=True)

# Take first 100 candidates for human review
review = df.head(100).copy()

# Empty human-review fields
review["label"] = ""
review["reviewer_note"] = ""

review.to_csv(
    OUTPUT_FILE,
    index=False,
    encoding="utf-8-sig"
)

print("Opposite-rule review batch created!")
print("Candidates selected:", len(review))
print("Output:", OUTPUT_FILE)

print()
print("Categories:")
print(review["category"].value_counts().to_string())

print()
print("Similarity range:")
print(
    round(review["similarity"].min(), 4),
    "to",
    round(review["similarity"].max(), 4)
)
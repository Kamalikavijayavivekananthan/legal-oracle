import pandas as pd
from pathlib import Path

DATA_DIR = Path(__file__).parent / "data"

INPUT_FILE = DATA_DIR / "candidate_pairs_contradiction_search.csv"
OUTPUT_FILE = DATA_DIR / "contradiction_review_batch_100.csv"

df = pd.read_csv(INPUT_FILE)

# Remove duplicate clause pairs
df = df.drop_duplicates(
    subset=["category", "filename1", "filename2", "clause1", "clause2"]
).reset_index(drop=True)

# Sort by similarity
df = df.sort_values(
    by="similarity",
    ascending=True
).reset_index(drop=True)

# Divide candidates into 10 similarity bands
df["similarity_band"] = pd.qcut(
    df["similarity"],
    q=10,
    labels=False,
    duplicates="drop"
)

# Select up to 10 candidates from each band
parts = []

for band in sorted(df["similarity_band"].dropna().unique()):

    band_df = df[df["similarity_band"] == band]

    sample_size = min(10, len(band_df))

    parts.append(
        band_df.sample(
            n=sample_size,
            random_state=42
        )
    )

review = pd.concat(parts, ignore_index=True)

# Keep exactly 100 if more were selected
review = review.head(100).copy()

# Remove helper column
review = review.drop(columns=["similarity_band"])

# Empty labels for manual review
review["label"] = ""

# Add reviewer note column
review["reviewer_note"] = ""

review.to_csv(
    OUTPUT_FILE,
    index=False,
    encoding="utf-8-sig"
)

print("Contradiction review batch created!")
print("Candidates selected:", len(review))
print("Output:", OUTPUT_FILE)

print()
print("Categories:")
print(review["category"].value_counts().to_string())

print()
print("Similarity range:")
print("Minimum:", review["similarity"].min())
print("Maximum:", review["similarity"].max())
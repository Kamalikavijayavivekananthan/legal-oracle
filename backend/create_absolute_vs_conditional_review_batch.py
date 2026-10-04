import pandas as pd
from pathlib import Path


DATA_DIR = Path(__file__).parent / "data"

INPUT_FILE = DATA_DIR / "absolute_vs_conditional_candidates.csv"
OUTPUT_FILE = DATA_DIR / "absolute_vs_conditional_review_batch_100.csv"


df = pd.read_csv(INPUT_FILE)

print("Total candidates:", len(df))

if len(df) == 0:
    print("No candidates found.")
    raise SystemExit


# Remove any accidental duplicates
df = df.drop_duplicates(
    subset=[
        "category",
        "filename1",
        "filename2",
        "clause1",
        "clause2"
    ]
).copy()


# Create 10 similarity bands
df["similarity_band"] = pd.qcut(
    df["similarity"],
    q=10,
    labels=False,
    duplicates="drop"
)


samples = []

for band in sorted(df["similarity_band"].dropna().unique()):

    band_df = df[df["similarity_band"] == band]

    n = min(10, len(band_df))

    sample = band_df.sample(
        n=n,
        random_state=42
    )

    samples.append(sample)


review_df = pd.concat(
    samples,
    ignore_index=True
)


# Maximum 100 rows
review_df = review_df.head(100).copy()


# Add reviewer column
review_df["reviewer_note"] = ""


# Put label near the end
review_df["label"] = ""


review_df.to_csv(
    OUTPUT_FILE,
    index=False,
    encoding="utf-8-sig"
)


print()
print("Review batch created!")
print("Rows:", len(review_df))
print("Output:", OUTPUT_FILE)

print()
print("Category distribution:")
print(
    review_df["category"]
    .value_counts()
    .to_string()
)

print()
print("Similarity range:")
print(
    round(review_df["similarity"].min(), 4),
    "to",
    round(review_df["similarity"].max(), 4)
)

print()
print("Columns:")
print(review_df.columns.tolist())
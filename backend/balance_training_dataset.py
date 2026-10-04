import pandas as pd
from pathlib import Path

DATA_DIR = Path(__file__).parent / "data"

INPUT_FILE = DATA_DIR / "training_pairs.csv"
OUTPUT_FILE = DATA_DIR / "balanced_training_pairs.csv"

df = pd.read_csv(INPUT_FILE)

# Separate positive and negative examples
positive = df[df["label"] == 1].copy()
negative = df[df["label"] == 0].copy()

print("Original positive:", len(positive))
print("Original negative:", len(negative))

# Keep equal number of negative examples
negative_sample = negative.sample(
    n=len(positive),
    random_state=42
)

# Combine
balanced = pd.concat(
    [positive, negative_sample],
    ignore_index=True
)

# Shuffle
balanced = balanced.sample(
    frac=1,
    random_state=42
).reset_index(drop=True)

# Save
balanced.to_csv(
    OUTPUT_FILE,
    index=False
)

print()
print("Balanced dataset created successfully.")
print("Output:", OUTPUT_FILE)
print("Total pairs:", len(balanced))
print()
print("Label distribution:")
print(balanced["label"].value_counts())
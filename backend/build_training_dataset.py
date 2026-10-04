import pandas as pd
from pathlib import Path
from itertools import combinations

DATA_DIR = Path(__file__).parent / "data"

CLAUSE_FILE = DATA_DIR / "target_clauses.csv"
REVIEW_FILE = DATA_DIR / "absolute_vs_conditional_review_batch_100.csv"
OUTPUT_FILE = DATA_DIR / "training_pairs.csv"


# ---------------------------------------------------------
# 1. Load clause dataset
# ---------------------------------------------------------

clauses = pd.read_csv(CLAUSE_FILE)

clauses = clauses.dropna(subset=["clause_text"])
clauses["clause_text"] = clauses["clause_text"].astype(str).str.strip()

print("Target clauses:", len(clauses))


# ---------------------------------------------------------
# 2. Load manually reviewed examples
# ---------------------------------------------------------

review = pd.read_csv(REVIEW_FILE)

reviewed = review.dropna(subset=["label"]).copy()

reviewed["label"] = reviewed["label"].astype(int)

manual_pairs = reviewed[
    ["clause1", "clause2", "label"]
].copy()

print("Manual reviewed pairs:", len(manual_pairs))


# ---------------------------------------------------------
# 3. Create additional negative pairs
# ---------------------------------------------------------
# Clauses from different contracts are used as negative
# examples. We keep them in the same category so the model
# learns to distinguish similar legal topics.

negative_pairs = []

for category, group in clauses.groupby("category"):

    group = group.reset_index(drop=True)

    # Limit combinations so the dataset does not explode
    max_rows = min(len(group), 120)

    group = group.iloc[:max_rows]

    for i, j in combinations(range(len(group)), 2):

        row1 = group.iloc[i]
        row2 = group.iloc[j]

        # Do not pair clauses from the same contract
        if row1["filename"] == row2["filename"]:
            continue

        text1 = row1["clause_text"]
        text2 = row2["clause_text"]

        if len(text1.split()) < 8 or len(text2.split()) < 8:
            continue

        negative_pairs.append({
            "clause1": text1,
            "clause2": text2,
            "label": 0
        })

        if len(negative_pairs) >= 1500:
            break

    if len(negative_pairs) >= 1500:
        break


negative_df = pd.DataFrame(negative_pairs)

print("Generated negative pairs:", len(negative_df))


# ---------------------------------------------------------
# 4. Combine manual + generated data
# ---------------------------------------------------------

training = pd.concat(
    [manual_pairs, negative_df],
    ignore_index=True
)


# ---------------------------------------------------------
# 5. Remove exact duplicate pairs
# ---------------------------------------------------------

training["pair_key"] = (
    training["clause1"].str.strip()
    + " ||| "
    + training["clause2"].str.strip()
)

training = training.drop_duplicates("pair_key")

training = training.drop(columns=["pair_key"])


# ---------------------------------------------------------
# 6. Save
# ---------------------------------------------------------

training.to_csv(
    OUTPUT_FILE,
    index=False
)


# ---------------------------------------------------------
# 7. Report
# ---------------------------------------------------------

print()
print("Training dataset created successfully.")
print("Output:", OUTPUT_FILE)
print("Total pairs:", len(training))
print()
print("Label distribution:")
print(training["label"].value_counts())
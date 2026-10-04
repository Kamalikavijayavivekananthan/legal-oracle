import pandas as pd
from pathlib import Path

DATA_DIR = Path(__file__).parent / "data"

input_file = DATA_DIR / "absolute_vs_conditional_review_batch_100.csv"
backup_file = DATA_DIR / "absolute_vs_conditional_review_batch_100_backup.csv"

df = pd.read_csv(input_file)

# Backup original file first
df.to_csv(backup_file, index=False)

# Labels we already reviewed
labels = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,

    10: 1,
    11: 1,
    12: 1,
    13: 1,
    14: 1,
    15: 1,
    16: 1,
    17: 1,
    18: 1,
    19: 1,

    22: 1,
    23: 0,
    24: 0,
    25: 1,
    26: 0,
    27: 0,
    28: 1,
    29: 0,
    30: 0,
}

for row_index, label in labels.items():
    df.loc[row_index, "label"] = label

df.to_csv(input_file, index=False)

print("Manual labels applied successfully.")
print()
print(df["label"].value_counts(dropna=False))
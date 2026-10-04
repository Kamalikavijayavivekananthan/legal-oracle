
from pathlib import Path
import pandas as pd

# Project paths
data_dir = Path(__file__).parent / "data"
input_file = data_dir / "label report.xlsx"
output_file = data_dir / "cleaned_clauses.csv"

# Read Excel dataset
df = pd.read_excel(input_file)

# Clean column names and text
df.columns = df.columns.str.strip()

for column in ["Filename", "Change of Control", "Anti-assignment"]:
    df[column] = df[column].fillna("").astype(str).str.strip()

# Keep records with at least one clause
cleaned = df[
    (cleaned_text := (
        df["Change of Control"].ne("")
        | df["Anti-assignment"].ne("")
    ))
].copy()

# Save in a simpler format
cleaned.to_csv(output_file, index=False, encoding="utf-8-sig")

print("Dataset preparation complete!")
print("Rows saved:", len(cleaned))
print("Output:", output_file)
print("Change of Control clauses:",
      cleaned["Change of Control"].ne("").sum())
print("Anti-assignment clauses:",
      cleaned["Anti-assignment"].ne("").sum())
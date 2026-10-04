import pandas as pd
from pathlib import Path
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


DATA_DIR = Path(__file__).parent / "data"

INPUT_FILE = DATA_DIR / "target_clauses.csv"
OUTPUT_FILE = DATA_DIR / "candidate_pairs.csv"


# Load extracted CUAD clauses
df = pd.read_csv(INPUT_FILE)

print("Total clauses:", len(df))


# Load the existing Legal Oracle similarity model
model = SentenceTransformer("all-MiniLM-L6-v2")


candidate_rows = []


# Process each clause category separately
for category in sorted(df["category"].unique()):

    category_df = df[df["category"] == category].reset_index(drop=True)

    
        # Remove very short / incomplete clause fragments
    category_df = category_df[
        category_df["clause_text"].fillna("").str.split().str.len() >= 8
    ].reset_index(drop=True)

    texts = category_df["clause_text"].tolist()

    print()
    print("Processing:", category)
    print("Clauses:", len(texts))

    # Create embeddings
    embeddings = model.encode(
        texts,
        show_progress_bar=True,
        batch_size=32
    )

    similarity_matrix = cosine_similarity(embeddings)

    seen_pairs = set()

    for i in range(len(category_df)):

        # Sort most similar clauses first
        similar_indices = similarity_matrix[i].argsort()[::-1]

        selected = 0

        for j in similar_indices:

            if i == j:
                continue

            # Don't compare clauses from the same contract
            if (
                category_df.loc[i, "filename"]
                == category_df.loc[j, "filename"]
            ):
                continue

            score = float(similarity_matrix[i][j])

            # Candidate range only
            if score < 0.70 or score > 0.97:
                continue

            pair = tuple(sorted([i, j]))

            if pair in seen_pairs:
                continue

            seen_pairs.add(pair)

            candidate_rows.append({
                "category": category,
                "filename1": category_df.loc[i, "filename"],
                "filename2": category_df.loc[j, "filename"],
                "clause1": category_df.loc[i, "clause_text"],
                "clause2": category_df.loc[j, "clause_text"],
                "similarity": round(score, 4),
                "label": ""
            })

            selected += 1

            # Maximum 3 candidates per clause
            if selected >= 3:
                break


# Save candidates
result = pd.DataFrame(candidate_rows)

result.to_csv(
    OUTPUT_FILE,
    index=False,
    encoding="utf-8-sig"
)

print()
print("Candidate generation complete!")
print("Candidate pairs:", len(result))
print("Output:", OUTPUT_FILE)

if len(result) > 0:
    print()
    print("Candidates by category:")
    print(result["category"].value_counts().to_string())
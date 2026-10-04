import pandas as pd
import re
from pathlib import Path
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


DATA_DIR = Path(__file__).parent / "data"

INPUT_FILE = DATA_DIR / "target_clauses.csv"
OUTPUT_FILE = DATA_DIR / "absolute_vs_conditional_candidates.csv"


def classify_assignment_rule(text):
    text = str(text).lower()

    has_assignment = bool(
        re.search(r"\b(assign|assigned|assignment|transfer|transferred)\b", text)
    )

    if not has_assignment:
        return "OTHER"

    # Conditional permission:
    # assignment is restricted, but possible with consent
    conditional = bool(
        re.search(
            r"(without|unless|except\s+with|subject\s+to)"
            r".{0,100}"
            r"(consent|approval|permission)",
            text
        )
    )

    # Explicit consent wording
    consent = bool(
        re.search(
            r"(prior|written|express|other\s+party.{0,30})"
            r".{0,80}"
            r"(consent|approval)",
            text
        )
    )

    # Strong absolute prohibition
    absolute = bool(
        re.search(
            r"(may\s+not|shall\s+not|cannot|prohibited)"
            r".{0,80}"
            r"(assign|assignment|transfer|delegate)",
            text
        )
    )

    if absolute and not conditional:
        return "ABSOLUTE_PROHIBITION"

    if conditional or consent:
        return "CONSENT_CONDITIONAL"

    return "OTHER"


print("Loading target clauses...")

df = pd.read_csv(INPUT_FILE)

print("Total clauses:", len(df))

model = SentenceTransformer("all-MiniLM-L6-v2")

candidate_rows = []


for category in sorted(df["category"].unique()):

    category_df = df[df["category"] == category].copy()

    category_df = category_df[
        category_df["clause_text"]
        .fillna("")
        .str.split()
        .str.len()
        >= 8
    ].reset_index(drop=True)

    print()
    print("Processing:", category)
    print("Clauses:", len(category_df))

    texts = category_df["clause_text"].tolist()

    rule_types = [
        classify_assignment_rule(text)
        for text in texts
    ]

    embeddings = model.encode(
        texts,
        show_progress_bar=True,
        batch_size=32
    )

    similarity_matrix = cosine_similarity(embeddings)

    for i in range(len(category_df)):

        for j in range(i + 1, len(category_df)):

            # Different contracts only
            if (
                category_df.loc[i, "filename"]
                == category_df.loc[j, "filename"]
            ):
                continue

            rule_i = rule_types[i]
            rule_j = rule_types[j]

            # We specifically want:
            # ABSOLUTE PROHIBITION vs CONSENT CONDITIONAL
            if not (
                (
                    rule_i == "ABSOLUTE_PROHIBITION"
                    and rule_j == "CONSENT_CONDITIONAL"
                )
                or
                (
                    rule_i == "CONSENT_CONDITIONAL"
                    and rule_j == "ABSOLUTE_PROHIBITION"
                )
            ):
                continue

            score = float(similarity_matrix[i][j])

            # Similar topic, but not near-duplicates
            if score < 0.65 or score > 0.93:
                continue

            candidate_rows.append({
                "category": category,
                "filename1": category_df.loc[i, "filename"],
                "filename2": category_df.loc[j, "filename"],
                "clause1": texts[i],
                "clause2": texts[j],
                "similarity": round(score, 4),
                "rule_type1": rule_i,
                "rule_type2": rule_j,
                "label": ""
            })


result = pd.DataFrame(candidate_rows)

if len(result) > 0:

    result = result.drop_duplicates(
        subset=[
            "category",
            "filename1",
            "filename2",
            "clause1",
            "clause2"
        ]
    )

    result = result.sort_values(
        by="similarity",
        ascending=False
    ).reset_index(drop=True)


result.to_csv(
    OUTPUT_FILE,
    index=False,
    encoding="utf-8-sig"
)


print()
print("Absolute-vs-conditional candidates created!")
print("Candidate pairs:", len(result))
print("Output:", OUTPUT_FILE)

if len(result) > 0:

    print()
    print("Categories:")
    print(
        result["category"]
        .value_counts()
        .to_string()
    )

    print()
    print("Similarity range:")
    print(
        round(result["similarity"].min(), 4),
        "to",
        round(result["similarity"].max(), 4)
    )
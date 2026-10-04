import pandas as pd
import re
from pathlib import Path
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

DATA_DIR = Path(__file__).parent / "data"

INPUT_FILE = DATA_DIR / "target_clauses.csv"
OUTPUT_FILE = DATA_DIR / "opposite_rule_candidates.csv"


def has_negation(text):
    text = text.lower()

    patterns = [
        r"\bnot\b",
        r"\bno\b",
        r"\bnever\b",
        r"\bwithout\b",
        r"\bprohibited\b",
        r"\bprohibit\b",
        r"\bshall not\b",
        r"\bmay not\b",
        r"\bcannot\b",
        r"\bcan't\b",
        r"\bunable\b",
        r"\bunless\b",
    ]

    return any(re.search(pattern, text) for pattern in patterns)


def rule_signal(text):
    text = text.lower()

    signals = []

    if has_negation(text):
        signals.append("NEGATIVE")
    else:
        signals.append("POSITIVE")

    if "consent" in text:
        signals.append("CONSENT")

    if "assign" in text or "transfer" in text:
        signals.append("ASSIGNMENT")

    if "change of control" in text:
        signals.append("CHANGE_OF_CONTROL")

    if "terminate" in text or "termination" in text:
        signals.append("TERMINATION")

    if "void" in text:
        signals.append("VOID")

    return signals


print("Loading target clauses...")

df = pd.read_csv(INPUT_FILE)

print("Total clauses:", len(df))

model = SentenceTransformer("all-MiniLM-L6-v2")

candidate_rows = []


for category in sorted(df["category"].unique()):

    category_df = df[df["category"] == category].copy()

    category_df = category_df[
        category_df["clause_text"].fillna("").str.split().str.len() >= 8
    ].reset_index(drop=True)

    print()
    print("Processing:", category)
    print("Clauses:", len(category_df))

    texts = category_df["clause_text"].tolist()

    embeddings = model.encode(
        texts,
        show_progress_bar=True,
        batch_size=32
    )

    similarity_matrix = cosine_similarity(embeddings)

    seen_pairs = set()

    for i in range(len(category_df)):

        signals_i = rule_signal(texts[i])

        for j in range(i + 1, len(category_df)):

            # Never compare clauses from the same contract
            if category_df.loc[i, "filename"] == category_df.loc[j, "filename"]:
                continue

            signals_j = rule_signal(texts[j])

            # Need similar topic
            score = float(similarity_matrix[i][j])

            if score < 0.70 or score > 0.95:
                continue

            # Look for opposite rule signals
            opposite_negation = (
                ("NEGATIVE" in signals_i and "POSITIVE" in signals_j)
                or
                ("POSITIVE" in signals_i and "NEGATIVE" in signals_j)
            )

            if not opposite_negation:
                continue

            # Prefer clauses discussing the same legal topic
            shared_topics = set(signals_i) & set(signals_j)

            useful_topic = (
                "ASSIGNMENT" in shared_topics
                or
                "CONSENT" in shared_topics
                or
                "CHANGE_OF_CONTROL" in shared_topics
                or
                "TERMINATION" in shared_topics
            )

            if not useful_topic:
                continue

            pair = (
                category_df.loc[i, "filename"],
                category_df.loc[j, "filename"]
            )

            if pair in seen_pairs:
                continue

            seen_pairs.add(pair)

            candidate_rows.append({
                "category": category,
                "filename1": category_df.loc[i, "filename"],
                "filename2": category_df.loc[j, "filename"],
                "clause1": texts[i],
                "clause2": texts[j],
                "similarity": round(score, 4),
                "signals1": ",".join(signals_i),
                "signals2": ",".join(signals_j),
                "label": ""
            })


result = pd.DataFrame(candidate_rows)

if len(result) > 0:
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
print("Opposite-rule candidates created!")
print("Candidate pairs:", len(result))
print("Output:", OUTPUT_FILE)

if len(result) > 0:
    print()
    print("Categories:")
    print(result["category"].value_counts().to_string())

    print()
    print("Similarity range:")
    print(
        round(result["similarity"].min(), 4),
        "to",
        round(result["similarity"].max(), 4)
    )
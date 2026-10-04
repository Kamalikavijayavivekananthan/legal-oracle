import pandas as pd
import re
from pathlib import Path
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


DATA_DIR = Path(__file__).parent / "data"

INPUT_FILE = DATA_DIR / "target_clauses.csv"
OUTPUT_FILE = DATA_DIR / "targeted_contradiction_candidates.csv"


def get_rule_signals(text):
    text = str(text).lower()

    signals = set()

    # Assignment permission / prohibition
    if re.search(r"\bmay\s+assign\b", text):
        signals.add("MAY_ASSIGN")

    if re.search(r"\bmay\s+not\s+assign\b", text):
        signals.add("MAY_NOT_ASSIGN")

    if re.search(r"\bshall\s+not\s+assign\b", text):
        signals.add("SHALL_NOT_ASSIGN")

    if re.search(r"\bassign.*without.*consent\b", text):
        signals.add("ASSIGN_WITHOUT_CONSENT")

    if re.search(r"\bassign.*with.*consent\b", text):
        signals.add("ASSIGN_WITH_CONSENT")

    # Termination
    if "may terminate" in text:
        signals.add("MAY_TERMINATE")

    if "shall terminate" in text:
        signals.add("SHALL_TERMINATE")

    if "shall not terminate" in text:
        signals.add("SHALL_NOT_TERMINATE")

    if "may not terminate" in text:
        signals.add("MAY_NOT_TERMINATE")

    # Change of Control
    if "change of control" in text:
        signals.add("CHANGE_OF_CONTROL")

    # Notice
    if "prior written notice" in text:
        signals.add("PRIOR_WRITTEN_NOTICE")

    if "written notice" in text:
        signals.add("WRITTEN_NOTICE")

    # Numeric values
    numbers = re.findall(r"\b\d+(?:\.\d+)?\b", text)

    if numbers:
        signals.add("HAS_NUMBER")

    return signals


def has_opposite_signal(signals1, signals2):

    opposite_pairs = [
        ("MAY_ASSIGN", "MAY_NOT_ASSIGN"),
        ("MAY_ASSIGN", "SHALL_NOT_ASSIGN"),
        ("ASSIGN_WITH_CONSENT", "ASSIGN_WITHOUT_CONSENT"),
        ("MAY_TERMINATE", "MAY_NOT_TERMINATE"),
        ("MAY_TERMINATE", "SHALL_NOT_TERMINATE"),
    ]

    for a, b in opposite_pairs:

        if (a in signals1 and b in signals2) or (
            b in signals1 and a in signals2
        ):
            return True

    return False


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

    embeddings = model.encode(
        texts,
        show_progress_bar=True,
        batch_size=32
    )

    similarity_matrix = cosine_similarity(embeddings)

    for i in range(len(category_df)):

        signals_i = get_rule_signals(texts[i])

        for j in range(i + 1, len(category_df)):

            # Never compare clauses from same contract
            if (
                category_df.loc[i, "filename"]
                == category_df.loc[j, "filename"]
            ):
                continue

            score = float(similarity_matrix[i][j])

            # Similar enough to discuss the same topic
            if score < 0.65 or score > 0.95:
                continue

            signals_j = get_rule_signals(texts[j])

            if not has_opposite_signal(signals_i, signals_j):
                continue

            candidate_rows.append({
                "category": category,
                "filename1": category_df.loc[i, "filename"],
                "filename2": category_df.loc[j, "filename"],
                "clause1": texts[i],
                "clause2": texts[j],
                "similarity": round(score, 4),
                "signals1": ",".join(sorted(signals_i)),
                "signals2": ",".join(sorted(signals_j)),
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
print("Targeted contradiction candidates created!")
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
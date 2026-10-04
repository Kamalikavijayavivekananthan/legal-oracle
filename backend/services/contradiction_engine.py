import re
import pickle
from pathlib import Path

import numpy as np
from sentence_transformers import SentenceTransformer

from services.similarity_engine import compare_clauses


# ---------------------------------------------------------
# Load trained contradiction classifier
# ---------------------------------------------------------

MODEL_PATH = (
    Path(__file__).resolve().parent.parent
    / "models"
    / "contradiction_classifier.pkl"
)

with open(MODEL_PATH, "rb") as f:
    model_data = pickle.load(f)

classifier = model_data["classifier"]

encoder = SentenceTransformer("all-MiniLM-L6-v2")


# ---------------------------------------------------------
# Extract numbers
# ---------------------------------------------------------

def extract_numbers(text):
    numbers = re.findall(r"\b\d+(?:\.\d+)?\b", text)
    return numbers


# ---------------------------------------------------------
# ML contradiction prediction
# ---------------------------------------------------------

def predict_contradiction(clause1, clause2):

    embeddings = encoder.encode([clause1, clause2])

    emb1 = embeddings[0]
    emb2 = embeddings[1]

    features = np.concatenate(
        [
            emb1,
            emb2,
            np.abs(emb1 - emb2)
        ]
    ).reshape(1, -1)

    prediction = classifier.predict(features)[0]

    probability = classifier.predict_proba(features)[0][1]

    return int(prediction), round(float(probability), 3)


# ---------------------------------------------------------
# Main contradiction detector
# ---------------------------------------------------------

def detect_contradictions(clauses1, clauses2):

    contradictions = []
    seen_pairs = set()

    for clause1 in clauses1:
        for clause2 in clauses2:

            # Skip very short clauses
            if len(clause1.split()) < 4 or len(clause2.split()) < 4:
                continue

            pair_key = (clause1[:100], clause2[:100])

            if pair_key in seen_pairs:
                continue

            seen_pairs.add(pair_key)

            # Semantic similarity
            similarity = compare_clauses(
                clause1,
                clause2
            )

            # ML prediction
            prediction, probability = predict_contradiction(
                clause1,
                clause2
            )

            # Numbers
            nums1 = extract_numbers(clause1)
            nums2 = extract_numbers(clause2)

            issue = None

            # -------------------------------------------------
            # ML contradiction
            # -------------------------------------------------
            #
            # Require reasonable semantic similarity.
            # This prevents unrelated clauses from being
            # classified as contradictions.
            #

            if prediction == 1 and similarity >= 0.65:

                if nums1 != nums2 and nums1 and nums2:
                    issue = (
                        "ML contradiction detected with "
                        "different numeric values"
                    )
                else:
                    issue = (
                        "ML contradiction detected: clauses "
                        "may contain conflicting rules"
                    )

            # -------------------------------------------------
            # Numeric fallback
            # -------------------------------------------------
            #
            # Only use numeric contradiction when the clauses
            # are strongly semantically related.
            #

            elif (
                similarity >= 0.65
                and nums1
                and nums2
                and nums1 != nums2
            ):

                issue = (
                    "Numeric contradiction: same clause topic "
                    "but different values"
                )

            # -------------------------------------------------
            # Add result
            # -------------------------------------------------

            if issue:

                contradictions.append({
                    "clause1": clause1,
                    "clause2": clause2,
                    "similarity": similarity,
                    "contradiction_probability": probability,
                    "issue": issue
                })

    return contradictions
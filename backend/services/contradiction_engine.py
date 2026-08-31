import re
from services.similarity_engine import compare_clauses

def extract_numbers(text):
    numbers = re.findall(r'\b\d+(?:\.\d+)?\b', text)
    return numbers

def detect_contradictions(clauses1, clauses2):

    contradictions = []
    seen_pairs = set()

    for clause1 in clauses1:
        for clause2 in clauses2:

            # Skip very short clauses (likely headers/noise)
            if len(clause1.split()) < 4 or len(clause2.split()) < 4:
                continue

            similarity = compare_clauses(clause1, clause2)

            pair_key = (clause1[:50], clause2[:50])
            if pair_key in seen_pairs:
                continue

            nums1 = extract_numbers(clause1)
            nums2 = extract_numbers(clause2)

            issue = None

            if similarity > 0.70:
                if nums1 != nums2:
                    # Same topic, different numbers = strong contradiction
                    issue = "Numeric contradiction: same clause topic but different values"
                else:
                    # Same topic, no number difference = semantic conflict
                    issue = "Semantic conflict: clauses address the same topic with potentially conflicting terms"

            elif similarity > 0.40:
                if nums1 and nums2 and nums1 != nums2:
                    # Related topic + differing numbers
                    issue = "Possible numeric conflict: related clauses with different values"

            if issue:
                seen_pairs.add(pair_key)
                contradictions.append({
                    "clause1": clause1,
                    "clause2": clause2,
                    "similarity": similarity,
                    "issue": issue
                })

    return contradictions

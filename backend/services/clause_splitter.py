import re


def split_into_clauses(text):

    # ---------------------------------------------------------
    # 1. Normalize whitespace
    # ---------------------------------------------------------
    cleaned_text = re.sub(r"\s+", " ", text).strip()

    # ---------------------------------------------------------
    # 2. Split into sentence-like pieces
    # ---------------------------------------------------------
    raw_clauses = re.split(r"(?<=[.;])\s+|(?<=\.)\s+", cleaned_text)

    clauses = []

    # Common heading/title patterns that should NOT be treated
    # as legal clauses
    heading_patterns = [
        r"^legal oracle\b",
        r"^master service agreement$",
        r"^vendor agreement$",
        r"^service agreement$",
        r"^statement of work$",
        r"^non[- ]disclosure agreement$",
        r"^nda$",
        r"^table of contents$",
        r"^contents$",
        r"^definitions?$",
        r"^recitals?$",
        r"^background$",
    ]

    # ---------------------------------------------------------
    # 3. Filter noise / headings
    # ---------------------------------------------------------
    for clause in raw_clauses:

        clause = clause.strip()

        if not clause:
            continue

        # Remove standalone page numbers
        if re.fullmatch(r"\d+", clause):
            continue

        # Remove very short fragments
        if len(clause.split()) < 5:
            continue

        # Skip obvious headings
        lower_clause = clause.lower()

        if any(
            re.search(pattern, lower_clause)
            for pattern in heading_patterns
        ):
            continue

        # Skip synthetic sample/document-title text
        if (
            "synthetic sample contract" in lower_clause
            and "academic project testing" in lower_clause
        ):
            continue

        clauses.append(clause)

    return clauses
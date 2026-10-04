import re

from services.similarity_engine import compare_clauses


TOPIC_GROUPS = {
    "payment": [
        "payment",
        "payments",
        "invoice",
        "invoices",
        "pay",
        "paid",
        "settled",
        "settlement",
    ],
    "liability": [
        "liability",
        "liable",
        "damages",
        "damage",
        "loss",
        "losses",
    ],
    "termination": [
        "termination",
        "terminate",
        "terminated",
        "cancellation",
        "cancel",
    ],
    "delivery": [
        "delivery",
        "deliver",
        "delivered",
        "shipment",
        "shipping",
    ],
    "assignment": [
        "assign",
        "assigned",
        "assignment",
        "transfer",
        "transferred",
    ],
    "confidentiality": [
        "confidential",
        "confidentiality",
        "disclosure",
        "disclose",
    ],
}


def extract_numbers(text):
    return re.findall(r"\b\d+(?:\.\d+)?\b", text)


def get_topics(text):
    text = text.lower()
    topics = set()

    for topic, keywords in TOPIC_GROUPS.items():
        for keyword in keywords:
            if re.search(r"\b" + re.escape(keyword) + r"\b", text):
                topics.add(topic)
                break

    return topics


def has_negation(text):
    text = text.lower()

    patterns = [
        r"\bnot\b",
        r"\bno\b",
        r"\bnever\b",
        r"\bneither\b",
        r"\bshall not\b",
        r"\bmay not\b",
        r"\bcannot\b",
        r"\bprohibited\b",
    ]

    return any(re.search(pattern, text) for pattern in patterns)


def detect_contradictions(clauses1, clauses2):

    contradictions = []
    seen_pairs = set()

    for clause1 in clauses1:
        for clause2 in clauses2:

            if len(clause1.split()) < 4 or len(clause2.split()) < 4:
                continue

            pair_key = (clause1[:100], clause2[:100])

            if pair_key in seen_pairs:
                continue

            seen_pairs.add(pair_key)

            similarity = compare_clauses(clause1, clause2)

            nums1 = extract_numbers(clause1)
            nums2 = extract_numbers(clause2)

            topics1 = get_topics(clause1)
            topics2 = get_topics(clause2)

            shared_topics = topics1.intersection(topics2)

            issue = None

            # Same legal/business topic + different numeric values
            if (
                shared_topics
                and nums1
                and nums2
                and nums1 != nums2
            ):
                issue = (
                    "Numeric contradiction: same clause topic "
                    "but different values"
                )

            # Same topic + opposite permission/prohibition language
            elif shared_topics:
                neg1 = has_negation(clause1)
                neg2 = has_negation(clause2)

                if neg1 != neg2:
                    issue = (
                        "Potential contradiction: related clauses "
                        "contain opposite permission or prohibition terms"
                    )

            if issue:
                contradictions.append({
                    "clause1": clause1,
                    "clause2": clause2,
                    "similarity": similarity,
                    "contradiction_probability": None,
                    "issue": issue,
                })

    return contradictions
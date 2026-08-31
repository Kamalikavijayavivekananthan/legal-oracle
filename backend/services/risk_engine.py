def calculate_risk(clause1, clause2):

    text = (clause1 + " " + clause2).lower()

    # High risk keywords
    high_keywords = [
        "liability",
        "damages",
        "penalty",
        "termination",
        "lawsuit"
    ]

    # Medium risk keywords
    medium_keywords = [
        "payment",
        "invoice",
        "delivery",
        "deadline"
    ]

    for word in high_keywords:
        if word in text:
            return "HIGH"

    for word in medium_keywords:
        if word in text:
            return "MEDIUM"

    return "LOW"

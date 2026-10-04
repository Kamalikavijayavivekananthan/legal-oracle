from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def compare_clauses(clause1, clause2):
    vectorizer = TfidfVectorizer(
        lowercase=True,
        stop_words="english"
    )

    embeddings = vectorizer.fit_transform([
        clause1,
        clause2
    ])

    similarity = cosine_similarity(
        embeddings[0:1],
        embeddings[1:2]
    )[0][0]

    return round(float(similarity), 2)
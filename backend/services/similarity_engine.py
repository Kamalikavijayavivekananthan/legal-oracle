from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Load AI model
model = SentenceTransformer('all-MiniLM-L6-v2')

def compare_clauses(clause1, clause2):

    embeddings = model.encode([clause1, clause2])

    similarity = cosine_similarity(
        [embeddings[0]],
        [embeddings[1]]
    )[0][0]

    return round(float(similarity), 2)

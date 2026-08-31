import re

def split_into_clauses(text):

    # Remove extra spaces/new lines
    cleaned_text = re.sub(r'\s+', ' ', text)

    # Split using punctuation
    clauses = re.split(r'[.;]', cleaned_text)

    # Remove empty clauses
    clauses = [clause.strip() for clause in clauses if clause.strip()]

    return clauses

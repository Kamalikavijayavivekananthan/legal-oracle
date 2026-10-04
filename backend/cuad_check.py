import json
import collections

file_path = r"backend\data\CUADv1.json"

with open(file_path, "r", encoding="utf-8") as f:
    data = json.load(f)

questions = []

for article in data["data"]:
    for paragraph in article.get("paragraphs", []):
        for question in paragraph.get("qas", []):
            questions.append(question)

print("Total questions:", len(questions))

# Extract the text inside quotation marks
categories = []

for q in questions:
    question = q.get("question", "")
    
    if '"' in question:
        parts = question.split('"')
        if len(parts) >= 2:
            categories.append(parts[1])

counts = collections.Counter(categories)

print("Different categories:", len(counts))
print("\nTop 30 categories:")

for category, count in counts.most_common(30):
    print(count, "=>", category)
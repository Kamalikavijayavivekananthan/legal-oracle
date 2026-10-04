import json
from pathlib import Path

CUAD_FILE = Path(__file__).parent / "data" / "CUADv1.json"

with open(CUAD_FILE, "r", encoding="utf-8") as f:
    data = json.load(f)

categories = set()

for article in data["data"]:
    for paragraph in article.get("paragraphs", []):
        for qa in paragraph.get("qas", []):
            question = qa.get("question", "")

            if '"' in question:
                parts = question.split('"')

                if len(parts) >= 2:
                    categories.add(parts[1])

categories = sorted(categories)

print("Total CUAD categories:", len(categories))
print()

for number, category in enumerate(categories, start=1):
    print(f"{number}. {category}")
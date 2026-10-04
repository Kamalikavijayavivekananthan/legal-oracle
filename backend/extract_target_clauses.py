import json
import csv
from pathlib import Path

DATA_DIR = Path(__file__).parent / "data"

CUAD_FILE = DATA_DIR / "CUADv1.json"
OUTPUT_FILE = DATA_DIR / "target_clauses.csv"

TARGETS = {
    "Anti-Assignment",
    "Change Of Control",
}


with open(CUAD_FILE, "r", encoding="utf-8") as f:
    data = json.load(f)


rows = []

for article in data["data"]:
    filename = article.get("title", "").strip()

    for paragraph in article.get("paragraphs", []):
        for qa in paragraph.get("qas", []):

            question = qa.get("question", "")

            category = None

            for target in TARGETS:
                if f'"{target}"' in question:
                    category = target
                    break

            if category is None:
                continue

            answers = qa.get("answers", [])

            for answer in answers:
                clause_text = answer.get("text", "").strip()

                if clause_text:
                    rows.append({
                        "filename": filename,
                        "category": category,
                        "clause_text": clause_text,
                    })


with open(
    OUTPUT_FILE,
    "w",
    encoding="utf-8-sig",
    newline=""
) as f:

    writer = csv.DictWriter(
        f,
        fieldnames=[
            "filename",
            "category",
            "clause_text",
        ],
    )

    writer.writeheader()
    writer.writerows(rows)


print("Target clause extraction complete!")
print("Total clauses:", len(rows))
print("Output:", OUTPUT_FILE)

for target in sorted(TARGETS):
    count = sum(
        1 for row in rows
        if row["category"] == target
    )

    print(f"{target}: {count}")
from fastapi import FastAPI, UploadFile, File
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import os
from services.pdf_extractor import extract_text_from_pdf
from services.clause_splitter import split_into_clauses
from services.similarity_engine import compare_clauses
from services.contradiction_engine import detect_contradictions
from services.ai_reasoner import explain_contradiction, generate_explainable_ai_analysis
from services.risk_engine import calculate_risk
from services.report_generator import generate_report
from fastapi.responses import FileResponse
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "contracts"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.get("/")
def home():
    return {"message": "Legal Oracle Backend Running"}

@app.post("/upload-contracts")
async def upload_contracts(files: List[UploadFile] = File(...)):

    all_contracts = []

    for file in files:

        file_path = os.path.join(UPLOAD_FOLDER, file.filename)

        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)

        # Extract text
        extracted_text = extract_text_from_pdf(file_path)

        # Split clauses
        clauses = split_into_clauses(extracted_text)

        all_contracts.append({
            "filename": file.filename,
            "clauses": clauses
        })

    contradictions = []

    # Compare all pairs of contracts
    if len(all_contracts) >= 2:
        for i in range(len(all_contracts)):
            for j in range(i + 1, len(all_contracts)):
                contract1 = all_contracts[i]["clauses"]
                contract2 = all_contracts[j]["clauses"]
                filename1 = all_contracts[i]["filename"]
                filename2 = all_contracts[j]["filename"]

                detected = detect_contradictions(contract1, contract2)

                for item in detected:

                    ai_data = explain_contradiction(
                        item["clause1"],
                        item["clause2"]
                    )

                    risk = calculate_risk(
                        item["clause1"],
                        item["clause2"]
                    )

                    contradictions.append({
                        "clause1": item["clause1"],
                        "clause2": item["clause2"],
                        "filename1": filename1,
                        "filename2": filename2,
                        "similarity": item["similarity"],
                        "issue": item["issue"],
                        "risk_level": risk,
                        "ai_explanation": ai_data.get("analysis", ""),
                        "ai_reason": ai_data.get("reason", ""),
                        "ai_recommendation": ai_data.get("recommendation", "")
                    })

    return {
        "total_contracts": len(all_contracts),
        "contradictions_found": len(contradictions),
        "results": contradictions
    }

@app.get("/compare")
def compare():

    clause1 = "Payment must be completed within 30 days"

    clause2 = "Invoices should be settled within one month"

    score = compare_clauses(clause1, clause2)

    return {
        "clause1": clause1,
        "clause2": clause2,
        "similarity_score": score
    }

@app.get("/detect-contradictions")
def detect():

    contract1 = [
        "Payment must be completed within 30 days",
        "Liability is capped at 1 million dollars"
    ]

    contract2 = [
        "Invoices should be settled within 60 days",
        "Vendor may claim damages up to 5 million dollars"
    ]

    results = detect_contradictions(contract1, contract2)

    return {
        "contradictions_found": len(results),
        "results": results
    }

@app.get("/ai-explanation")
def ai_explanation():

    clause1 = "Payment must be completed within 30 days"

    clause2 = "Invoices should be settled within 60 days"

    ai_data = explain_contradiction(clause1, clause2)

    return {
        "clause1": clause1,
        "clause2": clause2,
        "ai_explanation": ai_data.get("analysis", ""),
        "ai_reason": ai_data.get("reason", ""),
        "ai_recommendation": ai_data.get("recommendation", "")
    }

@app.post("/generate-report")
async def generate_pdf_report(payload: dict):
    # Expect payload to contain results and total_contracts
    results = payload.get("results", [])
    
    if not results:
        sample_results = [
            {
                "risk_level": "HIGH",
                "clause1": "Liability capped at $1M",
                "clause2": "Damages allowed up to $5M",
                "ai_explanation": "Different liability limits increase financial exposure.",
                "ai_recommendation": "Align the liability caps.",
                "similarity": 0.89
            }
        ]
        results = sample_results

    report_path = generate_report(results, payload.get("total_contracts", 2))

    return FileResponse(
        path=report_path,
        filename="Legal_Oracle_Report.pdf",
        media_type='application/pdf'
    )

class ExplainRequest(BaseModel):
    clause1: str
    clause2: str
    filename1: str = ""
    filename2: str = ""
    issue: str = ""

class ContractReference(BaseModel):
    document_name: str
    clause: str
    reference: str

class AIExplanationResponse(BaseModel):
    contradiction_found: bool
    what_was_found: str
    contract_a: ContractReference
    contract_b: ContractReference
    why_it_matters: str
    risk_level: str
    risk_reason: str
    what_should_be_reviewed: str
    disclaimer: str

@app.post("/api/analyze/explain-contradiction", response_model=AIExplanationResponse)
async def analyze_explain_contradiction(req: ExplainRequest):
    payload = {
        "clause1": req.clause1,
        "clause2": req.clause2,
        "filename1": req.filename1,
        "filename2": req.filename2,
        "issue": req.issue
    }
    result = generate_explainable_ai_analysis(payload)
    return AIExplanationResponse(**result)

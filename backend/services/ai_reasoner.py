import google.generativeai as genai
import json

import os

# Add your Gemini API key
API_KEY = os.environ.get("GEMINI_API_KEY", "YOUR_API_KEY")
if API_KEY != "YOUR_API_KEY":
    genai.configure(api_key=API_KEY)

model = genai.GenerativeModel("gemini-1.5-flash")

def explain_contradiction(clause1, clause2):

    # Mock response if API key is not configured
    if API_KEY == "YOUR_API_KEY":
        return {
            "analysis": f"Mock AI Analysis: Conflict between '{clause1}' and '{clause2}'.",
            "reason": "Mocked reason for demonstration.",
            "recommendation": "Review manually (Mocked)."
        }

    prompt = f"""
    You are a legal AI assistant.

    Analyze these two contract clauses
    and explain the contradiction clearly.

    Clause 1:
    {clause1}

    Clause 2:
    {clause2}

    Provide your response as a valid JSON object ONLY, with NO markdown formatting, with the following keys:
    - "analysis": Detailed explanation of the conflict and possible legal/financial risk.
    - "reason": A short one-sentence reason for the risk level.
    - "recommendation": A clear recommendation on how to align the contracts.
    """

    try:
        response = model.generate_content(prompt)
        text = response.text.replace("```json", "").replace("```", "").strip()
        data = json.loads(text)
        return data
    except Exception as e:
        return {
            "analysis": f"AI Analysis failed to generate: {str(e)}",
            "reason": "Unknown",
            "recommendation": "Review manually."
        }

def generate_explainable_ai_analysis(payload: dict) -> dict:
    clause1 = payload.get("clause1", "")
    clause2 = payload.get("clause2", "")
    filename1 = payload.get("filename1", "")
    filename2 = payload.get("filename2", "")

    # Mock response if API key is not configured
    if API_KEY == "YOUR_API_KEY":
        return {
            "contradiction_found": True,
            "what_was_found": "Mock AI: Difference in clauses detected.",
            "contract_a": {
                "document_name": filename1,
                "clause": clause1,
                "reference": "N/A"
            },
            "contract_b": {
                "document_name": filename2,
                "clause": clause2,
                "reference": "N/A"
            },
            "why_it_matters": "Mock: It matters because of inconsistencies.",
            "risk_level": "MEDIUM",
            "risk_reason": "Mock risk reason.",
            "what_should_be_reviewed": "Mock: Review manually.",
            "disclaimer": "This is an AI-assisted analysis intended to support contract review. It is not legal advice."
        }

    prompt = f"""
    You are an expert legal AI assistant.
    Analyze the following two contract clauses from different documents and provide a highly detailed, explainable AI analysis of the contradiction.

    Contract A (Document: {filename1}):
    Clause: {clause1}

    Contract B (Document: {filename2}):
    Clause: {clause2}

    Provide your response as a valid JSON object ONLY, with NO markdown formatting, adhering exactly to this structure:
    {{
      "contradiction_found": true/false,
      "what_was_found": "Clear explanation of the exact difference or contradiction between the clauses.",
      "contract_a": {{
        "document_name": "{filename1}",
        "clause": "The clause from Contract A.",
        "reference": "N/A"
      }},
      "contract_b": {{
        "document_name": "{filename2}",
        "clause": "The clause from Contract B.",
        "reference": "N/A"
      }},
      "why_it_matters": "Explanation of the possible business, financial, operational, or contractual impact (understandable to a legal team).",
      "risk_level": "LOW", // Must be one of: LOW, MEDIUM, HIGH, CRITICAL
      "risk_reason": "Short reason for the selected risk level.",
      "what_should_be_reviewed": "An AI-assisted review recommendation. Do NOT provide definitive legal advice.",
      "disclaimer": "This is an AI-assisted analysis intended to support contract review. It is not legal advice."
    }}
    """

    try:
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        text = response.text.replace("```json", "").replace("```", "").strip()
        data = json.loads(text)
        # Ensure disclaimer is set properly
        data["disclaimer"] = "This is an AI-assisted analysis intended to support contract review. It is not legal advice."
        return data
    except Exception as e:
        return {
            "contradiction_found": True,
            "what_was_found": f"AI Generation failed: {str(e)}",
            "contract_a": {"document_name": filename1, "clause": clause1, "reference": "N/A"},
            "contract_b": {"document_name": filename2, "clause": clause2, "reference": "N/A"},
            "why_it_matters": "N/A",
            "risk_level": "MEDIUM",
            "risk_reason": "Failed to analyze",
            "what_should_be_reviewed": "Manual review required due to AI error.",
            "disclaimer": "This is an AI-assisted analysis intended to support contract review. It is not legal advice."
        }

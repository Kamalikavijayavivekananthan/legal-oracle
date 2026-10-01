import os
import json
from dotenv import load_dotenv

load_dotenv()

# API Keys Configuration
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "").strip()
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "").strip()

# Initialize Groq Client
groq_client = None
if GROQ_API_KEY and GROQ_API_KEY != "YOUR_GROQ_API_KEY":
    try:
        from groq import Groq
        groq_client = Groq(api_key=GROQ_API_KEY)
    except Exception as e:
        print(f"Failed to initialize Groq client: {e}")

# Initialize Gemini Client (Fallback)
gemini_model = None
if GEMINI_API_KEY and GEMINI_API_KEY != "YOUR_API_KEY":
    try:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)
        gemini_model = genai.GenerativeModel("gemini-1.5-flash")
    except Exception as e:
        print(f"Failed to initialize Gemini client: {e}")


def _query_llm_json(prompt: str, system_prompt: str = "You are an expert legal AI assistant specializing in contract contradiction analysis. Always return valid JSON only.") -> dict:
    """Helper to query Groq first, then Gemini as fallback, or return None if both fail."""
    # 1. Try Groq API
    if groq_client:
        try:
            chat_completion = groq_client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                model="llama-3.3-70b-versatile",
                response_format={"type": "json_object"},
                temperature=0.2,
            )
            content = chat_completion.choices[0].message.content
            return json.loads(content)
        except Exception as e:
            print(f"Groq generation error: {e}, attempting fallback...")

    # 2. Try Gemini API
    if gemini_model:
        try:
            response = gemini_model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            text = response.text.replace("```json", "").replace("```", "").strip()
            return json.loads(text)
        except Exception as e:
            print(f"Gemini generation error: {e}")

    return None


def explain_contradiction(clause1: str, clause2: str) -> dict:
    prompt = f"""
    Analyze these two conflicting contract clauses and explain the contradiction clearly.

    Clause 1:
    {clause1}

    Clause 2:
    {clause2}

    Provide your response as a valid JSON object ONLY, with the following keys:
    - "analysis": Detailed explanation of the conflict and possible legal/financial risk.
    - "reason": A short one-sentence reason for the risk level.
    - "recommendation": A clear recommendation on how to align the contracts.
    """

    result = _query_llm_json(prompt)
    if result:
        return result

    # Mock response if neither API is active or calls failed
    return {
        "analysis": f"Analysis between '{clause1[:50]}...' and '{clause2[:50]}...'. Potential inconsistency in terms.",
        "reason": "Potential conflict in obligations or timelines.",
        "recommendation": "Review both clauses manually and harmonize definitions."
    }


def generate_explainable_ai_analysis(payload: dict) -> dict:
    clause1 = payload.get("clause1", "")
    clause2 = payload.get("clause2", "")
    filename1 = payload.get("filename1", "") or "Document A"
    filename2 = payload.get("filename2", "") or "Document B"

    prompt = f"""
    Analyze the following two contract clauses from different documents and provide a highly detailed, explainable AI analysis of the contradiction.

    Contract A (Document: {filename1}):
    Clause: {clause1}

    Contract B (Document: {filename2}):
    Clause: {clause2}

    Provide your response as a valid JSON object adhering strictly to this format:
    {{
      "contradiction_found": true,
      "what_was_found": "Clear explanation of the exact difference or contradiction between the clauses.",
      "contract_a": {{
        "document_name": "{filename1}",
        "clause": "{clause1.replace('"', '')}",
        "reference": "N/A"
      }},
      "contract_b": {{
        "document_name": "{filename2}",
        "clause": "{clause2.replace('"', '')}",
        "reference": "N/A"
      }},
      "why_it_matters": "Explanation of the possible business, financial, operational, or contractual impact.",
      "risk_level": "HIGH",
      "risk_reason": "Short reason for the selected risk level (LOW, MEDIUM, HIGH, or CRITICAL).",
      "what_should_be_reviewed": "AI-assisted review recommendation.",
      "disclaimer": "This is an AI-assisted analysis intended to support contract review. It is not legal advice."
    }}
    """

    result = _query_llm_json(prompt)
    if result:
        result["disclaimer"] = "This is an AI-assisted analysis intended to support contract review. It is not legal advice."
        return result

    # Fallback response
    return {
        "contradiction_found": True,
        "what_was_found": f"Contradiction identified between {filename1} and {filename2}.",
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
        "why_it_matters": "Conflicting contractual terms may lead to disputes, delayed compliance, or financial liability.",
        "risk_level": "MEDIUM",
        "risk_reason": "Mismatch between contract conditions.",
        "what_should_be_reviewed": "Recommend standardizing terms across both agreements.",
        "disclaimer": "This is an AI-assisted analysis intended to support contract review. It is not legal advice."
    }

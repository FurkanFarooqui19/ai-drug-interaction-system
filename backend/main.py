"""
AI Drug-Drug Interaction Warning System - FastAPI Backend
Loads CSV at startup, exposes POST /check and POST /check-from-image.
Uses Google Gemini (free) for AI explanations and image-based drug extraction.
Set GEMINI_API_KEY in .env — get a free key at https://aistudio.google.com/apikey
"""
import io
import os
from contextlib import asynccontextmanager
from pathlib import Path

from dotenv import load_dotenv
# Load .env from project root (AI-Drug/) or backend folder
load_dotenv(Path(__file__).resolve().parent.parent / ".env")
load_dotenv(Path(__file__).resolve().parent / ".env")

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd


def _get_gemini_model():
    """Return configured Gemini model. Uses GEMINI_API_KEY from env."""
    import google.generativeai as genai
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return None
    genai.configure(api_key=api_key)
    return genai.GenerativeModel("gemini-3-flash-preview")


def get_ai_explanation(interaction: dict) -> str | None:
    """Use Gemini to generate a short patient-friendly explanation. Free tier."""
    try:
        model = _get_gemini_model()
        if not model:
            return None
        drug1 = interaction.get("drug1", "")
        drug2 = interaction.get("drug2", "")
        desc = interaction.get("description", "")
        prompt = (
            f"Explain this drug interaction in one short, simple sentence for patients. No jargon. "
            f"Drugs: {drug1} and {drug2}. Interaction: {desc}"
        )
        resp = model.generate_content(prompt)
        if resp and resp.text:
            return resp.text.strip()
    except Exception:
        pass
    return None


def extract_drugs_from_image(image_bytes: bytes) -> list[str]:
    """
    Use Gemini Vision to extract medicine/drug names from an image (pill bottle, prescription, etc.).
    Returns a list of drug names. Requires GEMINI_API_KEY (free at aistudio.google.com/apikey).
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="Image upload requires GEMINI_API_KEY. Get a free key at https://aistudio.google.com/apikey and add it to .env",
        )
    try:
        import google.generativeai as genai
        from PIL import Image
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-3-flash-preview")
        img = Image.open(io.BytesIO(image_bytes))
        prompt = (
            "Look at this image and list ALL medicine or drug names you can see "
            "(from labels, prescription, pill bottles, packaging). "
            "Return ONLY a comma-separated list of drug names, nothing else. "
            "Use standard names (e.g. Paracetamol). If you see no medicines, return: none"
        )
        resp = model.generate_content([prompt, img])
        if not resp or not resp.text:
            return []
        text = resp.text.strip().lower()
        if text == "none" or not text:
            return []
        drugs = [d.strip() for d in text.replace(";", ",").split(",") if d.strip()]
        return drugs
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Could not read medicines from image: {str(e)}")


# --- Medical Chatbot: safe, concise, patient-friendly ---
MEDICAL_CHAT_SYSTEM_PROMPT = """You are a helpful medical information assistant for a drug interaction checker app. Your role is to answer general medicine and drug-safety questions in a simple, patient-friendly way.

RULES (follow strictly):
- Use simple language. Avoid jargon. Be concise (2–4 short sentences unless the user asks for more).
- Only answer questions about medicines, drug interactions, and general drug safety. For anything else (e.g. recipes, coding), politely say: "I can only help with medicine and drug safety questions. Try the drug interaction checker on this app for specific combinations."
- Never prescribe, recommend specific dosages, or suggest changing medication. Always say to consult a doctor or pharmacist for that.
- For serious symptoms (chest pain, severe allergy, overdose), say: "Please see a doctor or go to the emergency room. I can't give medical advice."
- Tone: calm, professional, helpful, non-alarming.
- Do not diagnose conditions. You can explain what a drug is for or what an interaction might mean in general terms only."""


def _chat_with_gemini(user_message: str) -> str:
    """Single-turn chat with Gemini. Uses GEMINI_API_KEY. Returns assistant reply or raises."""
    import google.generativeai as genai
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="Chat requires GEMINI_API_KEY. Add it to .env (free at https://aistudio.google.com/apikey)",
        )
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(
        "gemini-2.5-flash",  # Fast, free tier
        system_instruction=MEDICAL_CHAT_SYSTEM_PROMPT,
    )
    chat = model.start_chat(history=[])
    resp = chat.send_message(user_message)
    if not resp or not resp.text:
        raise HTTPException(status_code=502, detail="Empty reply from AI")
    return resp.text.strip()


# --- Config ---
# Support both local (AI-Drug/data/) and Render deployment (backend/../data/ or backend/data/)
_BACKEND_DIR = Path(__file__).resolve().parent
DATA_DIR = (
    _BACKEND_DIR.parent / "data"
    if (_BACKEND_DIR.parent / "data").exists()
    else _BACKEND_DIR / "data"
)
CSV_PATH = DATA_DIR / "drug_interactions.csv"

# Global: loaded once at startup
interactions_df: pd.DataFrame | None = None


@asynccontextmanager
async def lifespan(app):
    """Load data on startup."""
    global interactions_df
    try:
        interactions_df = load_interactions()
    except Exception as e:
        print(f"WARNING: Could not load interaction CSV: {e}")
    yield


def load_interactions() -> pd.DataFrame:
    """Load and normalize interaction CSV. Case-insensitive lookup ready."""
    if not CSV_PATH.exists():
        raise FileNotFoundError(f"Dataset not found: {CSV_PATH}")
    df = pd.read_csv(CSV_PATH)
    required = {"drug1", "drug2", "severity", "description"}
    missing = required - set(df.columns)
    if missing:
        raise ValueError(f"CSV missing columns: {missing}")
    # Normalize for case-insensitive matching
    df["drug1_lower"] = df["drug1"].astype(str).str.strip().str.lower()
    df["drug2_lower"] = df["drug2"].astype(str).str.strip().str.lower()
    return df


app = FastAPI(
    title="Drug Interaction API",
    description="Check drug-drug interactions for a list of medicines.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS — allow configured origins (set ALLOWED_ORIGINS env var in production)
_raw_origins = os.environ.get("ALLOWED_ORIGINS", "")
ALLOWED_ORIGINS = [
    o.strip() for o in _raw_origins.split(",") if o.strip()
] if _raw_origins else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,  # must be False when using wildcard
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)



# --- Request/Response models ---
class CheckRequest(BaseModel):
    drugs: list[str]


class CheckResponse(BaseModel):
    risk: str  # Safe | Moderate | Dangerous
    message: str
    ai_explanation: str | None = None
    interaction_detail: dict | None = None  # drug1, drug2, severity, description
    detected_drugs: list[str] | None = None  # when source is image upload


def find_first_interaction(drugs: list[str]) -> dict | None:
    """
    Check all pairs in drugs list against CSV.
    Returns first matched row as dict, or None if no interaction.
    """
    if interactions_df is None or len(drugs) < 2:
        return None
    drugs_lower = [d.strip().lower() for d in drugs if d and str(d).strip()]
    if len(drugs_lower) < 2:
        return None

    for i in range(len(drugs_lower)):
        for j in range(i + 1, len(drugs_lower)):
            a, b = drugs_lower[i], drugs_lower[j]
            # Check both orderings (drug1-drug2 and drug2-drug1)
            mask = (
                ((interactions_df["drug1_lower"] == a) & (interactions_df["drug2_lower"] == b))
                | ((interactions_df["drug1_lower"] == b) & (interactions_df["drug2_lower"] == a))
            )
            match = interactions_df[mask]
            if not match.empty:
                row = match.iloc[0]
                return {
                    "drug1": str(row["drug1"]),
                    "drug2": str(row["drug2"]),
                    "severity": str(row["severity"]).strip(),
                    "description": str(row["description"]),
                }
    return None


def risk_from_severity(severity: str) -> str:
    """Map severity to risk level for response."""
    s = (severity or "").strip().lower()
    if s in ("major", "contraindicated", "dangerous", "high"):
        return "Dangerous"
    if s in ("moderate", "moderate"):
        return "Moderate"
    return "Dangerous" if s else "Safe"


@app.post("/check", response_model=CheckResponse)
def check_interaction(req: CheckRequest):
    """
    Check drug-drug interactions for the given list of drugs.
    Returns first found interaction with risk, message, and optional AI explanation.
    """
    drugs = [d.strip() for d in req.drugs if d and str(d).strip()]
    if len(drugs) < 2:
        return CheckResponse(
            risk="Safe",
            message="Please enter at least two drugs to check for interactions.",
            ai_explanation=None,
            interaction_detail=None,
            detected_drugs=None,
        )

    interaction = find_first_interaction(drugs)
    if interaction is None:
        return CheckResponse(
            risk="Safe",
            message="No known dangerous interactions found among the listed drugs. Always confirm with your doctor or pharmacist.",
            ai_explanation=None,
            interaction_detail=None,
            detected_drugs=None,
        )

    severity = interaction["severity"]
    risk = risk_from_severity(severity)
    message = (
        f"Interaction between {interaction['drug1']} and {interaction['drug2']}: "
        f"{interaction['description']}"
    )
    # Optional: Gemini-generated simple explanation if API key is set (free)
    ai_explanation = None
    if os.environ.get("GEMINI_API_KEY"):
        ai_explanation = get_ai_explanation(interaction)
    if not ai_explanation:
        ai_explanation = (
            f"Taking {interaction['drug1']} and {interaction['drug2']} together may cause "
            f"the following: {interaction['description']}. Please consult your doctor before combining these medicines."
        )
    return CheckResponse(
        risk=risk,
        message=message,
        ai_explanation=ai_explanation,
        interaction_detail=interaction,
        detected_drugs=None,
    )


@app.get("/health")
def health():
    return {"status": "ok", "interactions_loaded": interactions_df is not None and len(interactions_df) > 0}


@app.get("/drugs")
def list_drugs():
    """Return unique drug names for autocomplete (from CSV)."""
    if interactions_df is None:
        return {"drugs": []}
    all_drugs = set(interactions_df["drug1"].astype(str).str.strip()) | set(
        interactions_df["drug2"].astype(str).str.strip()
    )
    return {"drugs": sorted([d for d in all_drugs if d and d.lower() != "nan"])}


@app.post("/check-from-image", response_model=CheckResponse)
async def check_from_image(file: UploadFile = File(...)):
    """
    Upload an image of medicine (pill bottle, prescription, label). Extracts drug names via Gemini Vision,
    then runs interaction check. Requires GEMINI_API_KEY (free at aistudio.google.com/apikey).
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Please upload an image file (e.g. JPEG, PNG).")
    image_bytes = await file.read()
    if len(image_bytes) > 10 * 1024 * 1024:  # 10 MB
        raise HTTPException(status_code=400, detail="Image too large. Max 10 MB.")
    drugs = extract_drugs_from_image(image_bytes)
    if len(drugs) < 2:
        return CheckResponse(
            risk="Safe",
            message=f"We found {len(drugs)} medicine name(s) in the image. Please add at least two drugs (or type them above) to check interactions.",
            ai_explanation=None,
            interaction_detail=None,
            detected_drugs=drugs if drugs else None,
        )
    # Reuse same logic as /check
    interaction = find_first_interaction(drugs)
    if interaction is None:
        return CheckResponse(
            risk="Safe",
            message=f"No known dangerous interactions among: {', '.join(drugs)}. Always confirm with your doctor or pharmacist.",
            ai_explanation=None,
            interaction_detail=None,
            detected_drugs=drugs,
        )
    severity = interaction["severity"]
    risk = risk_from_severity(severity)
    message = (
        f"Interaction between {interaction['drug1']} and {interaction['drug2']}: "
        f"{interaction['description']}"
    )
    ai_explanation = None
    if os.environ.get("GEMINI_API_KEY"):
        ai_explanation = get_ai_explanation(interaction)
    if not ai_explanation:
        ai_explanation = (
            f"Taking {interaction['drug1']} and {interaction['drug2']} together may cause "
            f"{interaction['description']}. Please consult your doctor before combining these medicines."
        )
    return CheckResponse(
        risk=risk,
        message=message,
        ai_explanation=ai_explanation,
        interaction_detail=interaction,
        detected_drugs=drugs,
    )


# --- Clinical decision-support: alternatives, duration, safety ---
CLINICAL_ADVICE_SYSTEM = """You are a clinical decision-support AI that assists patients and healthcare learners. You provide safe, general medical guidance and do NOT replace a doctor.

RULES (strict):
- Never give exact dosage. Never give emergency-critical instructions.
- Suggest only widely known, generic medicines — never invent rare or experimental drugs.
- For alternatives, clearly state they must be confirmed by a licensed doctor.
- Base duration on typical treatment for the condition; if it varies, explain briefly.
- Always include a short medical disclaimer. Keep tone calm, clear, and patient-friendly.
- Output ONLY valid JSON with exactly these keys (no markdown, no extra text):
  "interaction_summary": "1-2 lines summary of the interaction and risk.",
  "alternative_options": ["option 1 with brief note", "option 2 if applicable"] or [] if severity is Safe,
  "typical_duration": "General guidance on how long the medicine(s) are usually taken.",
  "safety_advice": "2-3 short bullet points or one paragraph of important safety advice.",
  "disclaimer": "One short sentence: this is not medical advice; follow your doctor's prescription."
"""


def _get_clinical_advice(drugs: list[str], severity: str, age: str | None, disease: str | None, symptoms: str | None) -> dict:
    """Call Gemini for clinical guidance. Returns dict with interaction_summary, alternative_options, typical_duration, safety_advice, disclaimer."""
    import json
    import google.generativeai as genai
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="Clinical advice requires GEMINI_API_KEY in .env",
        )
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(
        "gemini-2.5-flash",
        system_instruction=CLINICAL_ADVICE_SYSTEM,
    )
    severity_normalized = "Severe" if severity == "Dangerous" else severity
    context_parts = [f"Medicines: {', '.join(drugs)}.", f"Detected interaction severity: {severity_normalized}."]
    if age:
        context_parts.append(f"Patient age (if relevant): {age}.")
    if disease:
        context_parts.append(f"Relevant disease/condition: {disease}.")
    if symptoms:
        context_parts.append(f"Relevant symptoms: {symptoms}.")
    prompt = (
        "Based on the following, provide the JSON output only.\n\n"
        + "\n".join(context_parts)
        + "\n\nIf severity is Safe, set alternative_options to []. Otherwise suggest 1-2 safer alternative medicines (common, generic) with similar therapeutic purpose and state they must be confirmed by a doctor."
    )
    resp = model.generate_content(prompt)
    if not resp or not resp.text:
        raise HTTPException(status_code=502, detail="Empty response from AI")
    text = resp.text.strip()
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    text = text.strip()
    try:
        out = json.loads(text)
    except json.JSONDecodeError:
        raise HTTPException(status_code=502, detail="Could not parse clinical advice response")

    # Normalize: Gemini sometimes returns lists for string fields; convert to expected types
    string_keys = ("interaction_summary", "typical_duration", "safety_advice", "disclaimer")
    for key in string_keys:
        val = out.get(key)
        if val is None:
            out[key] = ""
        elif isinstance(val, list):
            out[key] = "\n".join(str(x) for x in val) if val else ""
        else:
            out[key] = str(val) if not isinstance(val, str) else val
    if "alternative_options" not in out:
        out["alternative_options"] = []
    elif not isinstance(out["alternative_options"], list):
        out["alternative_options"] = [str(out["alternative_options"])] if out["alternative_options"] else []
    else:
        out["alternative_options"] = [str(x) for x in out["alternative_options"]]
    return out


class ClinicalAdviceRequest(BaseModel):
    drugs: list[str]
    severity: str  # Safe | Moderate | Dangerous
    age: str | None = None
    disease: str | None = None
    symptoms: str | None = None


class ClinicalAdviceResponse(BaseModel):
    interaction_summary: str
    alternative_options: list[str]
    typical_duration: str
    safety_advice: str
    disclaimer: str


@app.post("/clinical-advice", response_model=ClinicalAdviceResponse)
def clinical_advice(req: ClinicalAdviceRequest):
    """
    Clinical decision-support: interaction summary, safer alternatives (if Moderate/Severe),
    typical duration of use, safety advice, disclaimer. Requires GEMINI_API_KEY.
    """
    drugs = [d.strip() for d in req.drugs if d and str(d).strip()]
    if len(drugs) < 1:
        raise HTTPException(status_code=400, detail="At least one drug is required.")
    sev = (req.severity or "Safe").strip()
    if sev not in ("Safe", "Moderate", "Dangerous"):
        sev = "Safe"
    try:
        out = _get_clinical_advice(drugs, sev, req.age, req.disease, req.symptoms)
        return ClinicalAdviceResponse(**out)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Clinical advice failed: {str(e)}")


# --- Medical Chatbot ---
class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    """
    Medical chatbot: answers medicine/drug-safety questions using Gemini.
    Safe, concise, patient-friendly. Never prescribes or suggests dosage changes.
    """
    text = (req.message or "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")
    if len(text) > 2000:
        raise HTTPException(status_code=400, detail="Message too long.")
    try:
        reply = _chat_with_gemini(text)
        return ChatResponse(reply=reply)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Chat failed: {str(e)}")

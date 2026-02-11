from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

import google.genai as genai
from google.genai.types import GenerateContentConfig
from google.api_core.exceptions import ServiceUnavailable

import os
import json
import traceback
import time
from tempfile import NamedTemporaryFile
from json.decoder import JSONDecodeError

# --- Load environment variables ---
load_dotenv()

# --- Initialize Router ---
router = APIRouter()

# --- Configure Gemini client ---
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
print("Gemini API Key Configured")

# 🔁 Toggle this for testing
USE_GEMINI = True
print(f"USE_GEMINI set to: {USE_GEMINI}")

# --- Retry Helper ---
def gemini_generate_with_retry(call_fn, retries=3, delay=1.5):
    for attempt in range(retries):
        try:
            return call_fn()
        except ServiceUnavailable:
            if attempt == retries - 1:
                raise
            time.sleep(delay)

# --- JSON Schemas ---
EXTRACTION_SCHEMA_DICT = {
    "type": "object",
    "properties": {
        "District_Name": {"type": "string"},
        "Nitrogen": {"type": "number"},
        "Phosphorus": {"type": "number"},
        "Potassium": {"type": "number"},
        "Organic_Carbon": {"type": "number"},
        "pH": {"type": "number"},
        "Rainfall": {"type": "number"},
        "Sulphur": {"type": "number"},
        "Zinc": {"type": "number"},
        "Iron": {"type": "number"}
    },
    "required": [
        "District_Name", "Nitrogen", "Phosphorus",
        "Potassium", "Organic_Carbon", "pH", "Rainfall"
    ]
}

ANALYSIS_SCHEMA_DICT = {
    "type": "object",
    "properties": {
        "soil_health_analysis": {"type": "string"},
        "soil_health_score": {"type": "string"},
        "soil_health_grade": {"type": "string"},
        "recommended_crop": {"type": "string"},
        "recommended_fertilizer": {"type": "string"},
        "top_crops": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "crop": {"type": "string"},
                    "probability": {"type": "number"}
                }
            }
        },
        "top_fertilizers": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "fertilizer": {"type": "string"},
                    "probability": {"type": "number"}
                }
            }
        }
    },
    "required": [
        "soil_health_analysis",
        "soil_health_score",
        "soil_health_grade",
        "recommended_crop",
        "recommended_fertilizer"
    ]
}

@router.post("/analyze-soil-report")
async def analyze_soil_report(file: UploadFile = File(...)):

    tmp_path = None
    uploaded_file = None

    try:
        # -------- STEP 1: Read file --------
        file_bytes = await file.read()
        if not file_bytes:
            raise HTTPException(400, "Empty PDF received")

        # Optional size guard
        if len(file_bytes) > 5 * 1024 * 1024:
            raise HTTPException(400, "PDF too large (max 5MB)")

        # -------- STEP 2: Save temp PDF --------
        with NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(file_bytes)
            tmp_path = tmp.name

        # -------- STEP 3: Upload to Gemini --------
        if USE_GEMINI:
            uploaded_file = client.files.upload(file=tmp_path)

        # -------- STEP 4: Extraction --------
        if USE_GEMINI:
            extraction_prompt = """
            You are a data extraction AI.
            Extract:
            District Name, Nitrogen, Phosphorus, Potassium,
            Organic Carbon, pH, Rainfall, Sulphur, Zinc, Iron.
            Return STRICT JSON only.
            """

            extraction_config = GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=EXTRACTION_SCHEMA_DICT
            )

            extraction_response = gemini_generate_with_retry(
                lambda: client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=[uploaded_file, extraction_prompt],
                    config=extraction_config
                )
            )

            extracted_data = json.loads(extraction_response.text)

        else:
            extracted_data = {
                "District_Name": "Kolhapur",
                "Nitrogen": 45,
                "Phosphorus": 32,
                "Potassium": 40,
                "Organic_Carbon": 0.75,
                "pH": 6.8,
                "Rainfall": 900,
                "Sulphur": 10,
                "Zinc": 1.2,
                "Iron": 3.5
            }

        # -------- STEP 5: Analysis --------
        if USE_GEMINI:
            analysis_prompt = f"""
            You are an agricultural expert.
            Analyze this soil data:

            {json.dumps(extracted_data, indent=2)}

            Return STRICT JSON only.sample schema->
            "soil_health_analysis": "Balanced soil with moderate nutrients.",
                "soil_health_score": "75",
                "soil_health_grade": "Good",
                "recommended_crop": "Cotton",
                "recommended_fertilizer": "DAP",
                "top_crops": [],
                "top_fertilizers": []
            """

            analysis_config = GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=ANALYSIS_SCHEMA_DICT
            )

            analysis_response = gemini_generate_with_retry(
                lambda: client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=[analysis_prompt],
                    config=analysis_config
                )
            )

            ai_analysis = json.loads(analysis_response.text)

        else:
            ai_analysis = {
                "soil_health_analysis": "Balanced soil with moderate nutrients.",
                "soil_health_score": "75",
                "soil_health_grade": "Good",
                "recommended_crop": "Cotton",
                "recommended_fertilizer": "DAP",
                "top_crops": [],
                "top_fertilizers": []
            }

        # -------- STEP 6: Response --------
        return JSONResponse(content={
            "extracted_data": extracted_data,
            "ai_analysis_data": ai_analysis
        })

    except ServiceUnavailable:
        return JSONResponse(
            status_code=200,
            content={
                "error": "AI service temporarily unavailable. Try again later.",
                "extracted_data": extracted_data if 'extracted_data' in locals() else None,
                "ai_analysis_data": None
            }
        )

    except Exception:
        print("PDF Insight Error:\n", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Internal processing error")

    finally:
        try:
            if uploaded_file:
                client.files.delete(name=uploaded_file.name)
        except Exception:
            pass

        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)

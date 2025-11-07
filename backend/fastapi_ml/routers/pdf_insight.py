from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import google.genai as genai
from google.genai.types import GenerateContentConfig
import os, json, re, traceback
from tempfile import NamedTemporaryFile
from json.decoder import JSONDecodeError

# --- Load environment variables ---
load_dotenv()

# --- Initialize Router ---
router = APIRouter()

# --- Configure Gemini client ---
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
print("✅ Gemini API Key Configured (Multimodal PDF/Image Support)")

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
        "Rainfall": {"type": "number"}
    },
    "required": ["District_Name", "Nitrogen", "Phosphorus", "Potassium", "Organic_Carbon"]
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
            "items": {"type": "object", "properties": {"crop": {"type": "string"}, "probability": {"type": "number"}}}
        },
        "top_fertilizers": {
            "type": "array",
            "items": {"type": "object", "properties": {"fertilizer": {"type": "string"}, "probability": {"type": "number"}}}
        }
    },
    "required": ["soil_health_analysis", "soil_health_score", "soil_health_grade", "recommended_crop", "recommended_fertilizer"]
}

@router.post("/analyze-soil-report")
async def analyze_soil_report(file: UploadFile = File(...)):
    tmp_path = None # Initialize tmp_path for cleanup
    uploaded_file = None # Initialize uploaded_file for cleanup

    try:
        # --- Step 1: Validate file type ---
        allowed_types = ["application/pdf", "image/png", "image/jpeg"]
        if file.content_type not in allowed_types:
            return JSONResponse(status_code=400, content={"error": "Unsupported file type. Please upload PDF or image (PNG/JPG)."})

        # --- Step 2: Temporarily save the uploaded file ---
        # The file MUST be saved to disk before uploading to the Gemini API
        with NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        # --- Step 3: Upload to Gemini (FIXED) ---
        # CORRECT METHOD is client.files.upload()
        uploaded_file = client.files.upload(file=tmp_path)
        print(f"✅ Uploaded file: {uploaded_file.name}")

        # --- Step 4: Structured Data Extraction ---
        extraction_prompt = f"""
        You are a data extraction AI.
        Analyze the attached soil report (PDF or image) and extract values for:
        District Name, Available Nitrogen (as N), Available Phosphorus, Available Potassium, 
        Organic Carbon, pH, and Rainfall. If a value is not present, use null.
        Strictly return the result as a valid JSON conforming to the schema.
        """
        
        extraction_config = GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=EXTRACTION_SCHEMA_DICT
        )

        extraction_response = client.models.generate_content(
            model="gemini-2.5-flash", #"gemini-pro-latest"
            contents=[uploaded_file, extraction_prompt], # Pass the uploaded file object directly
            config=extraction_config
        )

        # Parse the extracted data (add robust JSON parsing)
        try:
            extracted_data = json.loads(extraction_response.text.strip())
        except JSONDecodeError:
            raise ValueError(f"Failed to parse extraction JSON. Raw Output: {extraction_response.text}")


        # --- Step 5: Structured AI Soil Analysis ---
        analysis_prompt = f"""
            You are an agricultural expert.
            Based on the extracted soil data below, analyze soil health for Maharashtra and
            provide insights and recommendations strictly following this schema:
            for eg:
            {{
            "soil_health_analysis": "🧭short summary about soil like this -> Soil Health Analysis: Nitrogen: Moderate, Phosphorus: Moderate, Potassium: Moderate, Soil pH: 8.0, Rainfall: Moderate",
            "soil_health_score": "70.00",
            "soil_health_grade": "Good",
            "recommended_crop": "Ginger",
            "recommended_fertilizer": "DAP",
            "top_crops": [
                {{"crop": "Ginger", "probability": 35.5}},
                {{"crop": "Cotton", "probability": 21.5}},
                {{"crop": "Groundnut", "probability": 16}},
                {{"crop": "Wheat", "probability": 13.5}},
                {{"crop": "Jowar", "probability": 8.5}}
            ],
            "top_fertilizers": [
                {{"fertilizer": "DAP", "probability": 31}},
                {{"fertilizer": "Urea", "probability": 14}},
                {{"fertilizer": "Ammonium Sulphate", "probability": 11.5}},
                {{"fertilizer": "Magnesium Sulphate", "probability": 10.5}},
                {{"fertilizer": "12:32:16 NPK", "probability": 9}}
            ]
            }}
            Extracted Soil Data:
            {json.dumps(extracted_data, indent=2)}
        """

        analysis_config = GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=ANALYSIS_SCHEMA_DICT
        )

        analysis_response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[analysis_prompt],
            config=analysis_config
        )

        # Parse the AI analysis
        try:
            ai_analysis = json.loads(analysis_response.text.strip())
        except JSONDecodeError:
            raise ValueError(f"Failed to parse analysis JSON. Raw Output: {analysis_response.text}")


        # --- Step 6: Return both outputs ---
        return JSONResponse(content={
            "extracted_data": extracted_data,
            "ai_analysis": ai_analysis
        })

    except ValueError as ve:
        # Handle custom ValueErrors (like JSON parsing failure)
        print("❌ Value Error:\n", traceback.format_exc())
        return JSONResponse(status_code=500, content={"error": str(ve)})

    except Exception as e:
        # Catch any other unhandled errors
        print("❌ Backend Error:\n", traceback.format_exc())
        return JSONResponse(status_code=500, content={"error": f"An unexpected error occurred: {str(e)}"})

    finally:
        # --- Step 7: Cleanup: Delete temporary file and uploaded file ---
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)
            print(f"🧹 Deleted local temporary file: {tmp_path}")
        if uploaded_file:
            client.files.delete(name=uploaded_file.name)
            print(f"🗑️ Deleted Gemini uploaded file: {uploaded_file.name}")
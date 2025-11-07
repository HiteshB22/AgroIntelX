from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import json
import traceback
from dotenv import load_dotenv
from utils.soil_health import calculate_soil_health
from routers import pdf_insight
from google.genai.types import GenerateContentConfig
import google.genai as genai
import os

# --- Load environment variables ---
load_dotenv()

# ✅ Initialize FastAPI app
app = FastAPI(title="Crop & Fertilizer Prediction API")

# ✅ Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Initialize Gemini client
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
print("✅ Gemini API Key Configured (Main.py)")

# ✅ Load ML models and encoders
rf_crop = joblib.load("model/crop_model.pkl")
rf_fertilizer = joblib.load("model/fert_model.pkl")
encoders = joblib.load("model/encoders.pkl")

le_district = encoders["district"]
le_crop = encoders["crop"]
le_fertilizer = encoders["fertilizer"]


# ✅ Define input structure
class SoilData(BaseModel):
    District_Name: str
    Nitrogen: float
    Phosphorus: float
    Potassium: float
    pH: float
    Rainfall: float


# ✅ Prediction Route with Gemini Fallback
@app.post("/predict")
def predict_crop(data: SoilData):
    try:
        # --- Step 1: Prepare Input ---
        df = pd.DataFrame([{
            "District_Name": le_district.transform([data.District_Name])[0],
            "Nitrogen": data.Nitrogen,
            "Phosphorus": data.Phosphorus,
            "Potassium": data.Potassium,
            "pH": data.pH,
            "Rainfall": data.Rainfall
        }])

        # --- Step 2: ML Predictions ---
        pred_crop = le_crop.inverse_transform(rf_crop.predict(df))[0]
        pred_fert = le_fertilizer.inverse_transform(rf_fertilizer.predict(df))[0]

        # --- Step 3: Soil Health Logic ---
        score, status, details = calculate_soil_health(
            data.Nitrogen, data.Phosphorus, data.Potassium, data.pH, data.Rainfall
        )

        # --- Step 4: Top 5 Crops ---
        crop_probs = rf_crop.predict_proba(df)[0]
        top_crops_idx = crop_probs.argsort()[-5:][::-1]
        top_crops = [
            {"crop": le_crop.inverse_transform([idx])[0], "probability": round(crop_probs[idx] * 100, 2)}
            for idx in top_crops_idx
        ]

        # --- Step 5: Top 5 Fertilizers ---
        fert_probs = rf_fertilizer.predict_proba(df)[0]
        top_ferts_idx = fert_probs.argsort()[-5:][::-1]
        top_fertilizers = [
            {"fertilizer": le_fertilizer.inverse_transform([idx])[0], "probability": round(fert_probs[idx] * 100, 2)}
            for idx in top_ferts_idx
        ]

        # ✅ Step 6: Return ML Result (in required format)
        return {
            "source": "ML Model",
            "soil_health_analysis": details,
            "soil_health_score": f"{score:.2f}",
            "soil_health_grade": status,
            "recommended_crop": pred_crop,
            "recommended_fertilizer": pred_fert,
            "top_crops": top_crops,
            "top_fertilizers": top_fertilizers
        }

    except Exception as e:
        print("⚠️ ML model failed, switching to Gemini fallback.")
        print(traceback.format_exc())

        # --- Step 7: Gemini Fallback ---
        fallback_prompt = f"""
        You are an agricultural expert.
        The ML model failed to predict results for the following soil data.
        Please analyze the soil and respond strictly in JSON format matching this schema:

        Input:
        {{
            "District_Name": "{data.District_Name}",
            "Nitrogen": {data.Nitrogen},
            "Phosphorus": {data.Phosphorus},
            "Potassium": {data.Potassium},
            "pH": {data.pH},
            "Rainfall": {data.Rainfall}
        }}

        Output JSON Schema:
        {{
            "soil_health_analysis": "Text summary of soil condition short summary for eg:Soil Health Analysis: Nitrogen: Moderate, Phosphorus: Moderate, Potassium: Moderate, Soil pH: 8.0, Rainfall: Moderate",
            "soil_health_score": "Numeric score out of 100",
            "soil_health_grade": "Excellent/Good/Average/Poor",
            "recommended_crop": "Best crop name",
            "recommended_fertilizer": "Best fertilizer name",
            "top_crops": [{{"crop": "name", "probability": 0-100}}],
            "top_fertilizers": [{{"fertilizer": "name", "probability": 0-100}}]
        }}
        """

        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=fallback_prompt,
                config=GenerateContentConfig(response_mime_type="application/json")
            )

            raw_text = getattr(response, "text", getattr(response, "output_text", "")).strip()
            fallback_result = json.loads(raw_text)

            # ✅ Return same structured output
            return {
                "soil_health_analysis": fallback_result.get("soil_health_analysis", "Analysis unavailable."),
                "soil_health_score": fallback_result.get("soil_health_score", "0"),
                "soil_health_grade": fallback_result.get("soil_health_grade", "Unknown"),
                "recommended_crop": fallback_result.get("recommended_crop", "N/A"),
                "recommended_fertilizer": fallback_result.get("recommended_fertilizer", "N/A"),
                "top_crops": fallback_result.get("top_crops", []),
                "top_fertilizers": fallback_result.get("top_fertilizers", [])
            }

        except Exception as llm_err:
            print("❌ Gemini fallback also failed:", llm_err)
            return {
                "error": "Both ML model and Gemini fallback failed.",
                "details": str(llm_err)
            }


# ✅ Register PDF Insight Route
app.include_router(pdf_insight.router, prefix="/api", tags=["Soil PDF Insights"])

# ✅ Root Route
@app.get("/")
def home():
    return {"message": "🌱 AgroX FastAPI Backend Running Successfully"}

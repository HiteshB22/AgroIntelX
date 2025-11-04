from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib
from utils.soil_health import calculate_soil_health
from routers import pdf_insight
from fastapi.middleware.cors import CORSMiddleware

# ✅ Initialize FastAPI app FIRST
app = FastAPI(title="Crop & Fertilizer Prediction API")

# ✅ Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Load trained ML models and encoders
rf_crop = joblib.load("model/crop_model.pkl")
rf_fertilizer = joblib.load("model/fert_model.pkl")
encoders = joblib.load("model/encoders.pkl")

le_district = encoders['district']
le_crop = encoders['crop']
le_fertilizer = encoders['fertilizer']

# ✅ Define input structure
class SoilData(BaseModel):
    District_Name: str
    Nitrogen: float
    Phosphorus: float
    Potassium: float
    pH: float
    Rainfall: float

# ✅ Prediction Route
@app.post("/predict")
def predict_crop(data: SoilData):
    # Convert input to DataFrame
    df = pd.DataFrame([{
        "District_Name": le_district.transform([data.District_Name])[0],
        "Nitrogen": data.Nitrogen,
        "Phosphorus": data.Phosphorus,
        "Potassium": data.Potassium,
        "pH": data.pH,
        "Rainfall": data.Rainfall
    }])

    # Model predictions
    pred_crop = le_crop.inverse_transform(rf_crop.predict(df))[0]
    pred_fert = le_fertilizer.inverse_transform(rf_fertilizer.predict(df))[0]

    # Soil health logic
    score, status, details = calculate_soil_health(
        data.Nitrogen, data.Phosphorus, data.Potassium, data.pH, data.Rainfall
    )

    # Top 5 crops
    crop_probs = rf_crop.predict_proba(df)[0]
    top_crops_idx = crop_probs.argsort()[-5:][::-1]
    top_crops = [
        {"crop": le_crop.inverse_transform([idx])[0], "probability": round(crop_probs[idx] * 100, 2)}
        for idx in top_crops_idx
    ]

    # Top 5 fertilizers
    fert_probs = rf_fertilizer.predict_proba(df)[0]
    top_ferts_idx = fert_probs.argsort()[-5:][::-1]
    top_fertilizers = [
        {"fertilizer": le_fertilizer.inverse_transform([idx])[0], "probability": round(fert_probs[idx] * 100, 2)}
        for idx in top_ferts_idx
    ]

    return {
        "soil_health_analysis": details,
        "soil_health_score": f"{score:.2f}",
        "soil_health_grade": status,
        "recommended_crop": pred_crop,
        "recommended_fertilizer": pred_fert,
        "top_crops": top_crops,
        "top_fertilizers": top_fertilizers
    }

# ✅ Register new LLM PDF Insight route
app.include_router(pdf_insight.router, prefix="/api", tags=["Soil PDF Insights"])

# ✅ Root test route
@app.get("/")
def home():
    return {"message": "🌱 AgroX FastAPI Backend Running Successfully"}

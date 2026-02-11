import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import SoilReport from "../models/SoilReport.js";
import { uploadPdfToCloudinary } from "../services/cloudinaryService.js";

const FASTAPI_BASE_URL = process.env.FASTAPI_URL || "http://localhost:8000";

export const analyzeSoil = async (req, res) => {
  try {
    const userId = req.user._id;
    const { source, nutrients } = req.body;

    let pdfUrl = null;
    let parsedNutrients = null;
    let aiResult = null;
    let extractedData = null;

    // ---------------- VALIDATION ----------------
    if (!source || !["pdf", "manual"].includes(source)) {
      return res.status(400).json({ message: "Invalid or missing source (pdf/manual)" });
    }

    if (source === "pdf" && !req.file) {
      return res.status(400).json({ message: "PDF file is required" });
    }

    if (source === "manual") {
      if (!nutrients) {
        return res.status(400).json({ message: "Nutrients data required" });
      }
      parsedNutrients = JSON.parse(nutrients);
    }

    // ============================================================
    // 🟢 CASE 1: PDF INPUT → FASTAPI
    // ============================================================
    if (source === "pdf" && req.file) {
      const form = new FormData();
      form.append("file", fs.createReadStream(req.file.path));

      const fastapiResponse = await axios.post(
        `${FASTAPI_BASE_URL}/api/analyze-soil-report`,
        form,
        { headers: form.getHeaders(), timeout: 120000 }
      );

      aiResult = fastapiResponse.data.ai_analysis_data;
      extractedData = fastapiResponse.data.extracted_data;

      const uploadResult = await uploadPdfToCloudinary(req.file.path);
      pdfUrl = uploadResult.secure_url;
    }

    // ============================================================
    // 🟡 CASE 2: MANUAL INPUT → FASTAPI /predict
    // ============================================================
    if (source === "manual") {
      const fastapiResponse = await axios.post(
        `${FASTAPI_BASE_URL}/predict`,
        parsedNutrients,
        { headers: { "Content-Type": "application/json" }, timeout: 60000 }
      );

      aiResult = fastapiResponse.data;

      // manual input itself becomes extracted data
      extractedData = parsedNutrients;
    }

    // ---------------- MAP TO extracted_input_data ----------------
    const extractedInputData = extractedData
      ? {
          district: extractedData.District_Name || extractedData.district || null,
          state: extractedData.State || extractedData.state || null,
          ph: extractedData.pH || extractedData.ph || null,
          nitrogen: extractedData.Nitrogen || extractedData.nitrogen || null,
          phosphorus: extractedData.Phosphorus || extractedData.phosphorus || null,
          potassium: extractedData.Potassium || extractedData.potassium || null,
          organicCarbon: extractedData.Organic_Carbon || extractedData.organicCarbon || null,
          sulphur: extractedData.Sulphur || extractedData.sulphur || null,
          zinc: extractedData.Zinc || extractedData.zinc || null,
          iron: extractedData.Iron || extractedData.iron || null,
          Rainfall: extractedData.Rainfall || extractedData.rainfall || null,
        }
      : null;

    // ---------------- SAVE TO DB ----------------
    const soilReport = await SoilReport.create({
      userId,
      source,
      pdfUrl,
      extracted_input_data: extractedInputData,

      analysis: aiResult
        ? {
            soil_health_analysis: aiResult.soil_health_analysis,
            soil_health_score: aiResult.soil_health_score,
            soil_health_grade: aiResult.soil_health_grade,
            recommended_crop: aiResult.recommended_crop,
            recommended_fertilizers: aiResult.recommended_fertilizer,
            top_crops: aiResult.top_crops || [],
            top_fertilizers: aiResult.top_fertilizers || [],
          }
        : null,
    });

    res.status(201).json({
      message: "Soil analysis completed",
      data: soilReport,
    });
  } catch (err) {
    console.error("Soil analysis error:", err.response?.data || err.message);
    res.status(500).json({ message: "Soil analysis failed" });
  }
};


export const getMySoilReports = async (req, res) => {
  try {
    const reports = await SoilReport.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};

import mongoose from "mongoose";

const soilReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    source: {
      type: String,
      enum: ["pdf", "manual"],
      required: true,
    },

    pdfUrl: String,

    extracted_input_data: {
      district: String,
      state: String,
      ph: Number,
      nitrogen: Number,
      phosphorus: Number,
      potassium: Number,
      organicCarbon: Number,
      sulphur: Number,
      zinc: Number,
      iron: Number,
      Rainfall: Number,
    },

    analysis: {
      soil_health_analysis: String,
      soil_health_score: String,
      soil_health_grade: String,
      recommended_crop: String,
      recommended_fertilizers: String,
      top_crops: Array,
      top_fertilizers: Array,
    },
  },
  { timestamps: true }
);

export default mongoose.model("SoilReport", soilReportSchema);

import mongoose from "mongoose";

const chatSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      default: "Soil Assistant Chat",
    },

    linkedReport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SoilReport", // optional: link chat to a soil report
    },
  },
  { timestamps: true }
);

export default mongoose.model("ChatSession", chatSessionSchema);

import express from "express";
import { analyzeSoil, getMySoilReports } from "../controllers/soilController.js";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/analyze",
  protect,
  upload.single("pdf"),
  analyzeSoil
);

router.get("/my-reports", protect, getMySoilReports);

export default router;

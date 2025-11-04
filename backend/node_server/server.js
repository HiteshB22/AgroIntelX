import express from "express";
import cors from "cors";
import predictionRoutes from "./routes/predictionRoute.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/predict", predictionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Node.js Server running on port ${PORT}`));

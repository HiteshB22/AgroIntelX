import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
connectDB();

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
// import predictionRoutes from "./routes/predictionRoute.js";
import soilRoutes from "./routes/soilRoute.js";
import chatRoutes from "./routes/chatRoute.js";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000","http://localhost:5173"],
    credentials: true,
}));

app.use("/api/auth", authRoutes);
// app.use("/api/predict", predictionRoutes);
app.use("/api/soil", soilRoutes);
app.use("/api/chat", chatRoutes);
app.get("/", (req, res) => {
  res.send("AgroIntelX API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Node.js Server running on port ${PORT}`));

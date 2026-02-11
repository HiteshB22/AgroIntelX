// import { analyzeSoilWithFastAPI } from "../services/fastapiService.js";

// export const getPrediction = async (req, res) => {
//   try {
    
//     // Log incoming request data for debugging
//     console.log(req.body); 

//     const prediction = await analyzeSoilWithFastAPI(req.body);
//     res.status(200).json(prediction);
//   } catch (error) {
//     console.error("Prediction error:", error.message);
//     res.status(500).json({ error: "Failed to get prediction" });
//   }
// };

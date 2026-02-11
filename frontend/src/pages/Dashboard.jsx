import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";
import { ArrowLeft, Download, Leaf, Sprout } from "lucide-react";
import jsPDF from "jspdf";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};

  const inputData = data?.input_data || {};
  console.log("Dashboard inputData:", inputData);
  const aiData = data?.ai_analysis || {};
  console.log("Dashboard aiData:", aiData);
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-700 bg-gray-50">
        <p className="text-lg mb-3">⚠ No data found. Please analyze soil first.</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-green-700 text-white px-5 py-2 rounded-md"
        >
          Go Back
        </button>
      </div>
    );
  }

  const normalizedInput = {
    District_Name: inputData.District_Name || inputData.district || "N/A",
    Nitrogen: Number(inputData.Nitrogen || inputData.nitrogen || 0),
    Phosphorus: Number(inputData.Phosphorus || inputData.phosphorus || 0),
    Potassium: Number(inputData.Potassium || inputData.potassium || 0),
    pH: Number(inputData.pH || inputData.ph || 0),
    Rainfall: Number(inputData.Rainfall || inputData.rainfall || 0),
    Iron: Number(inputData.Iron || inputData.iron || 0),
    Zinc: Number(inputData.Zinc || inputData.zinc || 0),
    Sulphur: Number(inputData.Sulphur || inputData.sulphur || 0),
    Organic_Carbon: Number(inputData.Organic_Carbon || inputData.organicCarbon || 0),
  };

  const healthScore = Number(aiData.soil_health_score) || 0;
  const topCrops = aiData.top_crops || [];
  const topFertilizers = aiData.top_fertilizers || [];

  const radarData = [
    { metric: "Nitrogen", user: normalizedInput.Nitrogen, ai: 50 },
    { metric: "Phosphorus", user: normalizedInput.Phosphorus, ai: 40 },
    { metric: "Potassium", user: normalizedInput.Potassium, ai: 50 },
    { metric: "pH", user: normalizedInput.pH, ai: 6.8 },
  ];

  const handleDownloadPDF = () => {
    const pdf = new jsPDF();
    pdf.text("AgroIntelX Soil Report", 20, 20);
    pdf.text(`District: ${normalizedInput.District_Name}`, 20, 30);
    pdf.text(`Health Score: ${healthScore}%`, 20, 40);
    pdf.text(`Crop: ${aiData.recommended_crop || "N/A"}`, 20, 50);
    pdf.text(`Fertilizer: ${aiData.recommended_fertilizers || "N/A"}`, 20, 60);
    pdf.save("Soil_Report.pdf");
  };

  return (
    <div className="min-h-screen p-10 bg-linear-to-br from-[#f3fff7] via-white to-[#eafff2]">

      {/* ================= HEADER ================= */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-14"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-green-100">
            <Leaf className="text-green-700" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-800">
            AgroIntelX <span className="text-green-600">Analytics</span>
          </h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 transition"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-5 py-2 rounded-lg bg-green-700 text-white hover:bg-green-800 transition shadow-md"
          >
            <Download size={18} /> Export
          </button>
        </div>
      </motion.div>

      {/* ================= KPI STRIP ================= */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-14"
      >
        {[
          { label: "District", value: normalizedInput.District_Name },
          { label: "Nitrogen", value: normalizedInput.Nitrogen },
          { label: "Phosphorus", value: normalizedInput.Phosphorus },
          { label: "Potassium", value: normalizedInput.Potassium },
          { label: "pH", value: normalizedInput.pH },
          { label: "Rainfall", value: normalizedInput.Rainfall },
        ].map((item, i) => (
          <div
            key={i}
            className="relative bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl p-4 text-center shadow-sm hover:shadow-lg transition-all"
          >
            <p className="text-xs uppercase tracking-wide text-gray-500">
              {item.label}
            </p>
            <p className="text-2xl font-bold text-green-700 mt-1">
              {item.value}
            </p>
          </div>
        ))}
      </motion.div>

      {/* ================= AI INSIGHT ZONE ================= */}
      <div className="grid lg:grid-cols-3 gap-10 mb-16">

        {/* Health Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-linear-to-br from-green-50 to-white border border-green-200 rounded-3xl p-10 shadow-lg flex flex-col items-center"
        >
          <p className="text-sm text-gray-500">Soil Health</p>
          <p className="text-6xl font-extrabold text-green-700">
            {healthScore}%
          </p>
          <p className="text-sm mt-2 text-gray-600">
            {aiData.soil_health_grade || "N/A"}
          </p>
        </motion.div>

        {/* AI Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white/70 backdrop-blur-xl border border-gray-200 rounded-3xl p-10 shadow-lg lg:col-span-2"
        >
          <h2 className="text-lg font-semibold text-green-700 flex items-center gap-2 mb-4">
            <Sprout size={20} /> AI Analysis
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            {aiData.soil_health_analysis || "No analysis available"}
          </p>
        </motion.div>
      </div>

      {/* ================= CHART ZONE ================= */}
      <div className="grid lg:grid-cols-2 gap-10 mb-16">

        {/* Radar */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-gray-200"
        >
          <h3 className="font-semibold text-green-700 mb-6 text-center text-lg">
            Soil Profile Comparison
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis />
              <Radar
                name="Your Soil"
                dataKey="user"
                stroke="#16a34a"
                fill="#16a34a"
                fillOpacity={0.5}
              />
              <Radar
                name="AI Optimal"
                dataKey="ai"
                stroke="#0284c7"
                fill="#0284c7"
                fillOpacity={0.4}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Crop */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-gray-200"
        >
          <h3 className="font-semibold text-green-700 mb-6 text-center text-lg">
            Crop Probability
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={topCrops}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="crop" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="probability" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ================= FERTILIZER ================= */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-xl border border-gray-200 mb-16"
      >
        <h3 className="font-semibold text-green-700 mb-6 text-center text-lg">
          Fertilizer Recommendation Probability
        </h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={topFertilizers}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fertilizer" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="probability" fill="#0284c7" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* ================= RECOMMENDATIONS ================= */}
      <div className="grid md:grid-cols-2 gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-linear-to-br from-green-50 to-white rounded-3xl p-8 shadow-lg border border-green-200"
        >
          <h3 className="text-lg font-semibold text-green-700 mb-2">
            🌾 Recommended Crop
          </h3>
          <p className="text-4xl font-extrabold text-green-800">
            {aiData.recommended_crop || "N/A"}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-linear-to-br from-blue-50 to-white rounded-3xl p-8 shadow-lg border border-blue-200"
        >
          <h3 className="text-lg font-semibold text-blue-700 mb-2">
            🧪 Recommended Fertilizer
          </h3>
          <p className="text-4xl font-extrabold text-blue-800">
            {aiData.recommended_fertilizers || "N/A"}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

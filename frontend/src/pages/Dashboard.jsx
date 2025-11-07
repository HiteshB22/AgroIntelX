import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { ArrowLeft, Download, Leaf, Sprout, TrendingUp } from "lucide-react";
import jsPDF from "jspdf";
import domtoimage from "dom-to-image-more";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};

  // ✅ Unpack nested data
  const inputData = data?.input_data || {};
  const aiData = data?.ai_analysis || {};

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-700 bg-gray-50">
        <p className="text-lg mb-3">
          ⚠ No data found. Please analyze soil first.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-green-700 text-white px-5 py-2 rounded-md hover:bg-green-800 transition"
        >
          <ArrowLeft size={18} /> Go Back
        </button>
      </div>
    );
  }

  const handleDownloadPDF = async () => {
    const input = document.getElementById("report-section");
    try {
      const blob = await domtoimage.toBlob(input);
      const img = new Image();
      img.src = URL.createObjectURL(blob);
      img.onload = () => {
        const pdf = new jsPDF("p", "mm", "a4");
        const width = pdf.internal.pageSize.getWidth();
        const height = (img.height * width) / img.width;
        pdf.addImage(img, "PNG", 0, 0, width, height);
        pdf.save("Soil_Report.pdf");
      };
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
  };

  // Reference values for radar chart
  const optimizedValues = {
    Nitrogen: 50,
    Phosphorus: 40,
    Potassium: 50,
    pH: 6.8,
  };

  const radarData = [
    { metric: "Nitrogen", user: inputData.Nitrogen, ai: optimizedValues.Nitrogen },
    { metric: "Phosphorus", user: inputData.Phosphorus, ai: optimizedValues.Phosphorus },
    { metric: "Potassium", user: inputData.Potassium, ai: optimizedValues.Potassium },
    { metric: "pH", user: inputData.pH, ai: optimizedValues.pH },
  ];

  return (
    <div
      className="p-8 bg-gradient-to-br from-green-50 to-emerald-100 min-h-screen"
      id="report-section"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-800 flex items-center gap-2">
          <Leaf className="text-green-700" /> Soil Health & Fertilizer Dashboard
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 transition shadow-sm"
          >
            <ArrowLeft size={18} /> Re-analyze
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition shadow-sm"
          >
            <Download size={18} /> Download PDF
          </button>
        </div>
      </div>

      {/* Input Summary */}
      <div className="bg-white rounded-2xl p-6 mb-8 shadow-md border border-green-100">
        <h2 className="font-semibold text-green-800 text-lg mb-4 flex items-center gap-2">
          <TrendingUp size={20} /> Input Summary
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "District", value: inputData.District_Name },
            { label: "Nitrogen (N)", value: inputData.Nitrogen },
            { label: "Phosphorus (P)", value: inputData.Phosphorus },
            { label: "Potassium (K)", value: inputData.Potassium },
            { label: "pH Level", value: inputData.pH },
            { label: "Rainfall (mm)", value: inputData.Rainfall },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-green-50 to-white rounded-lg p-4 text-center shadow-sm"
            >
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-lg font-semibold text-green-800">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Overview */}
      <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl border border-green-100 p-8 mb-8 shadow-md">
        <h2 className="font-semibold text-green-800 text-xl mb-8 flex items-center gap-2">
          <Sprout size={22} className="text-green-700" /> AI Analysis Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center">
          <div className="md:col-span-2 grid sm:grid-cols-2 gap-6">
            <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <p className="text-sm text-gray-500 mb-1">Soil Health Grade</p>
              <p className="text-3xl font-extrabold text-green-700">
                {aiData.soil_health_grade}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Based on nutrient balance and pH stability
              </p>
            </div>

            <div className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <p className="text-sm text-gray-500 mb-1">Condition Summary</p>
              <p className="text-green-700 font-medium leading-relaxed">
                {aiData.soil_health_analysis}
              </p>
            </div>
          </div>

          {/* Circular Progress Bar */}
          <div className="flex justify-center">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full">
                <circle
                  className="text-green-200"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  r="70"
                  cx="80"
                  cy="80"
                />
                <circle
                  className="text-green-600"
                  strokeWidth="10"
                  strokeDasharray="430"
                  strokeDashoffset={430 - (430 * aiData.soil_health_score) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="70"
                  cx="80"
                  cy="80"
                  style={{ transition: "stroke-dashoffset 1.5s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-3xl font-bold text-green-700">
                  {aiData.soil_health_score}%
                </p>
                <span className="text-sm text-gray-600">Health Score</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="bg-white border rounded-2xl p-6 mb-8 shadow-md">
        <h3 className="font-semibold text-green-800 mb-4 text-center">
          🧭 User Input vs AI Optimized Reference
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis />
            <Radar
              name="User Input"
              dataKey="user"
              stroke="#2e7d32"
              fill="#81c784"
              fillOpacity={0.6}
            />
            <Radar
              name="AI Optimal"
              dataKey="ai"
              stroke="#ef6c00"
              fill="#ffb74d"
              fillOpacity={0.4}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Recommendations */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
            <Sprout size={20} /> Recommended Crop
          </h3>
          <p className="text-2xl font-bold text-green-700">
            {aiData.recommended_crop}
          </p>
          <h4 className="font-semibold mt-4 text-gray-700">
            Top Crop Suggestions:
          </h4>
          <ul className="mt-2 text-gray-700 text-sm">
            {aiData.top_crops?.map((crop, idx) => (
              <li key={idx}>
                • {crop.crop} — {crop.probability}%
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
            <TrendingUp size={20} /> Recommended Fertilizer
          </h3>
          <p className="text-2xl font-bold text-green-700">
            {aiData.recommended_fertilizer}
          </p>
          <h4 className="font-semibold mt-4 text-gray-700">
            Top Fertilizer Options:
          </h4>
          <ul className="mt-2 text-gray-700 text-sm">
            {aiData.top_fertilizers?.map((fert, idx) => (
              <li key={idx}>
                • {fert.fertilizer} — {fert.probability}%
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Crop Probability Bar Chart */}
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <h3 className="font-semibold text-green-800 mb-4 text-center">
          📊 Crop Probability Visualization
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={aiData.top_crops}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="crop" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="probability" fill="#2e7d32" name="Probability (%)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState } from "react";
import AnalysisResult from "./AnalysisResult";
import axios from "axios";
import toast from "react-hot-toast";

const ManualInputForm = () => {
  const [formData, setFormData] = useState({
    District_Name: "",
    Nitrogen: "",
    Phosphorus: "",
    Potassium: "",
    pH: "",
    Rainfall: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic frontend validation
    if (!formData.District_Name) {
      toast.error("District name is required");
      return;
    }

    try {
      setLoading(true);
      const toastId = toast.loading("Analyzing soil data...");

      const res = await axios.post("http://localhost:5000/api/soil/analyze", {
        source: "manual",
        nutrients: JSON.stringify({
          District_Name: formData.District_Name,
          Nitrogen: parseFloat(formData.Nitrogen),
          Phosphorus: parseFloat(formData.Phosphorus),
          Potassium: parseFloat(formData.Potassium),
          pH: parseFloat(formData.pH),
          Rainfall: parseFloat(formData.Rainfall),
        }),
      });

      toast.dismiss(toastId);

      if (res.data?.data) {
        toast.success("✅ Analysis Completed!");
        setResultData(res.data.data);
        setSubmitted(true);
      } else {
        toast.error("No response data from server.");
      }
    } catch (err) {
      toast.dismiss();
      console.error("Manual analysis error:", err);
      toast.error(
        err.response?.data?.message || "Failed to analyze soil data."
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted)
    return <AnalysisResult data={resultData} inputValues={formData} />;

  return (
    <form
      onSubmit={handleSubmit}
      className="border rounded-2xl p-8 bg-white shadow-md max-w-2xl mx-auto"
    >
      <h2 className="text-xl font-semibold mb-1 text-gray-700">
        🌾 Soil Input Analysis
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Enter your soil nutrient values to get AI-powered crop & fertilizer
        recommendations.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* District */}
        <div className="sm:col-span-2">
          <label className="block font-medium mb-1">District Name *</label>
          <input
            name="District_Name"
            value={formData.District_Name}
            onChange={handleChange}
            className="border rounded-md w-full p-2 focus:ring-2 focus:ring-green-600 outline-none"
            placeholder="e.g. Nashik"
            required
          />
        </div>

        {/* Nitrogen */}
        <div>
          <label className="block font-medium mb-1">Nitrogen (ppm) *</label>
          <input
            name="Nitrogen"
            value={formData.Nitrogen}
            onChange={handleChange}
            type="number"
            step="any"
            className="border rounded-md w-full p-2 focus:ring-2 focus:ring-green-600 outline-none"
            placeholder="e.g. 45"
            required
          />
        </div>

        {/* Phosphorus */}
        <div>
          <label className="block font-medium mb-1">Phosphorus (ppm) *</label>
          <input
            name="Phosphorus"
            value={formData.Phosphorus}
            onChange={handleChange}
            type="number"
            step="any"
            className="border rounded-md w-full p-2 focus:ring-2 focus:ring-green-600 outline-none"
            placeholder="e.g. 35"
            required
          />
        </div>

        {/* Potassium */}
        <div>
          <label className="block font-medium mb-1">Potassium (ppm) *</label>
          <input
            name="Potassium"
            value={formData.Potassium}
            onChange={handleChange}
            type="number"
            step="any"
            className="border rounded-md w-full p-2 focus:ring-2 focus:ring-green-600 outline-none"
            placeholder="e.g. 150"
            required
          />
        </div>

        {/* pH */}
        <div>
          <label className="block font-medium mb-1">pH Value *</label>
          <input
            name="pH"
            value={formData.pH}
            onChange={handleChange}
            type="number"
            step="any"
            className="border rounded-md w-full p-2 focus:ring-2 focus:ring-green-600 outline-none"
            placeholder="e.g. 6.8"
            required
          />
        </div>

        {/* Rainfall */}
        <div className="sm:col-span-2">
          <label className="block font-medium mb-1">Rainfall (mm) *</label>
          <input
            name="Rainfall"
            value={formData.Rainfall}
            onChange={handleChange}
            type="number"
            step="any"
            className="border rounded-md w-full p-2 focus:ring-2 focus:ring-green-600 outline-none"
            placeholder="e.g. 120"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`mt-8 w-full px-6 py-2 rounded-md font-semibold text-white transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-700 hover:bg-green-800"
        }`}
      >
        {loading ? "Analyzing..." : "Analyze Soil"}
      </button>
    </form>
  );
};

export default ManualInputForm;

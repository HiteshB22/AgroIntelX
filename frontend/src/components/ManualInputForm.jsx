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

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      toast.loading("Analyzing soil data...");

      // Send data to Node.js API (which forwards to FastAPI)
      const res = await axios.post("http://localhost:5000/api/predict", {
        District_Name: formData.District_Name,
        Nitrogen: parseFloat(formData.Nitrogen),
        Phosphorus: parseFloat(formData.Phosphorus),
        Potassium: parseFloat(formData.Potassium),
        pH: parseFloat(formData.pH),
        Rainfall: parseFloat(formData.Rainfall),
      });

      toast.dismiss();

      if (res.data) {
        toast.success("✅ Analysis Completed!");
        setResultData(res.data);
        setSubmitted(true);
      } else {
        toast.error("No response data from server.");
      }
    } catch (err) {
      toast.dismiss();
      console.error(err);
      toast.error("Failed to analyze soil data.");
    }
  };

  if (submitted) return <AnalysisResult data={resultData} inputValues={formData}/>;

  return (
    <form
      onSubmit={handleSubmit}
      className="border rounded-lg p-8 bg-white shadow-md max-w-2xl mx-auto"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        🌾 Soil Input Analysis Form
      </h2>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block font-medium mb-1">District Name *</label>
          <input
            name="District_Name"
            value={formData.District_Name}
            onChange={handleChange}
            className="border rounded-md w-full p-2"
            placeholder="e.g. Nashik"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Nitrogen (ppm) *</label>
          <input
            name="Nitrogen"
            value={formData.Nitrogen}
            onChange={handleChange}
            type="number"
            step="any"
            className="border rounded-md w-full p-2"
            placeholder="e.g. 45"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Phosphorus (ppm) *</label>
          <input
            name="Phosphorus"
            value={formData.Phosphorus}
            onChange={handleChange}
            type="number"
            step="any"
            className="border rounded-md w-full p-2"
            placeholder="e.g. 35"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Potassium (ppm) *</label>
          <input
            name="Potassium"
            value={formData.Potassium}
            onChange={handleChange}
            type="number"
            step="any"
            className="border rounded-md w-full p-2"
            placeholder="e.g. 150"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">pH Value *</label>
          <input
            name="pH"
            value={formData.pH}
            onChange={handleChange}
            type="number"
            step="any"
            className="border rounded-md w-full p-2"
            placeholder="e.g. 6.8"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Rainfall (mm) *</label>
          <input
            name="Rainfall"
            value={formData.Rainfall}
            onChange={handleChange}
            type="number"
            step="any"
            className="border rounded-md w-full p-2"
            placeholder="e.g. 120"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 bg-green-700 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-800 w-full"
      >
        Analyze
      </button>
    </form>
  );
};

export default ManualInputForm;

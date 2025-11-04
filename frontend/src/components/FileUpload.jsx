import React, { useState } from "react";
import axios from "axios";
import AnalysisResult from "./AnalysisResult";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState(null);
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/analyze-soil-report", 
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        console.log("Server response:", response.data);
        console.log("Server response:", response.data.ai_analysis);
        console.log("Server response:", response.data.extracted_data);

        setAnalysisData(response.data);
        setSubmitted(true);
      } else {
        setError("File upload failed. Please try again.");
      }
    } catch (error) {
      console.error("❌ Error uploading file:", error);
      setError("Error uploading file.");
    } finally {
      setUploading(false);
    }
  };
  {error && <p className="text-red-600 mt-2">{error}</p>}
  if (submitted) return <AnalysisResult data={analysisData} />;

  return (
    <div className="border rounded-lg p-8 bg-white shadow-sm text-center">
      <div className="border-2 border-dashed border-gray-300 rounded-lg py-12">
        <p className="text-gray-700 mb-3">Drag and drop your file</p>
        <p className="text-sm text-gray-500 mb-4">or click to browse</p>

        <label className="cursor-pointer bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md">
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png,.csv"
          />
          Select File
        </label>

        {file && (
          <p className="mt-3 text-green-700 text-sm">Uploaded: {file.name}</p>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className={`mt-6 px-6 py-2 rounded-md font-semibold text-white ${
          uploading ? "bg-gray-500" : "bg-green-700 hover:bg-green-800"
        }`}
      >
        {uploading ? "Analyzing..." : "Upload & Analyze"}
      </button>

      <p className="text-sm text-gray-500 mt-4">
        Supported formats: PDF, JPG, PNG, CSV
      </p>

      
    </div>
  );
};

export default FileUpload;

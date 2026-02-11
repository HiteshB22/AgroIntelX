import React, { useState } from "react";
import api from "../services/api";
import AnalysisResult from "./AnalysisResult";
import { UploadCloud, FileText, Loader2 } from "lucide-react";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF file.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("source", "pdf");

    try {
      const response = await api.post("/soil/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAnalysisData(response.data.data);
      setSubmitted(true);
    } catch (err) {
      setError("File upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (submitted) return <AnalysisResult data={analysisData} />;

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Upload Soil Report
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Supported format: PDF only
        </p>
      </div>

      {/* Upload Box */}
      <div className="border-2 border-dashed border-green-300 rounded-xl p-8 text-center hover:border-green-500 transition">
        <UploadCloud className="mx-auto text-green-600 mb-3" size={40} />

        <p className="text-gray-700 font-medium">
          Click to upload your soil report
        </p>

        <p className="text-xs text-gray-500 mt-1">
          Max size depends on your server config
        </p>

        <label className="inline-block mt-4 cursor-pointer">
          <span className="bg-green-700 hover:bg-green-800 transition text-white px-5 py-2 rounded-md text-sm font-medium">
            Choose PDF
          </span>
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf"
          />
        </label>

        {/* File Preview */}
        {file && (
          <div className="mt-4 inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-full text-sm">
            <FileText size={16} />
            <span className="truncate max-w-[200px]">{file.name}</span>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
          {error}
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className={`mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white transition
          ${
            uploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-700 hover:bg-green-800"
          }
        `}
      >
        {uploading ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Analyzing Soil Report...
          </>
        ) : (
          "Upload & Analyze"
        )}
      </button>
    </div>
  );
};

export default FileUpload;

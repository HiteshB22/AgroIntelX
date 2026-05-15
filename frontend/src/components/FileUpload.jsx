import React, { useState } from "react";
import api from "../services/api";
import AnalysisResult from "./AnalysisResult";
import { UploadCloud, FileText, Loader2, FileUp } from "lucide-react";
import { motion } from "framer-motion";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
    }
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
    <div className="w-full">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Upload Soil Report
        </h3>
        <p className="text-gray-500 font-medium">
          Drag and drop your PDF report here or click to browse.
        </p>
      </div>

      <div 
        className={`relative border-3 border-dashed rounded-3xl p-10 mt-6 text-center transition-all duration-300 ease-in-out flex flex-col items-center justify-center min-h-[250px]
          ${isDragActive 
            ? "border-brand-500 bg-brand-50 scale-[1.02] shadow-inner" 
            : file ? "border-brand-300 bg-brand-50/50" : "border-gray-300 hover:border-brand-400 hover:bg-gray-50/50"
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf"
        />

        {!file ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center pointer-events-none"
          >
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors duration-300
              ${isDragActive ? 'bg-brand-200 text-brand-700' : 'bg-gray-100 text-gray-400'}
            `}>
              <FileUp size={40} className={`transition-transform duration-300 ${isDragActive ? '-translate-y-2' : ''}`} />
            </div>
            <p className="text-lg font-bold text-gray-700 mb-2">
              Drag & Drop your PDF
            </p>
            <p className="text-sm text-gray-500 mb-6 font-medium">
              or
            </p>
            <label 
              htmlFor="file-upload" 
              className="pointer-events-auto primary-btn px-8 py-3 rounded-xl shadow-lg shadow-brand-500/30 cursor-pointer inline-block"
            >
              Browse Files
            </label>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center"
          >
            <div className="w-20 h-20 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mb-4">
              <FileText size={40} />
            </div>
            <p className="text-xl font-bold text-gray-900 mb-2 truncate max-w-[250px] sm:max-w-sm">
              {file.name}
            </p>
            <p className="text-sm text-gray-500 font-medium mb-6">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <div className="flex gap-4">
              <label 
                htmlFor="file-upload" 
                className="px-6 py-2.5 rounded-xl font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
              >
                Change File
              </label>
            </div>
          </motion.div>
        )}
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-700 text-sm font-medium"
        >
          <div className="mt-0.5">⚠️</div>
          <p>{error}</p>
        </motion.div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className={`mt-8 w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-extrabold text-white text-lg transition-all transform active:scale-[0.98]
          ${uploading || !file
            ? "bg-gray-300 cursor-not-allowed text-gray-500"
            : "bg-brand-600 hover:bg-brand-700 shadow-xl shadow-brand-500/30 hover:-translate-y-1"
          }
        `}
      >
        {uploading ? (
          <>
            <Loader2 className="animate-spin" size={24} />
            Analyzing with AI...
          </>
        ) : (
          <>
            <UploadCloud size={24} /> Analyze Report
          </>
        )}
      </button>
    </div>
  );
};

export default FileUpload;

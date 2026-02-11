import { useState } from "react";
import FileUpload from "../components/FileUpload";
import ManualInputForm from "../components/ManualInputForm";

const SoilAnalysis = () => {
  const [activeTab, setActiveTab] = useState("upload");

  return (
    <div className="px-10 py-12 min-h-screen bg-linear-to-b from-green-50 to-white">
      <h2 className="text-3xl font-bold mb-2">Soil Report Analysis</h2>
      <p className="text-gray-600 mb-8">
        Upload your soil report or manually enter soil nutrient values to get AI-powered insights.
      </p>

      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex-1">
          {/* Tabs */}
          <div className="border-b mb-4 flex space-x-6">
            <button
              className={`pb-2 ${activeTab === "upload" ? "border-b-2 border-green-700 font-semibold" : "text-gray-500"}`}
              onClick={() => setActiveTab("upload")}
            >
              File Upload
            </button>
            <button
              className={`pb-2 ${activeTab === "manual" ? "border-b-2 border-green-700 font-semibold" : "text-gray-500"}`}
              onClick={() => setActiveTab("manual")}
            >
              Manual Input
            </button>
          </div>

          {activeTab === "upload" ? <FileUpload /> : <ManualInputForm />}
        </div>

        {/* Side Info */}
        <div className="w-full md:w-80 space-y-6">
          <div className="bg-green-100 border border-green-200 p-6 rounded-lg">
            <h4 className="font-semibold mb-2">What We Analyze</h4>
            <ul className="list-disc ml-5 text-gray-700 space-y-1">
              <li>Soil pH levels</li>
              <li>Nutrient composition</li>
              <li>Organic matter content</li>
              <li>Moisture levels</li>
              <li>Microbial activity</li>
            </ul>
          </div>

          <div className="bg-orange-100 border border-orange-200 p-6 rounded-lg">
            <h4 className="font-semibold mb-2">You'll Receive</h4>
            <ul className="list-disc ml-5 text-gray-700 space-y-1">
              <li>Detailed analysis report</li>
              <li>Crop recommendations</li>
              <li>Improvement suggestions</li>
              <li>Expert consultation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoilAnalysis;

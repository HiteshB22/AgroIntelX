import { useState } from "react";
import FileUpload from "../components/FileUpload";
import ManualInputForm from "../components/ManualInputForm";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Activity, Database, CheckCircle2 } from "lucide-react";

const SoilAnalysis = () => {
  const [activeTab, setActiveTab] = useState("upload");

  return (
    <div className="min-h-[90vh] bg-gray-50 py-12 relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-200/40 rounded-full blur-[120px] -z-10 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>

      <div className="max-w-6xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-sm font-bold tracking-wider uppercase mb-4 shadow-sm border border-brand-200">
            <Activity size={16} /> Diagnostic Center
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Soil Report Analysis
          </h1>
          <p className="text-lg text-gray-600 font-medium leading-relaxed">
            Upload your soil report or manually enter values to get instant, AI-powered insights for optimal crop yield.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Main Action Area */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 glass rounded-3xl p-6 md:p-10 shadow-lg border border-gray-100"
          >
            {/* Custom Tabs */}
            <div className="flex p-1 bg-gray-100/80 rounded-2xl mb-8 relative z-0">
              <button
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 z-10 ${
                  activeTab === "upload" ? "text-brand-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("upload")}
              >
                File Upload
              </button>
              <button
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 z-10 ${
                  activeTab === "manual" ? "text-brand-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("manual")}
              >
                Manual Input
              </button>
              
              {/* Tab selection pill animation */}
              <div 
                className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm transition-all duration-300 ease-out -z-10"
                style={{ left: activeTab === "upload" ? "4px" : "calc(50%)" }}
              />
            </div>

            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === "upload" ? <FileUpload /> : <ManualInputForm />}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Side Info Cards */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-[320px] xl:w-[380px] space-y-6"
          >
            <div className="glass bg-white/60 p-8 rounded-3xl border border-brand-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Database size={64} className="text-brand-700" />
              </div>
              <div className="flex items-center gap-3 mb-5 relative z-10">
                <div className="p-2.5 bg-brand-100 text-brand-700 rounded-xl">
                  <Info size={20} />
                </div>
                <h4 className="text-lg font-bold text-gray-900">What We Analyze</h4>
              </div>
              <ul className="space-y-4 relative z-10">
                {["Soil pH & NPK levels", "Organic matter content", "Microbial activity", "Micro-nutrient balance"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-brand-500 mt-0.5 shrink-0" />
                    <span className="text-gray-600 font-medium text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass bg-white/60 p-8 rounded-3xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Activity size={64} className="text-blue-700" />
              </div>
              <div className="flex items-center gap-3 mb-5 relative z-10">
                <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
                  <Activity size={20} />
                </div>
                <h4 className="text-lg font-bold text-gray-900">You'll Receive</h4>
              </div>
              <ul className="space-y-4 relative z-10">
                {["Detailed health score", "Tailored crop matches", "Fertilizer optimization", "Actionable insights"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-blue-500 mt-0.5 shrink-0" />
                    <span className="text-gray-600 font-medium text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
};

export default SoilAnalysis;

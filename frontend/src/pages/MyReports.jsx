import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { FileText, Eye, Download, Calendar, MapPin, Activity, FileStack } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get("/soil/my-reports");
        setReports(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load your reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleViewReport = (report) => {
    navigate("/dashboard", {
      state: {
        data: {
          input_data: report.extracted_input_data,
          ai_analysis: report.analysis,
        },
      },
    });
  };

  // ---------------- Skeleton Loader Components ----------------
  const ReportCardSkeleton = () => (
    <div className="glass bg-white/60 rounded-3xl p-6 border border-gray-100 shadow-sm animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
        <div className="h-6 bg-gray-200 rounded-md w-1/3"></div>
      </div>
      <div className="space-y-3 mb-6">
        <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
      </div>
      <div className="h-16 bg-gray-200 rounded-xl mb-6"></div>
      <div className="flex gap-3">
        <div className="h-10 bg-gray-200 rounded-xl w-24"></div>
        <div className="h-10 bg-gray-200 rounded-xl w-24"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-[90vh] bg-gray-50 py-12 relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-200/40 rounded-full blur-[100px] -z-10 pointer-events-none translate-x-1/2 -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-sm font-bold tracking-wider uppercase mb-4 shadow-sm border border-brand-200">
              <FileStack size={16} /> Archive
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              My Soil Reports
            </h1>
          </div>
          <p className="text-gray-500 font-medium md:max-w-xs text-sm md:text-right">
            Access your complete history of AI-powered soil analysis and recommendations.
          </p>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {[...Array(8)].map((_, i) => <ReportCardSkeleton key={i} />)}
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-3xl flex flex-col items-center justify-center text-center shadow-sm max-w-2xl mx-auto mt-12"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-500 text-2xl font-bold">!</div>
              <h3 className="text-xl font-bold mb-2">Oops! Something went wrong</h3>
              <p className="font-medium text-red-600/80">{error}</p>
            </motion.div>
          ) : reports.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass bg-white p-12 rounded-3xl border border-gray-100 shadow-sm text-center max-w-3xl mx-auto mt-12"
            >
              <div className="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-500 shadow-inner">
                <FileStack size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No reports found</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                You haven't analyzed any soil reports yet. Upload your first report or enter data manually to get AI-powered insights.
              </p>
              <button 
                onClick={() => navigate('/analysis')}
                className="primary-btn px-8"
              >
                Start Analysis
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {reports.map((report, idx) => (
                <motion.div
                  key={report._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass bg-white/80 rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-brand-200 transition-all duration-300 group flex flex-col h-full"
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className={`p-3 rounded-2xl ${report.source === "pdf" ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"} transition-colors group-hover:scale-110 duration-300 shadow-sm`}>
                       <FileText size={22} />
                    </div>
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${report.source === "pdf" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>
                      {report.source === "pdf" ? "PDF Upload" : "Manual Input"}
                    </span>
                  </div>

                  <div className="space-y-2.5 mb-5 flex-1">
                    <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                      <Calendar size={14} className="text-brand-500" />
                      {new Date(report.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                      <MapPin size={14} className="text-brand-500" />
                      {report.extracted_input_data?.district || "Unknown District"}
                    </div>
                  </div>

                  <div className="bg-gray-50/80 rounded-2xl p-4 mb-6 relative overflow-hidden group-hover:bg-brand-50/50 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity size={14} className="text-green-600" />
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Analysis Sneak Peek</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed font-medium">
                      {report.analysis?.soil_health_analysis || "Data processed successfully. Click view for details."}
                    </p>
                  </div>

                  <div className="flex gap-3 mt-auto">
                    <button
                      onClick={() => handleViewReport(report)}
                      className="flex-1 flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-brand-500/20 hover:-translate-y-0.5"
                    >
                      <Eye size={16} /> View Insights
                    </button>

                    {report.pdfUrl && (
                      <a
                        href={report.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-bold text-sm hover:border-gray-300 hover:bg-gray-50 transition-all hover:-translate-y-0.5"
                        title="Download Original PDF"
                      >
                        <Download size={16} />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyReports;

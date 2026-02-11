import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { FileText, Eye, Download } from "lucide-react";

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading your reports...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-green-50 to-white">
      <h1 className="text-3xl font-bold text-green-800 mb-6">
        📁 My Soil Reports
      </h1>

      {reports.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center text-gray-600">
          No reports found. Analyze soil to generate your first report.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div
              key={report._id}
              className="bg-white border border-green-100 rounded-xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-2 mb-2 text-green-700">
                <FileText size={18} />
                <span className="font-semibold">
                  {report.source === "pdf" ? "PDF Report" : "Manual Entry"}
                </span>
              </div>

              <p className="text-sm text-gray-500 mb-1">
                <strong>Date:</strong>{" "}
                {new Date(report.createdAt).toLocaleDateString()}
              </p>

              <p className="text-sm text-gray-500 mb-3">
                <strong>District:</strong>{" "}
                {report.extracted_input_data?.district || "N/A"}
              </p>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {report.analysis?.soil_health_analysis || "No analysis summary"}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => handleViewReport(report)}
                  className="flex items-center gap-1 bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition text-sm"
                >
                  <Eye size={16} /> View
                </button>

                {report.pdfUrl && (
                  <a
                    href={report.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 transition text-sm"
                  >
                    <Download size={16} /> PDF
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReports;

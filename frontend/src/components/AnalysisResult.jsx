import { useNavigate } from "react-router-dom";

const AnalysisResult = ({ data, inputValues }) => {
  const navigate = useNavigate();

  const inputData = inputValues || data?.extracted_input_data || {};
  const aiData = data?.analysis || {};

  const handleViewResults = () => {
    navigate("/dashboard", {
      state: {
        data: {
          input_data: inputData,
          ai_analysis: aiData,
        },
      },
    });
  };

  return (
    <div className="bg-green-50 border border-green-300 rounded-lg p-6 text-center mt-6">
      <p className="text-green-700 font-semibold text-lg mb-2">
        ✅ Analysis Complete!
      </p>
      <p className="text-gray-700 mb-4">
        Your soil report has been analyzed. Check your dashboard for insights.
      </p>
      {/* {---------------------only for testing ----------------------} */}
      {aiData && (
        <div className="bg-white border rounded-md p-4 mt-4 text-left">
          <h3 className="font-semibold mb-2 text-green-700">AI Insights: </h3>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">
            {JSON.stringify(aiData, null, 2)}
          </pre>
        </div>
      )}

      <div className="bg-white border rounded-md p-4 mt-4 text-left">
        <h3 className="font-semibold mb-2 text-green-700">
          Extracted/Input Data:
        </h3>
        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
          {JSON.stringify(inputData, null, 2)}
        </pre>
      </div>
      {/* {---------------------only for testing ----------------------} */}
      <button
        onClick={handleViewResults}
        className="mt-6 bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-md font-semibold"
      >
        View Results
      </button>
    </div>
  );
};

export default AnalysisResult;

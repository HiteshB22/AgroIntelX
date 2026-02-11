import { Sparkles, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const AIActions = ({ onGeneratePlan, onPredictYield }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#0f1620] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-md"
    >
      <h3 className="font-semibold text-green-700 dark:text-green-400 mb-4">
        ⚡ AI Actions
      </h3>

      <div className="grid sm:grid-cols-2 gap-4">
        <button
          onClick={onGeneratePlan}
          className="flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg font-medium transition"
        >
          <Sparkles size={18} /> Generate Fertilizer Plan
        </button>

        <button
          onClick={onPredictYield}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
        >
          <TrendingUp size={18} /> Predict Yield
        </button>
      </div>
    </motion.div>
  );
};

export default AIActions;

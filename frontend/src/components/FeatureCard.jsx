import { motion } from "framer-motion";

const FeatureCard = ({ title, description }) => {
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="group relative"
    >
      <div className="glass-card p-8 rounded-2xl border border-white/60 backdrop-blur-xl bg-white/60 shadow-lg hover:shadow-2xl transition-all duration-300">
        
        {/* Accent Line */}
        <div className="h-1 w-12 bg-green-600 mb-6 rounded-full"></div>

        <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-green-700 transition">
          {title}
        </h3>

        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default FeatureCard;

import { Leaf, Cloud, AlertTriangle, BarChart3, MessageSquare, Shield } from "lucide-react";

const icons = {
  Soil: Leaf,
  Crop: Cloud,
  Alerts: AlertTriangle,
  Expert: MessageSquare,
  Analytics: BarChart3,
  Security: Shield,
};

const FeatureCard = ({ title, description, icon }) => {
  return (
    <div className="bg-white border border-green-100 shadow-md hover:shadow-xl rounded-2xl p-8 transition-transform transform hover:-translate-y-2">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-green-700 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;

import { Link } from "react-router";
import FeatureCard from "../components/FeatureCard";

const Home = () => {
  return (
    <div className="p-10 space-y-16 bg-[#fffaf5] bg-linear-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row justify-between items-center gap-10 ">
        <div className="max-w-xl space-y-6 ">
          <h1 className="text-5xl font-bold">
            AI-Powered Agriculture <br /> Insights
          </h1>
          <p className="text-gray-600 text-2xl leading-relaxed">
            Transform your farming with real-time soil analysis, AI-driven crop
            recommendations, and expert insights powered by advanced machine
            learning.
          </p>
          <div className="space-x-4">
            <Link
              to="/soil-analysis"
              className="bg-green-700 text-white px-6 py-3 rounded-md hover:bg-green-800"
            >
              Get Started
            </Link>
            <button className="border border-green-700 text-green-700 px-6 py-3 rounded-md hover:bg-green-50">
              Learn More
            </button>
          </div>
        </div>

        {/* new images section  */}
        <div className="relative flex items-center justify-center h-[70vh] rounded-2xl overflow-hidden">
          {/* Background image */}
          <img
            src="https://images.unsplash.com/photo-1602867741746-6df80f40b3f6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFybWVyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600"
            alt="Smart Farming"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Gradient overlay for blending */}
          <div className="absolute inset-0  from-green-900/70 via-green-800/50 to-transparent"></div>

          {/* Text content */}
          <div className="relative z-10 text-center text-white px-6">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg">
              Smart Farming Dashboard
            </h1>
            <p className="text-lg md:text-2xl font-medium text-green-100 max-w-3xl mx-auto leading-relaxed">
              Harness the power of AI to analyze soil, predict crop yield, and
              make data-driven decisions — all in one smart, intuitive platform.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="text-center py-20 ">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl font-extrabold text-green-700 mb-4 tracking-tight">
            Powerful Features for Smarter Farming 🌾
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Everything you need to make intelligent, data-driven agricultural
            decisions.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 px-6 md:px-20">
          <FeatureCard
            title="Soil Analysis"
            type="Soil"
            icon="🌱"
            description="Get detailed insights into soil nutrients, pH, and moisture using AI-driven analytics."
          />
          <FeatureCard
            title="Crop Recommendations"
            type="Crop"
            icon="🌾"
            description="Receive personalized crop suggestions tailored to your soil type and local climate."
          />
          <FeatureCard
            title="Real-Time Alerts"
            type="Alerts"
            icon="⚡"
            description="Stay informed with instant notifications on weather, pest risks, and soil conditions."
          />
          <FeatureCard
            title="Expert Chat"
            type="Expert"
            icon="💬"
            description="Chat with AI agriculture experts for personalized advice and troubleshooting."
          />
          <FeatureCard
            title="Analytics Dashboard"
            type="Analytics"
            icon="📊"
            description="Track farm performance, compare crop cycles, and visualize yield improvements."
          />
          <FeatureCard
            title="Data Security"
            type="Security"
            icon="🔒"
            description="Your farm data is encrypted, securely stored, and only accessible to you."
          />
        </div>

        {/* Stats Section */}
        <div className="flex flex-wrap justify-center gap-12 mt-16 text-green-700 font-semibold">
          <div className="text-center">
            <h3 className="text-4xl font-extrabold">10,000+</h3>
            <p className="text-gray-600 text-sm mt-1">Active Farmers</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-extrabold">95%</h3>
            <p className="text-gray-600 text-sm mt-1">Prediction Accuracy</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-extrabold">50M+</h3>
            <p className="text-gray-600 text-sm mt-1">Acres Analyzed</p>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Home;

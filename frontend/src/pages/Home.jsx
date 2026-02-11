import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import FeatureCard from "../components/FeatureCard";

const Home = () => {
  return (
    <div className="bg-gradient-to-b from-green-50 via-white to-white text-gray-900">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#bbf7d0,_transparent_60%)]"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <span className="inline-block bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-semibold">
              🌱 AI for Smart Agriculture
            </span>

            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
              Transform Farming with <br />
              <span className="text-green-700">AgroIntelX</span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
              Analyze soil, predict crop success, and receive expert AI guidance.
              Built for data-driven agriculture in the modern era.
            </p>

            <div className="flex gap-4">
              <Link
                to="/soil-analysis"
                className="bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-800 transition shadow-md"
              >
                Get Started
              </Link>
              <Link
                to="/about"
                className="border border-green-700 text-green-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-50 transition"
              >
                Learn More
              </Link>
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl"
          >
            <img
              src="https://images.unsplash.com/photo-1602867741746-6df80f40b3f6?auto=format&fit=crop&q=80&w=900"
              alt="Smart Farming"
              className="w-full h-[500px] object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-green-900/70 via-green-800/40 to-transparent"></div>

            {/* Overlay Text */}
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Smart Farming Dashboard
              </h2>
              <p className="text-green-100 text-lg">
                AI-powered soil analysis, crop planning, and real-time insights.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-green-700 mb-4">
              Built for the Future of Agriculture
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              A complete AI platform that helps farmers make precise, data-driven
              decisions to increase yield and sustainability.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
            <FeatureCard
              title="Soil Intelligence"
              type="Soil"
              icon="🌱"
              description="AI-powered analysis of nutrients, pH, and moisture for smarter decisions."
            />
            <FeatureCard
              title="Crop Optimization"
              type="Crop"
              icon="🌾"
              description="Personalized crop recommendations based on soil health and climate."
            />
            <FeatureCard
              title="Real-Time Alerts"
              type="Alerts"
              icon="⚡"
              description="Get notified about risks, weather changes, and soil health instantly."
            />
            <FeatureCard
              title="AI Expert Chat"
              type="Expert"
              icon="💬"
              description="Chat with an AI agronomy assistant trained on your farm data."
            />
            <FeatureCard
              title="Advanced Analytics"
              type="Analytics"
              icon="📊"
              description="Visualize trends, compare seasons, and track performance over time."
            />
            <FeatureCard
              title="Enterprise Security"
              type="Security"
              icon="🔒"
              description="Your agricultural data is encrypted, private, and securely stored."
            />
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="py-24 bg-gradient-to-br from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <h3 className="text-5xl font-extrabold text-green-700">10,000+</h3>
              <p className="text-gray-600 mt-2">Active Farmers</p>
            </div>
            <div>
              <h3 className="text-5xl font-extrabold text-green-700">95%</h3>
              <p className="text-gray-600 mt-2">Prediction Accuracy</p>
            </div>
            <div>
              <h3 className="text-5xl font-extrabold text-green-700">50M+</h3>
              <p className="text-gray-600 mt-2">Acres Analyzed</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-28 bg-green-700 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-extrabold">
            Ready to Revolutionize Your Farming?
          </h2>
          <p className="text-green-100 text-lg max-w-3xl mx-auto">
            Join thousands of farmers using AI to improve soil health, maximize
            yield, and make confident agricultural decisions.
          </p>

          <Link
            to="/signup"
            className="inline-block bg-white text-green-700 px-10 py-4 rounded-lg text-lg font-semibold hover:bg-green-100 transition shadow-lg"
          >
            Start Free Today
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;

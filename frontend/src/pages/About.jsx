import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-gray-50 relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-100/50 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl text-center"
      >
        <span className="inline-block bg-brand-100 text-brand-800 px-4 py-1 rounded-full text-sm font-semibold tracking-wide mb-6">
          OUR MISSION
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-8">
          Cultivating the Future <br /> of Agriculture
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed font-medium mb-10">
          At AgroIntelX, we believe data is the new fertilizer. We combine artificial intelligence, machine learning, and agronomic expertise to provide actionable insights that help farmers increase yields while minimizing environmental impact.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 text-left">
          <div className="glass p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-3 text-brand-700">Vision</h3>
            <p className="text-gray-600">A world where every farm operates at peak efficiency with zero waste, powered by intelligent systems.</p>
          </div>
          <div className="glass p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-3 text-brand-700">Values</h3>
            <p className="text-gray-600">Sustainability, Precision, Farmer-First, and Continuous Innovation.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
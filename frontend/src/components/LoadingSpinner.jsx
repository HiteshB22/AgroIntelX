import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] w-full p-8">
      <div className="relative w-16 h-16 mb-4">
        {/* Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-4 border-brand-100 rounded-full border-t-brand-600 border-r-brand-600"
        ></motion.div>
        
        {/* Inner Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 border-4 border-brand-50 rounded-full border-b-brand-400 border-l-brand-400"
        ></motion.div>
        
        {/* Center Dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-2 h-2 rounded-full bg-brand-600"
          ></motion.div>
        </div>
      </div>
      
      {/* Loading Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-gray-500 font-medium tracking-wide animate-pulse"
      >
        {message}
      </motion.p>
    </div>
  );
};

export default LoadingSpinner;

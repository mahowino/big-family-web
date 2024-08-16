// components/LoadingScreen.tsx
import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <motion.div
          className="relative"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
        >
          <div className="w-16 h-16 border-4 border-t-4 border-gray-300 rounded-full animate-spin"></div>
        </motion.div>
        <motion.h2
          className="mt-4 text-lg font-semibold text-gray-700"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        >
          Loading...
        </motion.h2>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;

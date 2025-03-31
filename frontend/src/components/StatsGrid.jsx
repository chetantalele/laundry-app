import React from 'react';
import { motion } from 'framer-motion';

const StatsGrid = ({ stats }) => {
  return (
    <div className="container mx-auto px-4 -mt-16 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100 hover:border-[#46C6CE] group transition-all duration-300"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -10 }}
          >
            <div className="w-16 h-16 bg-[#194376]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#194376] group-hover:bg-[#194376] group-hover:text-white transition-all duration-300">
              {stat.icon}
            </div>
            <h3 className="text-4xl font-bold text-[#194376] mb-2 group-hover:text-[#46C6CE] transition-colors duration-300">
              {stat.value}
            </h3>
            <p className="text-gray-600 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StatsGrid;
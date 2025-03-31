import React from 'react';
import { motion } from 'framer-motion';

const FeaturesGrid = ({ features }) => {
  return (
    <div className="container mx-auto px-4 py-32">
      <div className="text-center mb-20">
        <motion.h2 
          className="text-5xl font-bold text-[#194376] mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Why Partner With Us?
        </motion.h2>
        <p className="text-2xl text-gray-600">Discover how we can help you scale your laundry business</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#46C6CE] group"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -15 }}
          >
            <div className="w-16 h-16 bg-[#194376]/10 rounded-2xl flex items-center justify-center text-[#194376] mb-8 group-hover:bg-[#194376] group-hover:text-white transition-all duration-300">
              {feature.icon}
            </div>
            <h3 className="text-2xl font-bold mb-4 text-[#194376] group-hover:text-[#46C6CE] transition-colors duration-300">
              {feature.title}
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
            <div className="text-[#46C6CE] font-bold">{feature.stats}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesGrid;
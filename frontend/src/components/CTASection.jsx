import React from 'react';
import { motion } from 'framer-motion';

const CTASection = () => {
  return (
    <div className="bg-gradient-to-r from-[#194376] to-[#46C6CE] py-24">
      <div className="container mx-auto px-4 text-center">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-white mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Ready to Transform Your Laundry Business?
        </motion.h2>
        <p className="text-2xl text-white/90 mb-12 max-w-3xl mx-auto">
          Join our platform today and experience the benefits of digital transformation
        </p>
        <motion.button 
          className="bg-white text-[#194376] px-12 py-6 rounded-xl font-bold text-xl hover:bg-[#46C6CE] hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Get Started Now
        </motion.button>
      </div>
    </div>
  );
};

export default CTASection;
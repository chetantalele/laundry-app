import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const PricingSection = ({ pricingPlans }) => {
  return (
    <div className="bg-gray-50/50 py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <motion.h2 
            className="text-5xl font-bold text-[#194376] mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Simple, Transparent Pricing
          </motion.h2>
          <p className="text-2xl text-gray-600">Choose the plan that works best for your business</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              className={`bg-white rounded-2xl p-10 ${
                plan.recommended 
                  ? 'ring-4 ring-[#46C6CE] shadow-2xl scale-105' 
                  : 'shadow-xl hover:shadow-2xl'
              } transition-all duration-300`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              {plan.recommended && (
                <div className="text-[#46C6CE] text-sm font-bold mb-6 bg-[#46C6CE]/10 py-2 px-4 rounded-full inline-block">
                  RECOMMENDED
                </div>
              )}
              <h3 className="text-3xl font-bold text-[#194376] mb-4">{plan.name}</h3>
              <div className="text-5xl font-bold text-[#194376] mb-8">{plan.price}</div>
              <ul className="space-y-6 mb-10">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="text-[#46C6CE]" size={24} />
                    <span className="text-gray-600 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                plan.recommended 
                  ? 'bg-[#194376] text-white hover:bg-[#46C6CE]' 
                  : 'bg-gray-100 text-[#194376] hover:bg-[#194376] hover:text-white'
              }`}>
                Get Started
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
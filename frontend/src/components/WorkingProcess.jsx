import React from 'react';
import { motion } from 'framer-motion';

const workingProcess = [
  {
    number: '01',
    title: 'Book Service',
    description: 'Schedule your laundry pickup through our easy-to-use app or website. Choose your preferred time slot.'
  },
  {
    number: '02',
    title: 'Doorstep Pickup',
    description: 'Our verified service provider will collect your laundry from your location at the scheduled time.'
  },
  {
    number: '03',
    title: 'Professional Cleaning',
    description: 'Your clothes are professionally cleaned and cared for according to fabric requirements.'
  },
  {
    number: '04',
    title: 'Quality Check',
    description: 'Each item undergoes thorough inspection to ensure the highest quality standards.'
  },
  {
    number: '05',
    title: 'Delivery',
    description: 'Clean, fresh clothes delivered back to your doorstep at your convenience.'
  }
];

const ProcessSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const numberVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.2,
      rotate: 360,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    }
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-4">How We Work</h2>
        <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 px-4"
      >
        {workingProcess.map((step, idx) => (
          <motion.div
            key={step.number}
            variants={itemVariants}
            whileHover={{ 
              y: -10,
              transition: { duration: 0.3 }
            }}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <motion.div
              variants={numberVariants}
              whileHover="hover"
              className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 mx-auto"
            >
              {step.number}
            </motion.div>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">
              {step.title}
            </h3>
            
            <p className="text-gray-600 text-center text-sm">
              {step.description}
            </p>

            {idx < workingProcess.length - 1 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className="hidden lg:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2"
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-blue-300">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default ProcessSection;
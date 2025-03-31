import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const TestimonialsSection = ({ testimonials }) => {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-12 md:mb-16">
        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#194376] mb-4"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          What Our Partners Say
        </motion.h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Hear from laundry business owners who have transformed their operations
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl p-6 md:p-8 shadow-lg hover:shadow-xl 
                        transition-all duration-300 border border-gray-100 
                        hover:border-[#46C6CE] group"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ 
              delay: index * 0.1, 
              duration: 0.5 
            }}
            whileHover={{ 
              scale: 1.03, 
              transition: { duration: 0.2 } 
            }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div 
                className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden 
                            shadow-md border-2 border-[#46C6CE]/20 
                            group-hover:border-[#46C6CE]/40 transition-all"
              >
                <img
                  src={`/api/placeholder/150/150?text=${testimonial.name.split(' ')[0]}`}
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg md:text-xl text-[#194376]">
                  {testimonial.name}
                </h3>
                <p className="text-sm md:text-base text-gray-500">
                  {testimonial.location}
                </p>
              </div>
            </div>
            <p className="text-base md:text-lg text-gray-600 mb-4 italic">
              "{testimonial.quote}"
            </p>
            <div className="flex gap-1">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star 
                  key={i} 
                  size={20} 
                  className="text-[#46C6CE]" 
                  fill="currentColor" 
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;
import React from 'react';
import { Clock, Award, Sparkles, Truck, Shield, HeartHandshake } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
    <div className="p-3 mb-4 rounded-full bg-blue-50">
      <Icon className="w-8 h-8 text-blue-500" />
    </div>
    <h3 className="mb-3 text-xl font-bold text-gray-900">{title}</h3>
    <p className="text-center text-gray-600">{description}</p>
  </div>
);

const WhyChooseUs = () => {
  const features = [
    {
      icon: Clock,
      title: "24-Hour Turnaround",
      description: "Get your clothes back fresh and clean within 24 hours. Perfect for your busy lifestyle."
    },
    {
      icon: Award,
      title: "Premium Quality",
      description: "Professional grade cleaning with eco-friendly products and attention to detail."
    },
    {
      icon: Sparkles,
      title: "Expert Care",
      description: "Specialized treatment for all fabric types, including delicates and designer wear."
    },
    {
      icon: Truck,
      title: "Free Pickup & Delivery",
      description: "Convenient doorstep service with real-time tracking of your orders."
    },
    {
      icon: Shield,
      title: "Guaranteed Protection",
      description: "Full insurance coverage for your garments while in our care."
    },
    {
      icon: HeartHandshake,
      title: "Customer Satisfaction",
      description: "100% satisfaction guaranteed with our premium laundry services."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16 bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Experience the difference with our professional laundry service that combines convenience, quality, and care.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;
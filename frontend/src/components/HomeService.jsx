import React from 'react';
import { 
  Users, 
  Target, 
  TrendingUp, 
  Award, 
  Shield, 
  Zap, 
  CheckCircle, 
  Star 
} from 'lucide-react';
import { motion } from 'framer-motion';

import PHeader from './PHeader';
import PFooter from './PFooter';
import HeroSection from './HeroSection';
import StatsGrid from './StatsGrid';
import FeaturesGrid from './FeaturesGrid';
import PricingSection from './PricingSection';
import './HomeService.css';
import TestimonialsPage from './TestimonialPage';


const HomeService = () => {
  const stats = [
    { icon: <Users />, value: "500+", label: "Service Providers" },
    { icon: <Target />, value: "98%", label: "Satisfaction Rate" },
    { icon: <TrendingUp />, value: "45%", label: "Average Growth" },
    { icon: <Award />, value: "50K+", label: "Orders Completed" }
  ];

  const features = [
    {
      icon: <Users />,
      title: "Expand Your Reach",
      description: "Connect with thousands of customers looking for quality laundry services in your area",
      stats: "10K+ Active Users"
    },
    {
      icon: <TrendingUp />,
      title: "Grow Your Business",
      description: "Increase your revenue with our smart scheduling and customer management tools",
      stats: "45% Average Growth"
    },
    {
      icon: <Shield />,
      title: "Reliable Partnership",
      description: "Join our verified network of service providers with guaranteed payments and support",
      stats: "100% Payment Protection"
    },
    {
      icon: <Zap />,
      title: "Smart Operations",
      description: "Streamline your operations with our AI-powered scheduling and route optimization",
      stats: "30% Time Saved"
    }
  ];

  const testimonials = [
    {
      name: "John's Laundry",
      quote: "Revenue increased by 60% within 3 months of joining",
      rating: 5,
      location: "New York, NY",
      image: "/images/laundaryimg2.jpg"
    },
    {
      name: "Clean Express",
      quote: "The platform's tools helped us scale operations efficiently",
      rating: 5,
      location: "Los Angeles, CA",
      image: "/images/laundaryimg2.jpg"
    },
    {
      name: "Wash Masters",
      quote: "Customer base grew significantly through the platform",
      rating: 5,
      location: "Chicago, IL",
      image: "/images/laundaryimg2.jpg"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$49",
      features: ["Basic Analytics", "100 Orders/month", "Email Support", "Basic Marketing Tools"],
      recommended: false
    },
    {
      name: "Professional",
      price: "$99",
      features: ["Advanced Analytics", "Unlimited Orders", "24/7 Support", "Premium Marketing Tools", "Route Optimization"],
      recommended: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: ["Custom Analytics", "Unlimited Everything", "Dedicated Support", "White-label Solution", "API Access"],
      recommended: false
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <PHeader />
      <HeroSection />
      <StatsGrid stats={stats} />
      <FeaturesGrid features={features} />
      <PricingSection pricingPlans={pricingPlans} />
      <TestimonialsPage/>
      <PFooter />
    </div>
  );
};

export default HomeService;
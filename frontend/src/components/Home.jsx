import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Carousel1 from './images/carousel-1.jpg';
import Carousel2 from './images/carousel-2.jpg';
import Header from './Header';
import Footer from './Footer';
import './HomePage.css';
import LaundryLanding from './LaundryLanding';
import Service from './Service';
import LaundryStatsDashboard from './LaundryStatsDashboard';
import FeatureCard from './FeatureCard';
import TestimonialsPage from './TestimonialPage';
import WorkingProcess from './WorkingProcess'

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
    }, 5000);
    
    // Add scroll listener for golden light effect
    const handleScroll = () => {
      const scrolled = window.scrollY > 100;
      setIsVisible(scrolled);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const services = [
    { icon: "cloud-sun", title: "Dry Cleaning", description: "Professional dry cleaning for all your delicate garments" },
    { icon: "soap", title: "Wash & Laundry", description: "Full-service laundry with premium detergents" },
    { icon: "burn", title: "Curtain Laundry", description: "Specialized cleaning for all types of curtains" },
    { icon: "tshirt", title: "Suits Cleaning", description: "Expert care for your formal wear" }
  ];

  const features = [
    { icon: "certificate", title: "10+ Years of Experience", description: "We have a decade of experience in providing top-notch laundry services." },
    { icon: "users", title: "Expert Staff", description: "Our staff are highly trained and experienced professionals." },
    { icon: "clock", title: "24/7 Service", description: "Round-the-clock service for your convenience." }
  ];

  const workingProcess = [
    { number: 1, title: "Place Your Order", description: "Easy online booking system" },
    { number: 2, title: "Free Pick Up", description: "Door-to-door collection service" },
    { number: 3, title: "Dry Cleaning", description: "Professional cleaning process" },
    { number: 4, title: "Free Delivery", description: "Timely delivery to your doorstep" }
  ];

  const testimonials = [
    { name: "John Doe", role: "Regular Customer", text: "Best laundry service I've ever used!" },
    { name: "Jane Smith", role: "Business Owner", text: "Their attention to detail is remarkable." },
    { name: "Mike Johnson", role: "Hotel Manager", text: "Reliable and professional service." }
  ];

  return (
    <div className="main-container">
      <div className={`golden-light ${isVisible ? 'visible' : ''}`} />
      <Header />
      
      {/* Enhanced Carousel Section */}
      <LaundryLanding/>

      {/* Enhanced Services Section */}
      <Service/>


      {/* New Statistics Section */}
      <LaundryStatsDashboard/>

      {/* Enhanced Features Section */}
      <FeatureCard/>


      {/* New Testimonials Section */}
      <TestimonialsPage/>

      
      {/* Enhanced Process Section */}
     <WorkingProcess/>

      {/* Call to Action Section */}
     

      <Footer />
    </div>
  );
};

export default Home;
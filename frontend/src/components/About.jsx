import React from 'react';
import Header from './Header';
import Footer from './Footer';
import img from './images/laundaryimg.webp';
import img1 from './images/laundaryimg3.jpg';
import img2 from './images/laundaryimg2.jpg';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header text="About Us" />
      
      <section className="py-16 lg:py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Your Trusted Laundry Partner
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Bringing professional laundry services to your doorstep with care, quality, and convenience.
            </p>
          </div>

          {/* Main Content */}
          <div className="flex flex-wrap items-center justify-between gap-12">
            {/* Image Gallery */}
            <div className="w-full lg:w-1/2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="overflow-hidden rounded-2xl shadow-lg transition-transform hover:scale-105 duration-300">
                    <img
                      src={img2}
                      alt="Professional laundry service"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <div className="overflow-hidden rounded-2xl shadow-lg transition-transform hover:scale-105 duration-300">
                    <img
                      src={img}
                      alt="Doorstep pickup service"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>
                <div className="mt-8">
                  <div className="overflow-hidden rounded-2xl shadow-lg transition-transform hover:scale-105 duration-300">
                    <img
                      src={img1}
                      alt="Professional cleaning"
                      className="w-full h-96 object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="w-full lg:w-5/12">
              <div className="space-y-8">
                <div className="inline-block">
                  <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold">
                    Why Choose Us
                  </span>
                </div>
                
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  Experience Premium Laundry Services
                </h2>
                
                <p className="text-gray-600 text-lg leading-relaxed">
                  We combine modern technology with expert care to deliver exceptional laundry services. Our network of verified professionals ensures your clothes receive the best treatment, with convenience at your doorstep.
                </p>

                {/* Features */}
                <div className="space-y-6">
                  {[
                    { title: 'Doorstep Pickup & Delivery', desc: 'Convenient scheduling that fits your lifestyle' },
                    { title: 'Professional Cleaning', desc: 'Expert care for all types of fabrics' },
                    { title: 'Real-time Tracking', desc: 'Know your order status at every step' }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                        <p className="text-gray-600">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="pt-6">
                  <a
                    href="#book-service"
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Schedule Pickup
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New About Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Our Story</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-4 mb-6">
              Revolutionizing Laundry Services Since 2020
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Vision */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600">
                To make professional laundry services accessible to everyone while maintaining the highest standards of quality and customer satisfaction.
              </p>
            </div>

            {/* Mission */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To deliver convenience and excellence in laundry care through innovative technology and passionate service professionals.
              </p>
            </div>

            {/* Values */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Values</h3>
              <p className="text-gray-600">
                We prioritize quality, reliability, and customer satisfaction in every interaction, ensuring your clothes receive the care they deserve.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              With years of experience in the laundry industry, we've built a network of trusted professionals who share our commitment to excellence. Our technology-driven approach ensures a seamless experience from order to delivery.
            </p>
            <a href="#learn-more" className="text-blue-600 font-medium hover:text-blue-700 transition-colors duration-300">
              Learn More About Our Process →
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;   
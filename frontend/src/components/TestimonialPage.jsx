import React from 'react';
import { FaLinkedinIn, FaShareAlt, FaQuoteLeft } from 'react-icons/fa';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Parker',
    designation: 'Working Professional',
    review: 'This laundry service is a lifesaver! Found a great provider within minutes, and my clothes were picked up and delivered right to my doorstep. The rates are so reasonable too!',
    linkedIn: '#',
  },
  {
    id: 2,
    name: 'Mike Chen',
    designation: 'Small Business Owner',
    review: 'As a restaurant owner, I need reliable laundry service for our linens. Their platform connected us with a professional service provider who never misses a schedule. Excellent service!',
    linkedIn: '#',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    designation: 'Student',
    review: 'Perfect for busy college students! Quick booking, same-day pickup, and the prices are student-friendly. The app makes it super easy to schedule pickups.',
    linkedIn: '#',
  },
  {
    id: 4,
    name: 'David Thompson',
    designation: 'Service Provider',
    review: 'As a laundry service provider, this platform has helped me grow my business significantly. The system efficiently connects me with customers in my area.',
    linkedIn: '#',
  },
  {
    id: 5,
    name: 'Priya Patel',
    designation: 'Homemaker',
    review: 'The doorstep delivery is so convenient! Their service providers are professional, and the quality of cleaning is consistently excellent. Best rates in the area!',
    linkedIn: '#',
  },
  {
    id: 6,
    name: 'Tom Wilson',
    designation: 'Healthcare Worker',
    review: 'With my irregular shifts, their 24/7 booking system is perfect. They always find me a provider, even for urgent requests. The tracking feature keeps me updated.',
    linkedIn: '#',
  }
];

const TestimonialCard = ({ testimonial }) => (
  <div className="bg-white shadow-lg rounded-lg p-6 m-4 flex flex-col">
    <div className="text-blue-500 mb-4">
      <FaQuoteLeft size={24} />
    </div>
    <p className="text-gray-600 mb-6 flex-grow">{testimonial.review}</p>
    <div className="border-t pt-4">
      <h5 className="text-lg font-bold">{testimonial.name}</h5>
      <p className="text-sm text-gray-500 mb-3">{testimonial.designation}</p>
      <div className="flex gap-4">
        <a href={testimonial.linkedIn} className="text-blue-500 text-xl hover:text-blue-700">
          <FaLinkedinIn />
        </a>
        <button className="text-gray-500 text-xl hover:text-gray-700">
          <FaShareAlt />
        </button>
      </div>
    </div>
  </div>
);

const TestimonialsPage = () => (
  <section className="p-8 bg-gray-100">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-3">Customer Experiences</h2>
      <p className="text-gray-600">Join thousands of satisfied customers who trust our laundry service!</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {testimonials.map(testimonial => (
        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
      ))}
    </div>
  </section>
);

export default TestimonialsPage;
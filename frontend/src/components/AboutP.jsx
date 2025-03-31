import React from 'react';
import PHeader from './PHeader';
import './About.css';
import img from './images/laundaryimg.webp';
import PFooter from './PFooter';


const AboutP = () => {
  return (
    <>
      <PHeader text={"About Us"} />
      <div className="about-container pt-5 pb-3">
        <div className="about-row">
          <div className="about-img-container">
            <img
              src={img}
              alt="Laundry Service"
              className="about-img"
            />
          </div>
          <div className="about-text-container">
            <h2 className="about-title">Welcome to Our Laundry Service</h2>
            <p className="about-paragraph">
              At [Your Laundry Service], we are dedicated to providing top-notch laundry services
              with a focus on convenience, quality, and customer satisfaction. Our team of
              professionals is committed to making your life easier by taking care of all your
              laundry needs.
            </p>
            <p className="about-paragraph">
              Whether you need regular laundry, dry cleaning, or specialized care for delicate
              garments, we've got you covered. With our easy-to-use online platform, you can
              schedule pickups and deliveries at your convenience. We pride ourselves on our
              attention to detail and the quality of our work, ensuring that your clothes are
              returned to you fresh, clean, and perfectly pressed.
            </p>
            <p className="about-paragraph">
              Our mission is to provide an exceptional laundry experience that exceeds your
              expectations every time. Thank you for choosing [Your Laundry Service] as your trusted
              laundry partner.
            </p>
          </div>
        </div>

       

       

        <div className="about-features-row pt-5">
          <div className="about-feature">
            <h4 className="about-feature-title">Quality Service</h4>
            <p className="about-feature-text">
              We use the best detergents and equipment to ensure that your clothes receive the care
              they deserve.
            </p>
          </div>
          <div className="about-feature">
            <h4 className="about-feature-title">Convenient Pickup & Delivery</h4>
            <p className="about-feature-text">
              Schedule pickups and deliveries at your convenience. We work around your schedule to
              make laundry hassle-free.
            </p>
          </div>
          <div className="about-feature">
            <h4 className="about-feature-title">Customer Satisfaction</h4>
            <p className="about-feature-text">
              Your satisfaction is our priority. We strive to exceed your expectations with every
              order.
            </p>
          </div>
          <div className="about-feature">
            <h4 className="about-feature-title">Eco-Friendly Practices</h4>
            <p className="about-feature-text">
            We are committed to sustainability. Our processes are designed to reduce water and
            energy consumption, and we use environmentally-friendly products.
            </p>
          </div>
        </div>

        <div className="about-testimonials-section">
          <h3 className="about-testimonials-title">What Our Customers Say</h3>
          <div className="about-testimonial">
            <p className="about-testimonial-text">
              "Fantastic service!. Highly recommend! for all laundary service providers"
            </p>
            <p className="about-testimonial-author">- Sayali</p>
          </div>
          <div className="about-testimonial">
            <p className="about-testimonial-text">
              "Convenient and reliable. The team is always friendly and helpful."
            </p>
            <p className="about-testimonial-author">- Yash</p>
          </div>
          {/* Add more testimonials as needed */}
        </div>

        <div className="about-cta-section">
          <h3 className="about-cta-title">Ready to Experience Exceptional Laundry Service?</h3>
          <button className="about-cta-button">Get Started</button>
        </div>
      </div>
      <PFooter/>

    </>
  );
};

export default AboutP;

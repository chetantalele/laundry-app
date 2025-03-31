import React from 'react';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebookF, faLinkedinIn, faInstagram } from '@fortawesome/free-brands-svg-icons';


function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section brand">
          <h1 className="footer-logo">
            <span className="logo-highlight">DRY</span>ME
          </h1>
          <p className="footer-description">
            Volup amet magna clita tempor. Tempor sea eos vero ipsum. Lorem lorem
            sit sed elitr sit no, sed kasd et ipsum dolor duo dolor
          </p>
          <div className="footer-social">
            <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
            <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
            <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
        
        <div className="footer-section contact">
          <h3 className="footer-heading">Get In Touch</h3>
          <p className='para'>Dolor clita stet nonumy clita diam vero, et et ipsum diam labore</p>
          <p className='para'><i className="fa fa-map-marker-alt"></i>1234 Pune, Maharashtra</p>
          <p className='para'><i className="fa fa-phone-alt"></i>+012 345 67890</p>
          <p className='para'><i className="fa fa-envelope"></i>info@example.com</p>
        </div>
        
        <div className="footer-section links">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li><a href="#"><i className="fa fa-angle-right"></i>Home</a></li>
            <li><a href="#"><i className="fa fa-angle-right"></i>About Us</a></li>
            <li><a href="/providers"><i className="fa fa-angle-right"></i>Providers</a></li>
            <li><a href="/orders"><i className="fa fa-angle-right"></i>Orders</a></li>
          </ul>
        </div>
        
        <div className="footer-section newsletter">
          <h3 className="footer-heading">Newsletter</h3>
          <form className="footer-form">
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <button type="submit" className="footer-btn">Submit Now</button>
          </form>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p className='para'>&copy; <a href="#">DRY ME</a>. All Rights Reserved. Designed by <a href="#">Prathamesh & Team</a></p>
      </div>
    </footer>
  );
}

export default Footer;
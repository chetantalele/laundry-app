import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Header = (props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    axios.post('http://43.204.96.204:3000/userlogout', {}, { withCredentials: true })
      .then((response) => {
        console.log(response.data.message);
        alert("Logout Successful!");
        navigate('/');
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  };

  const handleUpdateUser = () => {
    // Navigate to the update user page (assuming you have a route for this page)
    navigate('/update-user');
  };

  return (
    <>
      {/* Topbar */}
      <div className="w-full bg-[#194376] ">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between py-3">
            {/* Left Section */}
            <div className="flex justify-center md:justify-start items-center space-x-3 mb-2 md:mb-0">
              <a href="" className="text-white font-medium hover:text-[#46C6CE]">
                FAQs
              </a>
              <span className="text-white">|</span>
              <a href="" className="text-white font-medium hover:text-[#46C6CE]">
                Help
              </a>
              <span className="text-white">|</span>
              <a href="" className="text-white font-medium hover:text-[#46C6CE]">
                Support
              </a>
            </div>
            {/* Right Section */}
            <div className="flex justify-center md:justify-end items-center space-x-4">
              <a href="" className="text-white hover:text-[#46C6CE]">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="" className="text-white hover:text-[#46C6CE]">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="" className="text-white hover:text-[#46C6CE]">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="" className="text-white hover:text-[#46C6CE]">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="" className="text-white hover:text-[#46C6CE]">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex flex-wrap items-center justify-between py-3">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="flex items-center">
                <h1 className="text-2xl font-bold">
                  <span className="text-[#194376]">DRY</span>
                  <span className="text-[#46C6CE]">ME</span>
                </h1>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden inline-flex items-center p-2 text-gray-500 rounded-lg hover:bg-gray-100"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>

            {/* Navigation Links */}
            <div className={`${isMenuOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`}>
              <div className="flex flex-col md:flex-row md:items-center md:space-x-8 mt-4 md:mt-0">
                <a href="/home" className="text-[#194376] hover:text-[#46C6CE] py-2 md:py-0">
                  Home
                </a>
                <a href="/about" className="text-[#194376] hover:text-[#46C6CE] py-2 md:py-0">
                  About
                </a>
                <a href="/providers" className="text-[#194376] hover:text-[#46C6CE] py-2 md:py-0">
                  Providers
                </a>
                <a href="/orders" className="text-[#194376] hover:text-[#46C6CE] py-2 md:py-0">
                  Orders Placed
                </a>
                <button
                  onClick={handleUpdateUser}
                  className="bg-[#46C6CE] text-white px-4 py-2 rounded hover:bg-[#194376] transition-colors duration-300"
                >
                  Update User
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-[#194376] text-white px-4 py-2 rounded hover:bg-[#46C6CE] transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;

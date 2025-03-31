import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PHeader() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredElement, setHoveredElement] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    // Implement your logout logic here
    alert("Logout Successful!");
    navigate('/service-provider/login');
  };

  const menuItems = ['Home','About', "Add Service" ,'Orders' , 'Contact'];
  const menuLinks = ["/service-provider/home", "/aboutp", "/service-provider/add-service" , "/service-provider/orders", "/contact"];

  return (
    <>
      {/* Top Bar */}
      {!isMobile && (
        <div className="bg-[#194376] text-white">
          <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
            <div>
              {['Support', 'Help', 'FAQs'].map((item, index) => (
                <a
                  key={index}
                  href=""
                  className={`mr-4 font-medium transition-opacity duration-300 
                    ${hoveredElement === `topLink${index}` ? 'opacity-80' : ''}`}
                  onMouseEnter={() => setHoveredElement(`topLink${index}`)}
                  onMouseLeave={() => setHoveredElement(null)}
                >
                  {item}
                </a>
              ))}
            </div>
            <div>
              {['facebook-f', 'twitter', 'linkedin-in', 'instagram', 'youtube'].map((icon, index) => (
                <a
                  key={index}
                  href=""
                  className={`ml-4 text-lg transition-transform duration-300 
                    ${hoveredElement === `socialIcon${index}` ? 'scale-110' : ''}`}
                  onMouseEnter={() => setHoveredElement(`socialIcon${index}`)}
                  onMouseLeave={() => setHoveredElement(null)}
                >
                  <i className={`fab fa-${icon}`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <nav className="bg-[#46C6CE] shadow-md mb-8">
        <div className={`max-w-7xl mx-auto px-4 py-3 flex justify-between items-center 
          ${isMobile ? 'h-[60px]' : 'h-[100px]'}`}>
          {/* Brand */}
          <a 
            href="/"
            className={`text-white font-bold transition-opacity duration-300 
              ${isMobile ? 'text-2xl' : 'text-3xl'} 
              ${hoveredElement === 'brand' ? 'opacity-80' : ''}`}
            onMouseEnter={() => setHoveredElement('brand')}
            onMouseLeave={() => setHoveredElement(null)}
          >
            MY BRAND
          </a>

          {/* Mobile Menu Toggle */}
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`text-white text-2xl bg-transparent border-none cursor-pointer 
                transition-opacity duration-300 
                ${hoveredElement === 'mobileMenu' ? 'opacity-80' : ''}`}
              onMouseEnter={() => setHoveredElement('mobileMenu')}
              onMouseLeave={() => setHoveredElement(null)}
            >
              ☰
            </button>
          )}

          {/* Desktop Menu */}
          <div className={`${isMobile ? 'hidden' : 'flex items-center'}`}>
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={menuLinks[index]}
                className={`ml-6 text-black font-medium transition-colors duration-300 
                  ${hoveredElement === `navLink${index}` ? 'text-white' : ''}`}
                onMouseEnter={() => setHoveredElement(`navLink${index}`)}
                onMouseLeave={() => setHoveredElement(null)}
              >
                {item}
              </a>
            ))}
            <button
              onClick={handleLogout}
              className={`ml-6 bg-[#194376] text-white px-4 py-2 rounded 
                transition-colors duration-300
                ${hoveredElement === 'logoutBtn' ? 'bg-[#0d2b4d]' : ''}`}
              onMouseEnter={() => setHoveredElement('logoutBtn')}
              onMouseLeave={() => setHoveredElement(null)}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobile && mobileMenuOpen && (
          <div className="bg-[#46C6CE] absolute left-0 right-0 top-[60px] z-50 p-5 flex flex-col">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={menuLinks[index]}
                className={`my-2 text-black font-medium transition-colors duration-300 
                  ${hoveredElement === `mobileNavLink${index}` ? 'text-white' : ''}`}
                onMouseEnter={() => setHoveredElement(`mobileNavLink${index}`)}
                onMouseLeave={() => setHoveredElement(null)}
              >
                {item}
              </a>
            ))}
            <button
              onClick={handleLogout}
              className={`mt-2 bg-[#194376] text-white px-4 py-2 rounded 
                transition-colors duration-300
                ${hoveredElement === 'mobileLogoutBtn' ? 'bg-[#0d2b4d]' : ''}`}
              onMouseEnter={() => setHoveredElement('mobileLogoutBtn')}
              onMouseLeave={() => setHoveredElement(null)}
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </>
  );
}

export default PHeader;
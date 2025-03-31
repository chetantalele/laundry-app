import React from 'react';

const LaundryLanding = () => {
  return (
    <section className="bg-white">
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
        {/* New Service Alert Banner */}
        <a href="#" className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200" role="alert">
          <span className="text-xs bg-blue-600 rounded-full text-white px-4 py-1.5 mr-3">New</span>
          <span className="text-sm font-medium">Express 24-hour service now available!</span>
          <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </a>

        {/* Main Heading */}
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl">
          Professional Laundry Service at Your Doorstep
        </h1>

        {/* Subheading */}
        <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48">
          We offer premium wash, dry, and fold services with free pickup and delivery. Experience the convenience of professional laundry care with our expert team.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
          <a href="#" className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300">
            Book Now
            <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
          <a href="#" className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100">
            View Pricing
          </a>
        </div>

        {/* Trust Badges */}
        <div className="px-4 mx-auto text-center md:max-w-screen-md lg:max-w-screen-lg lg:px-36">
          <span className="font-semibold text-gray-400 uppercase">TRUSTED BY</span>
          <div className="flex flex-wrap justify-center items-center mt-8 text-gray-500 sm:justify-between">
            <div className="mr-5 mb-5 lg:mb-0 hover:text-gray-800">
              {/* Replaced logos with text for laundry service context */}
              <p className="text-sm">Local Hotels</p>
            </div>
            <div className="mr-5 mb-5 lg:mb-0 hover:text-gray-800">
              <p className="text-sm">Corporate Offices</p>
            </div>
            <div className="mr-5 mb-5 lg:mb-0 hover:text-gray-800">
              <p className="text-sm">Restaurants</p>
            </div>
            <div className="mr-5 mb-5 lg:mb-0 hover:text-gray-800">
              <p className="text-sm">Healthcare Facilities</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LaundryLanding;
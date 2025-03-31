import React from "react";

const Service = () => {
  return (
    <section className="pb-12 pt-20 bg-gray-50 lg:pb-[90px] lg:pt-[120px]">
      <div className="container mx-auto px-4">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto mb-12 max-w-[510px] text-center lg:mb-20">
              <span className="mb-2 block text-lg font-semibold text-[#46C6CE]">
                Our Services
              </span>
              <h2 className="mb-3 text-3xl font-bold leading-[1.2] text-[#194376] sm:text-4xl md:text-[40px]">
                Professional Laundry Solutions
              </h2>
              <p className="text-base text-gray-600">
                Experience premium laundry care with our comprehensive range of services designed to keep your clothes fresh, clean, and well-maintained.
              </p>
            </div>
          </div>
        </div>

        <div className="-mx-4 flex flex-wrap">
          <ServiceCard
            title="Wash & Fold"
            details="Professional washing and folding service for your everyday clothes. We use premium detergents and sort by color and fabric type."
            icon={
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.42 4.58C19.99 4.15 19.41 3.8 18.72 3.8H5.28C4.59 3.8 4.01 4.15 3.58 4.58C3.15 5.01 2.8 5.59 2.8 6.28V19.72C2.8 20.41 3.15 20.99 3.58 21.42C4.01 21.85 4.59 22.2 5.28 22.2H18.72C19.41 22.2 19.99 21.85 20.42 21.42C20.85 20.99 21.2 20.41 21.2 19.72V6.28C21.2 5.59 20.85 5.01 20.42 4.58ZM12 19C9.24 19 7 16.76 7 14C7 11.24 9.24 9 12 9C14.76 9 17 11.24 17 14C17 16.76 14.76 19 12 19Z" fill="white"/>
              </svg>
            }
          />
          <ServiceCard
            title="Dry Cleaning"
            details="Expert dry cleaning service for your delicate garments, suits, and special care items. We ensure proper treatment for each fabric type."
            icon={
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.12 5C21.12 2.76 19.24 1 16.88 1H7.12C4.76 1 2.88 2.76 2.88 5C2.88 6.44 3.44 7.76 4.36 8.68C4.36 8.68 4.36 8.68 4.36 8.68L10.88 15.2V19H13.12V15.2L19.64 8.68C20.56 7.76 21.12 6.44 21.12 5ZM17.88 7.32L12.88 12.32C12.4 12.8 11.6 12.8 11.12 12.32L6.12 7.32C5.64 6.84 5.36 6.2 5.36 5.48C5.36 4.12 6.52 3 7.92 3H16.08C17.48 3 18.64 4.12 18.64 5.48C18.64 6.2 18.36 6.84 17.88 7.32Z" fill="white"/>
                <path d="M19 21H5C4.45 21 4 21.45 4 22C4 22.55 4.45 23 5 23H19C19.55 23 20 22.55 20 22C20 21.45 19.55 21 19 21Z" fill="white"/>
              </svg>
            }
          />
          <ServiceCard
            title="Ironing & Pressing"
            details="Get perfectly pressed clothes with our professional ironing service. We pay attention to every detail for that crisp, fresh look."
            icon={
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 6C20.45 6 20 6.45 20 7V17C20 17.55 20.45 18 21 18C21.55 18 22 17.55 22 17V7C22 6.45 21.55 6 21 6Z" fill="white"/>
                <path d="M17 8H3C2.45 8 2 8.45 2 9V15C2 15.55 2.45 16 3 16H17C17.55 16 18 15.55 18 15V9C18 8.45 17.55 8 17 8ZM10 14C8.9 14 8 13.1 8 12C8 10.9 8.9 10 10 10C11.1 10 12 10.9 12 12C12 13.1 11.1 14 10 14Z" fill="white"/>
              </svg>
            }
          />
          <ServiceCard
            title="Express Service"
            details="Need it fast? Our express service ensures quick turnaround for your urgent laundry needs without compromising on quality."
            icon={
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M30.2625 10.6312L19.9125 1.4626C18.7875 0.843848 17.3812 0.843848 16.3125 1.4626L5.84999 7.5376C4.72499 8.2126 4.04999 9.39385 4.04999 10.6876C4.04999 11.9813 4.72499 13.2188 5.84999 13.8376L16.1437 19.8563C16.7062 20.1938 17.325 20.3626 18 20.3626C18.675 20.3626 19.35 20.1938 19.9125 19.8001L30.2625 13.4438C31.3875 12.7688 31.95 11.5876 31.95 10.2376C31.95 8.94385 31.2187 7.7626 30.2625 10.6312Z" fill="white"/>
              </svg>
            }
          />
          <ServiceCard
            title="Stain Removal"
            details="Our expert stain removal service tackles tough stains while protecting your fabrics. We use specialized treatments for different stain types."
            icon={
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17 13H7V11H17V13Z" fill="white"/>
              </svg>
            }
          />
          <ServiceCard
            title="Subscription Plans"
            details="Save time and money with our convenient subscription plans. Regular pickup and delivery service for hassle-free laundry management."
            icon={
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.11 21 21 20.1 21 19V5C21 3.9 20.11 3 19 3ZM17 13H7V11H17V13Z" fill="white"/>
              </svg>
            }
          />
        </div>
      </div>
    </section>
  );
};

const ServiceCard = ({ icon, title, details }) => {
  return (
    <div className="w-full px-4 md:w-1/2 lg:w-1/3">
      <div className="mb-9 rounded-[20px] bg-white p-10 shadow-md hover:shadow-xl transition-shadow duration-300 md:px-7 xl:px-10">
        <div className="mb-8 flex h-[70px] w-[70px] items-center justify-center rounded-2xl bg-[#194376]">
          {icon}
        </div>
        <h4 className="mb-[14px] text-2xl font-semibold text-[#194376]">
          {title}
        </h4>
        <p className="text-gray-600">{details}</p>
      </div>
    </div>
  );
};

export default Service;
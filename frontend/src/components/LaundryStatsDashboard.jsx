import { useState, useEffect } from 'react';

const CountUp = ({ end, decimal = false }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime;
    let animationFrame;
    const duration = 2000; // 2 seconds animation

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;

      if (progress < 1) {
        const currentCount = decimal 
          ? (end * progress).toFixed(1)
          : Math.floor(end * progress);
        setCount(currentCount);
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, decimal]);

  return count;
};

const StatCard = ({ value, label, prefix = '', suffix = '' }) => (
  <div className="flex flex-col items-center">
    <h3 className="text-5xl font-extrabold leading-tight text-center text-gray-900">
      {prefix}
      <CountUp end={value} decimal={typeof value === 'number' && value % 1 !== 0} />
      {suffix}
    </h3>
    <p className="text-base font-medium leading-7 text-center text-gray-600">
      {label}
    </p>
  </div>
);

const LaundryStatsDashboard = () => {
  const stats = [
    {
      value: 250,
      label: "Satisfied Customers",
      suffix: "+"
    },
    {
      value: 12,
      label: "Monthly Revenue",
      prefix: "$",
      suffix: "k"
    },
    {
      value: 2.8,
      label: "Service Locations",
      suffix: "k+"
    },
    {
      value: 18000,
      label: "Garments Cleaned Monthly",
      suffix: "+"
    }
  ];

  return (
    <div className="container flex flex-col mx-auto bg-white">
      <div className="w-full">
        <div className="container flex flex-col items-center gap-16 mx-auto my-32">
          <div className="grid w-full grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-y-8">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                value={stat.value}
                label={stat.label}
                prefix={stat.prefix}
                suffix={stat.suffix}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaundryStatsDashboard;
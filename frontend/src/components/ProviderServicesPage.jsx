import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './ProviderServicesPage.css';
import Header from './Header';

function ProviderServicesPage() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/user/providers/${providerId}/services`,
          { withCredentials: true }
        );
        setServices(response.data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
        setError('Failed to fetch services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [providerId]);

  const handleQuantityChange = (serviceName, serviceId, quantity, price) => {
    setSelectedServices((prev) => {
      const updated = [...prev];
      const index = updated.findIndex((item) => item.serviceId === serviceId);

      if (index > -1) {
        updated[index] = {
          serviceName,
          serviceId,
          quantity: parseInt(quantity, 10) || 0,
          price,
        };
      } else {
        updated.push({ serviceName, serviceId, quantity: parseInt(quantity, 10) || 0, price });
      }

      return updated;
    });
  };

  const handleProceed = () => {
    console.log(selectedServices);
    navigate('/checkout', { state: { providerId, selectedServices } });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Header
      text={"Services"}/>
    <div className="ps-provider-services-container">
      <h2>Services Provided</h2>
      <div className="ps-providers-list">
        {services.length === 0 ? (
          <p>No services available</p>
        ) : (
          services.map((service, index) => {
            let price = parseFloat(service.Price);
            if (isNaN(price)) {
              console.error('Invalid price:', service.Price);
              price = 0;
            }

            return (
              <div key={`${service.ServiceID}-${index}`} className="ps-service-card">
                <h3>{service.ServiceName}</h3>
                <p>Price: Rs.{price.toFixed(2)}</p>
                <input
                  type="number"
                  placeholder="Quantity"
                  min="1"
                  onChange={(e) =>
                    handleQuantityChange(service.ServiceName, service.ServiceID, e.target.value, price.toFixed(2))
                  }
                />
              </div>
            );
          })
        )}
      </div>
      <button className="ps-proceed-button" onClick={handleProceed}>
        Proceed to Checkout
      </button>
    </div>
    </div>
  );
}

export default ProviderServicesPage;

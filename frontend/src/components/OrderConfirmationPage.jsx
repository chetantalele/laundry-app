import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './OrderConfirmationPage.css'; // Create this CSS file for styling

function OrderConfirmationPage() {
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState('');

  // Get the orderId from the location state
  const orderId = location.state?.orderId;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/order/${orderId}`);
        setOrderDetails(response.data);
      } catch (error) {
        console.error('Failed to fetch order details:', error);
        setError('Failed to fetch order details');
      }
    };

    if (orderId) {
      fetchOrderDetails();
    } else {
      setError('Order ID is missing');
    }
  }, [orderId]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!orderDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="order-confirmation-container">
      <h2>Order Confirmation</h2>
      <p><strong>Order ID:</strong> {orderDetails.id}</p>
      <p><strong>Provider:</strong> {orderDetails.providerName}</p>
      <p><strong>Total Amount:</strong> ${orderDetails.totalAmount.toFixed(2)}</p>
      <p><strong>Pickup Time:</strong> {new Date(orderDetails.pickupTime).toLocaleString()}</p>
      <p><strong>Dropoff Time:</strong> {new Date(orderDetails.dropoffTime).toLocaleString()}</p>

      <h3>Ordered Services:</h3>
      <ul>
        {orderDetails.services.map((service, index) => (
          <li key={index}>
            <p><strong>Service ID:</strong> {service.serviceId}</p>
            <p><strong>Quantity:</strong> {service.quantity}</p>
            <p><strong>Price:</strong> ${service.price.toFixed(2)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrderConfirmationPage;

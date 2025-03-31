import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './OrderDetailsPage.css';
import PFooter from './PFooter';
import PHeader from './PHeader';


function OrderDetailsPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState({ services: [] });
  const [pickupTime, setPickupTime] = useState('');
  const [dropoffTime, setDropoffTime] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/service-provider/orders/${orderId}`, { withCredentials: true });
        setOrder(response.data);
        setPickupTime(response.data.PickupTime || '');
        setDropoffTime(response.data.DropoffTime || '');
      } catch (error) {
        console.error('Failed to fetch order details:', error);
        setError('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleUpdate = async () => {
    try {
      const response = await axios.post('http://localhost:3000/service-provider/update-order', {
        OrderID: order.OrderID,
        PickupTime: pickupTime || null,
        DropoffTime: dropoffTime || null,
      }, { withCredentials: true });

      console.log('Update response:', response.data);
      setOrder(prevOrder => ({
        ...prevOrder,
        PickupTime: pickupTime,
        DropoffTime: dropoffTime
      }));

      await axios.post('http://localhost:3000/service-provider/time-updation', {
        orderId: order.OrderID,
        pickup: pickupTime,
        dropup: dropoffTime
      });

      alert("Times updated successfully");

    } catch (error) {
      setError('Failed to update order');
      console.error('Failed to update order:', error);
    }
  };

  const handleOtpVerification = async () => {
    try {
      
      const response = await axios.post('http://localhost:3000/service-provider/pickdropverify-otp', {
        orderId: order.OrderID,
        otp: otp,
      }, { withCredentials: true });

      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setOrder(prevOrder => ({
          ...prevOrder,
          Status: response.data.newStatus
        }));
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Failed to verify OTP');
      console.error('Failed to verify OTP:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <PHeader
      text={"Order Details"}
      />
    <div className="order-details-container">
      <h2>Order #{order.OrderID} Details</h2>
      
      <h4>Services</h4>
      <ul>
        {order.services.map(service => (
          <li key={service.ServiceID}>
            <strong>{service.ServiceName}</strong> - Quantity: {service.Quantity} - Price: Rs.{service.Price}
          </li>
        ))}
      </ul>
      {order.Status!=='Completed' && <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
        <div>
          <label htmlFor="pickup-time">Pickup Time:</label>
          <input
            type="datetime-local"
            id="pickup-time"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="dropoff-time">Dropoff Time:</label>
          <input
            type="datetime-local"
            id="dropoff-time"
            value={dropoffTime}
            onChange={(e) => setDropoffTime(e.target.value)}
          />
        </div>
        <button type="submit">Update Times</button>
      </form>}
      {order.Status!=='Completed' &&<div>
         <h4>Verify OTP</h4>
         <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button onClick={handleOtpVerification}>Verify OTP</button>
      </div>}
      {error && <div className="error">{error}</div>}
      {successMessage && <div className="success">{successMessage}</div>}
    </div>
    <PFooter/>
    </div>
  );
}

export default OrderDetailsPage;

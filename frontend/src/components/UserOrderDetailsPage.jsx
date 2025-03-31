import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './UserOrderDetailsPage.jsx';

function UserOrderDetailsPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState({ services: [] });
  const [pickupTime, setPickupTime] = useState('');
  const [dropoffTime, setDropoffTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [otpMessage, setOtpMessage] = useState('');
  const [cancelMessage, setCancelMessage] = useState('');

  // ... (all existing useEffect and handler functions remain the same)
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/user/orders/${orderId}`, { withCredentials: true });
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
      const response = await axios.post('http://localhost:3000/user/update-order', {
        OrderID: order.OrderID,
        PickupTime: pickupTime || null,
        DropoffTime: dropoffTime || null,
      }, { withCredentials: true });

      setOrder(prevOrder => ({
        ...prevOrder,
        PickupTime: pickupTime,
        DropoffTime: dropoffTime,
      }));
      setError(null);
      alert("Times Updated Successfully");
    } catch (error) {
      setError('Failed to update order');
      alert("Error Updating Times");
      console.error('Failed to update order:', error);
    }
  };

  const handleRequestOtp = async () => {
    try {
      const response = await axios.post('http://localhost:3000/user/send-otp', {
        orderId: order.OrderID
      }, { withCredentials: true });
      setOtpMessage(response.data.message);
      setError(null);
    } catch (error) {
      console.error('Failed to request OTP:', error);
      setOtpMessage('Failed to request OTP');
    }
  };

  const handleCancelOrder = async () => {
    try {
      const response = await axios.post(`http://localhost:3000/user/cancel-order`, {
        orderId: order.OrderID,
      }, { withCredentials: true });

      setOrder(prevOrder => ({
        ...prevOrder,
        Status: 'Cancelled',
      }));
      setError(null);

      await axios.post('http://localhost:3000/user/cancel-orderconfirmation',{
        orderId: order.OrderID
      });

      await axios.post('http://localhost:3000/provider/cancel-orderconfirmation',{
        orderId: order.OrderID
      });

      alert("Order cancelled successfully. Please check your email for confirmation.");
      setCancelMessage('Order cancelled successfully.');
      navigate("/orders");
      
    } catch (error) {
      console.error('Failed to cancel order:', error);
      setError('Failed to cancel order');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header text="Order Details" />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Order #{order.OrderID}
            </h2>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              order.Status === 'Completed' ? 'bg-green-100 text-green-800' :
              order.Status === 'Cancelled' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {order.Status}
            </span>
          </div>

          <div className="mb-8">
            <h4 className="text-xl font-semibold text-gray-700 mb-4">Services</h4>
            <div className="space-y-3">
              {order.services.map(service => (
                <div 
                  key={service.ServiceID}
                  className="flex justify-between items-center bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                >
                  <span className="font-medium text-gray-800">{service.ServiceName}</span>
                  <div className="flex items-center space-x-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">
                      Qty: {service.Quantity}
                    </span>
                    <span className="font-semibold text-gray-800">
                      Rs.{service.Price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {order.Status !== 'Completed' && (
            <div className="space-y-6">
              <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="pickup-time" className="block text-sm font-medium text-gray-700">
                      Pickup Time
                    </label>
                    <input
                      type="datetime-local"
                      id="pickup-time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="dropoff-time" className="block text-sm font-medium text-gray-700">
                      Dropoff Time
                    </label>
                    <input
                      type="datetime-local"
                      id="dropoff-time"
                      value={dropoffTime}
                      onChange={(e) => setDropoffTime(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-6 text-white bg-blue-500 hover:bg-blue-600 rounded-xl font-medium transition-colors duration-200 shadow-lg shadow-blue-500/30"
                >
                  Update Times
                </button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <button
                  onClick={handleRequestOtp}
                  className="w-full py-3 px-6 text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-xl font-medium transition-colors duration-200"
                >
                  Request OTP
                </button>
                
                <button
                  onClick={handleCancelOrder}
                  disabled={order.Status === 'Cancelled'}
                  className={`w-full py-3 px-6 rounded-xl font-medium transition-colors duration-200
                    ${order.Status === 'Cancelled'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                    }`}
                >
                  Cancel Order
                </button>
              </div>

              {(otpMessage || cancelMessage) && (
                <div className="mt-4 p-4 rounded-lg bg-gray-50">
                  {otpMessage && <p className="text-blue-600">{otpMessage}</p>}
                  {cancelMessage && <p className="text-red-600">{cancelMessage}</p>}
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default UserOrderDetailsPage;
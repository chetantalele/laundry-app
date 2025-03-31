import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatuses, setSelectedStatuses] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3000/user/orders', { withCredentials: true });
        const groupedOrders = response.data.reduce((acc, order) => {
          const { OrderID, ServiceID, ServiceName, Quantity, Price, name: lspName, ...orderDetails } = order;
          if (!OrderID) return acc;
          if (!acc[OrderID]) {
            acc[OrderID] = { ...orderDetails, OrderID, services: [], lspName };
          }
          acc[OrderID].services.push({ ServiceID, ServiceName, Quantity, Price });
          return acc;
        }, {});
        setOrders(Object.values(groupedOrders));
      } catch (error) {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleCardClick = (orderId, status) => {
    if (status !== "Cancelled") {
      navigate(`/order/${orderId}`);
    }
  };

  const getStatusStyles = (status) => {
    const baseStyles = "px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1";
    const styles = {
      Pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      Pickup: "bg-blue-100 text-blue-800 border border-blue-200",
      Completed: "bg-green-100 text-green-800 border border-green-200",
      Cancelled: "bg-red-100 text-red-800 border border-red-200"
    };
    return `${baseStyles} ${styles[status] || "bg-gray-100 text-gray-800"}`;
  };

  const getStatusIcon = (status) => {
    const icons = {
      Pending: "⏳",
      Pickup: "🚚",
      Completed: "✅",
      Cancelled: "❌"
    };
    return icons[status] || "📦";
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.OrderID.toString() === searchTerm ||
      order.lspName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatuses.size === 0 || selectedStatuses.has(order.Status);
    return matchesSearch && matchesStatus;
  });

  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-lg text-gray-600 animate-pulse">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header text="Orders Dashboard" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 transform hover:scale-105 transition-transform duration-300">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
            <p className="text-gray-600">Track and manage your laundry orders</p>
          </div>

          <div className="space-y-6">
            <div className="relative group">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:rotate-90 transition-transform duration-300">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search by Order ID or Service Provider"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:shadow-md"
              />
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              {['Pending', 'Pickup', 'Completed', 'Cancelled'].map((status) => (
                <label key={status} className="relative group">
                  <input
                    type="checkbox"
                    checked={selectedStatuses.has(status)}
                    onChange={() => setSelectedStatuses(prev => {
                      const newSet = new Set(prev);
                      if (newSet.has(status)) newSet.delete(status);
                      else newSet.add(status);
                      return newSet;
                    })}
                    className="sr-only peer"
                  />
                  <div className="px-4 py-2 rounded-full cursor-pointer select-none
                    transition-all duration-200 ease-in-out
                    peer-checked:bg-blue-500 peer-checked:text-white
                    peer-checked:shadow-lg peer-checked:transform peer-checked:scale-105
                    bg-white text-gray-700 hover:bg-gray-100 hover:shadow
                    border-2 border-transparent peer-checked:border-blue-600">
                    {status}
                  </div>
                </label>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {currentOrders.length === 0 ? (
                <div className="col-span-full">
                  <div className="bg-white rounded-lg shadow-lg p-8 text-center transform hover:scale-105 transition-all duration-300">
                    <div className="text-6xl mb-4 animate-bounce">📦</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Orders Found</h3>
                    <p className="text-gray-600">Start shopping to see your orders here!</p>
                  </div>
                </div>
              ) : (
                currentOrders.map((order) => (
                  <div
                    key={order.OrderID}
                    onClick={() => handleCardClick(order.OrderID, order.Status)}
                    className={`bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 
                      ${order.Status !== "Cancelled" 
                        ? "hover:shadow-xl hover:-translate-y-1 cursor-pointer" 
                        : "opacity-75"}`}
                  >
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200">
                          Order #{order.OrderID}
                        </h3>
                        <span className={getStatusStyles(order.Status)}>
                          {getStatusIcon(order.Status)} {order.Status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <p className="flex items-center gap-2">
                            <span className="text-gray-400">👤</span>
                            <span className="text-gray-600">{order.Name}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="text-gray-400">📧</span>
                            <span className="text-gray-600">{order.Email}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="text-gray-400">📱</span>
                            <span className="text-gray-600">{order.PhoneNo}</span>
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="flex items-center gap-2">
                            <span className="text-gray-400">🏪</span>
                            <span className="text-gray-600">{order.lspName}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="text-gray-400">📅</span>
                            <span className="text-gray-600">
                              {new Date(order.CreatedAt).toLocaleDateString()}
                            </span>
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="text-gray-400">📍</span>
                            <span className="text-gray-600">{order.Address}</span>
                          </p>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="text-sm font-semibold mb-2">Services</h4>
                        <div className="space-y-2">
                          {order.services.map((service) => (
                            <div
                              key={`${order.OrderID}-${service.ServiceID}`}
                              className="flex justify-between items-center bg-gray-50 p-2 rounded hover:bg-gray-100 transition-colors duration-200"
                            >
                              <span className="text-sm font-medium">{service.ServiceName}</span>
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-500">×{service.Quantity}</span>
                                <span className="text-sm font-semibold">₹{service.Price}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center mt-4 pt-2 border-t">
                          <span className="font-semibold">Total Amount</span>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-400">💰</span>
                            <span className="font-bold text-lg">₹{order.TotalAmount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg transition-all duration-300 transform hover:scale-110
                      ${currentPage === i + 1
                        ? 'bg-blue-500 text-white font-bold shadow-lg scale-105'
                        : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default UserOrders;
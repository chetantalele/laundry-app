import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PHeader from './PHeader';
import PFooter from './PFooter';

function ServiceProviderOrders() {
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
        const response = await axios.get('http://localhost:3000/service-provider/orders', { withCredentials: true });
        const groupedOrders = response.data.reduce((acc, order) => {
          const { OrderID, ServiceID, ServiceName, Quantity, Price, ...orderDetails } = order;
          if (!OrderID) return acc;
          if (!acc[OrderID]) {
            acc[OrderID] = { ...orderDetails, OrderID, services: [] };
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
      navigate(`/service-provider/order/${orderId}`);
    }
  };

  const handleCheckboxChange = (status) => {
    setSelectedStatuses(prev => {
      const newStatuses = new Set(prev);
      if (newStatuses.has(status)) {
        newStatuses.delete(status);
      } else {
        newStatuses.add(status);
      }
      return newStatuses;
    });
  };

  const getStatusConfig = (status) => {
    const configs = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Pickup: 'bg-blue-100 text-blue-800',
      Completed: 'bg-green-100 text-green-800',
      Cancelled: 'bg-red-100 text-red-800'
    };
    return configs[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      Pending: '⏳',
      Pickup: '🚚',
      Completed: '✅',
      Cancelled: '❌'
    };
    return icons[status] || '📦';
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.OrderID.toString() === searchTerm ||
      order.Name.toLowerCase().includes(searchTerm.toLowerCase());
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-lg text-gray-600">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <PHeader text="Orders Dashboard" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Orders Management</h1>
            <p className="text-gray-600">Track and manage your service orders</p>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search by Order ID or Customer Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              {['Pending', 'Pickup', 'Completed', 'Cancelled'].map((status) => (
                <label key={status} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedStatuses.has(status)}
                    onChange={() => handleCheckboxChange(status)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{status}</span>
                </label>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {currentOrders.length === 0 ? (
                <div className="col-span-full p-8 bg-white rounded-lg shadow text-center">
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-xl text-gray-500">No orders found</p>
                </div>
              ) : (
                currentOrders.map((order) => (
                  <div
                    key={order.OrderID}
                    onClick={() => handleCardClick(order.OrderID, order.Status)}
                    className={`bg-white rounded-lg shadow-md p-6 transform transition-all duration-300 ${
                      order.Status !== "Cancelled" 
                        ? "hover:shadow-lg hover:-translate-y-1 cursor-pointer" 
                        : "opacity-75"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-gray-900">
                        Order #{order.OrderID}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusConfig(order.Status)}`}>
                        {getStatusIcon(order.Status)} {order.Status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">👤</span>
                        <span className="text-sm text-gray-600">{order.Name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">📧</span>
                        <span className="text-sm text-gray-600">{order.Email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">📱</span>
                        <span className="text-sm text-gray-600">{order.PhoneNo}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">📅</span>
                        <span className="text-sm text-gray-600">
                          {new Date(order.CreatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2 mb-4">
                      <span className="text-gray-400">📍</span>
                      <span className="text-sm text-gray-600">{order.Address}</span>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="text-sm font-semibold mb-2">Services Ordered</h4>
                      <div className="space-y-2">
                        {order.services.map((service) => (
                          <div
                            key={`${order.OrderID}-${service.ServiceID}`}
                            className="flex justify-between items-center bg-gray-50 p-2 rounded"
                          >
                            <span className="text-sm font-medium">{service.ServiceName}</span>
                            <div className="flex items-center space-x-4">
                              <span className="text-sm text-gray-500">×{service.Quantity}</span>
                              <span className="text-sm font-semibold">₹{service.Price}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center mt-4 pt-2 border-t">
                        <span className="font-semibold">Total Amount</span>
                        <div className="flex items-center">
                          <span className="text-gray-400 mr-1">💰</span>
                          <span className="font-bold">₹{order.TotalAmount}</span>
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
                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                      currentPage === i + 1
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <PFooter />
    </div>
  );
}

export default ServiceProviderOrders;
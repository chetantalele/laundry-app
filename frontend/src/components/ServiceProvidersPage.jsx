import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Loader2, Star, Phone, Clock } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import img from './images/laundaryimg3.jpg'

const ServiceProvidersPage = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => { 
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch('http://localhost:3000/user/providers', {
          credentials: 'include'
        });
        const fetchedProviders = await response.json();

        if (userLocation) {
          const providersWithDistance = fetchedProviders.map(provider => ({
            ...provider,
            distance: calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              parseFloat(provider.lat),
              parseFloat(provider.long)
            )
          }));
          setProviders(providersWithDistance.sort((a, b) => a.distance - b.distance));
        } else {
          setProviders(fetchedProviders);
        }
      } catch (error) {
        setError('Failed to fetch service providers');
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [userLocation]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    return Math.round(Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2)) * 111000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Finding nearby service providers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-50 p-6 rounded-xl shadow-sm text-red-600 max-w-md text-center">
          <p className="text-lg font-medium mb-2">Oops! Something went wrong</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Laundry Service
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with trusted laundry providers in your area for hassle-free service
          </p>
        </motion.div>

        {providers.length === 0 ? (
          <div className="text-center py-16">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-8 rounded-xl shadow-sm max-w-md mx-auto"
            >
              <p className="text-gray-600 text-lg mb-2">No service providers found in your area.</p>
              <p className="text-gray-500">Please try expanding your search area or check back later.</p>
            </motion.div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {providers.map((provider, index) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group"
              >
                <div className={`bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  selectedProvider === provider.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedProvider(provider.id)}
                >
                  <div className="relative">
                    <img
                      src={img}
                      alt={provider.name}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                      Open
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{provider.name}</h3>
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="ml-1 text-gray-600">4.8</span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                        <p className="text-sm">{provider.address}</p>
                      </div>

                      {provider.distance && (
                        <div className="flex items-center text-gray-600">
                          <Navigation className="w-5 h-5 mr-3 text-gray-400" />
                          <p className="text-sm">
                            {provider.distance < 1000
                              ? `${provider.distance} meters`
                              : `${(provider.distance / 1000).toFixed(1)} km`} away
                          </p>
                        </div>
                      )}

                      <div className="flex items-center text-gray-600">
                        <Clock className="w-5 h-5 mr-3 text-gray-400" />
                        <p className="text-sm">Opens 9:00 AM - 8:00 PM</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <a
                        href={`/provider/${provider.id}/services`}
                        className="flex-1 text-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-300"
                      >
                        View Services
                      </a>
                      <button className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-300">
                        <Phone className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default ServiceProvidersPage;
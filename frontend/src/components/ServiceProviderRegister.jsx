import React, { useState } from "react";
import axios from "axios";
import myImage from './images/laundaryimg3.jpg';
import { getPreciseDistance } from 'geolib';

function RegisterServiceProvider() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const sendOtp = () => {
    axios
      .post(
        "http://43.204.96.204:3000/service-provider/send-otp",
        { email },
        { withCredentials: true }
      )
      .then((response) => {
        console.log("OTP sent:", response.data);
        setOtpSent(true);
      })
      .catch((error) => {
        console.error("Error sending OTP:", error);
        setError("Failed to send OTP. Please try again.");
      });
  };

  const verifyOtp = () => {
    axios
      .post(
        "http://43.204.96.204:3000/service-provider/verify-otp",
        { email, otp },
        { withCredentials: true }
      )
      .then((response) => {
        console.log("OTP verified:", response.data);
        setOtpVerified(true);
        getCurrentLocation();
      })
      .catch((error) => {
        console.error("Error verifying OTP:", error);
        setError("Failed to verify OTP. Please try again.");
      });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toPrecision(5));
          setLongitude(position.coords.longitude.toPrecision(5));
          console.log("Latitude:", position.coords.latitude, "Longitude:", position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Failed to get location. Please try again.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otpVerified) {
      setError("Please verify your email first.");
      return;
    }
    axios
      .post(
        "http://43.204.96.204:3000/service-provider/register",
        { username: email, password, name, address, latitude, longitude },
        { withCredentials: true }
      )
      .then((response) => {
        console.log("Registration successful:", response.data);
        window.location.href = "/service-provider/login";
      })
      .catch((error) => {
        console.error("Error during registration:", error);
        setError("Registration failed. Please try again.");
      });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-1/2 hidden md:block p-6 mt-28">
        <img 
          src={myImage} 
          alt="Laundry Service" 
          className="w-full h-96 object-cover rounded-xl shadow-lg"
        />
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Sign Up as a Service Provider
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            {!otpSent ? (
              <button 
                type="button" 
                onClick={sendOtp}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
              >
                Send OTP
              </button>
            ) : (
              <>
                <div>
                  <input
                    type="text"
                    value={otp}
                    placeholder="Enter OTP"
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <button 
                  type="button" 
                  onClick={verifyOtp}
                  className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-300"
                >
                  Verify OTP
                </button>
              </>
            )}

            {otpVerified && (
              <>
                <div>
                  <input
                    type="password"
                    value={password}
                    placeholder="Enter your Password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={name}
                    placeholder="Enter your Laundry Name"
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={address}
                    placeholder="Enter your Address"
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
                >
                  Sign Up
                </button>
              </>
            )}
          </form>

          {error && (
            <div className="mt-4 text-center text-red-500 bg-red-100 py-2 rounded-md">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegisterServiceProvider;
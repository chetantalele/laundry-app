import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import GoogleButton from "react-google-button";
import myImage from './images/file.png';

function ServiceProviderLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://43.204.96.204:3000/service-provider/login",
        { username, password },
        { withCredentials: true }
      );
      
      response.status === 200 
        ? navigate("/service-provider/secrets")
        : setError("Login failed. Please check your credentials.");
    } catch (error) {
      setError("Error logging in. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="w-full flex justify-center py-6">
          <img 
            src={myImage} 
            alt="Service Provider" 
            className="h-32 w-32 object-cover rounded-full shadow-md"
          />
        </div>

        <div className="p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">Service Provider Login</h2>
          </div>

          <GoogleButton
            type="light"
            label="Continue with Google"
            onClick={() => window.location.href = "http://43.204.96.204:3000/service-provider/auth/google"}
          />

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />

            <div className="relative">
              <input
                type={isPasswordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {isPasswordVisible ? "🔓" : "🔒"}
              </button>
            </div>

            <div className="flex justify-between items-center">
              <a href="/spforgotpass" className="text-sm text-blue-600">
                Forgot Password?
              </a>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Login
              </button>
            </div>
          </form>

          {error && (
            <div className="text-red-600 text-center">{error}</div>
          )}

          <div className="text-center">
            <p>
              New provider? 
              <button 
                onClick={() => navigate('/service-provider/register')}
                className="text-blue-600 ml-2"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceProviderLogin;
import React, { useState } from "react";
import axios from "axios";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [error, setError] = useState("");
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const sendOtp = () => {
    axios
      .post(
        "http://43.204.96.204:3000/send-otp",
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

  const verifyOtp = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://43.204.96.204:3000/verify-otp",
        { email, otp },
        { withCredentials: true }
      )
      .then((response) => {
        console.log("OTP verified:", response.data);
        setOtpVerified(true);
      })
      .catch((error) => {
        console.error("Error verifying OTP:", error);
        setError("Failed to verify OTP. Please try again.");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otpVerified) {
      setError("Please verify your email first.");
      return;
    }
    axios
      .post(
        "http://43.204.96.204:3000/register",
        { username: email, password },
        { withCredentials: true }
      )
      .then((response) => {
        window.location.href = "/secrets";
      })
      .catch((error) => {
        console.error("Error during registration:", error);
        setError("Registration failed. Please try again.");
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full bg-white shadow-2xl rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Image Section */}
        <div className="hidden md:block relative overflow-hidden">
          <img 
            src="images/laundaryimg.webp" 
            alt="Laundry illustration" 
            className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
          />
          <div className="absolute inset-0 bg-blue-600 opacity-40"></div>
        </div>

        {/* Registration Form */}
        <div className="p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 
              transform transition-transform duration-300 hover:translate-x-2">
              Create Your Account
            </h2>
            <p className="text-gray-500">Join our laundry service today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 
                  transition-all duration-300 
                  hover:border-blue-400"
                required
              />
              {isEmailFocused && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 
                  text-blue-500 animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Send OTP Button */}
            <button 
              type="button" 
              onClick={sendOtp}
              className="w-full bg-blue-600 text-white py-3 rounded-lg 
                hover:bg-blue-700 transition-all duration-300 
                transform hover:scale-[1.02] active:scale-95"
            >
              Send OTP
            </button>

            {/* OTP Section */}
            {otpSent && (
              <div className="space-y-4 animate-fade-in-up">
                <div className="relative">
                  <input
                    type="text"
                    value={otp}
                    placeholder="Enter OTP"
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <button 
                  type="button" 
                  onClick={verifyOtp}
                  className="w-full bg-green-600 text-white py-3 rounded-lg 
                    hover:bg-green-700 transition-all duration-300 
                    transform hover:scale-[1.02] active:scale-95"
                >
                  Verify OTP
                </button>
              </div>
            )}

            {/* Password Section */}
            {otpVerified && (
              <div className="space-y-4 animate-fade-in-up">
                <div className="relative">
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    value={password}
                    placeholder="Enter your Password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 
                      text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    {isPasswordVisible ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.503-1.503A10.05 10.05 0 0019.542 10c-1.274-4.057-5.064-7-9.542-7a9.94 9.94 0 00-4.697 1.227l-1.592-1.592zm4.293 4.293a2 2 0 112.828 2.828l-2.828-2.828zm-1.414 5.657l2.828-2.828a4 4 0 115.657 5.657l-2.828-2.828a2 2 0 11-2.828-2.828z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg 
                    hover:bg-blue-700 transition-all duration-300 
                    transform hover:scale-[1.02] active:scale-95"
                >
                  Sign Up
                </button>
              </div>
            )}
          </form>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-2 rounded-lg 
              text-center animate-shake">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;
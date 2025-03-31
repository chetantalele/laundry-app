import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import myImage from './images/laundaryimg3.jpg';


function ProviderForgotpass() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [error, setError] = useState("");

  const sendOtp = () => {
    axios
      .post(
        "http://localhost:3000/service-provider/forgsend-otp",
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
        "http://localhost:3000/service-provider/forgverify-otp",
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
        "http://localhost:3000/service-provider/forgpass",
        { username: email, password },
        { withCredentials: true }
      )
      
      .then((response) => {
        window.location.href = "/service-provider/login";
        // Handle successful registration
      })
      .catch((error) => {
        console.error("Error during Password Reset", error);
        // Handle registration error
        setError("Password Reset failed. Please try again.");
      });
  };

 

  return (
    <div className="login-body">
    <div className="login-container">
      <div className="login-card">
        <div className="login-form-container">
        
          <h2>Reset Password sp</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="button" onClick={sendOtp}>
              Send OTP
            </button>
            {otpSent && (
              <>
                <input
                  type="text"
                  value={otp}
                  placeholder="Enter OTP"
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button type="button" onClick={verifyOtp}>
                  Verify OTP
                </button>
              </>
            )}
            {otpVerified && (
              <>
                <input
                  type="password"
                  value={password}
                  placeholder="Enter your Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Sign Up</button>
              </>
            )}
          </form>
          {error && <div className="error">{error}</div>}
        </div>

        <div className="login-image">
          <img src={myImage} alt="Laundry illustration" />
        </div>
      </div>
    </div>
    </div>
  );
}

export default ProviderForgotpass;

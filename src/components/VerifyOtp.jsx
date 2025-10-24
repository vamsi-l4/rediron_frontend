import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "./Api";
import "./Login.css";
import { AuthContext } from "../contexts/AuthContext";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [email] = useState(localStorage.getItem("email") || "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const validateOtp = () => {
    if (!otp.trim()) {
      setOtpError("OTP is required");
      return false;
    }
    if (!/^\d{6}$/.test(otp.trim())) {
      setOtpError("OTP must be 6 digits");
      return false;
    }
    setOtpError("");
    return true;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage("");
    setOtpError("");

    if (!validateOtp()) return;

    setLoading(true);
    try {
      const res = await API.post("/api/accounts/verify-otp/", { email, otp });

      if (res.data.access) {
        localStorage.setItem("accessToken", res.data.access);
        if (res.data.refresh) {
          localStorage.setItem("refreshToken", res.data.refresh);
        }
        login(res.data.access);
        setMessage("OTP verified successfully");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setMessage("Verification failed");
      }
    } catch (err) {
      let errorMsg = "Verification failed";
      if (!err.response) {
        errorMsg = "Network error: Unable to connect to server. Please check your connection.";
      } else if (err.response.status === 500) {
        errorMsg = "Server error: Service temporarily unavailable. Please try again later.";
      } else if (err.response.status === 429) {
        errorMsg = "Too many attempts. Please wait a moment before trying again.";
      } else {
        errorMsg = err.response?.data?.error || err.response?.data?.detail || errorMsg;
      }
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <video autoPlay muted loop className="background-video">
        <source src="/background1.mp4" type="video/mp4" />
      </video>
      <div className="login-form-wrapper">
        <div className="glass-card-background"></div>
        <img src="/muscleman.png" alt="Gym Silhouette" className="silhouette" />
        <motion.div
          className="form-content"
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2>Enter OTP</h2>
          <form className="otp-form" onSubmit={handleVerify}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter the OTP sent to email"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                  setOtp(value);
                  if (otpError) setOtpError('');
                }}
                maxLength={6}
                required
                className={otpError ? 'error' : ''}
                autoFocus
              />
              {otpError && <p className="field-error">{otpError}</p>}
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            {message && (
              <p className={message === "OTP verified successfully" ? "success" : "error"}>
                {message}
              </p>
            )}
          </form>
          <p className="footer-text">
            Back to <span onClick={() => navigate("/login")}>Login</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyOtp;

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
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      // Try form-data first for verify-otp
      const formData = new FormData();
      formData.append("email", email);
      formData.append("otp", otp);

      const res = await API.post("/api/accounts/verify-otp/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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
      setMessage(err.response?.data?.error || "Verification failed");
    }
  };

  return (
    <div className="login-container">
      <video autoPlay muted loop className="background-video">
        <source src="/background1.mp4" type="video/mp4" />
      </video>

      <div className="login-form-wrapper">
        <div className="glass-card-background"></div>
        <img
          src="/muscleman.png"
          alt="Gym Silhouette"
          className="silhouette"
        />

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
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <button type="submit">Verify OTP</button>
            {message && (
              <p
                className={
                  message === "OTP verified successfully" ? "success" : "error"
                }
              >
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

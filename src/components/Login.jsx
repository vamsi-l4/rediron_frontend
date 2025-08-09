import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Key } from 'react-feather';
import Navbar from './Navbar';
import './Login.css';

// Dynamic API base URL
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/login/`, {
        email,
        password,
      });

      // Store token
      if (rememberMe) {
        localStorage.setItem('token', response.data.token);
      } else {
        sessionStorage.setItem('token', response.data.token);
      }

      localStorage.setItem('email', email); // store email for OTP usage
      setOtpSent(true); // show OTP box
    } catch (error) {
      setErrorMsg('Login failed. Check email/password.');
    }
  };

  // Handle OTP verify
  const handleVerifyOtp = async () => {
    setErrorMsg('');
    try {
      const response = await axios.post(`${API_BASE_URL}/api/verify-otp/`, {
        email,
        otp,
      });

      if (response.data.success) {
        setOtpError('');
        navigate('/');
      }
    } catch (error) {
      setOtpError('OTP verification failed.');
    }
  };

  return (
    <div className="login-container">
      <Navbar />

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
          <h2>
            Welcome Back to <span className="logo-text">RedIron Gym</span> 💪
          </h2>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <Lock className="input-icon" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            {errorMsg && <p className="error">{errorMsg}</p>}
            {otpError && <p className="error">{otpError}</p>}

            <div className="options-row">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember Me</span>
              </label>
              <span className="forgot-password">Forgot password?</span>
            </div>

            <button className="button" type="submit">
              Login
            </button>
          </form>

          {/* OTP box */}
          {otpSent && (
            <motion.div
              className="otp-box"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h4>Enter the OTP sent to your Email</h4>
              <div className="input-group">
                <Key className="input-icon" size={18} />
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <button className="button" onClick={handleVerifyOtp}>
                Verify OTP
              </button>
            </motion.div>
          )}

          <p className="footer-text">
            Don't have an account? <span onClick={() => navigate('/signup')}>Signup</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

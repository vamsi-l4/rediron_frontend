import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'react-feather';
import API from './Api';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setEmailError('');
    setPasswordError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      // Do not set Content-Type, let Axios handle it!
      const response = await API.post('/api/accounts/login/', formData);

      if (response.data && response.data.message) {
        localStorage.setItem('email', email);
        navigate('/verify-otp');
        return;
      }
      setErrorMsg('Login failed. Unexpected response.');
    } catch (error) {
      let serverMsg = 'Login failed. Check email/password.';
      if (!error.response) {
        serverMsg = 'Network error: Unable to connect to server. Please check your connection.';
      } else if (error.response.status === 500) {
        serverMsg = 'Server error: Email service temporarily unavailable. Please try again later.';
      } else if (error.response.status === 429) {
        serverMsg = 'Too many attempts. Please wait a moment before trying again.';
      } else {
        serverMsg = error.response?.data?.error || error.response?.data?.detail || serverMsg;
      }
      setErrorMsg(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <video autoPlay muted loop className="background-video">
        <source src="background1.mp4" type="video/mp4" />
      </video>
      <div className="login-form-wrapper">
        <div className="glass-card-background"></div>
        <img src="muscleman.png" alt="Gym Silhouette" className="silhouette" />
        <motion.div
          className="form-content"
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2>
            Welcome Back to <span className="logo-text">RedIron</span>
          </h2>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                required
                className={emailError ? 'error' : ''}
              />
              {emailError && <p className="field-error">{emailError}</p>}
            </div>
            <div className="input-group">
              <Lock className="input-icon" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                required
                className={passwordError ? 'error' : ''}
              />
              <span
                className="toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
              {passwordError && <p className="field-error">{passwordError}</p>}
            </div>
            {errorMsg && <p className="error">{errorMsg}</p>}
            <div className="options-row">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                />
                <span>Remember Me</span>
              </label>
              <label>
                <span className="forgot-password">Forgot password?</span>
              </label>
            </div>
            <button className="button" type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="footer-text">
            Don't have an account?{" "}
            <span onClick={() => navigate("/signup")}>Signup</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

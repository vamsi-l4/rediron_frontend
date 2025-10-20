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
  const navigate = useNavigate();
  // const { login } = useContext(AuthContext); // Not used in this component

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const response = await API.post('/api/accounts/login/', { email, password });
      if (response.data && response.data.message) {
        localStorage.setItem('email', email);
        navigate('/verify-otp');
        return;
      }

      // If backend returned 500 or unexpected shape, try fallback form-data payload (some backends expect multipart)
      if (!response.data || !response.data.message) {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        const fallback = await API.post('/api/accounts/login/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (fallback.data && fallback.data.message) {
          localStorage.setItem('email', email);
          navigate('/verify-otp');
          return;
        }
      }
      setErrorMsg('Login failed. Unexpected response.');
    } catch (error) {
      // Surface full server message when available to aid debugging
      const serverMsg = error.response?.data?.message || error.response?.data?.error || JSON.stringify(error.response?.data);
      setErrorMsg(serverMsg || 'Login failed. Check email/password.');
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
          <h2>Welcome Back to <span className="logo-text">RedIron</span> 💪</h2>
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
            <button className="button" type="submit">Login</button>
          </form>
          <p className="footer-text">
            Don't have an account? <span onClick={() => navigate('/signup')}>Signup</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import './Login.css';
import { motion } from 'framer-motion';
import API from './Api';
import { Mail, Lock, Eye, EyeOff, User } from 'react-feather';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    setEmailError('');
    setNameError('');
    setPasswordError('');

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    } else if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
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

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setEmailError('');
    setNameError('');
    setPasswordError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await API.post('/api/accounts/signup/', { email, name, password });

      if (response.data && response.data.message) {
        localStorage.setItem('email', email);
        setErrorMsg(response.data.message);
        setTimeout(() => navigate('/verify-otp'), 3000); // Navigate to OTP verification
      } else {
        setErrorMsg('Signup failed. Unexpected response.');
      }
    } catch (error) {
      let serverMsg = 'Signup failed.';
      if (!error.response) {
        serverMsg = 'Network error: Unable to connect to server. Please check your connection.';
      } else if (error.response.status === 400) {
        // Handle validation errors
        const errors = error.response.data;
        if (errors.email) setEmailError(errors.email[0]);
        if (errors.name) setNameError(errors.name[0]);
        if (errors.password) setPasswordError(errors.password[0]);
        if (errors.detail) serverMsg = errors.detail;
      } else if (error.response.status === 500) {
        serverMsg = 'Server error: Service temporarily unavailable. Please try again later.';
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
            Create your account <span className="logo-text">RedIron</span>
          </h2>
          <form onSubmit={handleSignup}>
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
              <User className="input-icon" size={18} />
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) setNameError('');
                }}
                required
                className={nameError ? 'error' : ''}
              />
              {nameError && <p className="field-error">{nameError}</p>}
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
            <button className="button" type="submit" disabled={loading}>
              {loading ? 'Signing up...' : 'Signup'}
            </button>
          </form>
          <p className="footer-text">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Login</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;

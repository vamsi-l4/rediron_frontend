/**
 * ============================================
 * SIGNUP COMPONENT - CLERK ONLY (SIMPLIFIED)
 * ============================================
 *
 * RULES:
 * - Minimum 8 characters password
 * - No complexity rules
 * - Clerk stores password securely
 * - No localStorage
 * - No manual token handling
 */

import React, { useState, useEffect } from 'react';
import './Login.css';
import { motion } from 'framer-motion';
import { useSignUp, useAuth } from '@clerk/clerk-react';
import { Mail, Lock, Eye, EyeOff, User } from 'react-feather';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [loading, setLoading] = useState(false);
  const [signInHover, setSignInHover] = useState(false);

  const { signUp, isLoaded } = useSignUp();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const navigate = useNavigate();

  // Redirect if already signed in
  useEffect(() => {
    if (authLoaded && isSignedIn) {
      navigate('/', { replace: true });
    }
  }, [authLoaded, isSignedIn, navigate]);

  /* =============================
     SIMPLE VALIDATION
  ============================= */

  const validateForm = () => {
    let valid = true;

    setEmailError('');
    setNameError('');
    setPasswordError('');

    if (!email.trim()) {
      setEmailError('Email is required');
      valid = false;
    }

    if (!name.trim()) {
      setNameError('Name is required');
      valid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      valid = false;
    }

    return valid;
  };

  /* =============================
     HANDLE SIGNUP
  ============================= */

  const handleSignup = async (e) => {
    e.preventDefault();

    setErrorMsg('');

    if (!validateForm()) return;

    if (!isLoaded || !signUp) {
      setErrorMsg('Authentication service not ready.');
      return;
    }

    setLoading(true);

    try {
      await signUp.create({
        emailAddress: email.trim(),
        password: password,
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' ') || '',
      });

      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      });

      setPassword('');
      setErrorMsg('Check your email for verification code.');

      setTimeout(() => {
        navigate('/verify-email', { replace: true });
      }, 1200);

    } catch (err) {
      let msg = 'Signup failed.';

      if (err.errors && err.errors.length > 0) {
        const code = err.errors[0].code;

        if (code === 'form_email_exists') {
          msg = 'Email already registered.';
          setEmailError('Email already registered');
        } else if (code === 'form_email_invalid') {
          msg = 'Invalid email.';
          setEmailError('Invalid email');
        } else if (code === 'form_password_size_too_small') {
          msg = 'Password must be at least 8 characters.';
          setPasswordError('Minimum 8 characters');
        } else {
          msg = err.errors[0].message || msg;
        }
      }

      setErrorMsg(msg);
      setPassword('');
    }

    setLoading(false);
  };

  if (!authLoaded || isSignedIn) {
    return (
      <div className="auth-container">
        <video autoPlay muted loop className="auth-background-video">
          <source src="background1.mp4" type="video/mp4" />
        </video>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <video autoPlay muted loop className="auth-background-video">
        <source src="background1.mp4" type="video/mp4" />
      </video>

      <div className="auth-form-wrapper">
        <div className="auth-glass-card"></div>
        <img src="muscleman.png" alt="Gym Silhouette" className="auth-silhouette" />

        <motion.div
          className="auth-form-content"
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="auth-form-heading">
            <img src="/logo.png" alt="RedIron Logo" className="auth-logo" />
            <h2>Create an Account</h2>
            <p className="auth-form-subtitle">Join RedIron and transform your body</p>
          </div>

          <form onSubmit={handleSignup}>
            {/* EMAIL */}
            <div className="auth-input-group">
              <Mail className="auth-input-icon" size={18} />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={emailError ? 'auth-input-error' : ''}
              />
              {emailError && <p className="auth-field-error">{emailError}</p>}
            </div>

            {/* NAME */}
            <div className="auth-input-group">
              <User className="auth-input-icon" size={18} />
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={nameError ? 'auth-input-error' : ''}
              />
              {nameError && <p className="auth-field-error">{nameError}</p>}
            </div>

            {/* PASSWORD */}
            <div className="auth-input-group">
              <Lock className="auth-input-icon" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password (min 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={passwordError ? 'auth-input-error' : ''}
              />
              <span
                className="auth-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
              {passwordError && <p className="auth-field-error">{passwordError}</p>}
            </div>

            {errorMsg && <div className="auth-message-box auth-error">{errorMsg}</div>}

            <button
              className="auth-submit-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <p className="auth-footer-text">
            Already have an account?{' '}
            <span 
              onClick={() => navigate('/login')}
              style={{ cursor: 'pointer', color: signInHover ? 'red' : 'inherit', transition: 'color 0.3s' }}
              onMouseEnter={() => setSignInHover(true)}
              onMouseLeave={() => setSignInHover(false)}
            >
              Sign in
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;

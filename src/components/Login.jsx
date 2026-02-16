/**
 * ============================================
 * LOGIN COMPONENT - CLERK ONLY
 * ============================================
 * 
 * Production-Ready Email + Password Login
 * 
 * CLERK FLOW:
 * 1. User enters email + password
 * 2. signIn.create() verifies credentials with Clerk
 * 3. If status === 'complete': Direct login (verified account)
 * 4. setActive() creates session immediately
 * 5. Redirect to dashboard
 * 
 * NO OTP - Email verification happens during signup only
 * NO localStorage - Clerk session handles everything
 * NO passwordless - Only email + password strategy
 * NO infinite useEffect loops - Form-driven, not auth-driven
 * 
 * ============================================
 * OLD JWT AUTHENTICATION (COMMENTED FOR REFERENCE)
 * ============================================
 * 
 * DEPRECATED APPROACH (DO NOT USE):
 * // Old code used manual API endpoint:
 * // const response = await API.post('/api/accounts/login/', { email, password });
 * // Then stored tokens in localStorage:
 * // localStorage.setItem('accessToken', response.data.access);
 * // localStorage.setItem('refreshToken', response.data.refresh);
 * // And managed token refresh manually
 * 
 * REPLACED BY:
 * - Clerk handles password verification securely
 * - Clerk manages session automatically
 * - No token storage in client
 * - No manual refresh logic needed
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignIn, useAuth } from '@clerk/clerk-react';
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
  const [clerkLoading, setClerkLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, isLoaded, setActive } = useSignIn();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();

  useEffect(() => {
    // ============================================
    // PREVENT INFINITE LOOPS
    // ============================================
    // If already signed in, redirect immediately to prevent redirect loops
    if (authLoaded && isSignedIn) {
      navigate('/', { replace: true });
      return;
    }

    // Set loading state while Clerk initializes
    if (!isLoaded) {
      setClerkLoading(true);
    } else {
      setClerkLoading(false);
    }
  }, [isLoaded, isSignedIn, authLoaded, navigate]);

  const validateForm = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    if (!email.trim()) {
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
    if (!isLoaded || !signIn) {
      setErrorMsg('Authentication service not ready. Please refresh and try again.');
      return;
    }

    setLoading(true);
    try {
      // ============================================
      // CLERK LOGIN: Email + Password Only
      // ============================================
      // Use Clerk's signIn.create() with identifier and password
      // This is the ONLY supported login method for security
      const signInResult = await signIn.create({
        identifier: email.trim(),
        password: password,
      });

      console.log('[Login] Clerk sign-in result:', {
        status: signInResult.status,
        supportedFirstFactors: signInResult.supportedFirstFactors,
      });

      // ============================================
      // CHECK LOGIN STATUS
      // ============================================
      if (signInResult.status === 'complete') {
        // ✅ Login successful: credentials verified, session created
        await setActive({ session: signInResult.createdSessionId });

        // Initialize backend profile to prevent 403 errors on dashboard
        try {
          await API.post('/api/accounts/initialize-profile/', {});
          console.log('[Login] Backend profile synced');
        } catch (syncErr) {
          console.warn('[Login] Profile sync warning:', syncErr);
        }

        setErrorMsg('✅ Login successful! Redirecting...');
        setTimeout(() => navigate('/', { replace: true }), 1500);
        return;
      }

      // ============================================
      // ACCOUNT NOT FULLY VERIFIED
      // ============================================
      // If account needs email verification, ask user to complete signup first
      if (signInResult.status === 'needs_first_factor') {
        setErrorMsg(
          'Your account requires email verification. Please complete signup first.'
        );
        setTimeout(() => navigate('/signup', { replace: true }), 2000);
        return;
      }

      // ============================================
      // UNEXPECTED STATUS - LOGIN FAILED
      // ============================================
      setErrorMsg(
        `Login failed (status: ${signInResult.status}). ` +
        'Please check your credentials and try again.'
      );

    } catch (error) {
      // ============================================
      // ERROR HANDLING - CLERK ERRORS
      // ============================================
      let serverMsg = 'Login failed. Please check your email and password.';
      let hasFieldError = false;

      if (error.errors && error.errors.length > 0) {
        const clerkError = error.errors[0];
        const code = clerkError.code || '';

        // Map Clerk error codes to user-friendly messages
        if (code === 'form_identifier_not_found' || code === 'form_identifier_invalid') {
          serverMsg = 'No account found with this email.';
          setEmailError('Email not found');
          hasFieldError = true;
        } else if (code === 'form_password_incorrect') {
          serverMsg = 'Invalid password. Please check and try again.';
          setPasswordError('Password is incorrect');
          hasFieldError = true;
        } else if (code === 'form_password_invalid') {
          serverMsg = 'Invalid password format.';
          setPasswordError('Invalid password');
          hasFieldError = true;
        } else if (code === 'rate_limited') {
          serverMsg = 'Too many login attempts. Please wait a few moments before trying again.';
        } else if (code === 'validation_error') {
          serverMsg = clerkError.message || 'Please check your credentials.';
        } else if (code === 'invalid_grant') {
          serverMsg = 'Email or password is incorrect.';
        } else {
          // Generic Clerk error
          serverMsg = clerkError.message || serverMsg;
        }
      } else if (!error.response && error.message) {
        // Network connectivity error
        if (error.message.includes('Network') || error.message.includes('Failed')) {
          serverMsg = 'Network error: Unable to connect to the server. Please check your internet connection.';
        } else {
          serverMsg = error.message || serverMsg;
        }
      }

      if (!hasFieldError) {
        setErrorMsg(serverMsg);
      } else {
        setErrorMsg(serverMsg);
      }

    } finally {
      setLoading(false);
    }
  };

  // Prevent form from showing while checking auth status
  if (!authLoaded || isSignedIn) {
    return (
      <div className="login-container">
        <video autoPlay muted loop className="background-video">
          <source src="background1.mp4" type="video/mp4" />
        </video>
      </div>
    );
  }

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
          <div className="form-heading">
            <h2>Login</h2>
          </div>
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
            <button 
              className="button" 
              type="submit" 
              disabled={loading || clerkLoading}
              style={{ color: 'white' }}
            >
              {loading || clerkLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="footer-text">
            Don't have an account?{" "}
            <span className="link-text" onClick={() => navigate("/signup")}>Signup</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

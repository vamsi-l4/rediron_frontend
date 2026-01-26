/**
 * Signup Component
 * 
 * Clerk-based user registration flow:
 * 1. User fills email, name, password
 * 2. signUp.create() - Creates account
 * 3. signUp.prepareEmailAddressVerification() - Sends OTP
 * 4. Redirects to /verify-email (NOT protected by auth guards)
 * 5. User verifies email code
 * 6. setActive() creates session AFTER email verification
 * 7. Redirects to /login
 * 
 * NO useEffect-based redirects here - form only handles user input
 * Router handles navigation based on authentication state
 * 
 * OLD LOGIC (COMMENTED):
 * - Used custom API endpoint: API.post('/api/accounts/signup/')
 * - Stored tokens in localStorage
 * - Manual session management
 * - All replaced with Clerk methods
 */

import React, { useState, useEffect } from 'react';
import './Login.css';
import { motion } from 'framer-motion';
// import API from './Api'; // COMMENTED OUT: Old API calls - replaced with Clerk
import { useSignUp } from '@clerk/clerk-react';
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
  const [clerkLoading, setClerkLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp, isLoaded } = useSignUp();

  useEffect(() => {
    // Wait for Clerk to load
    if (!isLoaded) {
      setClerkLoading(true);
    } else {
      setClerkLoading(false);
    }
  }, [isLoaded]);

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
    if (!isLoaded || !signUp) {
      setErrorMsg('Authentication service not ready. Please refresh and try again.');
      return;
    }

    setLoading(true);
    try {
      // ============================================
      // CLERK SIGNUP - STEP 1: CREATE ACCOUNT
      // ============================================
      // Create user account (does NOT verify email yet)
      const signUpResult = await signUp.create({
        emailAddress: email,
        password: password,
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' ') || 'User',
      });

      // ============================================
      // CLERK SIGNUP - STEP 2: TRIGGER EMAIL OTP
      // ============================================
      // After account creation, prepare email verification
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      
      // Store email for verification page
      localStorage.setItem('signupEmail', email);
      localStorage.setItem('signupUserId', signUpResult.id);
      
      // Redirect to email verification page (DO NOT call setActive yet)
      setErrorMsg('Account created! Check your email for verification code.');
      setTimeout(() => navigate('/verify-email'), 1500);
      return;

    } catch (error) {
      // ============================================
      // ERROR HANDLING FOR CLERK
      // ============================================
      let serverMsg = 'Signup failed.';
      
      if (error.errors && error.errors.length > 0) {
        // Clerk error format
        const clerkError = error.errors[0];
        if (clerkError.code === 'form_email_exists') {
          serverMsg = 'Email already exists. Please use a different email or login.';
          setEmailError('Email already registered');
        } else if (clerkError.code === 'form_password_pwned') {
          serverMsg = 'Password is too common. Please choose a stronger password.';
          setPasswordError('Password is too weak');
        } else if (clerkError.code === 'form_password_invalid') {
          serverMsg = 'Password does not meet requirements.';
          setPasswordError('Password too weak');
        } else if (clerkError.code === 'form_identifier_invalid') {
          serverMsg = 'Invalid email address.';
          setEmailError('Invalid email');
        } else if (clerkError.code === 'rate_limited') {
          serverMsg = 'Too many attempts. Please wait a moment before trying again.';
        } else {
          serverMsg = clerkError.message || serverMsg;
        }
      } else if (!error.response && error.message) {
        // Network error
        serverMsg = 'Network error: Unable to connect to server. Please check your connection.';
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
                disabled={clerkLoading}
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
                disabled={clerkLoading}
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
                disabled={clerkLoading}
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
            <button 
              className="button" 
              type="submit" 
              disabled={loading || clerkLoading}
            >
              {loading || clerkLoading ? 'Signing up...' : 'Signup'}
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

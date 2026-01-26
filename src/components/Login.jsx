/**
 * Login Component
 * 
 * Clerk-based authentication flow:
 * 1. User fills email and password
 * 2. signIn.create() - Initiates login
 * 3. Check status:
 *    - If 'needs_first_factor': OTP required (normal)
 *    - If 'complete': Direct login (rare)
 * 4. If OTP needed: Redirect to /verify-otp
 * 5. User verifies OTP code
 * 6. signIn.attemptFirstFactor() - Verifies OTP
 * 7. setActive() creates session AFTER OTP verification
 * 8. Redirect to dashboard
 * 
 * NO useEffect-based redirects here - form only handles user input
 * Router handles navigation based on authentication state
 * 
 * OLD LOGIC (COMMENTED):
 * - Used custom API endpoint: API.post('/api/accounts/login/')
 * - Stored tokens in localStorage
 * - Manual session management
 * - All replaced with Clerk methods
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignIn, useAuth } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'react-feather';
// import API from './Api'; // COMMENTED OUT: Old API calls - replaced with Clerk
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
    // FIX: PREVENT INFINITE LOOP
    // ============================================
    // If user is already signed in, redirect to dashboard immediately
    // This prevents "Session already exists" error from repeated signIn() calls
    if (authLoaded && isSignedIn) {
      navigate('/');
      return;
    }

    // Wait for Clerk to load
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
    if (!isLoaded || !signIn) {
      setErrorMsg('Authentication service not ready. Please refresh and try again.');
      return;
    }

    setLoading(true);
    try {
      // ============================================
      // CLERK LOGIN - STEP 1: CREATE SIGN-IN
      // ============================================
      // Create sign-in session with email/password
      const signInResult = await signIn.create({
        identifier: email,
        password: password,
      });

      // ============================================
      // CLERK LOGIN - STEP 2: CHECK IF OTP NEEDED
      // ============================================
      if (signInResult.status === 'needs_first_factor') {
        // ============================================
        // OTP REQUIRED - SEND TO OTP PAGE
        // ============================================
        // Clerk automatically triggers OTP sending
        // Store sign-in ID for verification
        localStorage.setItem('loginSignInId', signInResult.id);
        localStorage.setItem('loginEmail', email);

        setErrorMsg('OTP sent to your email. Please verify.');
        setTimeout(() => navigate('/verify-otp'), 1500);
        return;
      }

      // ============================================
      // NO OTP NEEDED - ACTIVATE SESSION
      // ============================================
      if (signInResult.status === 'complete') {
        await setActive({ session: signInResult.createdSessionId });
        setErrorMsg('Login successful! Redirecting...');
        setTimeout(() => navigate('/'), 1500);
        return;
      }

      setErrorMsg('Login failed. Please try again.');

      // COMMENTED OUT: Old login logic
      // const response = await API.post('/api/accounts/login/', { email, password });
      // if (response.data && response.data.message) {
      //   localStorage.setItem('email', email);
      //   setTimeout(() => navigate('/verify-otp'), 3000);
      //   return;
      // }
    } catch (error) {
      // ============================================
      // ERROR HANDLING FOR CLERK
      // ============================================
      let serverMsg = 'Login failed. Check email/password.';
      
      if (error.errors && error.errors.length > 0) {
        // Clerk error format
        const clerkError = error.errors[0];
        if (clerkError.code === 'form_identifier_not_found') {
          serverMsg = 'No account found with this email.';
          setEmailError('Email not found');
        } else if (clerkError.code === 'form_password_incorrect') {
          serverMsg = 'Invalid password. Please check and try again.';
          setPasswordError('Password is incorrect');
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
                disabled={clerkLoading}
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
            <div className="options-row">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  disabled={clerkLoading}
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
            >
              {loading || clerkLoading ? 'Logging in...' : 'Login'}
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

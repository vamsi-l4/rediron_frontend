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
    if (authLoaded && isSignedIn) {
      navigate('/', { replace: true });
      return;
    }

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
      const signInResult = await signIn.create({
        identifier: email.trim(),
        password: password,
      });

      if (signInResult.status === 'complete') {
        await setActive({ session: signInResult.createdSessionId });

        try {
          await API.post('/api/accounts/initialize-profile/', {});
        } catch (syncErr) {
          console.warn('[Login] Profile sync warning:', syncErr);
        }

        setErrorMsg('✅ Login successful! Redirecting...');
        setTimeout(() => navigate('/', { replace: true }), 1500);
        return;
      }

      if (signInResult.status === 'needs_first_factor') {
        setErrorMsg(
          'Your account requires email verification. Please complete signup first.'
        );
        setTimeout(() => navigate('/signup', { replace: true }), 2000);
        return;
      }

      setErrorMsg(
        `Login failed (status: ${signInResult.status}). ` +
        'Please check your credentials and try again.'
      );

    } catch (error) {
      let serverMsg = 'Login failed. Please check your email and password.';
      let hasFieldError = false;

      if (error.errors && error.errors.length > 0) {
        const clerkError = error.errors[0];
        const code = clerkError.code || '';

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
          serverMsg = clerkError.message || serverMsg;
        }
      } else if (!error.response && error.message) {
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
          <div className="auth-form-heading">
            <img src="/logo.png" alt="RedIron Logo" className="auth-logo" />
            <h2>Welcome Back</h2>
            <p className="auth-form-subtitle">Sign in to your account</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="auth-input-group">
              <Mail className="auth-input-icon" size={18} />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                required
                className={emailError ? 'auth-input-error' : ''}
              />
              {emailError && <p className="auth-field-error">{emailError}</p>}
            </div>
            <div className="auth-input-group">
              <Lock className="auth-input-icon" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                required
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
            {errorMsg && <p className="auth-global-error">{errorMsg}</p>}
            <div className="auth-options-row">
              <label className="auth-remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                />
                <span>Remember Me</span>
              </label>
              <label>
                <span className="auth-forgot-password">Forgot password?</span>
              </label>
            </div>
            <button 
              className="auth-submit-btn" 
              type="submit" 
              disabled={loading || clerkLoading}
              style={{ color: 'white' }}
            >
              {loading || clerkLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="auth-footer-text">
            Don't have an account?{" "}
            <span className="auth-link-text" onClick={() => navigate("/signup")}>Signup</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

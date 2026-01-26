/**
 * VerifyEmail Component
 * 
 * Email verification after signup:
 * 1. User receives 6-digit code via email
 * 2. User enters code on this page
 * 3. signUp.attemptEmailAddressVerification() - Verifies code
 * 4. setActive() - Creates session AFTER verification
 * 5. Redirect to /login (user now needs to login)
 * 
 * NO useEffect-based redirects based on auth state
 * Only timer useEffect for resend countdown
 * 
 * Page is PUBLIC - no authentication required
 * ProtectedRoute does NOT wrap this page
 * 
 * Resend functionality:
 * - Calls signUp.prepareEmailAddressVerification() again
 * - Sends new code to email
 * - Cooldown: 60 seconds between resends
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignUp } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'react-feather';
import './Login.css';

const VerifyEmail = () => {
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const navigate = useNavigate();
  const { signUp, isLoaded, setActive } = useSignUp();

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setCodeError('');

    if (!code.trim()) {
      setCodeError('Verification code is required');
      return;
    }

    if (!/^\d{6}$/.test(code.trim())) {
      setCodeError('Code must be 6 digits');
      return;
    }

    if (!isLoaded || !signUp) {
      setErrorMsg('Service not ready. Please refresh and try again.');
      return;
    }

    setLoading(true);
    try {
      // ============================================
      // CLERK EMAIL VERIFICATION
      // ============================================
      // Verify email using the code sent by Clerk
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: code.trim(),
      });

      if (completeSignUp.status === 'complete') {
        // ============================================
        // NOW activate session after successful verification
        // ============================================
        await setActive({ session: completeSignUp.createdSessionId });

        // Clear signup session data
        localStorage.removeItem('signupEmail');
        localStorage.removeItem('signupUserId');

        setErrorMsg('Email verified successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1500);
        return;
      }

      setErrorMsg('Verification failed. Please try again.');
    } catch (error) {
      let serverMsg = 'Verification failed. Please check your code.';

      if (error.errors && error.errors.length > 0) {
        const clerkError = error.errors[0];
        if (clerkError.code === 'form_code_invalid') {
          serverMsg = 'Invalid verification code. Please try again.';
          setCodeError('Invalid code');
        } else if (clerkError.code === 'code_expired') {
          serverMsg = 'Code expired. Please request a new one.';
        } else if (clerkError.code === 'rate_limited') {
          serverMsg = 'Too many attempts. Please wait a moment.';
        } else {
          serverMsg = clerkError.message || serverMsg;
        }
      }

      setErrorMsg(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!isLoaded || !signUp) {
      setErrorMsg('Service not ready. Please refresh and try again.');
      return;
    }

    setResendLoading(true);
    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setErrorMsg('Verification code resent! Check your email.');
      setResendCountdown(60); // 60 second cooldown
    } catch (error) {
      setErrorMsg('Failed to resend code. Please try again.');
    } finally {
      setResendLoading(false);
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
            Verify Your <span className="logo-text">Email</span>
          </h2>
          <p style={{ marginTop: '-10px', marginBottom: '20px', fontSize: '14px', color: '#999' }}>
            Enter the 6-digit code we sent to your email
          </p>

          <form onSubmit={handleVerify}>
            <div className="input-group">
              <Mail className="input-icon" size={18} />
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                  if (codeError) setCodeError('');
                }}
                maxLength="6"
                required
                className={codeError ? 'error' : ''}
                disabled={loading}
              />
              {codeError && <p className="field-error">{codeError}</p>}
            </div>

            {errorMsg && <p className={errorMsg.includes('success') || errorMsg.includes('resent') ? 'success' : 'error'}>{errorMsg}</p>}

            <button
              className="button"
              type="submit"
              disabled={loading || !code}
              style={{ marginTop: '20px' }}
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          {/* Resend Button */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#999', marginBottom: '10px' }}>
              Didn't receive a code?
            </p>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading || resendCountdown > 0}
              style={{
                background: 'transparent',
                border: 'none',
                color: resendCountdown > 0 ? '#666' : '#00d4ff',
                cursor: resendCountdown > 0 ? 'default' : 'pointer',
                textDecoration: 'underline',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend Code'}
            </button>
          </div>

          {/* Back to Login */}
          <div style={{ marginTop: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
            <ArrowLeft size={16} style={{ color: '#999' }} />
            <button
              type="button"
              onClick={() => navigate('/login')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#999',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '14px',
              }}
            >
              Back to login
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyEmail;

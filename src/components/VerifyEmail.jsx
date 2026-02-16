/**
 * ============================================
 * VERIFY EMAIL COMPONENT - SIGNUP ONLY
 * ============================================
 * 
 * Email Verification After Signup
 * 
 * CLERK FLOW:
 * 1. User receives 6-digit OTP code in email
 * 2. User enters code on this page
 * 3. signUp.attemptEmailAddressVerification() - Verifies code
 * 4. If successful:
 *    - Session created automatically
 *    - Backend profile initialized
 *    - Redirect to login with success message
 * 
 * SIGNUP-ONLY FLOW (Simplified):
 * - No more dual-mode (signup vs login verification)
 * - Login uses email+password only (no OTP)
 * - Email verification is ONLY for signup
 * - This page is NOT protected by authentication
 * 
 * Resend Functionality:
 * - signUp.prepareEmailAddressVerification() sends new code
 * - 60-second cooldown between resends
 * - Code expires in 24 hours
 * 
 * ============================================
 * OLD LOGIN OTP FLOW (REMOVED)
 * ============================================
 * 
 * DEPRECATED APPROACH (NO LONGER USED):
 * Used to support login with email OTP:
 * - signIn.prepareFirstFactor({ strategy: 'email_code' })
 * - Supported 'needs_first_factor' status in login
 * 
 * REMOVED BECAUSE:
 * - Login now email+password only (more standard)
 * - Simplifies authentication state management
 * - Better security: password-based vs OTP-based
 * - Reduces complexity and potential attack vectors
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignUp } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'react-feather';
import API from './Api';
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

  // ============================================
  // COUNTDOWN TIMER FOR RESEND BUTTON
  // ============================================
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

    if (!isLoaded) {
      setErrorMsg('Service not ready. Please refresh and try again.');
      return;
    }

    setLoading(true);
    try {
      // ============================================
      // SIGNUP EMAIL VERIFICATION (ONLY FLOW)
      // ============================================
      if (!signUp) {
        setErrorMsg('Signup service not ready. Please refresh and try again.');
        setLoading(false);
        return;
      }

      // Verify the email code
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: code.trim(),
      });

      console.log('[VerifyEmail] SignUp verification attempt:', {
        status: completeSignUp.status,
      });

      if (completeSignUp.status === 'complete') {
        // ✅ Email verified successfully
        // Create session immediately
        await setActive({ session: completeSignUp.createdSessionId });
        
        console.log('[VerifyEmail] ✅ Email verified, session created');

        // ============================================
        // INITIALIZE BACKEND PROFILE
        // ============================================
        // Now that email is verified, initialize backend profile
        try {
          const syncResponse = await API.post('/api/accounts/initialize-profile/', {});
          console.log('[VerifyEmail] ✅ Backend profile initialized:', syncResponse.data);
        } catch (syncErr) {
          console.warn('[VerifyEmail] ⚠️ Failed to initialize profile:', syncErr.message);
          // Non-fatal: user can still proceed even if profile init fails
        }

        setErrorMsg('✅ Email verified! Redirecting to dashboard...');
        setTimeout(() => navigate('/', { replace: true }), 1500);
        return;
      }

      // Not complete - something went wrong
      setErrorMsg('Verification failed. Please try again.');

    } catch (error) {
      let serverMsg = 'Verification failed. Please check your code.';

      if (error.errors && error.errors.length > 0) {
        const clerkError = error.errors[0];
        const errCode = clerkError.code || '';

        if (errCode === 'form_code_invalid' || errCode === 'verification_failed') {
          serverMsg = 'Invalid verification code. Please try again.';
          setCodeError('Invalid code');
        } else if (errCode === 'code_expired' || errCode === 'form_code_expired') {
          serverMsg = 'Code expired. Please request a new one.';
        } else if (errCode === 'rate_limited') {
          serverMsg = 'Too many attempts. Please wait a moment before trying again.';
        } else {
          serverMsg = clerkError.message || serverMsg;
        }
      } else if (!error.response && error.message) {
        // Network error
        if (error.message.includes('Network') || error.message.includes('Failed')) {
          serverMsg = 'Network error: Unable to connect. Please check your connection.';
        } else {
          serverMsg = error.message || serverMsg;
        }
      }

      setErrorMsg(serverMsg);

    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!isLoaded) {
      setErrorMsg('Service not ready. Please refresh and try again.');
      return;
    }

    setResendLoading(true);
    try {
      if (!signUp) {
        setErrorMsg('Signup service not ready.');
        setResendLoading(false);
        return;
      }

      // ============================================
      // RESEND EMAIL VERIFICATION CODE
      // ============================================
      // This will send a new 6-digit code to the user's email
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      
      setErrorMsg('✅ Verification code resent! Check your email.');
      setResendCountdown(60); // 60-second cooldown
      setCode(''); // Clear input for new code

    } catch (error) {
      const serverMsg = error.message || 'Failed to resend code. Please try again.';
      setErrorMsg(serverMsg);
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
          <div className="form-heading">
            <h2>Verify Email</h2>
            <p className="form-subtitle">Enter the 6-digit code sent to your email</p>
          </div>

          <form onSubmit={handleVerify} className="auth-form">
            <div className="input-group">
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  type="text"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                    if (codeError) setCodeError('');
                  }}
                  maxLength="6"
                  required
                  className={codeError ? 'error' : ''}
                  disabled={loading}
                  inputMode="numeric"
                />
              </div>
              {codeError && <p className="field-error">{codeError}</p>}
            </div>

            {errorMsg && (
              <div className={`message-box ${errorMsg.includes('✅') || errorMsg.includes('resent') ? 'success' : 'error'}`}>
                {errorMsg}
              </div>
            )}

            <button
              className="form-button"
              type="submit"
              disabled={loading || !code}
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          {/* Resend Button */}
          <div className="verify-actions">
            <p className="verify-label">Didn't receive a code?</p>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading || resendCountdown > 0}
              className="resend-button"
            >
              {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend Code'}
            </button>
          </div>

          {/* Back to Signup */}
          <div className="verify-footer">
            <button
              type="button"
              onClick={() => navigate('/signup', { replace: true })}
              className="back-button"
            >
              <ArrowLeft size={14} />
              Back to sign up
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyEmail;

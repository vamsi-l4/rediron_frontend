/**
 * VerifyOtp Component
 * 
 * OTP verification after login:
 * 1. User receives 6-digit OTP via email
 * 2. User enters OTP on this page
 * 3. signIn.attemptFirstFactor() - Verifies OTP
 * 4. setActive() - Creates session AFTER verification
 * 5. Redirect to dashboard
 * 
 * NO useEffect-based redirects based on auth state
 * Page is PUBLIC - no authentication required
 * ProtectedRoute does NOT wrap this page
 * 
 * Session ID stored in localStorage during login:
 * - loginSignInId: Used to verify the OTP
 * - loginEmail: For display/reference
 * Both cleared after successful OTP verification
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSignIn } from "@clerk/clerk-react";
import "./Login.css";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [prepared, setPrepared] = useState(false);
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();
  const { signIn, isLoaded, setActive } = useSignIn();

  const validateOtp = () => {
    if (!otp.trim()) {
      setOtpError("OTP is required");
      return false;
    }
    if (!/^\d{6}$/.test(otp.trim())) {
      setOtpError("OTP must be 6 digits");
      return false;
    }
    setOtpError("");
    return true;
  };

  // Auto-prepare (send) the email code when the page loads and Clerk signIn is ready
  useEffect(() => {
    let mounted = true;
    const signInId = localStorage.getItem('loginSignInId');
    if (!signInId) {
      setMessage('Session expired. Please login again.');
      return;
    }

    if (!isLoaded || !signIn) return;

    if (prepared) return;

    const doPrepare = async () => {
      setSending(true);
      try {
        await signIn.update({ id: signInId });
        await signIn.prepareFirstFactor({ strategy: 'email_code' });
        if (!mounted) return;
        setPrepared(true);
        setMessage('OTP sent to ' + (localStorage.getItem('loginEmail') || 'your email'));
      } catch (err) {
        // Non-fatal: show a helpful message but allow manual resend
        if (!mounted) return;
        setMessage('Unable to auto-send code. Use Resend if you did not receive it.');
      } finally {
        if (mounted) setSending(false);
      }
    };

    doPrepare();

    return () => { mounted = false; };
  }, [isLoaded, signIn, prepared]);

  const handleResend = async () => {
    const signInId = localStorage.getItem('loginSignInId');
    if (!signInId) {
      setMessage('Session expired. Please login again.');
      setTimeout(() => navigate('/login'), 1200);
      return;
    }

    if (!isLoaded || !signIn) {
      setMessage('Authentication service not ready. Please refresh and try again.');
      return;
    }

    setSending(true);
    try {
      await signIn.update({ id: signInId });
      await signIn.prepareFirstFactor({ strategy: 'email_code' });
      setPrepared(true);
      setMessage('OTP resent to ' + (localStorage.getItem('loginEmail') || 'your email'));
    } catch (err) {
      setMessage('Unable to resend code. Please try again later.');
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage("");
    setOtpError("");

    if (!validateOtp()) return;

    setLoading(true);
    try {
      // ============================================
      // CLERK OTP VERIFICATION - STEP 1
      // ============================================
      // Retrieve the sign-in session ID from localStorage
      const signInId = localStorage.getItem('loginSignInId');
      if (!signInId) {
        setMessage('Session expired. Please login again.');
        setTimeout(() => navigate('/login'), 1500);
        return;
      }

      // Load the existing sign-in session
      await signIn.update({ id: signInId });

      // Ensure the first-factor is prepared (this will send the email code if needed)
      try {
        await signIn.prepareFirstFactor({ strategy: 'email_code' });
      } catch (prepErr) {
        // prepareFirstFactor may already have been triggered by Clerk; ignore non-fatal errors
      }

      // Attempt verification with the provided code
      const response = await signIn.attemptFirstFactor({
        strategy: 'email_code',
        code: otp,
      });

      // ============================================
      // CLERK OTP VERIFICATION - STEP 2: CHECK STATUS
      // ============================================
      if (response.status === 'complete') {
        // ============================================
        // SESSION ESTABLISHMENT FIX:
        // Validate sessionId and await setActive() completion
        // This ensures Clerk session is FULLY established
        // ============================================
        if (!response.createdSessionId) {
          setMessage('Session creation failed. Please try again.');
          setLoading(false);
          return;
        }
        
        try {
          await setActive({ session: response.createdSessionId });
          console.log('[VerifyOtp] ✅ Session activated successfully');
        } catch (sessionErr) {
          console.error('[VerifyOtp] ❌ Failed to activate session:', sessionErr);
          setMessage('Failed to establish session. Please try again.');
          setLoading(false);
          return;
        }
        
        setMessage('OTP verified successfully!');
        
        // Clean up localStorage
        localStorage.removeItem('loginSignInId');
        localStorage.removeItem('loginEmail');
        
        // Give Clerk time to finish session initialization
        setTimeout(() => {
          console.log('[VerifyOtp] Redirecting to dashboard after session established');
          navigate('/');
        }, 600);
        return;
      }

      setMessage('OTP verification failed. Please try again.');
    } catch (err) {
      // ============================================
      // ERROR HANDLING - CLERK OTP ERRORS
      // ============================================
      let errorMsg = 'OTP verification failed';

      if (err.errors && err.errors.length > 0) {
        // Handle Clerk-specific errors
        const clerkError = err.errors[0].message;
        if (clerkError.includes('Incorrect code')) {
          errorMsg = 'Incorrect OTP. Please try again.';
        } else if (clerkError.includes('expired')) {
          errorMsg = 'OTP expired. Please request a new one.';
        } else {
          errorMsg = clerkError;
        }
      } else if (!err.response) {
        errorMsg = 'Network error: Unable to connect. Please check your connection.';
      } else if (err.response?.status === 500) {
        errorMsg = 'Server error: Service temporarily unavailable. Please try again later.';
      } else {
        errorMsg = err.response?.data?.error || err.response?.data?.detail || errorMsg;
      }

      setMessage(errorMsg);

      // ============================================
      // OLD ERROR HANDLING (COMMENTED OUT)
      // ============================================
      /* Old error handling for API
      let errorMsg = "Verification failed";
      if (!err.response) {
        errorMsg = "Network error: Unable to connect to server. Please check your connection.";
      } else if (err.response.status === 500) {
        errorMsg = "Server error: Service temporarily unavailable. Please try again later.";
      } else if (err.response.status === 429) {
        errorMsg = "Too many attempts. Please wait a moment before trying again.";
      } else {
        errorMsg = err.response?.data?.error || err.response?.data?.detail || errorMsg;
      }
      setMessage(errorMsg);
      */
    } finally {
      setLoading(false);
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
          <h2>Verify Email</h2>
          <form className="otp-form" onSubmit={handleVerify}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter the verification code sent to email"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                  setOtp(value);
                  if (otpError) setOtpError('');
                }}
                maxLength={6}
                required
                className={otpError ? 'error' : ''}
                autoFocus
              />
              {otpError && <p className="field-error">{otpError}</p>}
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
            <div style={{ marginTop: 10, display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center' }}>
              <button type="button" onClick={handleResend} disabled={sending} style={{ padding: '8px 12px', background: 'transparent', color: '#e53935', border: '1px solid rgba(229,57,53,0.15)', borderRadius: 6, cursor: 'pointer' }}>
                {sending ? 'Sending...' : 'Resend code'}
              </button>
            </div>
            {message && (
              <p className={message === "Email verified successfully" ? "success" : "error"}>
                {message}
              </p>
            )}
          </form>
          <p className="footer-text">
            Back to <span onClick={() => navigate("/login")}>Login</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyOtp;

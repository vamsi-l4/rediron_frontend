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

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSignIn } from "@clerk/clerk-react";
import "./Login.css";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const navigate = useNavigate();
  const { signIn, setActive } = useSignIn();

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

      // Prepare the sign-in session for OTP verification
      const response = await signIn.attemptFirstFactor({
        strategy: 'email_code',
        code: otp,
      });

      // ============================================
      // CLERK OTP VERIFICATION - STEP 2: CHECK STATUS
      // ============================================
      if (response.status === 'complete') {
        // ============================================
        // OTP VERIFIED - ACTIVATE SESSION
        // ============================================
        await setActive({ session: response.createdSessionId });
        setMessage('OTP verified successfully!');
        
        // Clean up localStorage
        localStorage.removeItem('loginSignInId');
        localStorage.removeItem('loginEmail');
        
        setTimeout(() => navigate('/'), 1500);
        return;
      }

      setMessage('OTP verification failed. Please try again.');

      // ============================================
      // OLD OTP VERIFICATION LOGIC (COMMENTED OUT)
      // ============================================
      /* Replaced with Clerk verification
      const res = await API.post("/api/accounts/verify-otp/", { email, otp });
      if (res.data.access) {
        localStorage.setItem("accessToken", res.data.access);
        if (res.data.refresh) {
          localStorage.setItem("refreshToken", res.data.refresh);
        }
        login(res.data.access);
        setMessage("OTP verified successfully");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setMessage("Verification failed");
      }
      */
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

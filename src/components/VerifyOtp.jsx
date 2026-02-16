/**
 * ============================================
 * DEPRECATED: VerifyOtp Component
 * ============================================
 * 
 * This component is NO LONGER USED
 * 
 * REASON FOR DEPRECATION:
 * - Login now uses email + password only (no OTP)
 * - Email verification happens during SIGNUP only
 * - Clerk handles both flows securely
 * 
 * OLD FLOW (REMOVED):
 * - Login with email + password
 * - If account not fully verified: trigger email OTP
 * - User enters OTP on /verify-otp page
 * - Session created after OTP verification
 * 
 * NEW FLOW:
 * 1. SIGNUP: Email + Name + Password → Clerk creates account
 * 2. Email verification OTP sent → /verify-email
 * 3. User verifies email code
 * 4. Session created → Dashboard
 * 
 * 5. LOGIN: Email + Password only
 * 6. Clerk verifies credentials
 * 7. Session created → Dashboard
 * 8. Backend profile initialized
 * 
 * NO LOGIN OTP NEEDED
 * 
 * Route /verify-otp has been removed from App.js
 * This file kept for interview/reference purposes only.
 */

import React from 'react';

/**
 * DEPRECATED COMPONENT - DO NOT USE
 * 
 * If you're seeing this component rendered, it means:
 * 1. Someone tried to navigate to /verify-otp (disabled route)
 * 2. Or there's a broken redirect pointing here
 * 
 * Required action: Redirect to login instead
 */
const VerifyOtp = () => {
  React.useEffect(() => {
    // Auto-redirect to login
    window.location.href = '/login';
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      color: '#fff',
      fontSize: '18px',
      fontFamily: 'Arial, sans-serif',
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ marginBottom: '20px' }}>Redirecting...</h1>
        <p>The OTP verification page is no longer used.</p>
        <p>Please use the regular login page at <strong>/login</strong></p>
      </div>
    </div>
  );
};

export default VerifyOtp;

// ============================================
// OLD IMPLEMENTATION (COMMENTED FOR REFERENCE)
// ============================================
// KEPT FOR INTERVIEW/REFERENCE PURPOSES ONLY
// 
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { useSignIn } from "@clerk/clerk-react";
// import "./Login.css";
//
// const VerifyOtp = () => {
//   const [otp, setOtp] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [otpError, setOtpError] = useState("");
//   const [prepared, setPrepared] = useState(false);
//   const [sending, setSending] = useState(false);
//   const navigate = useNavigate();
//   const { signIn, isLoaded, setActive } = useSignIn();
//
//   const validateOtp = () => {
//     if (!otp.trim()) {
//       setOtpError("OTP is required");
//       return false;
//     }
//     if (!/^\d{6}$/.test(otp.trim())) {
//       setOtpError("OTP must be 6 digits");
//       return false;
//     }
//     setOtpError("");
//     return true;
//   };
//
//   useEffect(() => {
//     let mounted = true;
//     const signInId = localStorage.getItem('loginSignInId');
//     if (!signInId) {
//       setMessage('Session expired. Please login again.');
//       return;
//     }
//
//     if (!isLoaded || !signIn) return;
//
//     if (prepared) return;
//
//     const doPrepare = async () => {
//       setSending(true);
//       try {
//         await signIn.update({ id: signInId });
//         await signIn.prepareFirstFactor({ strategy: 'email_code' });
//         if (!mounted) return;
//         setPrepared(true);
//         setMessage('OTP sent to ' + (localStorage.getItem('loginEmail') || 'your email'));
//       } catch (err) {
//         if (!mounted) return;
//         setMessage('Unable to auto-send code. Use Resend if you did not receive it.');
//       } finally {
//         if (mounted) setSending(false);
//       }
//     };
//
//     doPrepare();
//
//     return () => { mounted = false; };
//   }, [isLoaded, signIn, prepared]);
//
//   const handleResend = async () => {
//     const signInId = localStorage.getItem('loginSignInId');
//     if (!signInId) {
//       setMessage('Session expired. Please login again.');
//       setTimeout(() => navigate('/login'), 1200);
//       return;
//     }
//
//     if (!isLoaded || !signIn) {
//       setMessage('Authentication service not ready. Please refresh and try again.');
//       return;
//     }
//
//     setSending(true);
//     try {
//       await signIn.update({ id: signInId });
//       await signIn.prepareFirstFactor({ strategy: 'email_code' });
//       setPrepared(true);
//       setMessage('OTP resent to ' + (localStorage.getItem('loginEmail') || 'your email'));
//     } catch (err) {
//       setMessage('Unable to resend code. Please try again later.');
//     } finally {
//       setSending(false);
//     }
//   };
//
//   const handleVerify = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setOtpError("");
//
//     if (!validateOtp()) return;
//
//     setLoading(true);
//     try {
//       const signInId = localStorage.getItem('loginSignInId');
//       if (!signInId) {
//         setMessage('Session expired. Please login again.');
//         setTimeout(() => navigate('/login'), 1500);
//         return;
//       }
//
//       await signIn.update({ id: signInId });
//
//       try {
//         await signIn.prepareFirstFactor({ strategy: 'email_code' });
//       } catch (prepErr) {
//         // Ignore non-fatal errors
//       }
//
//       const response = await signIn.attemptFirstFactor({
//         strategy: 'email_code',
//         code: otp,
//       });
//
//       if (response.status === 'complete') {
//         await setActive({ session: response.createdSessionId });
//         localStorage.removeItem('loginSignInId');
//         localStorage.removeItem('loginEmail');
//         setMessage('OTP verified! Redirecting...');
//         setTimeout(() => navigate('/'), 1500);
//         return;
//       }
//
//       setMessage('Verification failed. Please try again.');
//
//     } catch (error) {
//       let serverMsg = 'Verification failed. Please try again.';
//
//       if (error.errors && error.errors.length > 0) {
//         const clerkError = error.errors[0];
//         if (clerkError.code === 'form_code_invalid') {
//           serverMsg = 'Invalid OTP. Please try again.';
//           setOtpError('Invalid OTP');
//         } else if (clerkError.code === 'code_expired') {
//           serverMsg = 'OTP expired. Please request a new one.';
//         }
//       }
//
//       setMessage(serverMsg);
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   return (
//     <div className="login-container">
//       <video autoPlay muted loop className="background-video">
//         <source src="background1.mp4" type="video/mp4" />
//       </video>
//       <div className="login-form-wrapper">
//         <motion.div
//           className="form-content"
//           initial={{ opacity: 0, y: -60 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7 }}
//         >
//           <h2>Verify OTP</h2>
//           <form onSubmit={handleVerify}>
//             <div className="input-group">
//               <input
//                 type="text"
//                 placeholder="Enter 6-digit OTP"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
//                 maxLength="6"
//                 disabled={loading}
//               />
//               {otpError && <p className="field-error">{otpError}</p>}
//             </div>
//             {message && <p style={{ color: message.includes('success') ? '#4ade80' : '#ef4444' }}>{message}</p>}
//             <button type="submit" disabled={loading} style={{ marginTop: '20px' }}>
//               {loading ? 'Verifying...' : 'Verify OTP'}
//             </button>
//           </form>
//           <button
//             type="button"
//             onClick={handleResend}
//             disabled={sending}
//             style={{
//               marginTop: '10px',
//               background: 'transparent',
//               border: 'none',
//               color: '#00d4ff',
//               cursor: 'pointer',
//               textDecoration: 'underline',
//             }}
//           >
//             {sending ? 'Resending...' : 'Resend OTP'}
//           </button>
//         </motion.div>
//       </div>
//     </div>
//   );
// };
//
// export default VerifyOtp;

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

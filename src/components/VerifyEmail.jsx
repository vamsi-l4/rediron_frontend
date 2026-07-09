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
      if (!signUp) {
        setErrorMsg('Signup service not ready. Please refresh and try again.');
        setLoading(false);
        return;
      }

      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: code.trim(),
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });

        try {
          await API.post('/api/accounts/sync-user-after-signup/', {});
        } catch (syncErr) {
          console.warn('[VerifyEmail] ⚠️ Failed to initialize profile:', syncErr.message);
        }

        setErrorMsg('✅ Email verified! Redirecting to dashboard...');
        setTimeout(() => navigate('/', { replace: true }), 1500);
        return;
      }

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

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      
      setErrorMsg('✅ Verification code resent! Check your email.');
      setResendCountdown(60);
      setCode('');

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
            <div className="auth-input-group">
              <Mail className="auth-input-icon" size={18} />
              <input
                type="text"
                placeholder="000000"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                  if (codeError) setCodeError('');
                }}
                maxLength={6}
                required
                className={codeError ? 'auth-input-error' : ''}
                disabled={loading}
                inputMode="numeric"
              />
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

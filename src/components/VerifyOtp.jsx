import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [email] = useState(localStorage.getItem('email') || '');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/verify-otp/', {
        email,
        otp,
      });

      setMessage(res.data.success);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Verification failed');
    }
  };

  return (
    <div className="login-container">
      <form className="glass-card" onSubmit={handleVerify}>
        <h2>Enter OTP</h2>
        <input
          type="text"
          placeholder="Enter the OTP sent to email"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="submit">Verify OTP</button>
        {message && (
          <p className={message === 'OTP verified successfully' ? 'success' : 'error'}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default VerifyOtp;

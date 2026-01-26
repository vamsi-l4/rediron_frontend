import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { UserDataProvider } from '../contexts/UserDataContext';

/**
 * ProtectedRoute Component
 * 
 * Protects routes that require authentication.
 * Only renders children if user is signed in.
 * Redirects to /login if not signed in.
 * 
 * IMPORTANT: 
 * - Wraps children with UserDataProvider so profile is only loaded on protected routes
 * - This prevents unnecessary API calls on public pages
 * - DO NOT use on public auth pages (/login, /signup, /verify-email, /verify-otp)
 */
const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();

  // Show loading state while Clerk initializes
  if (!isLoaded) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      }}>
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <p style={{ fontSize: '18px', marginBottom: '10px' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // If not signed in, redirect to login
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render children wrapped in UserDataProvider
  // This ensures profile data is only loaded when on protected routes
  return <UserDataProvider>{children}</UserDataProvider>;
};

export default ProtectedRoute;


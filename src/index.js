import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

const clerkPublishableKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error('Missing Clerk Publishable Key. Add REACT_APP_CLERK_PUBLISHABLE_KEY to .env');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ClerkProvider publishableKey={clerkPublishableKey}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ClerkProvider>
);

reportWebVitals();

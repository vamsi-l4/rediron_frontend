# Authentication Guide

This guide explains the authentication flow for the RedIron frontend application.

## Overview

The authentication system uses JWT tokens with OTP verification for user accounts. Users must verify their email before they can fully access the application.

## Login Flow

### For Unverified Users
1. User enters email and password
2. POST request to `/api/accounts/login/` with credentials
3. Backend sends OTP to user's email
4. Frontend displays message and redirects to OTP verification page
5. User enters OTP on `/verify-otp` page
6. POST request to `/api/accounts/verify-otp/` with email and OTP
7. If successful, user receives access and refresh tokens
8. User is logged in and redirected to homepage

### For Verified Users
1. User enters email and password
2. POST request to `/api/accounts/login/` with credentials
3. Backend validates credentials and returns access/refresh tokens directly
4. User is logged in immediately and redirected to homepage

## API Endpoints

### Login
- **Endpoint**: `POST /api/accounts/login/`
- **Body**: `{ "email": "user@example.com", "password": "password" }`
- **Responses**:
  - Unverified user: `{ "message": "OTP sent to your email" }`
  - Verified user: `{ "access": "jwt_token", "refresh": "refresh_token" }`
  - Error: `{ "error": "Invalid credentials" }`

### OTP Verification
- **Endpoint**: `POST /api/accounts/verify-otp/`
- **Body**: `{ "email": "user@example.com", "otp": "123456" }`
- **Response**: `{ "access": "jwt_token", "refresh": "refresh_token" }`

### Token Refresh
- **Endpoint**: `POST /api/accounts/refresh/`
- **Body**: `{ "refresh": "refresh_token" }`
- **Response**: `{ "access": "new_jwt_token" }`

## Frontend Implementation

### Login Component
The `Login.jsx` component handles the initial login attempt. It checks the response from the login endpoint:

- If `response.data.access` exists, the user is verified and logged in directly
- If `response.data.message` exists, the user needs OTP verification

### AuthContext
The `AuthContext` manages authentication state and provides login/logout functionality. It stores tokens in localStorage and handles token refresh automatically.

### API Interceptor
The API client (`Api.jsx`) automatically adds the access token to requests (except public endpoints) and handles token refresh on 401 responses.

## Security Notes

- Tokens are stored in localStorage
- Public endpoints are defined in the API interceptor to skip authorization
- Token refresh is handled automatically on API calls
- Invalid tokens redirect users to login page
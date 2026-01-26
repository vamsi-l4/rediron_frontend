# RedIron Frontend - React Application

A production-ready React application for the RedIron fitness platform with Clerk authentication integration.

## Project Overview

RedIron is a comprehensive fitness platform that combines a gym management system with an e-commerce shop for fitness supplements. The frontend is built with React 19 and uses Clerk for authentication.

## Key Features

- **Clerk Authentication**: Secure user authentication with email verification
- **Responsive Design**: Mobile-first approach with responsive UI components
- **Protected Routes**: Role-based access control for authenticated users
- **User Profile Management**: Users can manage their profile information and images
- **Shop Integration**: Browse and purchase fitness supplements
- **Content Management**: Articles, workouts, nutrition guides, and more

## Architecture

### Frontend Stack
- React 19.1.0
- React Router 7.6.3
- Clerk React (@clerk/clerk-react 5.0.0)
- Axios for API requests
- CSS3 with responsive design

### Key Components

**Authentication & Protected Routes:**
- `AuthProvider`: Manages Clerk authentication context
- `ProtectedRoute`: Restricts access to authenticated users
- `TokenInitializer`: Initializes Clerk JWT tokens for API requests

**User Management:**
- `UserDataProvider`: Provides user profile data to protected routes
- `UserDataContext`: Context for user profile information
- `Profile.jsx`: User profile management page

**Navigation:**
- `Navbar.jsx`: Main navigation (uses Clerk's useUser hook)
- `ShopNavbar.jsx`: Shop navigation (uses Clerk's useUser hook)
- `Header.jsx`: Shop header component

### Authentication Flow

1. User signs up with email via Clerk
2. Email verification required
3. Login with credentials
4. Clerk JWT token attached to API requests
5. Backend validates token and creates/updates user profile
6. User can access protected routes and update profile

## API Integration

All API requests include Clerk JWT tokens in the Authorization header:
```
Authorization: Bearer <clerk_jwt_token>
```

The API layer (`Api.jsx`) automatically:
- Attaches Clerk tokens to authenticated requests
- Handles 401 errors (missing/invalid token)
- Retries on network errors with exponential backoff
- Provides debug logging in development

## Development

### Start Development Server
```bash
npm start
```
Runs on http://localhost:3000 (or 3001 if port is in use)

### Build for Production
```bash
npm run build
```
Creates optimized production build in `/build` folder

### Environment Configuration

The application automatically detects environment based on hostname:
- **Development** (localhost): Uses http://127.0.0.1:8000 for API
- **Production**: Uses process.env.REACT_APP_API_BASE_URL or Render backend

## Important Implementation Details

### No Backend Profile Calls on Public Pages
- `UserDataProvider` is ONLY inside `ProtectedRoute`
- Public pages (Home, Login, Signup) do NOT call profile API
- Prevents infinite redirect loops and 403 errors

### Navbar Avatar Display
- Uses Clerk's `useUser()` hook directly
- No backend API calls needed
- Shows user's first name and profile image from Clerk
- Displays immediately without loading state

### Profile Page
- Only accessible to authenticated users (inside ProtectedRoute)
- Uses `UserDataContext` to fetch profile data
- Shows profile information and allows updates
- Handles 403 on new users by creating profile on backend

## Error Handling

- **401 Unauthorized**: Rejected without redirect (component handles gracefully)
- **403 Forbidden**: Handled in UserDataContext (attempts to create profile for new users)
- **Network Errors**: Automatically retried with exponential backoff
- **SSL/Protocol Errors**: Logged and handled appropriately

## Code Quality

- No commented-out code
- No unnecessary imports
- Clean component structure
- Production-ready error handling
- Proper authentication guards
- No infinite loop vulnerabilities
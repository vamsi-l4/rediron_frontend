# RedIron Frontend

This is a React application for the RedIron project.

## Changes Made

The following changes have been made to the codebase:

- **Fixed Signup Issue:** The signup functionality was failing with a 400 Bad Request error. This was due to a mismatch between the frontend and backend expectations for the user's name field. The frontend was sending `name`, while the backend was expecting `username`. This has been fixed by updating the `Signup.jsx` component to send `username` instead of `name`.

- **Updated Profile Component:** The `Profile.jsx` component was also updated to use `username` instead of `name` when displaying and updating the user's profile information.

- **Reviewed Other Components:** Other components such as `Login.jsx`, `App.js`, `AuthContext.js`, `UserDataContext.js`, and `UserProfile.jsx` were reviewed to ensure that they were not negatively affected by the change. No changes were needed in these files.

- **Removed Commented Out Code:** Commented out code was removed from `App.js` to improve readability.
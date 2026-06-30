# RedIron Frontend

React frontend for RedIron Fitness, a dual-mode gym and ecommerce experience. The app includes workout and exercise content, nutrition articles, performance tools, user profiles, shop browsing, cart, checkout, wishlist, and order history.

## Tech Stack

- React 18 and React Router
- Clerk for authentication and email verification
- Axios API client with Clerk token injection
- CSS modules/files per page and component
- Lucide and React Feather icons

## Main Areas

- `src/components/` - Gym site, auth, articles, exercises, profile, shared layout
- `src/pages/` - Shop pages such as home, category, product, cart, checkout, orders
- `src/ShopComponents/` - Shop-specific reusable cards, header/footer, cart items
- `src/contexts/` - Auth, user data, and gym/shop mode state
- `src/lib/` - Cart, wishlist, and API helper utilities
- `public/` - Logos, auth media, static exercise/shop assets

## Authentication

Signup, login, and email verification are handled by Clerk. After Clerk creates a session, the frontend initializes the backend profile through `/api/accounts/initialize-profile/`. API requests automatically attach the Clerk token for protected endpoints.

Clerk email templates should be branded in the Clerk Dashboard as RedIron Fitness so verification emails no longer use the default “Login App” wording.

## Shop Flow

The shop supports product browsing, cart management, checkout, and order history. Cash on Delivery is currently the active payment method. Card and UPI options are intentionally disabled in the checkout UI until Razorpay credentials and payment verification are ready.

## Environment

Create `.env.local`:

```bash
REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_xxx
REACT_APP_API_BASE_URL=http://127.0.0.1:8000
```

## Local Development

```bash
npm install
npm start
```

The app runs at `http://localhost:3000`.

## Production Build

```bash
npm run build
```

Deploy the generated `build/` folder to Netlify or another static host. Configure redirects with `public/_redirects` so React Router routes work after refresh.

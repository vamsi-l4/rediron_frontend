# RedIron Frontend

RedIron Frontend is the React single-page application for the RedIron fitness and ecommerce platform. It provides the public gym website, authenticated training content, user profile flows, RedIron Coach AI screens, and the complete shop experience for browsing products, managing carts, checking out, and reviewing orders.

## Project Overview

The frontend is designed as a premium, dark-themed fitness experience with fast navigation, reusable UI sections, and responsive layouts for mobile, tablet, and desktop users. It communicates with the Django REST API for content, user data, shop data, checkout, profile initialization, and AI-powered coaching features.

## Purpose

- Present RedIron as a modern gym and fitness commerce brand.
- Serve educational content for workouts, exercises, nutrition, and articles.
- Support authenticated user journeys such as profile management and protected training pages.
- Provide ecommerce flows for category browsing, product discovery, wishlist, cart, checkout, and order history.
- Integrate cleanly with the backend API while keeping frontend secrets out of the repository.

## Features

- Public gym landing pages, equipment pages, trainer sections, contact pages, and brand content.
- Protected article, workout, exercise, profile, and coach routes.
- Shop homepage, categories, subcategories, product details, search, offers, reviews, wishlist, cart, checkout, and order history.
- Responsive premium dark UI with red accent styling.
- Reusable layout, navigation, cards, forms, badges, dropdowns, pagination, and shop components.
- API client with authenticated request support and production backend fallback.
- Static assets for banners, workout imagery, exercise images, product imagery, and auth screens.
- Animation support through React transitions and motion libraries.

## Architecture

The application is built with Create React App and React Router. Routes are declared centrally in `src/App.js`, while feature UI is grouped by domain:

- Gym and training experiences live mostly in `src/components/`.
- Ecommerce page-level routes live in `src/pages/`.
- Shop-specific reusable UI lives in `src/ShopComponents/`.
- Shared app state lives in `src/contexts/`.
- API and browser utilities live in `src/components/Api.jsx`, `src/lib/`, `src/utils/`, and `src/coach/lib/`.
- Static public files live in `public/`; imported React assets live in `src/assets/`.

## Folder Structure

```text
rediron_frontend/
  public/
    assets/              Static images and exercise media served directly
    img/                 Article, trainer, and marketing images
    _redirects           Netlify SPA routing configuration
    index.html           HTML shell
  src/
    assets/              Imported images used by React components
    coach/               RedIron Coach AI pages, widgets, API helpers, and styles
    components/          Gym site, auth, articles, exercises, profile, and shared layout
    components/ui/       Reusable UI primitives
    contexts/            Auth, mode, and user data providers
    hooks/               Reusable React hooks
    lib/                 Cart, wishlist, and utility helpers
    pages/               Shop and legal page routes
    ShopComponents/      Shop-specific reusable components
    utils/               Authentication and integration helpers
    App.js               Route map and application composition
    index.js             React entry point
```

## Technology Stack

- React
- React Router
- Axios
- Framer Motion
- Lucide React
- React Icons
- Recharts
- CSS files organized by page/component
- Create React App build tooling

## UI Architecture

The UI uses a professional dark premium theme: black and charcoal surfaces, red brand accents, high-contrast text, compact reusable controls, and content-first layouts. Pages are structured around reusable components rather than one-off markup, so cards, navigation, forms, product displays, profile sections, and shop widgets can be maintained consistently.

The design philosophy is:

- Keep the first screen useful and brand-forward.
- Use dark, polished surfaces suited to a fitness and commerce product.
- Keep repeated UI patterns predictable.
- Keep mobile layouts usable without losing content.
- Favor reusable components and scoped CSS files over scattered inline styling.

## Routing

Routing is handled by `react-router-dom` in `src/App.js`.

Main route groups:

- `/` - Gym homepage.
- `/equipment`, `/equipment/:type`, `/equipment/:category/:id` - Equipment discovery and detail pages.
- `/articles/*`, `/workouts/*`, `/exercise-videos`, `/exercises/:slug` - Protected training and content routes.
- `/profile`, `/coach-ai/*` - Protected user and coaching routes.
- `/shop`, `/shop-categories/:category`, `/shop-subcategories/:categorySlug`, `/shop-products/:id` - Shop browsing.
- `/shop-carts`, `/shop-checkout`, `/shop-orders`, `/shop-wishlist` - Shop account and checkout flows.
- `/shop/privacy`, `/shop/terms`, `/shop/refund` - Policy pages.
- `/login`, `/signup`, `/verify-email` - Authentication screens.

`ProtectedRoute` wraps authenticated sections. Netlify route refresh support is handled by `public/_redirects`.

## State Management

State is managed with React state, React context, browser storage, and API-backed data loading.

- `AuthContext` mirrors the active signed-in state for application UI.
- `UserDataContext` stores profile-related user data used across account views.
- `ModeContext` tracks gym/shop mode behavior.
- `shopCart.js` and `shopWishlist.js` provide local cart and wishlist utilities.
- Page-level components fetch API data directly where the data is specific to that page.

## Backend Integration

The frontend talks to the Django REST API through Axios. The shared API client in `src/components/Api.jsx` sets the base URL, attaches authenticated request headers for protected endpoints, retries transient failures, and exposes helper functions for user-facing API errors.

Production defaults point to the deployed backend, while local development can override the API origin through environment variables.

## Responsive Design

The interface is built with responsive CSS using flexible grids, media queries, stable spacing, and mobile-specific layout rules. Shop pages, auth pages, content sections, product cards, checkout steps, and profile views are designed to remain usable across phones, tablets, and desktop screens.

## Pages

- `src/pages/` contains ecommerce and policy pages.
- `src/components/` contains gym, article, workout, auth, and profile pages.
- `src/coach/pages/` contains RedIron Coach AI page composition.

## Components

Reusable components are organized by domain:

- Global layout: `Layout`, `Navbar`, `Footer`.
- Content: article cards, article detail views, workout sections, exercise cards, trainer sections.
- Auth: login, signup, email verification, protected routing.
- Shop: product cards, category menus, filters, loaders, banners, reviews, pagination, cart items.
- UI primitives: buttons, inputs, badges, dropdown menus.

## Layouts

The app uses shared layout wrappers for the gym experience and standalone layouts for shop pages where the ecommerce navigation and footer differ from the gym site.

## Hooks

`src/hooks/useProfileInitializer.js` contains profile initialization behavior used after authentication. Additional reusable logic should be added to `src/hooks/` when it is shared across multiple components.

## Utilities

- `src/components/Api.jsx` - API client and request helpers.
- `src/lib/shopCart.js` - Cart persistence helpers.
- `src/lib/shopWishlist.js` - Wishlist persistence helpers.
- `src/lib/utils.js` - Shared UI/data utilities.
- `src/utils/` - Authentication integration helpers.
- `src/coach/lib/coachApi.js` - Coach API helper functions.

## Assets

Static assets are split between:

- `public/` for files referenced by URL at runtime.
- `public/assets/` and `public/img/` for directly served media.
- `src/assets/` for images imported into React modules.

Do not remove assets unless a full reference scan confirms they are unused.

## Animations

Animations are implemented with CSS transitions/keyframes and motion libraries where appropriate. The visual style favors polished, restrained movement that supports navigation, loading, and premium presentation without overwhelming the core workflows.

## Project Setup

### Requirements

- Node.js
- npm

### Installation

```bash
npm install
```

### Development Server

```bash
npm start
```

The local development server runs at:

```text
http://localhost:3000
```

### Production Build

```bash
npm run build
```

The optimized production output is generated in `build/`.

## Environment Variables

Create a local environment file for development. Use variable names only in documentation and never commit real values.

```text
REACT_APP_API_BASE_URL
REACT_APP_DEBUG
REACT_APP_RAZORPAY_KEY_ID
```

The authentication publishable key is also required for authenticated builds and should be configured privately in the deployment environment.

## Deployment

The frontend is intended for Netlify deployment.

- Build command: `npm run build`
- Publish directory: `build`
- SPA redirects: `public/_redirects`
- Runtime configuration: Netlify environment variables

The deployed frontend should point to the deployed backend API through `REACT_APP_API_BASE_URL`.

## Future Improvements

- Add automated route smoke tests for the main gym and shop paths.
- Add component-level tests for checkout, cart, wishlist, and profile flows.
- Centralize repeated shop API loading patterns into reusable hooks.
- Add generated API type documentation once the backend schema is published.
- Add visual regression checks for key responsive breakpoints.

## Contributing

1. Create a feature branch.
2. Keep changes focused and avoid unrelated formatting churn.
3. Run `npm run build` before opening a pull request.
4. Do not commit `.env`, `build/`, `node_modules/`, logs, screenshots, or temporary files.
5. Document any new environment variable names without values.

## License

License information is not yet specified. Add the final project license before public distribution.

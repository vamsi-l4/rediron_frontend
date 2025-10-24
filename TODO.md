yes and my components folder files also i want to work both local and my deploy site ok 
# Refactor Shop Pages to Use Centralized API

## Overview
Refactor all shop pages to use the centralized `API` from `Api.jsx` instead of hardcoded `API_BASE` and direct `fetch()` calls. This ensures consistent authentication, token refresh, and environment flexibility.

## Files to Refactor
- [x] src/pages/Home.jsx
- [x] src/pages/Category.jsx
- [x] src/pages/ProductDetail.jsx
- [x] src/pages/Search.jsx
- [x] src/pages/Cart.jsx
- [ ] src/pages/Checkout.jsx
- [ ] src/pages/OrderHistory.jsx
- [ ] src/pages/Offers.jsx
- [ ] src/pages/Blog.jsx
- [x] src/pages/BlogDetail.jsx
- [ ] src/pages/Accessories.jsx
- [ ] src/pages/Apparel.jsx
- [ ] src/pages/Rewards.jsx
- [x] src/pages/FAQ.jsx
- [ ] src/pages/Contact.jsx
- [ ] src/pages/Dealer.jsx
- [ ] src/pages/Inquiry.jsx
- [ ] src/pages/Privacy.jsx
- [ ] src/pages/Terms.jsx

## Changes per File
- Import `API` from `../components/Api`
- Remove `const API_BASE = "http://localhost:8000/api";`
- Replace `fetch()` with `API.get()`, `API.post()`, etc.
- Adjust response handling: use `response.data` instead of `await res.json()`
- For POST/PATCH: use `API.post(url, data, config)` or `API.patch(url, data, config)`
- Ensure error handling uses `error.response?.data` or similar

## Followup
- Test shop functionality after refactoring
- Verify authentication works in shop mode
- Update environment variables if needed for deployment

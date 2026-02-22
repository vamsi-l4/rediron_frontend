import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { AuthProvider } from "./contexts/AuthContext";
import { UserDataProvider } from "./contexts/UserDataContext";
import { ModeProvider, ModeContext } from "./contexts/ModeContext";
import { setClerkGetToken } from "./components/Api";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// -------- Gym Components --------
import Homepage from "./components/Homepage";
import EquipmentList from "./components/EquipmentList";
import Contact from "./components/Contact";
import Login from "./components/Login";
import Signup from "./components/Signup";
import VerifyEmail from "./components/VerifyEmail";
// REMOVED: VerifyOtp - Login now uses email+password only (no OTP)
// import VerifyOtp from "./components/VerifyOtp";
import ArticlesLanding from "./components/ArticlesLanding";
import NutritionPage from "./components/NutritionPage";
import WorkoutsHub from "./components/WorkoutsHub";
import WorkoutRoutines from "./components/WorkoutRoutines";
import WorkoutTips from "./components/WorkoutTips";
import WorkoutFitness from "./components/WorkoutFitness";
import WorkoutExercises from "./components/WorkoutExercises";
import WorkoutArticles from "./components/WorkoutArticles";
import WorkoutDetail from "./components/WorkoutDetails";
import ExerciseDetail from "./components/ExerciseDetail";
import ArticleDetail from "./components/ArticleDetail";
import ArticleCard from "./components/ArticleCard";
import AboutUs from "./components/AboutUs";
import ProfileV2 from "./components/ProfileV2";
import Subscribe from "./components/Subscribe";

// -------- Performance Lab --------
import PerformanceLabPage from "./pages/PerformanceLab";

// -------- Shop Pages --------
import ShopHome from "./pages/Home";
import ShopCategory from "./pages/Category";
import ShopProductDetail from "./pages/ProductDetail";
import ShopCart from "./pages/Cart";
import ShopCheckout from "./pages/Checkout";
import ShopOrderHistory from "./pages/OrderHistory";
import ShopRewards from "./pages/Rewards";
import ShopBlog from "./pages/Blog";
import ShopBlogDetail from "./pages/BlogDetail";
import ShopContact from "./pages/Contact";
import ShopInquiry from "./pages/Inquiry";
import ShopDealer from "./pages/Dealer";
import ShopOffers from "./pages/Offers";
import ShopFAQ from "./pages/FAQ";
import ShopPrivacy from "./pages/Privacy";
import ShopTerms from "./pages/Terms";
import ShopRefund from "./pages/Refund";
import ShopNewsletter from "./pages/Newsletter";
import ShopNotFound from "./pages/NotFound";
import ShopSearch from "./pages/Search";
import ShopWishlist from "./pages/Wishlist";
import ShopUserProfile from "./pages/UserProfile";
import ShopReviews from "./pages/Reviews";
import ShopCoupons from "./pages/Coupons";
import ShopBrands from "./pages/Brands";
import ShopSubcategories from "./pages/Subcategories";
import ShopAbout from "./pages/About";

// ============================================
// TOKEN INITIALIZER - CLERK SETUP
// ============================================
// 
// PURPOSE:
// 1. Register Clerk's getToken() with API interceptor
// 2. Initialize backend user profile after login
// 
// FLOW:
// - When isSignedIn becomes true: set getToken
// - Call /api/accounts/initialize-profile/ once
// - Backend creates user profile if needed
// - Cache result in sessionStorage
// 
// NO infinite loops - guards prevent re-execution
// NO localStorage - only sessionStorage for this session

function TokenInitializer({ children }) {
  const { getToken, isSignedIn, isLoaded, sessionId } = useAuth();
  const [tokenSet, setTokenSet] = React.useState(false);

  // ============================================
  // STEP 1: Set Clerk's getToken when user signs in
  // ============================================
  React.useEffect(() => {
    if (isLoaded && isSignedIn && getToken && typeof getToken === 'function' && !tokenSet) {
      console.log('[TokenInit] ✅ Clerk session ready. Registering getToken with API.');
      setClerkGetToken(getToken);
      setTokenSet(true);
    } else if (isLoaded && !isSignedIn && tokenSet) {
      console.log('[TokenInit] User signed out. Clearing token.');
      setTokenSet(false);
    }
  }, [isLoaded, isSignedIn, getToken, tokenSet]);

  // ============================================
  // STEP 2: Initialize backend user profile
  // ============================================
  // Called once per session after token is set
  React.useEffect(() => {
    const initializeProfile = async () => {
      // Guard 1: User must be signed in
      if (!isSignedIn) return;
      
      // Guard 2: Token must be set
      if (!tokenSet) return;
      
      // Guard 3: Check if already initialized this session
      const profileInitKey = `profile_init_${sessionId}`;
      if (sessionStorage.getItem(profileInitKey)) {
        console.log('[TokenInit] Profile already initialized this session');
        return;
      }

      try {
        console.log('[TokenInit] Initializing backend profile...');
        const API = (await import('./components/Api')).default;
        
        const response = await API.post('/api/accounts/initialize-profile/');
        
        if (response.data.success) {
          console.log('[TokenInit] ✅ Profile initialized');
          sessionStorage.setItem(profileInitKey, 'true');
        }
      } catch (error) {
        if (error.response?.status === 401) {
          console.warn('[TokenInit] 401: Session expired');
        } else {
          console.error('[TokenInit] Profile init error:', error.message);
        }
      }
    };
    
    // Debounce to prevent excessive calls
    const timer = setTimeout(initializeProfile, 500);
    return () => clearTimeout(timer);
  }, [isSignedIn, tokenSet, sessionId]);

  return children;
}

function AppRoutes() {
  const { mode } = React.useContext(ModeContext);

  return (
    <Routes>
      {/* Public Pages */}
      <Route
        path="/"
        element={
          <Layout>
            <Homepage />
          </Layout>
        }
      />
      <Route
        path="/equipment"
        element={
          <Layout>
            <EquipmentList />
          </Layout>
        }
      />
      <Route
        path="/contact"
        element={
          <Layout>
            <Contact />
          </Layout>
        }
      />
      <Route
        path="/about"
        element={
          <Layout>
            <AboutUs />
          </Layout>
        }
      />

      {/* Public FAQ Page */}
      <Route
        path="/faq"
        element={
          <Layout>
            <ShopFAQ />
          </Layout>
        }
      />

      {/* Auth Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      {/* REMOVED: /verify-otp - Login now uses email+password only (no OTP) */}
      {/* <Route path="/verify-otp" element={<VerifyOtp />} /> */}

      {/* Subscribe */}
      <Route
        path="/subscribe"
        element={
          <Layout>
            <Subscribe />
          </Layout>
        }
      />

      {/* Private Pages */}
      <Route
        path="/articles"
        element={
          <ProtectedRoute>
            <Layout>
              <ArticlesLanding />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/articles/nutrition"
        element={
          <ProtectedRoute>
            <Layout>
              <NutritionPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/articles/workouts"
        element={
          <ProtectedRoute>
            <Layout>
              <WorkoutsHub />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/workouts/routines"
        element={
          <ProtectedRoute>
            <Layout>
              <WorkoutRoutines />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/workouts/tips"
        element={
          <ProtectedRoute>
            <Layout>
              <WorkoutTips />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/workouts/fitness"
        element={
          <ProtectedRoute>
            <Layout>
              <WorkoutFitness />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/workouts/exercises"
        element={
          <ProtectedRoute>
            <Layout>
              <WorkoutExercises />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/workouts/articles"
        element={
          <ProtectedRoute>
            <Layout>
              <WorkoutArticles />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/workout/:slug"
        element={
          <ProtectedRoute>
            <Layout>
              <WorkoutDetail />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/exercises/:slug"
        element={
          <ProtectedRoute>
            <Layout>
              <ExerciseDetail />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <ProfileV2 />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Performance Lab */}
      <Route
        path="/performance-lab"
        element={
          <ProtectedRoute>
            <Layout>
              <PerformanceLabPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Article Details */}
      <Route
        path="/article/:slug"
        element={
          <Layout>
            <ArticleDetail />
          </Layout>
        }
      />
      <Route
        path="/article-card"
        element={
          <Layout>
            <ArticleCard />
          </Layout>
        }
      />

      {/* Shop Pages - Only show when mode is "shop" */}
      {mode === "shop" && (
        <>
          <Route path="/shop" element={<ShopHome />} />
          <Route path="/shop-categories/:category" element={<ShopCategory />} />
          <Route path="/shop-products/:id" element={<ShopProductDetail />} />
          <Route path="/shop-carts" element={<ShopCart />} />
          <Route path="/shop-orders" element={<ShopOrderHistory />} />
          <Route path="/shop-checkout" element={<ShopCheckout />} />
          <Route path="/shop-rewards" element={<ShopRewards />} />
          <Route path="/shop-blogs" element={<ShopBlog />} />
          <Route path="/shop-blogs/:slug" element={<ShopBlogDetail />} />
          <Route path="/shop-contacts" element={<ShopContact />} />
          <Route path="/shop-business-inquiries" element={<ShopInquiry />} />
          <Route path="/shop-dealers" element={<ShopDealer />} />
          <Route path="/shop-coupons" element={<ShopOffers />} />
          <Route path="/shop-faqs" element={<ShopFAQ />} />
          <Route path="/shop/privacy" element={<ShopPrivacy />} />
          <Route path="/shop/terms" element={<ShopTerms />} />
          <Route path="/shop/refunds" element={<ShopRefund />} />
          <Route path="/shop-newsletter" element={<ShopNewsletter />} />
          <Route path="/shop-wishlist" element={<ShopWishlist />} />
          <Route path="/shop-userprofile" element={<ShopUserProfile />} />
          <Route path="/shop-reviews" element={<ShopReviews />} />
          <Route path="/shop-coupons" element={<ShopCoupons />} />
          <Route path="/shop-brands" element={<ShopBrands />} />
          <Route path="/shop-subcategories/:categorySlug" element={<ShopSubcategories />} />
          <Route path="/shop-about" element={<ShopAbout />} />
          <Route path="/shop-offers" element={<ShopOffers />} />
          <Route path="/shop-search" element={<ShopSearch />} />
          <Route path="/search" element={<ShopSearch />} />
          <Route path="/shop/*" element={<ShopNotFound />} />
        </>
      )}
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <UserDataProvider>
        <ModeProvider>
          <TokenInitializer>
            <AppRoutes />
          </TokenInitializer>
        </ModeProvider>
      </UserDataProvider>
    </AuthProvider>
  );
}

export default App;

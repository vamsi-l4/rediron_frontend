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
import VerifyOtp from "./components/VerifyOtp";
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
import Profile from "./components/Profile";
import Subscribe from "./components/Subscribe";

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
// Token Initializer Component
// ============================================
// This component initializes the Clerk token for API requests
// It must be inside ClerkProvider (via AuthProvider)
function TokenInitializer({ children }) {
  const { getToken, isSignedIn, isLoaded } = useAuth();

  React.useEffect(() => {
    console.log('[TokenInit] useEffect triggered:', { isLoaded, isSignedIn, hasGetToken: !!getToken, getTokenType: typeof getToken });
    
    if (getToken && typeof getToken === 'function') {
      console.log('[TokenInit] ✅ setClerkGetToken called with valid getToken function');
      setClerkGetToken(getToken);
      
      // Test if getToken works - always test to debug
      console.log('[TokenInit] Testing getToken()...');
      
      // First try without template
      getToken()
        .then(token => {
          console.log('[TokenInit] 🔑 getToken() without template:', !!token, token ? `${token.substring(0, 20)}...` : 'null');
        })
        .catch(err => {
          console.error('[TokenInit] ❌ Error getToken() without template:', err.message);
        });
      
      // Then try with template
      getToken({ template: 'integration_jwt' })
        .then(token => {
          console.log('[TokenInit] 🔑 getToken(template) returned:', !!token, token ? `${token.substring(0, 20)}...` : 'null');
        })
        .catch(err => {
          console.error('[TokenInit] ❌ Error getToken(template):', err.message);
        });
    } else {
      console.warn('[TokenInit] ⚠️ getToken is not available:', { isLoaded, isSignedIn, getTokenType: typeof getToken });
    }
  }, [getToken, isSignedIn, isLoaded]);

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

      {/* Auth Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />

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
              <Profile />
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

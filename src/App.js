import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import { AuthProvider } from "./contexts/AuthContext";
import { UserDataProvider } from "./contexts/UserDataContext";
import { ModeProvider } from "./contexts/ModeContext";
import { setClerkGetToken, setClerkUserInfo } from "./components/Api";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import "./pages/ShopTheme.css";

import Homepage from "./components/Homepage";
import EquipmentList from "./components/EquipmentList";
import EquipmentCategory from "./components/EquipmentCategory";
import Contact from "./components/Contact";
import Login from "./components/Login";
import Signup from "./components/Signup";
import VerifyEmail from "./components/VerifyEmail";
import ArticlesLanding from "./components/ArticlesLanding";
import NutritionPage from "./components/NutritionPage";
import WorkoutsHub from "./components/WorkoutsHub";
import WorkoutTips from "./components/WorkoutTips";
import WorkoutTipDetail from "./components/WorkoutTipDetail";
import WorkoutExercises from "./components/WorkoutExercises";
import WorkoutArticles from "./components/WorkoutArticles";
import FitnessArticles from "./components/FitnessArticles";
import FitnessArticleDetail from "./components/FitnessArticleDetail";
import ExerciseDetail from "./components/ExerciseDetail";
import ArticleDetail from "./components/ArticleDetail";
import ArticleCard from "./components/ArticleCard";
import AboutUs from "./components/AboutUs";
import Trainers from "./components/Trainers";
import ProfileV2 from "./components/ProfileV2";
import Subscribe from "./components/Subscribe";

import ShopHome from "./pages/Home";
import ShopCategory from "./pages/Category";
import ShopProductDetail from "./pages/ProductDetail";
import EquipmentDetail from "./pages/EquipmentDetail";
import ShopCart from "./pages/Cart";
import ShopCheckout from "./pages/Checkout";
import ShopOrderHistory from "./pages/OrderHistory";
import ShopRewards from "./pages/Rewards";
import ShopBlog from "./pages/Blog";
import ShopBlogDetail from "./pages/BlogDetail";
import ShopContact from "./pages/ShopContact";
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
import ShopReviews from "./pages/Reviews";
import ShopCoupons from "./pages/Coupons";
import ShopBrands from "./pages/Brands";
import ShopSubcategories from "./pages/Subcategories";
import ShopAbout from "./pages/ShopAbout";

const CoachAIPage = React.lazy(() => import("./coach/pages/CoachAIPage"));

function TokenInitializer({ children }) {
  const { getToken, isSignedIn, isLoaded, sessionId } = useAuth();
  const { user } = useUser();
  const [tokenSet, setTokenSet] = React.useState(false);

  React.useEffect(() => {
    if (isLoaded && isSignedIn && getToken && typeof getToken === 'function' && !tokenSet) {
      setClerkGetToken(getToken);
      setTokenSet(true);
    } else if (isLoaded && !isSignedIn && tokenSet) {
      setTokenSet(false);
      setClerkUserInfo(null);
    }
  }, [isLoaded, isSignedIn, getToken, tokenSet]);

  React.useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) {
      setClerkUserInfo(null);
      return;
    }
    setClerkUserInfo({
      email: user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress || "",
      name: user.fullName || [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || "",
    });
  }, [isLoaded, isSignedIn, user]);

  React.useEffect(() => {
    const initializeProfile = async () => {
      if (!isSignedIn) return;
      if (!tokenSet) return;

      const profileInitKey = `profile_init_${sessionId}`;
      if (sessionStorage.getItem(profileInitKey)) {
        return;
      }

      try {
        const API = (await import('./components/Api')).default;
        
        const response = await API.post('/api/accounts/initialize-profile/');
        
        if (response.data.success) {
          sessionStorage.setItem(profileInitKey, 'true');
        } else {
          console.warn('[TokenInit] Profile initialization returned unsuccessful response', response.data);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          console.warn('[TokenInit] 401: Session expired');
        } else {
          console.error('[TokenInit] Profile init error:', error.message);
        }
      }
    };
    const timer = setTimeout(initializeProfile, 500);
    return () => clearTimeout(timer);
  }, [isSignedIn, tokenSet, sessionId]);

  return children;
}

function AppRoutes() {
  return (
    <Routes>
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
        path="/equipment/:type"
        element={
          <Layout>
            <EquipmentCategory />
          </Layout>
        }
      />
      <Route
        path="/equipment/:category/:id"
        element={
          <Layout>
            <EquipmentDetail />
          </Layout>
        }
      />

      <Route
        path="/shop-products/:id"
        element={
          <ShopProductDetail />
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
      <Route
        path="/trainers"
        element={
          <Layout>
            <Trainers />
          </Layout>
        }
      />

      <Route
        path="/faq"
        element={
          <Layout>
            <ShopFAQ />
          </Layout>
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      <Route
        path="/subscribe"
        element={
          <Layout>
            <Subscribe />
          </Layout>
        }
      />

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
        path="/articles/fitness"
        element={
          <ProtectedRoute>
            <Layout>
              <FitnessArticles />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/articles/fitness/:slug"
        element={
          <ProtectedRoute>
            <Layout>
              <FitnessArticleDetail />
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
        path="/articles/workout-tips"
        element={
          <ProtectedRoute>
            <Layout>
              <WorkoutTips />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/articles/workout-tips/:slug"
        element={
          <ProtectedRoute>
            <Layout>
              <WorkoutTipDetail />
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
              <FitnessArticles />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/exercise-videos"
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

      <Route
        path="/coach-ai/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Suspense fallback={<div className="page-loading">Loading RedIron Coach AI...</div>}>
                <CoachAIPage />
              </Suspense>
            </Layout>
          </ProtectedRoute>
        }
      />

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

      <Route path="/shop" element={<ShopHome />} />
      <Route path="/shop-categories/:category" element={<ShopCategory />} />
      <Route path="/shop-carts" element={<ShopCart />} />
      <Route path="/shop-orders" element={<ShopOrderHistory />} />
      <Route path="/shop-checkout" element={<ShopCheckout />} />
      <Route path="/shop-rewards" element={<ShopRewards />} />
      <Route path="/shop-blogs" element={<ShopBlog />} />
      <Route path="/shop-blogs/:slug" element={<ShopBlogDetail />} />
      <Route path="/shop-contacts" element={<ShopContact />} />
      <Route path="/shop-business-inquiries" element={<ShopInquiry />} />
      <Route path="/shop-dealers" element={<ShopDealer />} />
      <Route path="/shop-coupons" element={<ShopCoupons />} />
      <Route path="/shop-faqs" element={<ShopFAQ />} />
      <Route path="/shop/privacy" element={<ShopPrivacy />} />
      <Route path="/shop/terms" element={<ShopTerms />} />
      <Route path="/shop/refund" element={<ShopRefund />} />
      <Route path="/shop-newsletter" element={<ShopNewsletter />} />
      <Route path="/shop-wishlist" element={<ShopWishlist />} />
      <Route path="/shop-userprofile" element={<ProfileV2 />} />
      <Route path="/shop-reviews" element={<ShopReviews />} />
      <Route path="/shop-about" element={<ShopAbout />} />
      <Route path="/shop-brands" element={<ShopBrands />} />
      <Route path="/shop-subcategories/:categorySlug" element={<ShopSubcategories />} />
      <Route path="/shop-offers" element={<ShopOffers />} />
      <Route path="/shop-search" element={<ShopSearch />} />
      <Route path="/search" element={<ShopSearch />} />
      <Route path="/shop/*" element={<ShopNotFound />} />
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

// import React, { useContext } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import { AuthContext, AuthProvider } from "./contexts/AuthContext";

// // -------- Components --------
// import Homepage from "./components/Homepage";
// import EquipmentList from "./components/EquipmentList";
// import Contact from "./components/Contact";
// import Login from "./components/Login";
// import Signup from "./components/Signup";
// import VerifyOtp from "./components/VerifyOtp";
// import ArticlesLanding from "./components/ArticlesLanding";
// import NutritionPage from "./components/NutritionPage";
// import WorkoutsHub from "./components/WorkoutsHub";
// import WorkoutRoutines from "./components/WorkoutRoutines";
// import WorkoutTips from "./components/WorkoutTips";
// import WorkoutFitness from "./components/WorkoutFitness";
// import WorkoutExercises from "./components/WorkoutExercises";
// import WorkoutArticles from "./components/WorkoutArticles";
// import WorkoutDetail from "./components/WorkoutDetails";
// import ExerciseDetail from "./components/ExerciseDetail";
// import ArticleDetail from "./components/ArticleDetail";
// import ArticleCard from "./components/ArticleCard";
// import AboutUs from "./components/AboutUs";
// import Profile from "./components/Profile";
// import Subscribe from "./components/Subscribe";

// function PrivateRoute({ children }) {
//   const { isAuthenticated } = useContext(AuthContext);
//   // Double check localStorage for accessToken
//   const hasToken = !!localStorage.getItem('accessToken');
//   return (isAuthenticated && hasToken) ? children : <Navigate to="/login" replace />;
// }

// function App() {
//   return (
//     <AuthProvider>
//       <Routes>
//         <Route path="/" element={<Homepage />} />
//         <Route path="/equipment" element={<EquipmentList />} />
//         <Route path="/contact" element={<Contact />} />

//         {/* Auth */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/verify-otp" element={<VerifyOtp />} />

//         {/* Subscribe */}
//         <Route path="/subscribe" element={<Subscribe />} />

//         {/* Articles */}
//         <Route
//           path="/articles"
//           element={
//             <PrivateRoute>
//               <ArticlesLanding />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/articles/nutrition"
//           element={
//             <PrivateRoute>
//               <NutritionPage />
//             </PrivateRoute>
//           }
//         />

//         {/* Workouts */}
//         <Route
//           path="/articles/workouts"
//           element={
//             <PrivateRoute>
//               <WorkoutsHub />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/workouts/routines"
//           element={
//             <PrivateRoute>
//               <WorkoutRoutines />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/workouts/tips"
//           element={
//             <PrivateRoute>
//               <WorkoutTips />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/workouts/fitness"
//           element={
//             <PrivateRoute>
//               <WorkoutFitness />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/workouts/exercises"
//           element={
//             <PrivateRoute>
//               <WorkoutExercises />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/workouts/articles"
//           element={
//             <PrivateRoute>
//               <WorkoutArticles />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/workout/:slug"
//           element={
//             <PrivateRoute>
//               <WorkoutDetail />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/exercises/:slug"
//           element={
//             <PrivateRoute>
//               <ExerciseDetail />
//             </PrivateRoute>
//           }
//         />

//         {/* Profile */}
//         <Route
//           path="/profile"
//           element={
//             <PrivateRoute>
//               <Profile />
//             </PrivateRoute>
//           }
//         />

//         {/* About */}
//         <Route path="/about" element={<AboutUs />} />

//         {/* Details */}
//         <Route path="/article/:slug" element={<ArticleDetail />} />
//         <Route path="/article-card" element={<ArticleCard />} />
//       </Routes>
//     </AuthProvider>
//   );
// }

// export default App;
import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext, AuthProvider } from "./contexts/AuthContext";
import { ModeProvider, ModeContext } from "./contexts/ModeContext";
import { UserDataProvider } from "./contexts/UserDataContext";
import Layout from "./components/Layout";

// -------- Gym Components --------
import Homepage from "./components/Homepage";
import EquipmentList from "./components/EquipmentList";
import Contact from "./components/Contact";
import Login from "./components/Login";
import Signup from "./components/Signup";
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
import ShopApparel from "./pages/Apparel";
import ShopAccessories from "./pages/Accessories";
import ShopSearch from "./pages/Search";

function PrivateRoute({ children }) {
  const { isAuthenticated } = useContext(AuthContext);
  const hasToken = !!localStorage.getItem("accessToken");
  return isAuthenticated && hasToken ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { mode } = useContext(ModeContext);

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
          <PrivateRoute>
            <Layout>
              <ArticlesLanding />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/articles/nutrition"
        element={
          <PrivateRoute>
            <Layout>
              <NutritionPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/articles/workouts"
        element={
          <PrivateRoute>
            <Layout>
              <WorkoutsHub />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/workouts/routines"
        element={
          <PrivateRoute>
            <Layout>
              <WorkoutRoutines />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/workouts/tips"
        element={
          <PrivateRoute>
            <Layout>
              <WorkoutTips />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/workouts/fitness"
        element={
          <PrivateRoute>
            <Layout>
              <WorkoutFitness />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/workouts/exercises"
        element={
          <PrivateRoute>
            <Layout>
              <WorkoutExercises />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/workouts/articles"
        element={
          <PrivateRoute>
            <Layout>
              <WorkoutArticles />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/workout/:slug"
        element={
          <PrivateRoute>
            <Layout>
              <WorkoutDetail />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/exercises/:slug"
        element={
          <PrivateRoute>
            <Layout>
              <ExerciseDetail />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Layout>
              <Profile />
            </Layout>
          </PrivateRoute>
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
          <Route path="/shop-apparel" element={<ShopApparel />} />
          <Route path="/shop-accessories" element={<ShopAccessories />} />
          <Route path="/shop-search" element={<ShopSearch />} />
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
          <AppRoutes />
        </ModeProvider>
      </UserDataProvider>
    </AuthProvider>
  );
}

export default App;

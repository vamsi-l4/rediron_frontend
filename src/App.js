import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import EquipmentList from "./components/EquipmentList";
import Contact from "./components/Contact";
import Login from "./components/Login";
import Signup from "./components/Signup";
import VerifyOtp from "./components/VerifyOtp";
import NutritionPage from "./components/NutritionPage";
import ArticleDetail from "./components/ArticleDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/equipment" element={<EquipmentList />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/articles" element={<NutritionPage />} />
      <Route path="/article/:id" element={<ArticleDetail />} />
    </Routes>
  );
}

export default App;

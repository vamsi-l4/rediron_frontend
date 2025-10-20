import React from "react";
import "./CategoryMenu.css";
import { Link, useLocation } from "react-router-dom";
// Example categories; adapt if your backend differs
const CATEGORIES = [
  { name: "Proteins", slug: "proteins" },
  { name: "Gainers", slug: "gainers" },
  { name: "Pre/Post Workout", slug: "pre-post-workout" },
  { name: "Ayurveda", slug: "ayurveda" },
  { name: "Fit Foods", slug: "fit-foods" },
  { name: "Vitamin Supplements", slug: "vitamin-supplements" },
  { name: "Fat Loss", slug: "fat-loss" },
  { name: "Accessories", slug: "fitness-accessories" },
  { name: "Apparel", slug: "apparel" }
];

const CategoryMenu = ({ direction = "horizontal" }) => {
  const loc = useLocation();
  // Extract category from path for active state
  const active = loc.pathname.split("/shop-categories/")[1]?.split("/")[0];

  return (
    <nav
      className={`categorymenu-main ${direction === "vertical" ? "vertical" : "horizontal"}`}
    >
      {CATEGORIES.map(cat => (
        <Link
          key={cat.slug}
          className={`categorymenu-link${active === cat.slug ? " active" : ""}`}
          to={`/shop-categories/${cat.slug}`}
        >
          {/* Optionally add category icon here */}
          {cat.name}
        </Link>
      ))}
    </nav>
  );
};

export default CategoryMenu;

import React, { useEffect, useState } from "react";
import "./CategoryMenu.css";
import { Link, useLocation } from "react-router-dom";
import API from "../components/Api";

const fallbackCategories = [
  { name: "Proteins", slug: "proteins" },
  { name: "Supplements", slug: "supplements" },
  { name: "Vitamins", slug: "vitamins" },
  { name: "Healthy Foods", slug: "healthy-foods" },
  { name: "Gym Wear", slug: "gym-wear" },
  { name: "Footwear", slug: "footwear" },
  { name: "Accessories", slug: "accessories" },
  { name: "Cardio Equipment", slug: "cardio" },
  { name: "Strength Equipment", slug: "strength" },
  { name: "Core Equipment", slug: "core" }
];

const CategoryMenu = ({ direction = "horizontal" }) => {
  const loc = useLocation();
  const active = loc.pathname.split("/shop-categories/")[1]?.split("/")[0];
  const [categories, setCategories] = useState(fallbackCategories);

  useEffect(() => {
    let cancelled = false;
    API.get("/api/shop-categories/")
      .then(res => {
        if (cancelled) return;
        const rows = res.data.results || res.data || [];
        if (rows.length) setCategories(rows);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return (
    <nav className={`categorymenu-main ${direction === "vertical" ? "vertical" : "horizontal"}`}>
      {categories.map(cat => (
        <Link
          key={cat.slug}
          className={`categorymenu-link${active === cat.slug ? " active" : ""}`}
          to={`/shop-categories/${cat.slug}`}
        >
          {cat.name}
        </Link>
      ))}
    </nav>
  );
};

export default CategoryMenu;

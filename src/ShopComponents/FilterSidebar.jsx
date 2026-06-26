import React, { useEffect, useMemo, useState } from "react";
import "./FilterSidebar.css";
import { RotateCcw, SlidersHorizontal, Star } from "lucide-react";

const DEFAULTS = {
  category: "",
  subcategory: "",
  brand: "",
  minPrice: "",
  maxPrice: "",
  discount: "",
  minRating: "",
  stock: "",
  tag: "",
  sort: "-rating"
};

const DISCOUNTS = [
  { label: "10% And Above", value: 10 },
  { label: "20% And Above", value: 20 },
  { label: "30% And Above", value: 30 }
];

const RATINGS = [
  { label: "4 & above", value: 4 },
  { label: "3 & above", value: 3 },
  { label: "2 & above", value: 2 }
];

const SORT_OPTIONS = [
  { label: "Newest", value: "-date_added" },
  { label: "Price Low To High", value: "price" },
  { label: "Price High To Low", value: "-price" },
  { label: "Top Rated", value: "-rating" },
  { label: "Popular", value: "popular" },
  { label: "Discount", value: "-discount_percent" }
];

const FilterSidebar = ({
  filters,
  onChange,
  categories = [],
  subcategories = [],
  brands = [],
  showCategory = true
}) => {
  const [local, setLocal] = useState({ ...DEFAULTS, ...(filters || {}) });

  useEffect(() => {
    setLocal({ ...DEFAULTS, ...(filters || {}) });
  }, [filters]);

  const visibleSubcategories = useMemo(() => {
    if (!local.category) return subcategories;
    return subcategories.filter(item => item.category_slug === local.category || String(item.category) === String(local.category));
  }, [local.category, subcategories]);

  const update = newVals => {
    const updated = { ...local, ...newVals };
    if (Object.prototype.hasOwnProperty.call(newVals, "category")) {
      updated.subcategory = "";
    }
    setLocal(updated);
    onChange(updated);
  };

  const reset = () => {
    setLocal(DEFAULTS);
    onChange(DEFAULTS);
  };

  return (
    <aside className="filtersidebar-main">
      <div className="filtersidebar-head">
        <h3><SlidersHorizontal size={17} /> Filters</h3>
        <button className="filtersidebar-reset" onClick={reset} type="button">
          <RotateCcw size={15} /> Reset
        </button>
      </div>

      <div className="filtersidebar-section">
        <div className="filtersidebar-label">Sort By</div>
        <select value={local.sort} onChange={e => update({ sort: e.target.value })}>
          {SORT_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {showCategory && (
        <div className="filtersidebar-section">
          <div className="filtersidebar-label">Category</div>
          <select value={local.category} onChange={e => update({ category: e.target.value })}>
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="filtersidebar-section">
        <div className="filtersidebar-label">Subcategory</div>
        <select value={local.subcategory} onChange={e => update({ subcategory: e.target.value })}>
          <option value="">All Subcategories</option>
          {visibleSubcategories.map(sub => (
            <option key={sub.id} value={sub.slug}>{sub.name}</option>
          ))}
        </select>
      </div>

      <div className="filtersidebar-section">
        <div className="filtersidebar-label">Brand</div>
        <select value={local.brand} onChange={e => update({ brand: e.target.value })}>
          <option value="">All Brands</option>
          {brands.map(brand => (
            <option key={brand.id} value={brand.slug}>{brand.name}</option>
          ))}
        </select>
      </div>

      <div className="filtersidebar-section">
        <div className="filtersidebar-label">Price Range</div>
        <div className="filtersidebar-row">
          <input
            type="number"
            placeholder="Min"
            value={local.minPrice}
            onChange={e => update({ minPrice: e.target.value })}
          />
          <span className="filtersidebar-to">to</span>
          <input
            type="number"
            placeholder="Max"
            value={local.maxPrice}
            onChange={e => update({ maxPrice: e.target.value })}
          />
        </div>
      </div>

      <div className="filtersidebar-section">
        <div className="filtersidebar-label">Rating</div>
        {RATINGS.map(rat => (
          <label className="filtersidebar-choice" key={rat.value} htmlFor={`rating${rat.value}`}>
            <input
              type="radio"
              id={`rating${rat.value}`}
              name="rating"
              value={rat.value}
              checked={String(local.minRating) === String(rat.value)}
              onChange={() => update({ minRating: rat.value })}
            />
            <span><Star size={14} fill="currentColor" /> {rat.label}</span>
          </label>
        ))}
      </div>

      <div className="filtersidebar-section">
        <div className="filtersidebar-label">Discount</div>
        {DISCOUNTS.map(disc => (
          <label className="filtersidebar-choice" key={disc.value} htmlFor={`discount${disc.value}`}>
            <input
              type="radio"
              id={`discount${disc.value}`}
              name="discount"
              value={disc.value}
              checked={String(local.discount) === String(disc.value)}
              onChange={() => update({ discount: disc.value })}
            />
            <span>{disc.label}</span>
          </label>
        ))}
      </div>

      <div className="filtersidebar-section">
        <div className="filtersidebar-label">Stock</div>
        <label className="filtersidebar-choice" htmlFor="stock">
          <input
            type="checkbox"
            id="stock"
            checked={local.stock === "true"}
            onChange={e => update({ stock: e.target.checked ? "true" : "" })}
          />
          <span>In stock only</span>
        </label>
      </div>

      <div className="filtersidebar-section">
        <div className="filtersidebar-label">Tags</div>
        <input
          type="text"
          placeholder="whey, running, shaker"
          value={local.tag}
          onChange={e => update({ tag: e.target.value })}
        />
      </div>
    </aside>
  );
};

export default FilterSidebar;

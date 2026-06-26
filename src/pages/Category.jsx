import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import './Category.css';

import Header from '../ShopComponents/Header';
import Footer from '../ShopComponents/Footer';
import ProductCard from '../ShopComponents/ProductCard';
import FilterSidebar from '../ShopComponents/FilterSidebar';
import Loader from '../ShopComponents/Loader';
import API from '../components/Api';

const DEFAULT_FILTERS = {
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

const Category = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categoryData, setCategoryData] = useState(null);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const activeSlug = category || filters.category || 'proteins';

  useEffect(() => {
    let cancelled = false;
    async function fetchMeta() {
      setLoading(true);
      try {
        const [catRes, subRes, brandRes] = await Promise.all([
          API.get('/api/shop-categories/'),
          API.get('/api/shop-subcategories/'),
          API.get('/api/shop-brands/')
        ]);
        if (cancelled) return;
        const catList = catRes.data.results || catRes.data || [];
        const subList = subRes.data.results || subRes.data || [];
        const brandList = brandRes.data.results || brandRes.data || [];
        setCategories(catList);
        setSubcategories(subList);
        setBrands(brandList);
        setCategoryData(catList.find(c => c.slug === activeSlug) || null);
        setFilters(prev => ({ ...prev, category: activeSlug }));
      } catch (error) {
        console.error('Error fetching category metadata:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchMeta();
    return () => { cancelled = true; };
  }, [activeSlug]);

  useEffect(() => {
    if (!filters.category) return;
    let cancelled = false;
    async function fetchProducts() {
      setProductsLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('category', filters.category);
        params.set('catalog', 'shop');
        params.set('page', page);

        if (filters.sort === 'popular') params.set('sort', 'popular');
        else params.set('ordering', filters.sort || '-rating');

        if (filters.subcategory) params.set('subcategory', filters.subcategory);
        if (filters.brand) params.set('brand', filters.brand);
        if (filters.minPrice) params.set('min_price', filters.minPrice);
        if (filters.maxPrice) params.set('max_price', filters.maxPrice);
        if (filters.discount) params.set('discount', filters.discount);
        if (filters.minRating) params.set('rating', filters.minRating);
        if (filters.stock) params.set('stock', filters.stock);
        if (filters.tag) params.set('tags', filters.tag);

        const prodRes = await API.get(`/api/shop-products/?${params.toString()}`);
        if (cancelled) return;
        const prodJson = prodRes.data;
        const rows = prodJson.results || prodJson || [];
        setProducts(rows);
        setTotalCount(prodJson.count || rows.length);
        setPageCount(prodJson.count ? Math.ceil(prodJson.count / 10) : 1);
      } catch (error) {
        console.error('Error fetching products:', error);
        if (!cancelled) {
          setProducts([]);
          setTotalCount(0);
          setPageCount(1);
        }
      } finally {
        if (!cancelled) setProductsLoading(false);
      }
    }
    fetchProducts();
    return () => { cancelled = true; };
  }, [filters, page]);

  const activeSubcategories = useMemo(() => (
    subcategories.filter(item => item.category_slug === activeSlug || String(item.category) === String(categoryData?.id))
  ), [activeSlug, categoryData?.id, subcategories]);

  const handleCategoryClick = (slug) => {
    setPage(1);
    setFilters(prev => ({ ...prev, ...DEFAULT_FILTERS, category: slug }));
    navigate(`/shop-categories/${slug}`);
  };

  const handleFilterChange = (updated) => {
    setPage(1);
    setFilters(updated);
    if (updated.category && updated.category !== activeSlug) {
      navigate(`/shop-categories/${updated.category}`);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="category-main rediron-theme">
      <Header />

      <div className="breadcrumb">
        <Link to="/shop">Home</Link>
        <span> / </span>
        <span className="current">{categoryData?.name || "Products"}</span>
      </div>

      <section className="category-hero">
        <div>
          <p className="category-kicker">RedIron Store</p>
          <h1>{categoryData?.name || "All Products"}</h1>
          <p>{categoryData?.description || "Premium fitness products curated for training, recovery, nutrition, and style."}</p>
        </div>
        <button className="mobile-filter-btn" type="button" onClick={() => setMobileFiltersOpen(true)}>
          <SlidersHorizontal size={18} /> Filters
        </button>
      </section>

      <section className="category-circle-section" aria-label="Shop categories">
        <div className="category-circle-row">
          {categories.map(cat => (
            <button
              type="button"
              key={cat.id}
              className={`category-circle-card ${cat.slug === activeSlug ? "active" : ""}`}
              onClick={() => handleCategoryClick(cat.slug)}
            >
              <span className="category-circle-img">
                {cat.image ? <img src={cat.image} alt="" loading="lazy" /> : <span>{cat.name.charAt(0)}</span>}
              </span>
              <strong>{cat.name}</strong>
              <small>{cat.product_count || 0} products</small>
            </button>
          ))}
        </div>
      </section>

      <div className="category-content">
        <div className="category-sidebar-desktop">
          <FilterSidebar
            filters={filters}
            onChange={handleFilterChange}
            categories={categories}
            subcategories={subcategories}
            brands={brands}
            showCategory
          />
        </div>

        <main className="category-products">
          <div className="category-toolbar">
            <div>
              <div className="category-title">{categoryData?.name || "Products"}</div>
              <div className="category-result-count">{totalCount} products found</div>
            </div>
            {activeSubcategories.length > 0 && (
              <div className="subcategory-pills">
                <button
                  type="button"
                  className={!filters.subcategory ? "active" : ""}
                  onClick={() => handleFilterChange({ ...filters, subcategory: "" })}
                >
                  All
                </button>
                {activeSubcategories.map(sub => (
                  <button
                    type="button"
                    key={sub.id}
                    className={filters.subcategory === sub.slug ? "active" : ""}
                    onClick={() => handleFilterChange({ ...filters, subcategory: sub.slug })}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {productsLoading ? (
            <div className="category-loading">Loading products...</div>
          ) : (
            <motion.div className="prod-grid" layout>
              {products.length === 0 ? (
                <div className="no-products">No products match your filters.</div>
              ) : (
                products.map(prod => (
                  <motion.div key={prod.id} layout initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
                    <ProductCard product={prod} />
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {pageCount > 1 && (
            <div className="pagination">
              {Array.from({ length: pageCount }).map((_, idx) => (
                <button
                  key={idx + 1}
                  type="button"
                  className={page === idx + 1 ? "active" : ""}
                  onClick={() => setPage(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div className="filter-drawer-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button className="filter-drawer-backdrop" type="button" aria-label="Close filters" onClick={() => setMobileFiltersOpen(false)} />
            <motion.div className="filter-drawer" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 260 }}>
              <div className="filter-drawer-head">
                <strong>Filter Products</strong>
                <button type="button" onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters"><X size={20} /></button>
              </div>
              <FilterSidebar
                filters={filters}
                onChange={handleFilterChange}
                categories={categories}
                subcategories={subcategories}
                brands={brands}
                showCategory
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Category;

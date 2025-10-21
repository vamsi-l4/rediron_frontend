
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Category.css';

import Header from '../ShopComponents/Header';
import Footer from '../ShopComponents/Footer';
import ProductCard from '../ShopComponents/ProductCard';
import FilterSidebar from '../ShopComponents/FilterSidebar';
import Loader from '../ShopComponents/Loader';
import API from '../components/Api';

const SORT_OPTIONS = [
  { label: "Popularity", value: "rating" },
  { label: "Price - Low to High", value: "price" },
  { label: "Price - High to Low", value: "-price" },
  { label: "Discount - Low to High", value: "discount_percent" },
  { label: "Discount - High to Low", value: "-discount_percent" },
];

const Category = () => {
  const { category } = useParams();
  const [categoryData, setCategoryData] = useState(null);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ minPrice: '', maxPrice: '', minRating: '', discount: '' });
  const [sort, setSort] = useState('rating');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  // read category slug from route params
  const slug = category || 'proteins';

  useEffect(() => {
    setLoading(true);
    async function fetchCategoryAndProducts() {
      try {
        const catRes = await API.get('/shop-categories/');
        const catList = catRes.data;
        const category = catList.results ? catList.results.find(c => c.slug === slug) : catList.find(c => c.slug === slug);

        if (!category) {
          setLoading(false);
          return;
        }

        setCategoryData(category);

        // Build product query string from filters
        let query = `?category=${category.id}&ordering=${sort}&page=${page}`;
        if (filters.minPrice) query += `&price__gte=${filters.minPrice}`;
        if (filters.maxPrice) query += `&price__lte=${filters.maxPrice}`;
        if (filters.discount) query += `&discount_percent__gte=${filters.discount}`;
        if (filters.minRating) query += `&rating__gte=${filters.minRating}`;

        const prodRes = await API.get(`/shop-products/${query}`);
        const prodJson = prodRes.data;

        setProducts(prodJson.results ? prodJson.results : prodJson);
        setPageCount(prodJson.count ? Math.ceil(prodJson.count / 10) : 1); // DRF default pagination
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategoryAndProducts();
  }, [slug, filters, sort, page]);

  const handleFilterChange = updated => setFilters(updated);
  const handleSortChange = e => setSort(e.target.value);
  const handlePageChange = num => setPage(num);

  if (loading) return <Loader />;

  if (!categoryData) {
    return (
      <div className="category-main rediron-theme">
        <Header />
        <div className="category-content">
          <div className="category-products">
            <div className="no-products">Category not found.</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="category-main rediron-theme">
      <Header />

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span>Home</span>
        <span> / </span>
        <span>Categories</span>
        <span> / </span>
        <span className="current">{categoryData.name}</span>
      </div>

      <div className="category-content">
        {/* Sidebar - Filtering */}
        <FilterSidebar filters={filters} onChange={handleFilterChange} />

        {/* Main list */}
        <div className="category-products">
          <div className="category-title">{categoryData.name}</div>
          {categoryData.description && (
            <div className="category-desc">{categoryData.description}</div>
          )}

          {/* Sort Bar */}
          <div className="sort-bar">
            <label htmlFor="sort-select">Sort by:</label>
            <select id="sort-select" value={sort} onChange={handleSortChange}>
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Products Grid */}
          <div className="prod-grid">
            {products.length === 0 ? (
              <div className="no-products">No products match your filters.</div>
            ) : (
              products.map(prod => <ProductCard key={prod.id} product={prod} />)
            )}
          </div>

          {/* Pagination */}
          {pageCount > 1 && (
            <div className="pagination">
              {Array.from({ length: pageCount }).map((_, idx) => (
                <button
                  key={idx + 1}
                  className={page === idx + 1 ? "active" : ""}
                  onClick={() => handlePageChange(idx + 1)}>
                  {idx + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Category;

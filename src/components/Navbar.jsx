import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, X as CloseIcon } from "react-feather";
import { ShoppingBag } from "lucide-react";
import "./Navbar.css";
import { AuthContext } from "../contexts/AuthContext";
import { UserDataContext } from "../contexts/UserDataContext";
import { useUser } from "@clerk/clerk-react";
import API, { makeAbsolute } from "../components/Api";

const Navbar = ({ onModeSwitch }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false); // State for mobile search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const { isAuthenticated } = useContext(AuthContext);
  const { user: clerkUser } = useUser();
  const { userData } = useContext(UserDataContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isShopRoute = location.pathname.startsWith("/shop");
  const effectiveMode = isShopRoute ? "shop" : "rediron";
  const isProfilePage = location.pathname === "/profile";

  // Use UserDataContext (which has fresh data from server)
  // Fall back to Clerk user if context data not available
  const user = userData ? {
    name: userData.name || userData.username || userData.email || 'User',
    email: userData.email || null,
    profile_image: userData.profile_image || clerkUser?.profileImageUrl || null
  } : clerkUser ? {
    name: clerkUser.firstName || clerkUser.username || 'User',
    email: clerkUser.emailAddresses?.[0]?.emailAddress || null,
    profile_image: clerkUser.profileImageUrl || null
  } : null;

  // Add a cache-busting query parameter to the navbar image as well
  const getCacheBustedUrl = (url) => {
    if (!url) return null;
    const absolute = makeAbsolute(url);
    if (absolute?.startsWith("data:") || absolute?.startsWith("blob:")) return absolute;
    return `${absolute}?t=${new Date(userData?.updated_at || Date.now()).getTime()}`;
  }
  const resolvedProfileImage = user && user.profile_image ? getCacheBustedUrl(user.profile_image) : null;



  // Get first letter for avatar
  const getFirstLetter = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);


  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobileMenuOpen && !e.target.closest('.navbar')) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobileMenuOpen]);

  // Update Web Title (Browser Top Tab) dynamically based on mode
  useEffect(() => {
    document.title = effectiveMode === "shop" ? "RedIron | Shop" : "RedIron | Gym";
  }, [effectiveMode]);

  useEffect(() => {
    if (!isSearchOpen || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      const query = encodeURIComponent(searchQuery.trim());
      try {
        const [equipmentRes, exercisesRes, productsRes] = await Promise.allSettled([
          API.get(`/api/equipment/?search=${query}`),
          API.get(`/api/exercises/?search=${query}`),
          API.get(`/api/shop-products/?search=${query}`),
        ]);

        if (cancelled) return;

        const unpack = (res) => res.status === "fulfilled" ? (res.value.data.results || res.value.data || []) : [];
        const mapped = [
          ...unpack(equipmentRes).slice(0, 4).map(item => ({
            id: `equipment-${item.id}`,
            title: item.name,
            label: "Equipment",
            image: item.image || item.image1 || item.thumbnail,
            path: `/equipment/${item.category || item.type || "all"}/${item.id}`,
          })),
          ...unpack(exercisesRes).slice(0, 4).map(item => ({
            id: `exercise-${item.id}`,
            title: item.name,
            label: "Exercise",
            image: item.image || item.thumbnail,
            path: `/exercises/${item.slug || item.id}`,
          })),
          ...unpack(productsRes).slice(0, 4).map(item => ({
            id: `product-${item.id}`,
            title: item.name,
            label: "Shop Product",
            image: item.image || item.gallery_images?.[0]?.image,
            path: `/shop-products/${item.id}`,
          })),
        ];
        setSearchResults(mapped);
      } catch (error) {
        if (!cancelled) setSearchResults([]);
      } finally {
        if (!cancelled) setSearchLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [isSearchOpen, searchQuery]);

  const getHomeRoute = () => {
    return effectiveMode === "shop" ? "/shop" : "/";
  };

  const openSearch = () => {
    setSearchOpen(true);
    setSearchQuery("");
  };

  const goToSearchResult = (path) => {
    setSearchOpen(false);
    setSearchQuery("");
    navigate(path);
  };

  // In shop mode, this entire navbar should not render its links,
  // as a different shop-specific navbar is used.
  // It should only render for the gym ('rediron') mode.
  if (effectiveMode === 'shop') return null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Hamburger Menu for Mobile (Moved to the left) */}
        <div
          className={`hamburger ${isMobileMenuOpen ? "active" : ""}`}
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          role="button"
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          tabIndex="0"
          onKeyDown={(e) => e.key === 'Enter' && setMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        <div className="navbar-logo">
          <Link to={getHomeRoute()}>
            <img src="/logo.png" alt="RedIron" />
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <ul className="navbar-links">
          <li><Link to={getHomeRoute()} className="navbar-link-box">{effectiveMode === "shop" ? "Shop Home" : "Home"}</Link></li>
          {effectiveMode !== "shop" && (
            <>
              <li><Link to="/equipment" className="navbar-link-box">Equipment</Link></li>
              <li><Link to="/articles" className="navbar-link-box">Articles</Link></li>
              <li><Link to="/performance-lab" className="navbar-link-box">Performance Lab</Link></li>
              <li><Link to="/contact" className="navbar-link-box">Contact</Link></li>
            </>
          )}
          {/* In shop mode, a contact link is already provided if needed */}
          {effectiveMode === "shop" && (
            <li><Link to="/shop-contacts" className="navbar-link-box">Contact</Link></li>
          )}
          <li><Link to="/about" className="navbar-link-box">About</Link></li>
        </ul>

        {/* Desktop Actions */}
        <div className="navbar-actions">
          {!isProfilePage && (
            <button onClick={onModeSwitch} className="navbar-btn navbar-mode-switch">
              <ShoppingBag size={16} aria-hidden="true" />
              <span>{effectiveMode === "shop" ? "Gym" : "Shop"}</span>
            </button>
          )}

          <button onClick={openSearch} className="navbar-btn navbar-search-btn-mobile" aria-label="Open search">
            <Search size={18} />
          </button>
          
          {isAuthenticated && user ? (
            <Link to="/profile" className="navbar-btn navbar-profile-btn" title={user.email || user.name}>
              <div className="navbar-profile-wrapper">
                {resolvedProfileImage ? (
                  <img
                    src={resolvedProfileImage}
                    alt="Profile"
                    className="navbar-profile-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="navbar-profile-avatar" style={resolvedProfileImage ? { display: 'none' } : {}}>
                  {getFirstLetter(user.name)}
                </div>
                <div className="navbar-profile-tooltip">
                  <div className="navbar-profile-name">{user.name}</div>
                  <div className="navbar-profile-email">{user.email || 'No email'}</div>
                </div>
              </div>
            </Link>
          ) : (
            <Link to="/login" className="navbar-btn navbar-btn-login">Login</Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)} />}
      {isMobileMenuOpen && (
      <div className="mobile-menu-drawer active">
        <ul className="mobile-menu-links">
          <li><Link to={getHomeRoute()} onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item">
            {effectiveMode === "shop" ? "Shop Home" : "Home"}
          </Link></li>
          {effectiveMode !== "shop" && (
            <>
              <li><Link to="/equipment" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item">Equipment</Link></li>
              <li><Link to="/articles" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item">Articles</Link></li>              
              <li><Link to="/performance-lab" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item">Performance Lab</Link></li>
              <li><Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item">Contact</Link></li>
            </>
          )}
          {effectiveMode === "shop" && (
            <li><Link to="/shop-contacts" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item">Contact</Link></li>
          )}
          <li><Link to="/about" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item">About</Link></li>
        </ul>

        <div className="mobile-menu-actions">
          {!isProfilePage && (
            <button onClick={() => { onModeSwitch(); setMobileMenuOpen(false); }} className="mobile-menu-btn mobile-mode-switch">
              <ShoppingBag size={17} aria-hidden="true" />
              {effectiveMode === "shop" ? "Gym Mode" : "Shop Mode"}
            </button>
          )}
          
          {isAuthenticated && user ? (
            <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-btn mobile-profile-btn">
              <span className="mobile-profile-avatar">{getFirstLetter(user.name)}</span>
              Profile
            </Link>
          ) : (
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-btn mobile-login-btn">Login</Link>
          )}
        </div>
      </div>
      )}

      {/* Global Search Overlay */}
      {isSearchOpen && (
        <div className="mobile-search-overlay">
          <div className="mobile-search-panel">
            <div className="mobile-search-bar">
              <Search className="mobile-search-icon" size={20} />
              <input
                type="text"
                placeholder="Search equipment, exercises, products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button onClick={() => setSearchOpen(false)} className="mobile-search-close-btn" aria-label="Close search">
                <CloseIcon size={24} />
              </button>
            </div>
            <div className="global-search-results">
              {searchLoading && <div className="global-search-state">Searching...</div>}
              {!searchLoading && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
                <div className="global-search-state">No matching results found</div>
              )}
              {searchResults.map(result => (
                <button key={result.id} className="global-search-item" onClick={() => goToSearchResult(result.path)}>
                  <img src={makeAbsolute(result.image) || "/logo.png"} alt="" />
                  <span>
                    <strong>{result.title}</strong>
                    <small>{result.label}</small>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

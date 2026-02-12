/**
 * KicksList - Sneaker Discovery & Shopping
 * Find and shop authentic sneakers from trusted retailers
 */

const { useState, useEffect, useRef, useCallback, createContext, useContext } = React;

// ============================================
// Analytics Helper
// ============================================
function trackEvent(eventName, params = {}) {
  if (window.gtag) {
    window.gtag('event', eventName, params);
  }
}

// ============================================
// App Context
// ============================================
const AppContext = createContext();

const useApp = () => useContext(AppContext);

// ============================================
// Router (Simple hash-based)
// ============================================
const useRouter = () => {
  const [route, setRoute] = useState({ page: 'home', params: {} });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || '/';
      const [path, query] = hash.split('?');
      const params = {};

      if (query) {
        query.split('&').forEach(param => {
          const [key, value] = param.split('=');
          params[key] = decodeURIComponent(value);
        });
      }

      if (path === '/' || path === '') {
        setRoute({ page: 'home', params });
      } else if (path.startsWith('/product/')) {
        const id = path.split('/')[2];
        setRoute({ page: 'product', params: { id, ...params } });
      } else if (path.startsWith('/shop')) {
        setRoute({ page: 'shop', params });
      } else if (path.startsWith('/category/')) {
        const category = path.split('/')[2];
        setRoute({ page: 'shop', params: { category, ...params } });
      } else if (path.startsWith('/search')) {
        setRoute({ page: 'shop', params });
      } else if (path === '/about') {
        setRoute({ page: 'about', params });
      } else if (path === '/brands') {
        setRoute({ page: 'brands', params });
      } else if (path === '/terms') {
        setRoute({ page: 'terms', params });
      } else if (path === '/privacy') {
        setRoute({ page: 'privacy', params });
      } else {
        setRoute({ page: 'home', params });
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = useCallback((path) => {
    window.location.hash = path;
    window.scrollTo(0, 0);
  }, []);

  return { route, navigate };
};

// ============================================
// App Provider (Cart removed)
// ============================================
const AppProvider = ({ children }) => {
  const router = useRouter();
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleWishlist = useCallback((productId) => {
    setWishlist(prev => {
      const isRemoving = prev.includes(productId);
      trackEvent(isRemoving ? 'remove_from_wishlist' : 'add_to_wishlist', { item_id: productId });
      return isRemoving
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
    });
  }, []);

  return (
    <AppContext.Provider value={{
      ...router,
      wishlist,
      toggleWishlist,
      searchQuery,
      setSearchQuery
    }}>
      {children}
    </AppContext.Provider>
  );
};

// ============================================
// Trust Rating Component
// ============================================
const TrustRating = ({ rating, showCount = false, count = 0, size = 'md' }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const sizeClasses = {
    sm: 'kl-trust-rating-sm',
    md: 'kl-trust-rating-md',
    lg: 'kl-trust-rating-lg'
  };

  return (
    <div className={`kl-trust-rating ${sizeClasses[size]}`}>
      <div className="kl-trust-stars">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} viewBox="0 0 24 24" fill="currentColor" className="kl-star kl-star-full">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        ))}
        {hasHalfStar && (
          <svg viewBox="0 0 24 24" className="kl-star kl-star-half">
            <defs>
              <linearGradient id="halfGradient">
                <stop offset="50%" stopColor="currentColor"/>
                <stop offset="50%" stopColor="#e7e5e4"/>
              </linearGradient>
            </defs>
            <path fill="url(#halfGradient)" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} viewBox="0 0 24 24" fill="#e7e5e4" className="kl-star kl-star-empty">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        ))}
      </div>
      <span className="kl-trust-rating-value">{rating.toFixed(1)}</span>
      {showCount && count > 0 && (
        <span className="kl-trust-count">({count.toLocaleString()} reviews)</span>
      )}
    </div>
  );
};

// ============================================
// Price Display Component (Shows Retail Price)
// ============================================
const PriceDisplay = ({ product }) => {
  const retailPrice = product.retail;

  if (!retailPrice) {
    return <span className="kl-price-range kl-out-of-stock">Price Unavailable</span>;
  }

  return (
    <div className="kl-price-range">
      <span className="kl-price-label">Retail:</span>
      <span className="kl-price-low">${retailPrice.toLocaleString()}</span>
    </div>
  );
};

// ============================================
// Where To Buy Section (Direct Links to Vendors)
// ============================================
const VendorComparisonTable = ({ product }) => {
  const { generateVendorPrices } = window.KicksListData;
  const { getVendorById, getRetailVendors, getResaleVendors } = window.KicksListVendors;

  const vendorPrices = generateVendorPrices(product);

  // Separate retail and resale vendors
  const retailVendors = vendorPrices.filter(v => v.type === 'retail');
  const resaleVendors = vendorPrices.filter(v => v.type === 'resale');

  const VendorRow = ({ vendorPrice, isResale = false }) => {
    const vendor = getVendorById(vendorPrice.vendorId);

    return (
      <div className="kl-comparison-row">
        <div className="kl-comparison-vendor">
          <span className="kl-vendor-name" style={{ color: vendor.color }}>{vendor.name}</span>
          {!isResale && <span className="kl-retail-badge">Retail</span>}
          {isResale && <span className="kl-resale-badge">Resale</span>}
        </div>
        <div className="kl-comparison-rating">
          <TrustRating rating={vendor.trustRating} size="sm" />
          <span className="kl-vendor-reviews">({vendor.trustCount.toLocaleString()})</span>
        </div>
        <div className="kl-comparison-action">
          <a
            href={vendorPrice.url}
            target="_blank"
            rel="noopener noreferrer"
            className="kl-btn kl-btn-shop"
            style={{ '--vendor-color': vendor.color }}
            onClick={() => trackEvent('vendor_click', {
              vendor_name: vendor.name,
              vendor_id: vendor.id,
              vendor_type: isResale ? 'resale' : 'retail',
              product_name: product.name,
              product_id: product.id
            })}
          >
            {isResale ? 'Check Live Price' : 'Check Availability'}
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="kl-vendor-comparison">
      {/* Resale Marketplaces - Show these first since they're more likely to have the shoe */}
      <div className="kl-comparison-section">
        <h3 className="kl-comparison-title">
          <span>Resale Marketplaces</span>
          <span className="kl-comparison-subtitle">Authenticated · Live market prices</span>
        </h3>
        <div className="kl-comparison-table">
          {resaleVendors.map((vendorPrice) => (
            <VendorRow key={vendorPrice.vendorId} vendorPrice={vendorPrice} isResale={true} />
          ))}
        </div>
      </div>

      {/* Retail Section */}
      <div className="kl-comparison-section">
        <h3 className="kl-comparison-title">
          <span>Retail Stores</span>
          <span className="kl-comparison-subtitle">Official retailers · MSRP ${product.retail?.toLocaleString()}</span>
        </h3>
        <div className="kl-comparison-table">
          {retailVendors.map((vendorPrice) => (
            <VendorRow key={vendorPrice.vendorId} vendorPrice={vendorPrice} isResale={false} />
          ))}
        </div>
      </div>

      {/* Affiliate Disclosure */}
      <p className="kl-affiliate-disclosure">
        Prices shown on vendor sites are live and may change. We may earn a commission when you shop through our links.
      </p>
    </div>
  );
};

// ============================================
// Navigation Component (Cart removed)
// ============================================
const Navigation = () => {
  const { navigate, searchQuery, setSearchQuery } = useApp();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      trackEvent('search', { search_term: searchQuery.trim() });
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
    }
  };

  const popularSearches = ['Jordan 4', 'Travis Scott', 'Dunk Low', 'Yeezy 350', 'New Balance 550'];

  return (
    <>
      <div className="kl-announcement">
        <span>Discover Sneakers From 10+ Trusted Retailers</span>
        <span className="kl-announcement-sep">·</span>
        <span>Shop With Confidence</span>
      </div>

      <nav className={`kl-nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className="kl-nav-inner">
          <div className="kl-nav-left">
            <a href="#/" className="kl-logo" onClick={(e) => { e.preventDefault(); navigate('/'); }}>KicksList</a>
            <ul className="kl-nav-links">
              <li><a href="#/shop" onClick={(e) => { e.preventDefault(); navigate('/shop'); }}>Browse</a></li>
              <li><a href="#/brands" onClick={(e) => { e.preventDefault(); navigate('/brands'); }}>Brands</a></li>
              <li><a href="#/about" onClick={(e) => { e.preventDefault(); navigate('/about'); }}>About</a></li>
            </ul>
          </div>

          <div className="kl-nav-right">
            <button className="kl-nav-icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
            </button>
            <button className="kl-nav-icon-btn kl-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                {menuOpen
                  ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                  : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
                }
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`kl-mobile-menu ${menuOpen ? 'open' : ''}`}>
        <a href="#/shop" onClick={(e) => { e.preventDefault(); navigate('/shop'); setMenuOpen(false); }}>Browse</a>
        <a href="#/brands" onClick={(e) => { e.preventDefault(); navigate('/brands'); setMenuOpen(false); }}>Brands</a>
        <a href="#/about" onClick={(e) => { e.preventDefault(); navigate('/about'); setMenuOpen(false); }}>About</a>
      </div>

      {/* Search Overlay */}
      <div className={`kl-search-overlay ${searchOpen ? 'open' : ''}`}>
        <div className="kl-search-container">
          <form onSubmit={handleSearch} className="kl-search-form">
            <svg className="kl-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search sneakers, brands, styles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="kl-search-input"
            />
            <button type="button" className="kl-search-close" onClick={() => setSearchOpen(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </form>
          <div className="kl-search-suggestions">
            <p className="kl-search-label">Popular Searches</p>
            <div className="kl-search-tags">
              {popularSearches.map((tag) => (
                <button
                  key={tag}
                  className="kl-search-tag"
                  onClick={() => {
                    setSearchQuery(tag);
                    navigate(`/search?q=${encodeURIComponent(tag)}`);
                    setSearchOpen(false);
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="kl-search-backdrop" onClick={() => setSearchOpen(false)} />
      </div>
    </>
  );
};

// ============================================
// Product Card (Shows Retail + Compare Prices CTA)
// ============================================
const ProductCard = ({ product, index = 0 }) => {
  const { navigate, wishlist, toggleWishlist } = useApp();
  const isWishlisted = wishlist.includes(product.id);

  return (
    <article
      className="kl-product-card"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {product.badge && (
        <span className={`kl-product-badge ${product.badge.toLowerCase().replace(' ', '-')}`}>
          {product.badge}
        </span>
      )}
      <button
        className={`kl-product-wishlist ${isWishlisted ? 'active' : ''}`}
        onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
        aria-label="Add to wishlist"
      >
        <svg viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
      <div className="kl-product-image" onClick={() => navigate(`/product/${product.id}`)}>
        <img
          src={product.images[0]}
          alt={product.name}
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400/f5f4f2/a8a29e?text=Image+Coming+Soon'; }}
        />
      </div>
      <div className="kl-product-info" onClick={() => navigate(`/product/${product.id}`)}>
        <p className="kl-product-brand">{product.brand}</p>
        <h3 className="kl-product-name">{product.name}</h3>
        <PriceDisplay product={product} />
        <a className="kl-compare-link" onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}>
          Compare Live Prices →
        </a>
      </div>
    </article>
  );
};

// ============================================
// Homepage
// ============================================
const Homepage = () => {
  const { navigate } = useApp();
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');

  const { products, categories, getFeaturedProducts, getTrendingProducts, getNewDrops } = window.KicksListData;
  const featuredProducts = getFeaturedProducts();
  const trendingProducts = getTrendingProducts();
  const newDrops = getNewDrops();

  // Only cycle through the 3 displayed slides
  const heroSlideCount = Math.min(featuredProducts.length, 3);

  useEffect(() => {
    if (heroSlideCount <= 1) return;
    const timer = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % heroSlideCount);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlideCount]);

  return (
    <main className="kl-homepage-content">
      {/* Hero */}
      <section className="kl-hero">
        <div className="kl-hero-slides">
          {featuredProducts.slice(0, 3).map((product, idx) => (
            <div key={product.id} className={`kl-hero-slide ${idx === activeHeroSlide ? 'active' : ''}`}>
              <div className="kl-hero-content">
                <p className="kl-hero-eyebrow">{product.featured ? "Editor's Pick" : 'Featured'}</p>
                <h1 className="kl-hero-title">{product.name}</h1>
                <p className="kl-hero-subtitle">{product.brand}</p>
                <div className="kl-hero-actions">
                  <button className="kl-btn kl-btn-primary" onClick={() => navigate(`/product/${product.id}`)}>
                    Shop Now
                  </button>
                  <span className="kl-hero-price">Retail ${product.retail?.toLocaleString()}</span>
                </div>
              </div>
              <div className="kl-hero-image">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/600x600/f5f4f2/a8a29e?text=Image+Coming+Soon'; }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="kl-categories">
        <div className="kl-categories-inner">
          <button
            className={`kl-category-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => { setActiveCategory('all'); navigate('/shop'); }}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`kl-category-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => { setActiveCategory(cat.id); navigate(`/category/${cat.id}`); }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Drops */}
      <section className="kl-section">
        <div className="kl-section-header">
          <div className="kl-section-title-group">
            <p className="kl-section-eyebrow">Most Popular</p>
            <h2 className="kl-section-title">Featured Drops</h2>
          </div>
          <a href="#/shop" className="kl-section-link" onClick={(e) => { e.preventDefault(); navigate('/shop'); }}>
            View All
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
        </div>
        <div className="kl-product-grid kl-featured-grid">
          {featuredProducts.slice(0, 8).map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      </section>

      {/* Editorial */}
      <section className="kl-editorial">
        <div className="kl-editorial-content">
          <p className="kl-editorial-eyebrow">The Edit</p>
          <h2 className="kl-editorial-title">Icons of<br /><em>Collaboration</em></h2>
          <p className="kl-editorial-desc">Explore the most coveted collaborations in sneaker history—from Travis Scott to Off-White.</p>
          <button className="kl-btn kl-btn-outline-light" onClick={() => navigate('/search?q=travis')}>
            Discover More
          </button>
        </div>
        <div className="kl-editorial-images">
          <div className="kl-editorial-img kl-editorial-img-1">
            <img src={products[1].images[0]} alt="Travis Scott" onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400/f5f4f2/a8a29e?text='; }} />
          </div>
          <div className="kl-editorial-img kl-editorial-img-2">
            <img src={products[3].images[0]} alt="Jordan" onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400/f5f4f2/a8a29e?text='; }} />
          </div>
        </div>
      </section>

      {/* New Drops */}
      <section className="kl-section">
        <div className="kl-section-header">
          <div className="kl-section-title-group">
            <p className="kl-section-eyebrow">Just Released</p>
            <h2 className="kl-section-title">New Drops</h2>
          </div>
          <a href="#/shop" className="kl-section-link" onClick={(e) => { e.preventDefault(); navigate('/shop'); }}>
            View All
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
        </div>
        <div className="kl-newdrops-grid">
          {newDrops.map((product, idx) => (
            <article key={product.id} className="kl-newdrop-card" style={{ animationDelay: `${idx * 50}ms` }} onClick={() => navigate(`/product/${product.id}`)}>
              <div className="kl-newdrop-image">
                <img src={product.images[0]} alt={product.name} onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300/f5f4f2/a8a29e?text='; }} />
              </div>
              <div className="kl-newdrop-info">
                <span className="kl-newdrop-date">{new Date(product.releaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <p className="kl-newdrop-brand">{product.brand}</p>
                <h3 className="kl-newdrop-name">{product.name}</h3>
                <span className="kl-newdrop-price">${product.retail?.toLocaleString()}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="kl-section kl-trending">
        <div className="kl-section-header">
          <div className="kl-section-title-group">
            <p className="kl-section-eyebrow">Most Wanted</p>
            <h2 className="kl-section-title">Trending Now</h2>
          </div>
          <a href="#/shop" className="kl-section-link" onClick={(e) => { e.preventDefault(); navigate('/shop'); }}>
            View All
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
        </div>
        <div className="kl-trending-grid">
          {trendingProducts.slice(0, 6).map((product, idx) => (
            <article key={product.id} className="kl-trending-card" onClick={() => navigate(`/product/${product.id}`)}>
              <span className="kl-trending-rank">{String(idx + 1).padStart(2, '0')}</span>
              <div className="kl-trending-image">
                <img src={product.images[0]} alt={product.name} onError={(e) => { e.target.src = 'https://via.placeholder.com/200x200/f5f4f2/a8a29e?text='; }} />
              </div>
              <div className="kl-trending-info">
                <p className="kl-trending-brand">{product.brand}</p>
                <h3 className="kl-trending-name">{product.name}</h3>
                <span className="kl-trending-price">Retail ${product.retail?.toLocaleString()}</span>
              </div>
              <svg className="kl-trending-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </article>
          ))}
        </div>
      </section>

      {/* Brands */}
      <section className="kl-brands">
        <p className="kl-brands-label">Shop by Brand</p>
        <div className="kl-brands-grid">
          {[
            { name: 'Jordan', id: 'jordan' },
            { name: 'Nike', id: 'nike' },
            { name: 'Adidas', id: 'adidas' },
            { name: 'New Balance', id: 'new-balance' },
            { name: 'Puma', id: 'puma' },
            { name: 'Reebok', id: 'reebok' },
            { name: 'Yeezy', id: 'yeezy' },
            { name: 'UGG', id: 'ugg' },
            { name: 'Crocs', id: 'crocs' },
          ].map((brand) => (
            <button key={brand.id} className="kl-brand-btn" onClick={() => navigate(`/category/${brand.id}`)}>
              {brand.name}
            </button>
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="kl-trust">
        <div className="kl-trust-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>
          </svg>
          <div><h4>All Vendors Verified</h4><p>Every vendor is authenticated and trusted</p></div>
        </div>
        <div className="kl-trust-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <div><h4>Compare Live Prices</h4><p>Direct links to StockX, GOAT & more</p></div>
        </div>
        <div className="kl-trust-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <div><h4>Trust Ratings</h4><p>See vendor reviews before you buy</p></div>
        </div>
        <div className="kl-trust-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
          <div><h4>Secure Shopping</h4><p>Buy directly from trusted vendors</p></div>
        </div>
      </section>
    </main>
  );
};

// ============================================
// Shop Page
// ============================================
const ShopPage = () => {
  const { route, navigate, searchQuery } = useApp();
  const { products, categories, getProductsByCategory, searchProducts } = window.KicksListData;

  const [sortBy, setSortBy] = useState('newest');
  const [activeCategory, setActiveCategory] = useState(route.params.category || 'all');
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState('all');
  const [customMin, setCustomMin] = useState('');
  const [customMax, setCustomMax] = useState('');
  const productsPerPage = 20;

  // Price range presets
  const priceRanges = [
    { id: 'all', label: 'All Prices', min: 0, max: Infinity },
    { id: 'under-100', label: 'Under $100', min: 0, max: 99 },
    { id: '100-150', label: '$100 - $150', min: 100, max: 150 },
    { id: '150-200', label: '$150 - $200', min: 150, max: 200 },
    { id: '200-300', label: '$200 - $300', min: 200, max: 300 },
    { id: 'over-300', label: '$300+', min: 300, max: Infinity },
  ];

  const queryParam = route.params.q || searchQuery;

  let filteredProducts = queryParam
    ? searchProducts(queryParam)
    : getProductsByCategory(activeCategory);

  // Apply price filter
  const activeRange = priceRanges.find(r => r.id === priceRange);
  if (priceRange === 'custom' && (customMin || customMax)) {
    const min = customMin ? parseInt(customMin) : 0;
    const max = customMax ? parseInt(customMax) : Infinity;
    filteredProducts = filteredProducts.filter(p => {
      const price = p.retail || 0;
      return price >= min && price <= max;
    });
  } else if (activeRange && priceRange !== 'all') {
    filteredProducts = filteredProducts.filter(p => {
      const price = p.retail || 0;
      return price >= activeRange.min && price <= activeRange.max;
    });
  }

  // Sort by retail price
  if (sortBy === 'price-low') {
    filteredProducts = [...filteredProducts].sort((a, b) => (a.retail || 0) - (b.retail || 0));
  } else if (sortBy === 'price-high') {
    filteredProducts = [...filteredProducts].sort((a, b) => (b.retail || 0) - (a.retail || 0));
  } else if (sortBy === 'newest') {
    filteredProducts = [...filteredProducts].sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
  }

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setActiveCategory(route.params.category || 'all');
    setCurrentPage(1);
  }, [route.params.category, queryParam]);

  useEffect(() => {
    setCurrentPage(1);
  }, [priceRange, customMin, customMax]);

  // Scroll to top when page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePriceRangeChange = (rangeId) => {
    setPriceRange(rangeId);
    if (rangeId !== 'custom') {
      setCustomMin('');
      setCustomMax('');
    }
  };

  const handleCustomPriceApply = () => {
    setPriceRange('custom');
  };

  return (
    <main className="kl-shop-page">
      <div className="kl-shop-header">
        <div className="kl-shop-header-inner">
          <div>
            <nav className="kl-breadcrumb">
              <a href="#/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a>
              <span className="kl-breadcrumb-sep">/</span>
              <span className="kl-breadcrumb-current">
                {queryParam ? `Search: "${queryParam}"` : activeCategory === 'all' ? 'All Sneakers' : categories.find(c => c.id === activeCategory)?.name || 'Shop'}
              </span>
            </nav>
            <h1 className="kl-shop-title">
              {queryParam ? `Results for "${queryParam}"` : activeCategory === 'all' ? 'All Sneakers' : categories.find(c => c.id === activeCategory)?.name || 'Shop'}
            </h1>
            <p className="kl-shop-count">{filteredProducts.length} Products</p>
          </div>
          <div className="kl-shop-sort">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="kl-shop-content">
        <aside className="kl-shop-filters">
          <div className="kl-filter-section">
            <h3 className="kl-filter-title">Categories</h3>
            <div className="kl-filter-options">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`kl-filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    navigate(cat.id === 'all' ? '/shop' : `/category/${cat.id}`);
                  }}
                >
                  {cat.name}
                  <span className="kl-filter-count">{cat.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="kl-filter-section">
            <h3 className="kl-filter-title">Price Range</h3>
            <div className="kl-filter-options">
              {priceRanges.map(range => (
                <button
                  key={range.id}
                  className={`kl-filter-btn ${priceRange === range.id ? 'active' : ''}`}
                  onClick={() => handlePriceRangeChange(range.id)}
                >
                  {range.label}
                </button>
              ))}
            </div>
            <div className="kl-price-custom">
              <p className="kl-price-custom-label">Custom Range</p>
              <div className="kl-price-inputs">
                <div className="kl-price-input-wrap">
                  <span className="kl-price-input-prefix">$</span>
                  <input
                    type="number"
                    placeholder="Min"
                    value={customMin}
                    onChange={(e) => setCustomMin(e.target.value)}
                    className="kl-price-input"
                  />
                </div>
                <span className="kl-price-input-sep">to</span>
                <div className="kl-price-input-wrap">
                  <span className="kl-price-input-prefix">$</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={customMax}
                    onChange={(e) => setCustomMax(e.target.value)}
                    className="kl-price-input"
                  />
                </div>
              </div>
              <button
                className="kl-btn kl-btn-apply"
                onClick={handleCustomPriceApply}
                disabled={!customMin && !customMax}
              >
                Apply
              </button>
            </div>
          </div>

          {(priceRange !== 'all' || activeCategory !== 'all') && (
            <button
              className="kl-clear-filters"
              onClick={() => {
                handlePriceRangeChange('all');
                setActiveCategory('all');
                navigate('/shop');
              }}
            >
              Clear All Filters
            </button>
          )}
        </aside>

        <div className="kl-shop-products">
          {filteredProducts.length === 0 ? (
            <div className="kl-shop-empty">
              <p>No sneakers found matching your criteria.</p>
              <button className="kl-btn kl-btn-primary" onClick={() => navigate('/shop')}>View All Products</button>
            </div>
          ) : (
            <>
              <div className="kl-product-grid">
                {paginatedProducts.map((product, idx) => (
                  <ProductCard key={product.id} product={product} index={idx} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="kl-pagination">
                  <button
                    className="kl-pagination-btn kl-pagination-prev"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <polyline points="15 18 9 12 15 6"/>
                    </svg>
                    Prev
                  </button>

                  <div className="kl-pagination-pages">
                    {/* First page */}
                    {currentPage > 3 && (
                      <>
                        <button
                          className="kl-pagination-page"
                          onClick={() => handlePageChange(1)}
                        >
                          1
                        </button>
                        {currentPage > 4 && <span className="kl-pagination-ellipsis">...</span>}
                      </>
                    )}

                    {/* Page numbers around current */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(page => page >= currentPage - 2 && page <= currentPage + 2)
                      .map(page => (
                        <button
                          key={page}
                          className={`kl-pagination-page ${page === currentPage ? 'active' : ''}`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      ))
                    }

                    {/* Last page */}
                    {currentPage < totalPages - 2 && (
                      <>
                        {currentPage < totalPages - 3 && <span className="kl-pagination-ellipsis">...</span>}
                        <button
                          className="kl-pagination-page"
                          onClick={() => handlePageChange(totalPages)}
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  <button
                    className="kl-pagination-btn kl-pagination-next"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                </div>
              )}

              <div className="kl-pagination-info">
                Showing {startIndex + 1}-{Math.min(startIndex + productsPerPage, filteredProducts.length)} of {filteredProducts.length} products
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

// ============================================
// Product Detail Page (Updated)
// ============================================
const ProductDetailPage = () => {
  const { route, navigate, wishlist, toggleWishlist } = useApp();
  const { getProductById, getRelatedProducts } = window.KicksListData;

  const productId = parseInt(route.params.id);
  const product = getProductById(productId);
  const relatedProducts = getRelatedProducts(productId, 4);

  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const isWishlisted = wishlist.includes(productId);

  useEffect(() => {
    setSelectedImage(0);
  }, [productId]);

  useEffect(() => {
    if (product) {
      trackEvent('view_item', {
        item_id: product.id,
        item_name: product.name,
        item_brand: product.brand,
        item_category: product.category,
        price: product.retail
      });
    }
  }, [productId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') setSelectedImage((prev) => (prev + 1) % product.images.length);
      if (e.key === 'ArrowLeft') setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, product?.images?.length]);

  if (!product) {
    return (
      <main className="kl-error-page">
        <h1>Product Not Found</h1>
        <p>The sneaker you're looking for doesn't exist.</p>
        <button className="kl-btn kl-btn-primary" onClick={() => navigate('/shop')}>Browse All Sneakers</button>
      </main>
    );
  }

  const handleImageHover = (e) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <main className="kl-product-detail">
      <nav className="kl-breadcrumb">
        <a href="#/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a>
        <span className="kl-breadcrumb-sep">/</span>
        <a href={`#/category/${product.category}`} onClick={(e) => { e.preventDefault(); navigate(`/category/${product.category}`); }}>{product.brand}</a>
        <span className="kl-breadcrumb-sep">/</span>
        <span className="kl-breadcrumb-current">{product.name}</span>
      </nav>

      <div className="kl-product-main">
        {/* Gallery */}
        <div className="kl-gallery">
          <div className="kl-gallery-thumbnails">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                className={`kl-thumbnail ${selectedImage === idx ? 'active' : ''}`}
                onClick={() => setSelectedImage(idx)}
              >
                <img src={img} alt={`View ${idx + 1}`} onError={(e) => { e.target.src = 'https://via.placeholder.com/100x100/f5f4f2/a8a29e?text='; }} />
              </button>
            ))}
          </div>
          <div
            className={`kl-main-image ${isZoomed ? 'zoomed' : ''}`}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleImageHover}
            onClick={() => setLightboxOpen(true)}
          >
            <div
              className="kl-image-container"
              style={isZoomed ? {
                backgroundImage: `url(${product.images[selectedImage]})`,
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              } : {}}
            >
              <img src={product.images[selectedImage]} alt={product.name} className={isZoomed ? 'hidden' : ''} onError={(e) => { e.target.src = 'https://via.placeholder.com/600x600/f5f4f2/a8a29e?text=Image+Coming+Soon'; }} />
            </div>
            <button className="kl-expand-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
                <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
              </svg>
            </button>
            <div className="kl-image-counter">{selectedImage + 1} / {product.images.length}</div>
          </div>
        </div>

        {/* Info */}
        <div className="kl-product-info-panel">
          <div className="kl-info-header">
            <p className="kl-detail-brand">{product.brand}</p>
            <h1 className="kl-detail-name">{product.name}</h1>
            <p className="kl-detail-style">{product.category?.toUpperCase()}</p>
          </div>

          <div className="kl-price-block">
            <div className="kl-price-row">
              <span className="kl-price-label-large">Retail Price:</span>
              <span className="kl-price-current">
                ${product.retail?.toLocaleString() || 'N/A'}
              </span>
            </div>
            <div className="kl-price-meta">
              <p className="kl-price-note">Click below to check current live prices from verified vendors</p>
            </div>
          </div>

          {/* Vendor Comparison Table */}
          <VendorComparisonTable product={product} />

          <div className="kl-wishlist-action">
            <button className={`kl-wishlist-btn-large ${isWishlisted ? 'active' : ''}`} onClick={() => toggleWishlist(productId)}>
              <svg viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
            </button>
          </div>

          <div className="kl-trust-badges">
            <div className="kl-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg><span>All Vendors Verified</span></div>
            <div className="kl-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><span>Live Price Links</span></div>
            <div className="kl-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg><span>Secure Checkout</span></div>
          </div>

          <div className="kl-specs">
            <h3 className="kl-specs-title">Product Details</h3>
            <dl className="kl-specs-list">
              <div className="kl-spec-row"><dt>Brand</dt><dd>{product.brand}</dd></div>
              <div className="kl-spec-row"><dt>Release Date</dt><dd>{new Date(product.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</dd></div>
              <div className="kl-spec-row"><dt>Retail Price</dt><dd>${product.retail?.toLocaleString()}</dd></div>
            </dl>
          </div>

          <div className="kl-description">
            <h3 className="kl-description-title">About This Sneaker</h3>
            <p className="kl-description-text">{product.description}</p>
          </div>
        </div>
      </div>

      {/* Related */}
      {relatedProducts.length > 0 && (
        <section className="kl-related">
          <div className="kl-section-header">
            <h2 className="kl-section-title">You May Also Like</h2>
            <a href="#/shop" className="kl-section-link" onClick={(e) => { e.preventDefault(); navigate('/shop'); }}>
              View All <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div>
          <div className="kl-product-grid">
            {relatedProducts.map((p, idx) => <ProductCard key={p.id} product={p} index={idx} />)}
          </div>
        </section>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="kl-lightbox" onClick={() => setLightboxOpen(false)}>
          <button className="kl-lightbox-close" onClick={() => setLightboxOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <button className="kl-lightbox-nav prev" onClick={(e) => { e.stopPropagation(); setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div className="kl-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={product.images[selectedImage]} alt={product.name} onError={(e) => { e.target.src = 'https://via.placeholder.com/800x800/f5f4f2/a8a29e?text=Image+Coming+Soon'; }} />
          </div>
          <button className="kl-lightbox-nav next" onClick={(e) => { e.stopPropagation(); setSelectedImage((prev) => (prev + 1) % product.images.length); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
          <div className="kl-lightbox-thumbnails">
            {product.images.map((img, idx) => (
              <button key={idx} className={`kl-lightbox-thumb ${selectedImage === idx ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setSelectedImage(idx); }}>
                <img src={img} alt={`View ${idx + 1}`} onError={(e) => { e.target.src = 'https://via.placeholder.com/100x100/f5f4f2/a8a29e?text='; }} />
              </button>
            ))}
          </div>
          <div className="kl-lightbox-counter">{selectedImage + 1} / {product.images.length}</div>
        </div>
      )}
    </main>
  );
};

// ============================================
// About Page (Updated)
// ============================================
const AboutPage = () => {
  const { navigate } = useApp();
  const { products } = window.KicksListData;

  return (
    <main className="kl-about-page">
      <section className="kl-about-hero">
        <h1>Every Sneaker. Every Price.<br /><em>One Place.</em></h1>
        <p>Stop tab-hopping between retailers. KicksList brings together prices from 14 verified vendors so you can compare in seconds and buy with confidence.</p>
      </section>

      <section className="kl-about-values">
        <div className="kl-about-value">
          <span className="kl-about-value-num">01</span>
          <h3>Compare Prices Instantly</h3>
          <p>See what StockX, GOAT, Nike, Foot Locker, and 10 other vendors are charging — all on one page. No more guessing who has the best deal.</p>
        </div>
        <div className="kl-about-value">
          <span className="kl-about-value-num">02</span>
          <h3>Shop Smarter, Not Harder</h3>
          <p>Retail or resale, we show you both. Filter by brand, price range, or release date to find exactly what you want at the price you want to pay.</p>
        </div>
        <div className="kl-about-value">
          <span className="kl-about-value-num">03</span>
          <h3>Every Vendor Verified</h3>
          <p>We only link to trusted retailers and authenticated marketplaces. Every vendor on KicksList has a proven track record for selling genuine products.</p>
        </div>
      </section>

      <section className="kl-about-stats">
        <div className="kl-about-stat"><span>14</span><p>Verified Vendors</p></div>
        <div className="kl-about-stat"><span>{products.length.toLocaleString()}</span><p>Sneakers Listed</p></div>
        <div className="kl-about-stat"><span>30+</span><p>Brands</p></div>
        <div className="kl-about-stat"><span>100%</span><p>Authentic Sources</p></div>
      </section>

      <section className="kl-about-cta">
        <h2>Ready to Find Your Next Pair?</h2>
        <div className="kl-about-cta-btns">
          <button className="kl-btn kl-btn-primary" onClick={() => navigate('/shop')}>Browse Sneakers</button>
        </div>
      </section>
    </main>
  );
};

// ============================================
// Brands Page
// ============================================
const BrandsPage = () => {
  const { navigate } = useApp();
  const { getProductsByCategory } = window.KicksListData;

  const brandsInfo = {
    jordan: {
      description: 'Air Jordan is a line of basketball shoes produced by Nike, created for Hall of Fame former basketball player Michael Jordan. The brand has transcended sports to become a cultural icon, with each numbered silhouette telling its own story. From the original Air Jordan 1 that was banned by the NBA to the revolutionary Air Jordan 11 worn during the "Flu Game," Jordan Brand represents the pinnacle of sneaker culture.',
      founded: '1984',
      headquarters: 'Beaverton, Oregon',
      highlights: ['Most collected sneaker brand', 'Retro releases highly sought after', 'Collaboration culture pioneer'],
      featuredImage: 'https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Chicago-Reimagined-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      featuredShoe: 'Air Jordan 1 "Chicago"'
    },
    nike: {
      description: 'Nike, Inc. is the world\'s largest supplier of athletic shoes and apparel. Known for groundbreaking innovation like Air Max, React, and ZoomX technologies, Nike continues to push the boundaries of performance and style. From the iconic Dunk to the revolutionary Air Force 1, Nike\'s sneaker lineup defines casual and athletic footwear.',
      founded: '1964',
      headquarters: 'Beaverton, Oregon',
      highlights: ['Air Max technology pioneer', 'Dunk resurgence leader', 'Sustainable Move to Zero initiative'],
      featuredImage: 'https://images.stockx.com/images/Nike-Dunk-Low-Retro-White-Black-2021-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      featuredShoe: 'Nike Dunk Low "Panda"'
    },
    yeezy: {
      description: 'Yeezy is a fashion collaboration between Adidas and designer Kanye West. Known for its distinctive Boost cushioning and futuristic aesthetic, Yeezy revolutionized the sneaker industry with limited releases and unprecedented demand. The Yeezy Boost 350 became one of the most influential sneaker designs of the 2010s.',
      founded: '2015',
      headquarters: 'Portland, Oregon',
      highlights: ['Boost technology integration', 'Limited release strategy', 'Distinctive earth-tone colorways'],
      featuredImage: 'https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Zebra-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      featuredShoe: 'Yeezy Boost 350 V2 "Zebra"'
    },
    adidas: {
      description: 'Adidas is a German multinational corporation that designs and manufactures shoes, clothing and accessories. With iconic silhouettes like the Samba, Superstar, and Stan Smith, Adidas has influenced street culture for decades. The brand\'s collaborations with designers and artists continue to push creative boundaries.',
      founded: '1949',
      headquarters: 'Herzogenaurach, Germany',
      highlights: ['Three Stripes heritage', 'Samba revival phenomenon', 'Sustainable Futurecraft innovations'],
      featuredImage: 'https://images.stockx.com/images/adidas-Samba-OG-Cloud-White-Core-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      featuredShoe: 'Adidas Samba OG'
    },
    'new-balance': {
      description: 'New Balance is an American multinational corporation known for its commitment to domestic manufacturing and quality craftsmanship. The brand has experienced a major resurgence with models like the 550, 2002R, and collaborations with high-end designers. Known as the "dad shoe" brand turned fashion favorite.',
      founded: '1906',
      headquarters: 'Boston, Massachusetts',
      highlights: ['Made in USA craftsmanship', '550 basketball revival', 'Designer collaboration leader'],
      featuredImage: 'https://images.stockx.com/images/New-Balance-550-White-Green-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      featuredShoe: 'New Balance 550'
    },
    ugg: {
      description: 'UGG is an American footwear company best known for its sheepskin boots. Founded in Southern California, UGG has grown from a surf culture staple to a global fashion phenomenon. The brand\'s cozy boots and slippers have become essential comfort footwear, with collaborations and new silhouettes keeping it relevant in streetwear.',
      founded: '1978',
      headquarters: 'Goleta, California',
      highlights: ['Iconic sheepskin boots', 'Tasman slipper phenomenon', 'High-fashion collaborations'],
      featuredImage: 'https://images.stockx.com/images/UGG-Classic-Short-II-Boot-Chestnut-W-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      featuredShoe: 'UGG Classic Boot'
    },
    crocs: {
      description: 'Crocs is an American footwear company known for its foam clog shoes. Once considered purely functional, Crocs has undergone a massive cultural revival through celebrity endorsements and high-profile collaborations. The brand\'s customizable Jibbitz charms and bold colorways have made it a streetwear staple.',
      founded: '2002',
      headquarters: 'Broomfield, Colorado',
      highlights: ['Classic Clog icon', 'Celebrity collaborations', 'Jibbitz customization culture'],
      featuredImage: 'https://images.stockx.com/images/Crocs-Classic-Clog-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      featuredShoe: 'Crocs Classic Clog'
    },
    puma: {
      description: 'Puma is a German multinational corporation that designs athletic and casual footwear. With roots in track and field, Puma has built a legacy around speed and style. Iconic silhouettes like the Suede, RS-X, and Clyde have cemented the brand in sneaker culture, while collaborations with Rihanna and other artists have brought it to the forefront of fashion.',
      founded: '1948',
      headquarters: 'Herzogenaurach, Germany',
      highlights: ['Suede classic heritage', 'RS-X technology line', 'High-profile celebrity collabs'],
      featuredImage: 'https://images.stockx.com/images/Puma-Suede-Classic-XXI-Black-White-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      featuredShoe: 'Puma Suede Classic'
    },
    reebok: {
      description: 'Reebok is an American-founded fitness and lifestyle brand with a storied history in basketball and training. Allen Iverson\'s Question and Answer lines became cultural icons, while the Classic Leather and Club C remain timeless staples. Now owned by Authentic Brands Group, Reebok continues to blend athletic heritage with streetwear appeal.',
      founded: '1958',
      headquarters: 'Boston, Massachusetts',
      highlights: ['Iverson Question legacy', 'Classic Leather icon', 'Fitness heritage brand'],
      featuredImage: 'https://images.stockx.com/images/Reebok-Club-C-85-Vintage-Chalk-Green-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90',
      featuredShoe: 'Reebok Club C 85'
    }
  };

  const brandIds = ['jordan', 'nike', 'yeezy', 'adidas', 'new-balance', 'puma', 'reebok', 'ugg', 'crocs'];

  return (
    <main className="kl-brands-page">
      <section className="kl-brands-hero">
        <h1>Our <em>Brands</em></h1>
        <p>Explore the iconic sneaker brands we curate. Shop from trusted retailers and authenticated marketplaces.</p>
      </section>

      <section className="kl-brands-grid">
        {brandIds.map((brandId, idx) => {
          const products = getProductsByCategory(brandId);
          const productCount = products.length;
          const info = brandsInfo[brandId];
          const brandNameMap = { 'new-balance': 'New Balance', 'puma': 'Puma', 'reebok': 'Reebok', 'ugg': 'UGG', 'crocs': 'Crocs' };
          const brandName = brandNameMap[brandId] || brandId.charAt(0).toUpperCase() + brandId.slice(1);

          return (
            <article key={brandId} className="kl-brand-card" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="kl-brand-image">
                <img src={info.featuredImage} alt={brandName} />
              </div>
              <div className="kl-brand-content">
                <div className="kl-brand-header">
                  <h2>{brandName}</h2>
                  <span className="kl-brand-count">{productCount} Products</span>
                </div>
                <div className="kl-brand-meta">
                  <span>Est. {info.founded}</span>
                  <span>{info.headquarters}</span>
                </div>
                <p className="kl-brand-description">{info.description}</p>
                <ul className="kl-brand-highlights">
                  {info.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </ul>
                <button className="kl-btn kl-btn-outline" onClick={() => navigate(`/category/${brandId}`)}>
                  Browse {brandName}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
};

// ============================================
// Terms of Service Page
// ============================================
const TermsPage = () => {
  const { navigate } = useApp();

  return (
    <main className="kl-legal-page">
      <div className="kl-legal-container">
        <nav className="kl-breadcrumb">
          <a href="#/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a>
          <span className="kl-breadcrumb-sep">/</span>
          <span className="kl-breadcrumb-current">Terms of Service</span>
        </nav>

        <h1>Terms of Service</h1>
        <p className="kl-legal-updated">Last Updated: February 12, 2026</p>

        <section className="kl-legal-section">
          <h2>1. Acceptance of Terms</h2>
          <p>Welcome to KicksList ("Company," "we," "us," or "our"). By accessing or using our website at kickslist.net (the "Service"), you ("User," "you," or "your") agree to be legally bound by these Terms of Service ("Terms"), our Privacy Policy, and all applicable laws and regulations. If you do not agree to these Terms, you must immediately discontinue use of the Service.</p>
          <p>We reserve the right to modify, amend, or update these Terms at any time and at our sole discretion. Changes become effective immediately upon posting to the Service. Your continued use of the Service after any modifications constitutes your binding acceptance of the revised Terms. It is your responsibility to review these Terms periodically.</p>
          <p><strong>PLEASE READ THESE TERMS CAREFULLY. THEY CONTAIN AN ARBITRATION AGREEMENT AND CLASS ACTION WAIVER THAT AFFECT YOUR LEGAL RIGHTS.</strong></p>
        </section>

        <section className="kl-legal-section">
          <h2>2. Description of Service</h2>
          <p>KicksList is a sneaker discovery and price comparison platform. We aggregate publicly available product information, images, and pricing from third-party retailers and resale marketplaces to help users find and compare sneakers.</p>
          <p><strong>Important — KicksList Does Not Sell Products:</strong> KicksList is solely an informational and affiliate referral service. We do not manufacture, sell, ship, warehouse, authenticate, or handle any products. We do not process payments or fulfill orders. All purchases are made directly through the respective third-party retailer or marketplace websites. KicksList is not a party to any transaction between you and any third-party vendor.</p>
        </section>

        <section className="kl-legal-section">
          <h2>3. Affiliate Disclosure</h2>
          <p>KicksList participates in affiliate marketing programs, including but not limited to programs operated by Impact, CJ Affiliate, Rakuten, and others. This means we may earn a commission when you click on links to retailers or marketplaces on our Service and make a purchase. This comes at no additional cost to you.</p>
          <p>Our affiliate relationships do not influence our product listings, rankings, or the information we display. We strive to provide accurate and unbiased information. However, we cannot guarantee that all product information is complete or current, as this data is sourced from third parties.</p>
          <p>In accordance with FTC guidelines, we disclose that affiliate links on this site may generate revenue for KicksList.</p>
        </section>

        <section className="kl-legal-section">
          <h2>4. Product Information and Pricing</h2>
          <p>All product information, including names, descriptions, images, and pricing, is sourced from third-party vendors and publicly available data. While we make reasonable efforts to display accurate information, we make no representations or warranties regarding the accuracy, completeness, reliability, or currentness of any product information displayed on our Service.</p>
          <p>Prices displayed on KicksList are for informational and reference purposes only. Actual prices, availability, promotions, and product details on vendor websites may differ and may change at any time without notice. You must always verify the final price, product details, and availability directly on the vendor's website before making any purchase.</p>
          <p>KicksList shall not be held liable for any pricing errors, product description inaccuracies, or outdated information displayed on our Service.</p>
        </section>

        <section className="kl-legal-section">
          <h2>5. Third-Party Vendors and Links</h2>
          <p>Our Service contains links to third-party websites, including but not limited to retailers, resale marketplaces, and other external sites. These third-party sites operate independently of KicksList, and each has its own terms of service, privacy policies, and business practices, which we strongly encourage you to review before engaging with them.</p>
          <p><strong>KicksList expressly disclaims any and all responsibility and liability for:</strong></p>
          <ul>
            <li>The content, accuracy, legality, or practices of any third-party websites</li>
            <li>Any products or services purchased from, or offered by, third-party vendors</li>
            <li>The authenticity, quality, safety, legality, or condition of any products sold by third parties</li>
            <li>Any disputes, claims, or issues between you and any third-party vendor</li>
            <li>Shipping, delivery, returns, exchanges, refunds, or customer service provided by third parties</li>
            <li>Any financial loss, personal injury, or property damage arising from your interactions with third parties</li>
            <li>Any unauthorized charges, fraud, or security breaches occurring on third-party websites</li>
          </ul>
          <p>Any transactions you conduct with third-party vendors are solely between you and that vendor. KicksList acts only as a referral service and assumes no liability whatsoever for any aspect of your dealings with third parties.</p>
        </section>

        <section className="kl-legal-section">
          <h2>6. No Endorsement or Guarantee</h2>
          <p>The inclusion of any product, brand, retailer, or marketplace on our Service does not constitute an endorsement, recommendation, or guarantee by KicksList. We do not verify, authenticate, or inspect any products listed on our Service. We do not guarantee that any third-party vendor is legitimate, authorized, or trustworthy. Users assume all risk when purchasing from any third-party vendor linked from our Service.</p>
        </section>

        <section className="kl-legal-section">
          <h2>7. Intellectual Property</h2>
          <p>The KicksList name, logo, domain name, and all related marks, as well as the design, layout, look, appearance, and graphics of our Service, are the property of KicksList and are protected by United States and international intellectual property laws. You may not reproduce, distribute, modify, create derivative works of, publicly display, or otherwise use any of our intellectual property without our prior written consent.</p>
          <p>Product names, brand names, trademarks, logos, and images displayed on our Service are the property of their respective owners. Their display on our Service is for informational purposes only and does not imply any affiliation with, endorsement by, or sponsorship by those brands or trademark holders. If you believe any content on our Service infringes your intellectual property rights, please contact us using the information in Section 15.</p>
        </section>

        <section className="kl-legal-section">
          <h2>8. DMCA / Copyright Complaints</h2>
          <p>If you believe that content on our Service infringes your copyright, please send a written notice to our designated agent at contact@kickslist.net containing: (a) a description of the copyrighted work you claim has been infringed; (b) a description of where the allegedly infringing material is located on our Service; (c) your contact information; (d) a statement that you have a good faith belief that the use is not authorized; (e) a statement under penalty of perjury that the information in your notice is accurate and that you are the copyright owner or authorized to act on the owner's behalf; and (f) your physical or electronic signature.</p>
        </section>

        <section className="kl-legal-section">
          <h2>9. User Conduct</h2>
          <p>By using our Service, you agree not to:</p>
          <ul>
            <li>Use the Service for any unlawful, fraudulent, or malicious purpose</li>
            <li>Attempt to gain unauthorized access to our systems, servers, or networks</li>
            <li>Use automated tools, bots, scrapers, crawlers, or similar technology to access, collect, or extract data from our Service without our express written permission</li>
            <li>Interfere with, disrupt, or place an undue burden on the Service or its infrastructure</li>
            <li>Reproduce, duplicate, copy, sell, resell, or otherwise exploit any part of our Service for commercial purposes without our express written permission</li>
            <li>Attempt to reverse-engineer, decompile, or disassemble any software or technology used in the Service</li>
            <li>Transmit any viruses, malware, or other harmful code</li>
            <li>Impersonate any person or entity, or misrepresent your affiliation with any person or entity</li>
            <li>Circumvent, disable, or otherwise interfere with any security features of the Service</li>
          </ul>
          <p>Violation of these provisions may result in immediate termination of your access to the Service and may subject you to civil and/or criminal liability.</p>
        </section>

        <section className="kl-legal-section">
          <h2>10. Disclaimer of Warranties</h2>
          <p>THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, KICKSLIST DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, NON-INFRINGEMENT, AND ACCURACY.</p>
          <p>WITHOUT LIMITING THE FOREGOING, KICKSLIST MAKES NO WARRANTY OR REPRESENTATION THAT: (A) THE SERVICE WILL MEET YOUR REQUIREMENTS OR EXPECTATIONS; (B) THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE; (C) ANY INFORMATION OBTAINED THROUGH THE SERVICE WILL BE ACCURATE, RELIABLE, OR COMPLETE; (D) ANY DEFECTS OR ERRORS IN THE SERVICE WILL BE CORRECTED; OR (E) THE SERVICE OR ITS SERVERS ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.</p>
          <p>YOU EXPRESSLY ACKNOWLEDGE AND AGREE THAT YOUR USE OF THE SERVICE IS AT YOUR SOLE RISK. KICKSLIST DOES NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR ANY PRODUCT OR SERVICE ADVERTISED OR OFFERED BY A THIRD PARTY THROUGH THE SERVICE OR ANY LINKED WEBSITE.</p>
        </section>

        <section className="kl-legal-section">
          <h2>11. Limitation of Liability</h2>
          <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL KICKSLIST, ITS OWNERS, OPERATORS, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AFFILIATES, LICENSORS, OR SERVICE PROVIDERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF PROFITS, REVENUE, GOODWILL, DATA, OR OTHER INTANGIBLE LOSSES, REGARDLESS OF WHETHER SUCH DAMAGES ARE BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY, OR ANY OTHER LEGAL THEORY, AND WHETHER OR NOT KICKSLIST HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES, RESULTING FROM:</p>
          <ul>
            <li>Your access to, use of, or inability to use the Service</li>
            <li>Any products or services purchased or obtained from third-party vendors through links on our Service</li>
            <li>Any conduct or content of any third party on or linked from the Service</li>
            <li>Unauthorized access to, alteration of, or loss of your data or transmissions</li>
            <li>Any errors, inaccuracies, omissions, or misleading information in our content, including product prices, descriptions, and images</li>
            <li>Any personal injury, property damage, or financial loss of any nature arising from your use of the Service</li>
            <li>Any bugs, viruses, or other harmful code that may be transmitted through the Service</li>
          </ul>
          <p>IN NO EVENT SHALL THE TOTAL AGGREGATE LIABILITY OF KICKSLIST FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THE USE OF THE SERVICE EXCEED THE GREATER OF: (A) THE AMOUNT YOU PAID TO KICKSLIST, IF ANY, IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM; OR (B) ONE HUNDRED U.S. DOLLARS ($100.00).</p>
          <p>SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES, SO SOME OF THE ABOVE LIMITATIONS MAY NOT APPLY TO YOU. IN SUCH JURISDICTIONS, KICKSLIST'S LIABILITY SHALL BE LIMITED TO THE FULLEST EXTENT PERMITTED BY LAW.</p>
        </section>

        <section className="kl-legal-section">
          <h2>12. Indemnification</h2>
          <p>You agree to indemnify, defend, and hold harmless KicksList and its owners, operators, officers, directors, employees, agents, affiliates, licensors, and service providers from and against any and all claims, demands, actions, damages, losses, liabilities, judgments, settlements, costs, and expenses (including reasonable attorneys' fees and legal costs) arising out of or relating to: (a) your use of or access to the Service; (b) your violation of these Terms; (c) your violation of any applicable law, regulation, or third-party right; (d) any content or information you submit or transmit through the Service; or (e) any dispute between you and a third-party vendor.</p>
          <p>KicksList reserves the right, at your expense, to assume the exclusive defense and control of any matter for which you are required to indemnify us, and you agree to cooperate with our defense of such claims.</p>
        </section>

        <section className="kl-legal-section">
          <h2>13. Dispute Resolution and Arbitration</h2>
          <p><strong>PLEASE READ THIS SECTION CAREFULLY — IT AFFECTS YOUR LEGAL RIGHTS.</strong></p>
          <p><strong>Binding Arbitration:</strong> Any dispute, controversy, or claim arising out of or relating to these Terms or the Service, including the determination of the scope or applicability of this agreement to arbitrate, shall be determined by binding arbitration administered in accordance with the rules of the American Arbitration Association ("AAA"). The arbitration shall be conducted by a single arbitrator in the State of California. The language of the arbitration shall be English. Judgment on the arbitration award may be entered in any court having jurisdiction.</p>
          <p><strong>Class Action Waiver:</strong> YOU AND KICKSLIST AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS, CONSOLIDATED, OR REPRESENTATIVE PROCEEDING. THE ARBITRATOR MAY NOT CONSOLIDATE MORE THAN ONE PERSON'S CLAIMS AND MAY NOT OTHERWISE PRESIDE OVER ANY FORM OF A CLASS OR REPRESENTATIVE PROCEEDING.</p>
          <p><strong>Waiver of Jury Trial:</strong> TO THE EXTENT PERMITTED BY LAW, YOU AND KICKSLIST EACH WAIVE THE RIGHT TO A JURY TRIAL FOR ANY DISPUTES COVERED BY THESE TERMS.</p>
          <p><strong>Exception:</strong> Notwithstanding the foregoing, either party may bring an individual action in small claims court for disputes within the jurisdiction of such court, and either party may seek injunctive or equitable relief in any court of competent jurisdiction to protect its intellectual property rights.</p>
        </section>

        <section className="kl-legal-section">
          <h2>14. Governing Law</h2>
          <p>These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions. To the extent that arbitration does not apply, you consent to the exclusive jurisdiction of the state and federal courts located in California for the resolution of any disputes.</p>
        </section>

        <section className="kl-legal-section">
          <h2>15. Termination</h2>
          <p>KicksList reserves the right to terminate or suspend your access to the Service, without prior notice or liability, for any reason whatsoever, including but not limited to a breach of these Terms. Upon termination, your right to use the Service will immediately cease. All provisions of these Terms that by their nature should survive termination shall survive, including but not limited to ownership provisions, warranty disclaimers, indemnification, arbitration, and limitations of liability.</p>
        </section>

        <section className="kl-legal-section">
          <h2>16. Severability</h2>
          <p>If any provision of these Terms is found to be unlawful, void, or unenforceable by a court of competent jurisdiction, that provision shall be deemed severable and shall not affect the validity and enforceability of the remaining provisions, which shall remain in full force and effect.</p>
        </section>

        <section className="kl-legal-section">
          <h2>17. Entire Agreement</h2>
          <p>These Terms, together with the Privacy Policy, constitute the entire agreement between you and KicksList regarding the use of the Service and supersede all prior and contemporaneous agreements, understandings, representations, and warranties, both written and oral, regarding the Service.</p>
        </section>

        <section className="kl-legal-section">
          <h2>18. Waiver</h2>
          <p>The failure of KicksList to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision. No waiver of any term shall be deemed a further or continuing waiver of such term or any other term.</p>
        </section>

        <section className="kl-legal-section">
          <h2>19. Contact Information</h2>
          <p>If you have any questions about these Terms of Service, please contact us at:</p>
          <p>Email: contact@kickslist.net</p>
        </section>
      </div>
    </main>
  );
};

// ============================================
// Privacy Policy Page
// ============================================
const PrivacyPage = () => {
  const { navigate } = useApp();

  return (
    <main className="kl-legal-page">
      <div className="kl-legal-container">
        <nav className="kl-breadcrumb">
          <a href="#/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a>
          <span className="kl-breadcrumb-sep">/</span>
          <span className="kl-breadcrumb-current">Privacy Policy</span>
        </nav>

        <h1>Privacy Policy</h1>
        <p className="kl-legal-updated">Last Updated: February 12, 2026</p>

        <section className="kl-legal-section">
          <h2>1. Introduction</h2>
          <p>KicksList ("Company," "we," "our," or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at kickslist.net (the "Service"). Please read this policy carefully. By using the Service, you consent to the practices described in this Privacy Policy.</p>
        </section>

        <section className="kl-legal-section">
          <h2>2. Information We Collect</h2>
          <h3>Information You Voluntarily Provide</h3>
          <p>We may collect information you voluntarily provide when you interact with us, such as:</p>
          <ul>
            <li>Email address (if you subscribe to our newsletter or contact us)</li>
            <li>Name and contact information (if you reach out to us directly)</li>
            <li>Any other information you choose to provide in communications with us</li>
          </ul>

          <h3>Information Automatically Collected</h3>
          <p>When you visit our Service, we and our third-party service providers may automatically collect certain information, including:</p>
          <ul>
            <li>Device and browser information (type, version, operating system)</li>
            <li>IP address and approximate geographic location</li>
            <li>Pages visited, time spent on pages, and navigation paths</li>
            <li>Referring website, search terms, and traffic source</li>
            <li>Date and time of visits</li>
            <li>Clicks on links, including affiliate links to third-party vendors</li>
            <li>Screen resolution and device identifiers</li>
          </ul>
        </section>

        <section className="kl-legal-section">
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect for the following purposes:</p>
          <ul>
            <li>To provide, operate, maintain, and improve our Service</li>
            <li>To analyze website traffic, user behavior, and usage patterns</li>
            <li>To track affiliate link performance and referral conversions</li>
            <li>To send periodic communications, including newsletters and updates (only with your explicit consent)</li>
            <li>To respond to your inquiries, comments, or requests</li>
            <li>To detect, prevent, and address technical issues, fraud, or security concerns</li>
            <li>To comply with legal obligations and enforce our Terms of Service</li>
            <li>To generate aggregated, anonymized, or de-identified data for analytics and business purposes</li>
          </ul>
        </section>

        <section className="kl-legal-section">
          <h2>4. Cookies and Tracking Technologies</h2>
          <p>We use cookies, web beacons, pixels, and similar tracking technologies to:</p>
          <ul>
            <li>Remember your preferences and settings</li>
            <li>Analyze site traffic and user engagement through services such as Google Analytics 4</li>
            <li>Track affiliate referrals and conversions to our partner vendors</li>
            <li>Improve the functionality and performance of our Service</li>
          </ul>
          <p><strong>Google Analytics:</strong> We use Google Analytics 4, which collects data such as your IP address, browser type, pages visited, and session duration. Google may use this data in accordance with its own privacy policy. You can opt out of Google Analytics by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-Out Browser Add-on</a>.</p>
          <p><strong>Affiliate Tracking:</strong> When you click on affiliate links, our affiliate network partners (including Impact, CJ Affiliate, and Rakuten) may place cookies on your device to track referrals and conversions. These cookies are governed by the respective affiliate network's privacy policy.</p>
          <p>You can control and manage cookies through your browser settings. Note that disabling cookies may affect the functionality of our Service. Most browsers allow you to refuse cookies, delete existing cookies, or alert you when cookies are being sent.</p>
        </section>

        <section className="kl-legal-section">
          <h2>5. Third-Party Services and Data Sharing</h2>
          <p>Our Service integrates with and may share data with the following categories of third-party services:</p>
          <ul>
            <li><strong>Affiliate Networks (Impact, CJ Affiliate, Rakuten):</strong> We share referral data (such as click identifiers) with affiliate networks to track conversions. These networks may place cookies on your device.</li>
            <li><strong>Analytics Providers (Google Analytics):</strong> We share usage data with analytics providers to understand how users interact with our Service.</li>
            <li><strong>Hosting Provider (GitHub Pages):</strong> Our Service is hosted on GitHub Pages, which may collect server logs including IP addresses.</li>
            <li><strong>Third-Party Retailers:</strong> When you click links to vendors like StockX, GOAT, Nike, Foot Locker, or others, those sites will collect information according to their own privacy policies. We encourage you to review them.</li>
          </ul>
          <p><strong>We do not sell your personal information.</strong> We may disclose information to:</p>
          <ul>
            <li>Service providers who assist in operating our website and business</li>
            <li>Affiliate partners, limited to referral and conversion tracking</li>
            <li>Legal authorities when required by law, subpoena, or court order</li>
            <li>Third parties in connection with a merger, acquisition, or sale of assets</li>
            <li>Any party with your explicit consent</li>
          </ul>
        </section>

        <section className="kl-legal-section">
          <h2>6. Data Retention</h2>
          <p>We retain your personal information only for as long as necessary to fulfill the purposes described in this Privacy Policy, unless a longer retention period is required or permitted by law. Automatically collected data (such as analytics data) is retained according to the default retention settings of our third-party analytics providers.</p>
        </section>

        <section className="kl-legal-section">
          <h2>7. Data Security</h2>
          <p>We implement commercially reasonable administrative, technical, and physical security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of electronic transmission or storage is completely secure, and we cannot guarantee the absolute security of your information. You acknowledge that you provide your information at your own risk.</p>
        </section>

        <section className="kl-legal-section">
          <h2>8. Your Rights and Choices</h2>
          <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
          <ul>
            <li><strong>Right to Access:</strong> Request a copy of the personal information we hold about you</li>
            <li><strong>Right to Correction:</strong> Request correction of inaccurate or incomplete information</li>
            <li><strong>Right to Deletion:</strong> Request deletion of your personal information, subject to certain exceptions</li>
            <li><strong>Right to Opt Out:</strong> Opt out of marketing communications, cookies, or certain data collection</li>
            <li><strong>Right to Data Portability:</strong> Request your data in a structured, commonly used format</li>
            <li><strong>Right to Object:</strong> Object to certain types of data processing</li>
          </ul>
          <p>To exercise any of these rights, please contact us at contact@kickslist.net. We will respond to your request within 30 days or as required by applicable law.</p>
        </section>

        <section className="kl-legal-section">
          <h2>9. California Privacy Rights (CCPA/CPRA)</h2>
          <p>If you are a California resident, the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA) provide you with additional rights, including:</p>
          <ul>
            <li>The right to know what personal information is collected, used, shared, or sold</li>
            <li>The right to request deletion of your personal information</li>
            <li>The right to opt out of the sale or sharing of personal information</li>
            <li>The right to non-discrimination for exercising your privacy rights</li>
            <li>The right to correct inaccurate personal information</li>
            <li>The right to limit the use of sensitive personal information</li>
          </ul>
          <p><strong>We do not sell or share personal information</strong> as defined under the CCPA/CPRA. To submit a verifiable consumer request, please contact us at contact@kickslist.net.</p>
        </section>

        <section className="kl-legal-section">
          <h2>10. European Privacy Rights (GDPR)</h2>
          <p>If you are located in the European Economic Area (EEA), United Kingdom, or Switzerland, you have rights under the General Data Protection Regulation (GDPR), including the rights described in Section 8 above. Our legal basis for processing your personal information includes: (a) your consent; (b) our legitimate business interests; and (c) compliance with legal obligations.</p>
          <p>If you wish to exercise your GDPR rights or have concerns about our data practices, please contact us at contact@kickslist.net. You also have the right to lodge a complaint with your local data protection authority.</p>
        </section>

        <section className="kl-legal-section">
          <h2>11. Do Not Track Signals</h2>
          <p>Some web browsers transmit "Do Not Track" (DNT) signals. Because there is no uniform standard for interpreting DNT signals, our Service does not currently respond to DNT signals. However, you can manage your privacy preferences through browser settings and the opt-out tools described in this policy.</p>
        </section>

        <section className="kl-legal-section">
          <h2>12. Children's Privacy</h2>
          <p>Our Service is not directed to, and we do not knowingly collect personal information from, children under the age of 13 (or 16 in the EEA). If we become aware that we have collected personal information from a child under the applicable age, we will take steps to delete such information promptly. If you believe we have collected information from a child, please contact us immediately at contact@kickslist.net.</p>
        </section>

        <section className="kl-legal-section">
          <h2>13. International Data Transfers</h2>
          <p>Our Service is operated in the United States. If you access the Service from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States, where data protection laws may differ from those in your jurisdiction. By using the Service, you consent to the transfer of your information to the United States.</p>
        </section>

        <section className="kl-legal-section">
          <h2>14. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time at our sole discretion. We will notify you of material changes by posting the updated policy on this page and updating the "Last Updated" date. Your continued use of the Service after any changes constitutes your acceptance of the revised policy. We encourage you to review this page periodically.</p>
        </section>

        <section className="kl-legal-section">
          <h2>15. Contact Us</h2>
          <p>If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:</p>
          <p>Email: contact@kickslist.net</p>
        </section>
      </div>
    </main>
  );
};

// ============================================
// Footer (Updated with Vendors)
// ============================================
const Footer = () => {
  const { navigate } = useApp();
  const { vendors } = window.KicksListVendors;

  return (
    <footer className="kl-footer">
      <div className="kl-footer-main">
        <div className="kl-footer-brand">
          <a href="#/" className="kl-logo" onClick={(e) => { e.preventDefault(); navigate('/'); }}>KicksList</a>
          <p>Discover and shop authentic sneakers from trusted retailers and marketplaces.</p>
        </div>
        <div className="kl-footer-links">
          <div className="kl-footer-col">
            <h5>Brands</h5>
            <ul>
              <li><a href="#/category/jordan" onClick={(e) => { e.preventDefault(); navigate('/category/jordan'); }}>Jordan</a></li>
              <li><a href="#/category/nike" onClick={(e) => { e.preventDefault(); navigate('/category/nike'); }}>Nike</a></li>
              <li><a href="#/category/adidas" onClick={(e) => { e.preventDefault(); navigate('/category/adidas'); }}>Adidas</a></li>
              <li><a href="#/category/new-balance" onClick={(e) => { e.preventDefault(); navigate('/category/new-balance'); }}>New Balance</a></li>
              <li><a href="#/category/puma" onClick={(e) => { e.preventDefault(); navigate('/category/puma'); }}>Puma</a></li>
              <li><a href="#/category/reebok" onClick={(e) => { e.preventDefault(); navigate('/category/reebok'); }}>Reebok</a></li>
              <li><a href="#/category/yeezy" onClick={(e) => { e.preventDefault(); navigate('/category/yeezy'); }}>Yeezy</a></li>
              <li><a href="#/category/ugg" onClick={(e) => { e.preventDefault(); navigate('/category/ugg'); }}>UGG</a></li>
              <li><a href="#/category/crocs" onClick={(e) => { e.preventDefault(); navigate('/category/crocs'); }}>Crocs</a></li>
            </ul>
          </div>
          <div className="kl-footer-col">
            <h5>Retailers</h5>
            <ul>
              {vendors.filter(v => v.type === 'retail').map(vendor => (
                <li key={vendor.id}>
                  <a href={vendor.url} target="_blank" rel="noopener noreferrer">{vendor.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="kl-footer-col">
            <h5>Resale</h5>
            <ul>
              {vendors.filter(v => v.type === 'resale').map(vendor => (
                <li key={vendor.id}>
                  <a href={vendor.url} target="_blank" rel="noopener noreferrer">{vendor.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="kl-footer-col">
            <h5>Company</h5>
            <ul>
              <li><a href="#/about" onClick={(e) => { e.preventDefault(); navigate('/about'); }}>About Us</a></li>
              <li><a href="#/brands" onClick={(e) => { e.preventDefault(); navigate('/brands'); }}>Our Brands</a></li>
              <li><a href="#/privacy" onClick={(e) => { e.preventDefault(); navigate('/privacy'); }}>Privacy Policy</a></li>
              <li><a href="#/terms" onClick={(e) => { e.preventDefault(); navigate('/terms'); }}>Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="kl-footer-bottom">
        <p>© 2026 KicksList. All rights reserved.</p>
        <div className="kl-footer-legal">
          <a href="#/privacy" onClick={(e) => { e.preventDefault(); navigate('/privacy'); }}>Privacy Policy</a>
          <a href="#/terms" onClick={(e) => { e.preventDefault(); navigate('/terms'); }}>Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

// ============================================
// Main App (Cart Drawer removed)
// ============================================
// ============================================
// SEO Helper - Update page title and meta
// ============================================
const updatePageMeta = (title, description, image = null) => {
  document.title = title;

  // Update meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', description);

  // Update OG tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', title);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', description);

  if (image) {
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute('content', image);

    const twImage = document.querySelector('meta[name="twitter:image"]');
    if (twImage) twImage.setAttribute('content', image);
  }

  // Update Twitter tags
  const twTitle = document.querySelector('meta[name="twitter:title"]');
  if (twTitle) twTitle.setAttribute('content', title);

  const twDesc = document.querySelector('meta[name="twitter:description"]');
  if (twDesc) twDesc.setAttribute('content', description);
};

const App = () => {
  const { route } = useApp();
  const { getProductById, categories } = window.KicksListData;

  // Update page title based on route
  useEffect(() => {
    const baseTitle = 'KicksList';
    let title = baseTitle;
    let description = 'Compare prices on 20,000+ sneakers from Jordan, Nike, Adidas, Yeezy, New Balance, and more.';
    let image = null;

    switch (route.page) {
      case 'home':
        title = `${baseTitle} | Discover & Shop Authentic Sneakers`;
        break;
      case 'product':
        const product = getProductById(route.params.id);
        if (product) {
          title = `${product.name} | ${baseTitle}`;
          description = `Shop ${product.name} from ${product.brand}. Compare prices from StockX, GOAT, and other trusted retailers. Retail: $${product.retail}.`;
          image = product.images?.[0] || null;
        }
        break;
      case 'shop':
        if (route.params.category) {
          const cat = categories.find(c => c.id === route.params.category);
          title = `${cat?.name || route.params.category} Sneakers | ${baseTitle}`;
          description = `Browse ${cat?.count || ''} ${cat?.name || route.params.category} sneakers. Compare prices from trusted retailers.`;
        } else if (route.params.q) {
          title = `Search: ${route.params.q} | ${baseTitle}`;
          description = `Search results for "${route.params.q}" on KicksList. Find the best prices on authentic sneakers.`;
        } else {
          title = `Shop All Sneakers | ${baseTitle}`;
          description = `Browse 20,000+ sneakers from Jordan, Nike, Adidas, Yeezy, and more. Compare prices from trusted retailers.`;
        }
        break;
      case 'brands':
        title = `Brands | ${baseTitle}`;
        description = `Explore top sneaker brands including Jordan, Nike, Adidas, Yeezy, New Balance, UGG, and Crocs.`;
        break;
      case 'about':
        title = `About Us | ${baseTitle}`;
        description = `Learn about KicksList - your trusted source for comparing sneaker prices from verified retailers and marketplaces.`;
        break;
      case 'terms':
        title = `Terms of Service | ${baseTitle}`;
        description = `KicksList Terms of Service - read our terms and conditions for using our sneaker price comparison platform.`;
        break;
      case 'privacy':
        title = `Privacy Policy | ${baseTitle}`;
        description = `KicksList Privacy Policy - learn how we collect, use, and protect your information.`;
        break;
      default:
        title = `${baseTitle} | Discover & Shop Authentic Sneakers`;
    }

    updatePageMeta(title, description, image);

    trackEvent('page_view', {
      page_title: title,
      page_path: window.location.hash || '#/'
    });
  }, [route]);

  let PageComponent;
  switch (route.page) {
    case 'product':
      PageComponent = ProductDetailPage;
      break;
    case 'shop':
      PageComponent = ShopPage;
      break;
    case 'about':
      PageComponent = AboutPage;
      break;
    case 'brands':
      PageComponent = BrandsPage;
      break;
    case 'terms':
      PageComponent = TermsPage;
      break;
    case 'privacy':
      PageComponent = PrivacyPage;
      break;
    default:
      PageComponent = Homepage;
  }

  return (
    <div className="kl-app">
      <Navigation />
      <PageComponent />
      <Footer />
    </div>
  );
};

// ============================================
// Root
// ============================================
const Root = () => (
  <AppProvider>
    <App />
  </AppProvider>
);

// Render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Root />);

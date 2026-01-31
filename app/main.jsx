/**
 * KicksList - Sneaker Discovery & Shopping
 * Find and shop authentic sneakers from trusted retailers
 */

const { useState, useEffect, useRef, useCallback, createContext, useContext } = React;

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
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
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
          </div>
        </div>
      </nav>

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
        {featuredProducts.length > 1 && (
          <div className="kl-hero-nav">
            {featuredProducts.slice(0, 3).map((_, idx) => (
              <button
                key={idx}
                className={`kl-hero-dot ${idx === activeHeroSlide ? 'active' : ''}`}
                onClick={() => setActiveHeroSlide(idx)}
              />
            ))}
          </div>
        )}
        <div className="kl-hero-scroll">
          <span>Scroll to explore</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 5v14M19 12l-7 7-7-7"/>
          </svg>
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
            <p className="kl-section-eyebrow">Just Listed</p>
            <h2 className="kl-section-title">Featured Drops</h2>
          </div>
          <a href="#/shop?filter=new" className="kl-section-link" onClick={(e) => { e.preventDefault(); navigate('/shop?filter=new'); }}>
            View All
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
        </div>
        <div className="kl-product-grid">
          {newDrops.slice(0, 4).map((product, idx) => (
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
  const productsPerPage = 20;

  const queryParam = route.params.q || searchQuery;

  let filteredProducts = queryParam
    ? searchProducts(queryParam)
    : getProductsByCategory(activeCategory);

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

  // Reset to page 1 when category or search changes
  useEffect(() => {
    setActiveCategory(route.params.category || 'all');
    setCurrentPage(1);
  }, [route.params.category, queryParam]);

  // Scroll to top when page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
                    Previous
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
        <h1>Discover Your Next<br /><em>Grail</em></h1>
        <p>KicksList curates authentic sneakers from trusted retailers and resale platforms. Find your perfect pair and shop with confidence from verified vendors.</p>
      </section>

      <section className="kl-about-values">
        <div className="kl-about-value">
          <span className="kl-about-value-num">01</span>
          <h3>Curated Collection</h3>
          <p>We handpick the most sought-after sneakers from Jordan, Nike, Adidas, Yeezy, New Balance, and more. Every shoe in our catalog is worth your attention.</p>
        </div>
        <div className="kl-about-value">
          <span className="kl-about-value-num">02</span>
          <h3>Trusted Sources</h3>
          <p>Shop from verified retailers like Nike, Foot Locker, and authenticated marketplaces like StockX and GOAT. Every vendor has a proven track record.</p>
        </div>
        <div className="kl-about-value">
          <span className="kl-about-value-num">03</span>
          <h3>Easy Discovery</h3>
          <p>Browse by brand, style, or release date. Find exactly what you're looking for with smart filters and search. No more endless scrolling across multiple sites.</p>
        </div>
      </section>

      <section className="kl-about-stats">
        <div className="kl-about-stat"><span>10+</span><p>Trusted Retailers</p></div>
        <div className="kl-about-stat"><span>{products.length}</span><p>Sneakers Curated</p></div>
        <div className="kl-about-stat"><span>5</span><p>Top Brands</p></div>
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
      highlights: ['Most collected sneaker brand', 'Retro releases highly sought after', 'Collaboration culture pioneer']
    },
    nike: {
      description: 'Nike, Inc. is the world\'s largest supplier of athletic shoes and apparel. Known for groundbreaking innovation like Air Max, React, and ZoomX technologies, Nike continues to push the boundaries of performance and style. From the iconic Dunk to the revolutionary Air Force 1, Nike\'s sneaker lineup defines casual and athletic footwear.',
      founded: '1964',
      headquarters: 'Beaverton, Oregon',
      highlights: ['Air Max technology pioneer', 'Dunk resurgence leader', 'Sustainable Move to Zero initiative']
    },
    yeezy: {
      description: 'Yeezy is a fashion collaboration between Adidas and designer Kanye West. Known for its distinctive Boost cushioning and futuristic aesthetic, Yeezy revolutionized the sneaker industry with limited releases and unprecedented demand. The Yeezy Boost 350 became one of the most influential sneaker designs of the 2010s.',
      founded: '2015',
      headquarters: 'Portland, Oregon',
      highlights: ['Boost technology integration', 'Limited release strategy', 'Distinctive earth-tone colorways']
    },
    adidas: {
      description: 'Adidas is a German multinational corporation that designs and manufactures shoes, clothing and accessories. With iconic silhouettes like the Samba, Superstar, and Stan Smith, Adidas has influenced street culture for decades. The brand\'s collaborations with designers and artists continue to push creative boundaries.',
      founded: '1949',
      headquarters: 'Herzogenaurach, Germany',
      highlights: ['Three Stripes heritage', 'Samba revival phenomenon', 'Sustainable Futurecraft innovations']
    },
    'new-balance': {
      description: 'New Balance is an American multinational corporation known for its commitment to domestic manufacturing and quality craftsmanship. The brand has experienced a major resurgence with models like the 550, 2002R, and collaborations with high-end designers. Known as the "dad shoe" brand turned fashion favorite.',
      founded: '1906',
      headquarters: 'Boston, Massachusetts',
      highlights: ['Made in USA craftsmanship', '550 basketball revival', 'Designer collaboration leader']
    },
    ugg: {
      description: 'UGG is an American footwear company best known for its sheepskin boots. Founded in Southern California, UGG has grown from a surf culture staple to a global fashion phenomenon. The brand\'s cozy boots and slippers have become essential comfort footwear, with collaborations and new silhouettes keeping it relevant in streetwear.',
      founded: '1978',
      headquarters: 'Goleta, California',
      highlights: ['Iconic sheepskin boots', 'Tasman slipper phenomenon', 'High-fashion collaborations']
    },
    crocs: {
      description: 'Crocs is an American footwear company known for its foam clog shoes. Once considered purely functional, Crocs has undergone a massive cultural revival through celebrity endorsements and high-profile collaborations. The brand\'s customizable Jibbitz charms and bold colorways have made it a streetwear staple.',
      founded: '2002',
      headquarters: 'Broomfield, Colorado',
      highlights: ['Classic Clog icon', 'Celebrity collaborations', 'Jibbitz customization culture']
    }
  };

  const brandIds = ['jordan', 'nike', 'yeezy', 'adidas', 'new-balance', 'ugg', 'crocs'];

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
          const brandNameMap = { 'new-balance': 'New Balance', 'ugg': 'UGG', 'crocs': 'Crocs' };
          const brandName = brandNameMap[brandId] || brandId.charAt(0).toUpperCase() + brandId.slice(1);
          const featuredImage = products[0]?.images[0] || '';

          return (
            <article key={brandId} className="kl-brand-card" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="kl-brand-image">
                {featuredImage && <img src={featuredImage} alt={brandName} />}
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
          <div className="kl-footer-socials">
            <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
            <a href="#" aria-label="Twitter"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5 0-.28-.03-.56-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg></a>
            <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
          </div>
        </div>
        <div className="kl-footer-links">
          <div className="kl-footer-col">
            <h5>Brands</h5>
            <ul>
              <li><a href="#/category/jordan" onClick={(e) => { e.preventDefault(); navigate('/category/jordan'); }}>Jordan</a></li>
              <li><a href="#/category/nike" onClick={(e) => { e.preventDefault(); navigate('/category/nike'); }}>Nike</a></li>
              <li><a href="#/category/adidas" onClick={(e) => { e.preventDefault(); navigate('/category/adidas'); }}>Adidas</a></li>
              <li><a href="#/category/new-balance" onClick={(e) => { e.preventDefault(); navigate('/category/new-balance'); }}>New Balance</a></li>
              <li><a href="#/category/yeezy" onClick={(e) => { e.preventDefault(); navigate('/category/yeezy'); }}>Yeezy</a></li>
              <li><a href="#/category/ugg" onClick={(e) => { e.preventDefault(); navigate('/category/ugg'); }}>UGG</a></li>
              <li><a href="#/category/crocs" onClick={(e) => { e.preventDefault(); navigate('/category/crocs'); }}>Crocs</a></li>
            </ul>
          </div>
          <div className="kl-footer-col">
            <h5>Vendors</h5>
            <ul>
              {vendors.filter(v => v.type === 'retail').slice(0, 3).map(vendor => (
                <li key={vendor.id}>
                  <a href={vendor.url} target="_blank" rel="noopener noreferrer">{vendor.name}</a>
                </li>
              ))}
              {vendors.filter(v => v.type === 'resale').slice(0, 2).map(vendor => (
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
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="kl-footer-bottom">
        <p>© 2026 KicksList. All rights reserved.</p>
        <div className="kl-footer-legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

// ============================================
// Main App (Cart Drawer removed)
// ============================================
const App = () => {
  const { route } = useApp();

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

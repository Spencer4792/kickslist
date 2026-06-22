/**
 * KicksList - Sneaker Discovery & Shopping
 * Find and shop authentic sneakers from trusted retailers
 */

const {
  useState,
  useEffect,
  useRef,
  useCallback,
  createContext,
  useContext
} = React;

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
  const [route, setRoute] = useState({
    page: 'home',
    params: {}
  });
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
        setRoute({
          page: 'home',
          params
        });
      } else if (path.startsWith('/product/')) {
        const id = path.split('/')[2];
        setRoute({
          page: 'product',
          params: {
            id,
            ...params
          }
        });
      } else if (path.startsWith('/shop')) {
        setRoute({
          page: 'shop',
          params
        });
      } else if (path.startsWith('/category/')) {
        const category = path.split('/')[2];
        setRoute({
          page: 'shop',
          params: {
            category,
            ...params
          }
        });
      } else if (path.startsWith('/search')) {
        setRoute({
          page: 'shop',
          params
        });
      } else if (path === '/about') {
        setRoute({
          page: 'about',
          params
        });
      } else if (path === '/brands') {
        setRoute({
          page: 'brands',
          params
        });
      } else if (path === '/terms') {
        setRoute({
          page: 'terms',
          params
        });
      } else if (path === '/privacy') {
        setRoute({
          page: 'privacy',
          params
        });
      } else if (path === '/wishlist') {
        setRoute({
          page: 'wishlist',
          params
        });
      } else if (path === '/affiliate-disclosure') {
        setRoute({
          page: 'affiliate-disclosure',
          params
        });
      } else if (path === '/contact') {
        setRoute({
          page: 'contact',
          params
        });
      } else if (path === '/faq') {
        setRoute({
          page: 'faq',
          params
        });
      } else {
        setRoute({
          page: 'home',
          params
        });
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  const navigate = useCallback(path => {
    window.location.hash = path;
    window.scrollTo(0, 0);
  }, []);
  return {
    route,
    navigate
  };
};

// ============================================
// App Provider (Cart removed)
// ============================================
const AppProvider = ({
  children
}) => {
  const router = useRouter();
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('kickslist-wishlist')) || [];
    } catch {
      return [];
    }
  });
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    localStorage.setItem('kickslist-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);
  const toggleWishlist = useCallback(productId => {
    setWishlist(prev => {
      const isRemoving = prev.includes(productId);
      trackEvent(isRemoving ? 'remove_from_wishlist' : 'add_to_wishlist', {
        item_id: productId
      });
      return isRemoving ? prev.filter(id => id !== productId) : [...prev, productId];
    });
  }, []);
  return /*#__PURE__*/React.createElement(AppContext.Provider, {
    value: {
      ...router,
      wishlist,
      toggleWishlist,
      searchQuery,
      setSearchQuery
    }
  }, children);
};

// ============================================
// Trust Rating Component
// ============================================
const TrustRating = ({
  rating,
  showCount = false,
  count = 0,
  size = 'md'
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  const sizeClasses = {
    sm: 'kl-trust-rating-sm',
    md: 'kl-trust-rating-md',
    lg: 'kl-trust-rating-lg'
  };
  return /*#__PURE__*/React.createElement("div", {
    className: `kl-trust-rating ${sizeClasses[size]}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-trust-stars"
  }, [...Array(fullStars)].map((_, i) => /*#__PURE__*/React.createElement("svg", {
    key: `full-${i}`,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    className: "kl-star kl-star-full"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
  }))), hasHalfStar && /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    className: "kl-star kl-star-half"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "halfGradient"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "50%",
    stopColor: "currentColor"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "50%",
    stopColor: "#e7e5e4"
  }))), /*#__PURE__*/React.createElement("path", {
    fill: "url(#halfGradient)",
    d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
  })), [...Array(emptyStars)].map((_, i) => /*#__PURE__*/React.createElement("svg", {
    key: `empty-${i}`,
    viewBox: "0 0 24 24",
    fill: "#e7e5e4",
    className: "kl-star kl-star-empty"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
  })))), /*#__PURE__*/React.createElement("span", {
    className: "kl-trust-rating-value"
  }, rating.toFixed(1)), showCount && count > 0 && /*#__PURE__*/React.createElement("span", {
    className: "kl-trust-count"
  }, "(", count.toLocaleString(), " reviews)"));
};

// ============================================
// Price Display Component (Shows Retail Price)
// ============================================
const PriceDisplay = ({
  product
}) => {
  const retailPrice = product.retail;
  if (!retailPrice) {
    return /*#__PURE__*/React.createElement("span", {
      className: "kl-price-range kl-out-of-stock"
    }, "Price Unavailable");
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "kl-price-range"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kl-price-label"
  }, "Retail:"), /*#__PURE__*/React.createElement("span", {
    className: "kl-price-low"
  }, "$", retailPrice.toLocaleString()));
};

// ============================================
// Where To Buy Section (Direct Links to Vendors)
// ============================================
const VendorComparisonTable = ({
  product
}) => {
  const {
    generateVendorPrices
  } = window.KicksListData;
  const {
    getVendorById,
    getRetailVendors,
    getResaleVendors
  } = window.KicksListVendors;
  const vendorPrices = generateVendorPrices(product);

  // Separate retail and resale vendors
  const retailVendors = vendorPrices.filter(v => v.type === 'retail');
  const resaleVendors = vendorPrices.filter(v => v.type === 'resale');
  const VendorRow = ({
    vendorPrice,
    isResale = false
  }) => {
    const vendor = getVendorById(vendorPrice.vendorId);
    return /*#__PURE__*/React.createElement("div", {
      className: "kl-comparison-row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "kl-comparison-vendor"
    }, /*#__PURE__*/React.createElement("span", {
      className: "kl-vendor-name",
      style: {
        color: vendor.color
      }
    }, vendor.name), !isResale && /*#__PURE__*/React.createElement("span", {
      className: "kl-retail-badge"
    }, "Retail"), isResale && /*#__PURE__*/React.createElement("span", {
      className: "kl-resale-badge"
    }, "Resale")), /*#__PURE__*/React.createElement("div", {
      className: "kl-comparison-rating"
    }, /*#__PURE__*/React.createElement(TrustRating, {
      rating: vendor.trustRating,
      size: "sm"
    }), /*#__PURE__*/React.createElement("span", {
      className: "kl-vendor-reviews"
    }, "(", vendor.trustCount.toLocaleString(), ")")), /*#__PURE__*/React.createElement("div", {
      className: "kl-comparison-action"
    }, /*#__PURE__*/React.createElement("a", {
      href: vendorPrice.url,
      target: "_blank",
      rel: "noopener noreferrer",
      className: "kl-btn kl-btn-shop",
      style: {
        '--vendor-color': vendor.color
      },
      onClick: () => trackEvent('vendor_click', {
        vendor_name: vendor.name,
        vendor_id: vendor.id,
        vendor_type: isResale ? 'resale' : 'retail',
        product_name: product.name,
        product_id: product.id
      })
    }, isResale ? 'Check Live Price' : 'Check Availability')));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "kl-vendor-comparison"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-comparison-section"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "kl-comparison-title"
  }, /*#__PURE__*/React.createElement("span", null, "Resale Marketplaces"), /*#__PURE__*/React.createElement("span", {
    className: "kl-comparison-subtitle"
  }, "Authenticated · Live market prices")), /*#__PURE__*/React.createElement("div", {
    className: "kl-comparison-table"
  }, resaleVendors.map(vendorPrice => /*#__PURE__*/React.createElement(VendorRow, {
    key: vendorPrice.vendorId,
    vendorPrice: vendorPrice,
    isResale: true
  })))), /*#__PURE__*/React.createElement("div", {
    className: "kl-comparison-section"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "kl-comparison-title"
  }, /*#__PURE__*/React.createElement("span", null, "Retail Stores"), /*#__PURE__*/React.createElement("span", {
    className: "kl-comparison-subtitle"
  }, "Official retailers · MSRP $", product.retail?.toLocaleString())), /*#__PURE__*/React.createElement("div", {
    className: "kl-comparison-table"
  }, retailVendors.map(vendorPrice => /*#__PURE__*/React.createElement(VendorRow, {
    key: vendorPrice.vendorId,
    vendorPrice: vendorPrice,
    isResale: false
  })))), /*#__PURE__*/React.createElement("p", {
    className: "kl-affiliate-disclosure"
  }, "Prices shown on vendor sites are live and may change. We may earn a commission when you shop through our links."));
};

// ============================================
// Navigation Component (Cart removed)
// ============================================
const Navigation = () => {
  const {
    navigate,
    searchQuery,
    setSearchQuery,
    wishlist
  } = useApp();
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
  const handleSearch = e => {
    e.preventDefault();
    if (searchQuery.trim()) {
      trackEvent('search', {
        search_term: searchQuery.trim()
      });
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
    }
  };
  const popularSearches = ['Jordan 4', 'Travis Scott', 'Dunk Low', 'Yeezy 350', 'New Balance 550'];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "kl-announcement"
  }, /*#__PURE__*/React.createElement("span", null, "Discover Sneakers From 10+ Trusted Retailers"), /*#__PURE__*/React.createElement("span", {
    className: "kl-announcement-sep"
  }, "·"), /*#__PURE__*/React.createElement("span", null, "Shop With Confidence")), /*#__PURE__*/React.createElement("nav", {
    className: `kl-nav ${isScrolled ? 'scrolled' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-nav-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-nav-left"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#/",
    className: "kl-logo",
    onClick: e => {
      e.preventDefault();
      navigate('/');
    }
  }, "KicksList"), /*#__PURE__*/React.createElement("ul", {
    className: "kl-nav-links"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#/shop",
    onClick: e => {
      e.preventDefault();
      navigate('/shop');
    }
  }, "Browse")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#/brands",
    onClick: e => {
      e.preventDefault();
      navigate('/brands');
    }
  }, "Brands")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#/about",
    onClick: e => {
      e.preventDefault();
      navigate('/about');
    }
  }, "About")))), /*#__PURE__*/React.createElement("div", {
    className: "kl-nav-right"
  }, /*#__PURE__*/React.createElement("button", {
    className: "kl-nav-icon-btn",
    onClick: () => setSearchOpen(true),
    "aria-label": "Search"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M21 21l-4.35-4.35"
  }))), /*#__PURE__*/React.createElement("button", {
    className: "kl-nav-icon-btn kl-nav-wishlist-btn",
    onClick: () => navigate('/wishlist'),
    "aria-label": "Wishlist"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: wishlist.length > 0 ? 'currentColor' : 'none',
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
  })), wishlist.length > 0 && /*#__PURE__*/React.createElement("span", {
    className: "kl-nav-wishlist-badge"
  }, wishlist.length)), /*#__PURE__*/React.createElement("button", {
    className: "kl-nav-icon-btn kl-menu-toggle",
    onClick: () => setMenuOpen(!menuOpen),
    "aria-label": "Menu"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, menuOpen ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "6",
    x2: "21",
    y2: "6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "12",
    x2: "21",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "18",
    x2: "21",
    y2: "18"
  }))))))), /*#__PURE__*/React.createElement("div", {
    className: `kl-mobile-menu ${menuOpen ? 'open' : ''}`
  }, /*#__PURE__*/React.createElement("a", {
    href: "#/shop",
    onClick: e => {
      e.preventDefault();
      navigate('/shop');
      setMenuOpen(false);
    }
  }, "Browse"), /*#__PURE__*/React.createElement("a", {
    href: "#/brands",
    onClick: e => {
      e.preventDefault();
      navigate('/brands');
      setMenuOpen(false);
    }
  }, "Brands"), /*#__PURE__*/React.createElement("a", {
    href: "#/wishlist",
    onClick: e => {
      e.preventDefault();
      navigate('/wishlist');
      setMenuOpen(false);
    }
  }, "Wishlist", wishlist.length > 0 ? ` (${wishlist.length})` : ''), /*#__PURE__*/React.createElement("a", {
    href: "#/about",
    onClick: e => {
      e.preventDefault();
      navigate('/about');
      setMenuOpen(false);
    }
  }, "About")), /*#__PURE__*/React.createElement("div", {
    className: `kl-search-overlay ${searchOpen ? 'open' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-search-container"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSearch,
    className: "kl-search-form"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "kl-search-icon",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M21 21l-4.35-4.35"
  })), /*#__PURE__*/React.createElement("input", {
    ref: searchInputRef,
    type: "text",
    placeholder: "Search sneakers, brands, styles...",
    value: searchQuery,
    onChange: e => setSearchQuery(e.target.value),
    className: "kl-search-input"
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "kl-search-close",
    onClick: () => setSearchOpen(false)
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "kl-search-suggestions"
  }, /*#__PURE__*/React.createElement("p", {
    className: "kl-search-label"
  }, "Popular Searches"), /*#__PURE__*/React.createElement("div", {
    className: "kl-search-tags"
  }, popularSearches.map(tag => /*#__PURE__*/React.createElement("button", {
    key: tag,
    className: "kl-search-tag",
    onClick: () => {
      setSearchQuery(tag);
      navigate(`/search?q=${encodeURIComponent(tag)}`);
      setSearchOpen(false);
    }
  }, tag))))), /*#__PURE__*/React.createElement("div", {
    className: "kl-search-backdrop",
    onClick: () => setSearchOpen(false)
  })));
};

// ============================================
// Product Card (Shows Retail + Compare Prices CTA)
// ============================================
const ProductCard = ({
  product,
  index = 0
}) => {
  const {
    navigate,
    wishlist,
    toggleWishlist
  } = useApp();
  const isWishlisted = wishlist.includes(product.id);
  return /*#__PURE__*/React.createElement("article", {
    className: "kl-product-card",
    style: {
      animationDelay: `${index * 50}ms`
    }
  }, product.badge && /*#__PURE__*/React.createElement("span", {
    className: `kl-product-badge ${product.badge.toLowerCase().replace(' ', '-')}`
  }, product.badge), /*#__PURE__*/React.createElement("button", {
    className: `kl-product-wishlist ${isWishlisted ? 'active' : ''}`,
    onClick: e => {
      e.stopPropagation();
      toggleWishlist(product.id);
    },
    "aria-label": "Add to wishlist"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: isWishlisted ? 'currentColor' : 'none',
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "kl-product-image",
    onClick: () => navigate(`/product/${product.id}`)
  }, /*#__PURE__*/React.createElement("img", {
    src: product.images[0],
    alt: product.name,
    onError: e => {
      e.target.src = 'https://via.placeholder.com/400x400/f5f4f2/a8a29e?text=Image+Coming+Soon';
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "kl-product-info",
    onClick: () => navigate(`/product/${product.id}`)
  }, /*#__PURE__*/React.createElement("p", {
    className: "kl-product-brand"
  }, product.brand), /*#__PURE__*/React.createElement("h3", {
    className: "kl-product-name"
  }, product.name), /*#__PURE__*/React.createElement(PriceDisplay, {
    product: product
  }), /*#__PURE__*/React.createElement("a", {
    className: "kl-compare-link",
    onClick: e => {
      e.stopPropagation();
      navigate(`/product/${product.id}`);
    }
  }, "Compare Live Prices →")));
};

// ============================================
// Homepage
// ============================================
const Homepage = () => {
  const {
    navigate
  } = useApp();
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');
  const {
    products,
    categories,
    getFeaturedProducts,
    getTrendingProducts,
    getNewDrops
  } = window.KicksListData;
  const featuredProducts = getFeaturedProducts();
  const trendingProducts = getTrendingProducts();
  const newDrops = getNewDrops();

  // Only cycle through the 3 displayed slides
  const heroSlideCount = Math.min(featuredProducts.length, 3);
  useEffect(() => {
    if (heroSlideCount <= 1) return;
    const timer = setInterval(() => {
      setActiveHeroSlide(prev => (prev + 1) % heroSlideCount);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlideCount]);
  return /*#__PURE__*/React.createElement("main", {
    className: "kl-homepage-content"
  }, /*#__PURE__*/React.createElement("section", {
    className: "kl-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-hero-slides"
  }, featuredProducts.slice(0, 3).map((product, idx) => /*#__PURE__*/React.createElement("div", {
    key: product.id,
    className: `kl-hero-slide ${idx === activeHeroSlide ? 'active' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-hero-content"
  }, /*#__PURE__*/React.createElement("p", {
    className: "kl-hero-eyebrow"
  }, product.featured ? "Editor's Pick" : 'Featured'), /*#__PURE__*/React.createElement("h1", {
    className: "kl-hero-title"
  }, product.name), /*#__PURE__*/React.createElement("p", {
    className: "kl-hero-subtitle"
  }, product.brand), /*#__PURE__*/React.createElement("div", {
    className: "kl-hero-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "kl-btn kl-btn-primary",
    onClick: () => navigate(`/product/${product.id}`)
  }, "Shop Now"), /*#__PURE__*/React.createElement("span", {
    className: "kl-hero-price"
  }, "Retail $", product.retail?.toLocaleString()))), /*#__PURE__*/React.createElement("div", {
    className: "kl-hero-image"
  }, /*#__PURE__*/React.createElement("img", {
    src: product.images[0],
    alt: product.name,
    onError: e => {
      e.target.src = 'https://via.placeholder.com/600x600/f5f4f2/a8a29e?text=Image+Coming+Soon';
    }
  })))))), /*#__PURE__*/React.createElement("section", {
    className: "kl-categories"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-categories-inner"
  }, /*#__PURE__*/React.createElement("button", {
    className: `kl-category-btn ${activeCategory === 'all' ? 'active' : ''}`,
    onClick: () => {
      setActiveCategory('all');
      navigate('/shop');
    }
  }, "All"), categories.map(cat => /*#__PURE__*/React.createElement("button", {
    key: cat.id,
    className: `kl-category-btn ${activeCategory === cat.id ? 'active' : ''}`,
    onClick: () => {
      setActiveCategory(cat.id);
      navigate(`/category/${cat.id}`);
    }
  }, cat.name)))), /*#__PURE__*/React.createElement("section", {
    className: "kl-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-section-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-section-title-group"
  }, /*#__PURE__*/React.createElement("p", {
    className: "kl-section-eyebrow"
  }, "Most Popular"), /*#__PURE__*/React.createElement("h2", {
    className: "kl-section-title"
  }, "Featured Drops")), /*#__PURE__*/React.createElement("a", {
    href: "#/shop",
    className: "kl-section-link",
    onClick: e => {
      e.preventDefault();
      navigate('/shop');
    }
  }, "View All", /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "5",
    y1: "12",
    x2: "19",
    y2: "12"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "12 5 19 12 12 19"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "kl-product-grid kl-featured-grid"
  }, featuredProducts.slice(0, 8).map((product, idx) => /*#__PURE__*/React.createElement(ProductCard, {
    key: product.id,
    product: product,
    index: idx
  })))), /*#__PURE__*/React.createElement("section", {
    className: "kl-editorial"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-editorial-content"
  }, /*#__PURE__*/React.createElement("p", {
    className: "kl-editorial-eyebrow"
  }, "The Edit"), /*#__PURE__*/React.createElement("h2", {
    className: "kl-editorial-title"
  }, "Icons of", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", null, "Collaboration")), /*#__PURE__*/React.createElement("p", {
    className: "kl-editorial-desc"
  }, "Explore the most coveted collaborations in sneaker history—from Travis Scott to Off-White."), /*#__PURE__*/React.createElement("button", {
    className: "kl-btn kl-btn-outline-light",
    onClick: () => navigate('/search?q=travis')
  }, "Discover More")), /*#__PURE__*/React.createElement("div", {
    className: "kl-editorial-images"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-editorial-img kl-editorial-img-1"
  }, /*#__PURE__*/React.createElement("img", {
    src: products[1].images[0],
    alt: "Travis Scott",
    onError: e => {
      e.target.src = 'https://via.placeholder.com/400x400/f5f4f2/a8a29e?text=';
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "kl-editorial-img kl-editorial-img-2"
  }, /*#__PURE__*/React.createElement("img", {
    src: products[3].images[0],
    alt: "Jordan",
    onError: e => {
      e.target.src = 'https://via.placeholder.com/400x400/f5f4f2/a8a29e?text=';
    }
  })))), /*#__PURE__*/React.createElement("section", {
    className: "kl-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-section-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-section-title-group"
  }, /*#__PURE__*/React.createElement("p", {
    className: "kl-section-eyebrow"
  }, "Just Released"), /*#__PURE__*/React.createElement("h2", {
    className: "kl-section-title"
  }, "New Drops")), /*#__PURE__*/React.createElement("a", {
    href: "#/shop",
    className: "kl-section-link",
    onClick: e => {
      e.preventDefault();
      navigate('/shop');
    }
  }, "View All", /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "5",
    y1: "12",
    x2: "19",
    y2: "12"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "12 5 19 12 12 19"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "kl-newdrops-grid"
  }, newDrops.map((product, idx) => /*#__PURE__*/React.createElement("article", {
    key: product.id,
    className: "kl-newdrop-card",
    style: {
      animationDelay: `${idx * 50}ms`
    },
    onClick: () => navigate(`/product/${product.id}`)
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-newdrop-image"
  }, /*#__PURE__*/React.createElement("img", {
    src: product.images[0],
    alt: product.name,
    onError: e => {
      e.target.src = 'https://via.placeholder.com/300x300/f5f4f2/a8a29e?text=';
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "kl-newdrop-info"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kl-newdrop-date"
  }, new Date(product.releaseDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })), /*#__PURE__*/React.createElement("p", {
    className: "kl-newdrop-brand"
  }, product.brand), /*#__PURE__*/React.createElement("h3", {
    className: "kl-newdrop-name"
  }, product.name), /*#__PURE__*/React.createElement("span", {
    className: "kl-newdrop-price"
  }, "$", product.retail?.toLocaleString())))))), /*#__PURE__*/React.createElement("section", {
    className: "kl-section kl-trending"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-section-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-section-title-group"
  }, /*#__PURE__*/React.createElement("p", {
    className: "kl-section-eyebrow"
  }, "Most Wanted"), /*#__PURE__*/React.createElement("h2", {
    className: "kl-section-title"
  }, "Trending Now")), /*#__PURE__*/React.createElement("a", {
    href: "#/shop",
    className: "kl-section-link",
    onClick: e => {
      e.preventDefault();
      navigate('/shop');
    }
  }, "View All", /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "5",
    y1: "12",
    x2: "19",
    y2: "12"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "12 5 19 12 12 19"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "kl-trending-grid"
  }, trendingProducts.slice(0, 6).map((product, idx) => /*#__PURE__*/React.createElement("article", {
    key: product.id,
    className: "kl-trending-card",
    onClick: () => navigate(`/product/${product.id}`)
  }, /*#__PURE__*/React.createElement("span", {
    className: "kl-trending-rank"
  }, String(idx + 1).padStart(2, '0')), /*#__PURE__*/React.createElement("div", {
    className: "kl-trending-image"
  }, /*#__PURE__*/React.createElement("img", {
    src: product.images[0],
    alt: product.name,
    onError: e => {
      e.target.src = 'https://via.placeholder.com/200x200/f5f4f2/a8a29e?text=';
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "kl-trending-info"
  }, /*#__PURE__*/React.createElement("p", {
    className: "kl-trending-brand"
  }, product.brand), /*#__PURE__*/React.createElement("h3", {
    className: "kl-trending-name"
  }, product.name), /*#__PURE__*/React.createElement("span", {
    className: "kl-trending-price"
  }, "Retail $", product.retail?.toLocaleString())), /*#__PURE__*/React.createElement("svg", {
    className: "kl-trending-arrow",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "5",
    y1: "12",
    x2: "19",
    y2: "12"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "12 5 19 12 12 19"
  })))))), /*#__PURE__*/React.createElement("section", {
    className: "kl-brands"
  }, /*#__PURE__*/React.createElement("p", {
    className: "kl-brands-label"
  }, "Shop by Brand"), /*#__PURE__*/React.createElement("div", {
    className: "kl-brands-grid"
  }, [{
    name: 'Jordan',
    id: 'jordan'
  }, {
    name: 'Nike',
    id: 'nike'
  }, {
    name: 'Adidas',
    id: 'adidas'
  }, {
    name: 'New Balance',
    id: 'new-balance'
  }, {
    name: 'Puma',
    id: 'puma'
  }, {
    name: 'Reebok',
    id: 'reebok'
  }, {
    name: 'Yeezy',
    id: 'yeezy'
  }, {
    name: 'UGG',
    id: 'ugg'
  }, {
    name: 'Crocs',
    id: 'crocs'
  }].map(brand => /*#__PURE__*/React.createElement("button", {
    key: brand.id,
    className: "kl-brand-btn",
    onClick: () => navigate(`/category/${brand.id}`)
  }, brand.name)))), /*#__PURE__*/React.createElement("section", {
    className: "kl-trust"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-trust-item"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "9 12 11 14 15 10"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "All Vendors Verified"), /*#__PURE__*/React.createElement("p", null, "Every vendor is authenticated and trusted"))), /*#__PURE__*/React.createElement("div", {
    className: "kl-trust-item"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "12 6 12 12 16 14"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Compare Live Prices"), /*#__PURE__*/React.createElement("p", null, "Direct links to StockX, GOAT & more"))), /*#__PURE__*/React.createElement("div", {
    className: "kl-trust-item"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Trust Ratings"), /*#__PURE__*/React.createElement("p", null, "See vendor reviews before you buy"))), /*#__PURE__*/React.createElement("div", {
    className: "kl-trust-item"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "1",
    y: "4",
    width: "22",
    height: "16",
    rx: "2",
    ry: "2"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "1",
    y1: "10",
    x2: "23",
    y2: "10"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Secure Shopping"), /*#__PURE__*/React.createElement("p", null, "Buy directly from trusted vendors")))));
};

// ============================================
// Shop Page
// ============================================
const ShopPage = () => {
  const {
    route,
    navigate,
    searchQuery
  } = useApp();
  const {
    products,
    categories,
    getProductsByCategory,
    searchProducts
  } = window.KicksListData;
  const [sortBy, setSortBy] = useState('newest');
  const [activeCategory, setActiveCategory] = useState(route.params.category || 'all');
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState('all');
  const [customMin, setCustomMin] = useState('');
  const [customMax, setCustomMax] = useState('');
  const productsPerPage = 20;

  // Price range presets
  const priceRanges = [{
    id: 'all',
    label: 'All Prices',
    min: 0,
    max: Infinity
  }, {
    id: 'under-100',
    label: 'Under $100',
    min: 0,
    max: 99
  }, {
    id: '100-150',
    label: '$100 - $150',
    min: 100,
    max: 150
  }, {
    id: '150-200',
    label: '$150 - $200',
    min: 150,
    max: 200
  }, {
    id: '200-300',
    label: '$200 - $300',
    min: 200,
    max: 300
  }, {
    id: 'over-300',
    label: '$300+',
    min: 300,
    max: Infinity
  }];
  const queryParam = route.params.q || searchQuery;
  let filteredProducts = queryParam ? searchProducts(queryParam) : getProductsByCategory(activeCategory);

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
  const handlePageChange = page => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  const handlePriceRangeChange = rangeId => {
    setPriceRange(rangeId);
    if (rangeId !== 'custom') {
      setCustomMin('');
      setCustomMax('');
    }
  };
  const handleCustomPriceApply = () => {
    setPriceRange('custom');
  };
  return /*#__PURE__*/React.createElement("main", {
    className: "kl-shop-page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-shop-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-shop-header-inner"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("nav", {
    className: "kl-breadcrumb"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#/",
    onClick: e => {
      e.preventDefault();
      navigate('/');
    }
  }, "Home"), /*#__PURE__*/React.createElement("span", {
    className: "kl-breadcrumb-sep"
  }, "/"), /*#__PURE__*/React.createElement("span", {
    className: "kl-breadcrumb-current"
  }, queryParam ? `Search: "${queryParam}"` : activeCategory === 'all' ? 'All Sneakers' : categories.find(c => c.id === activeCategory)?.name || 'Shop')), /*#__PURE__*/React.createElement("h1", {
    className: "kl-shop-title"
  }, queryParam ? `Results for "${queryParam}"` : activeCategory === 'all' ? 'All Sneakers' : categories.find(c => c.id === activeCategory)?.name || 'Shop'), /*#__PURE__*/React.createElement("p", {
    className: "kl-shop-count"
  }, filteredProducts.length, " Products")), /*#__PURE__*/React.createElement("div", {
    className: "kl-shop-sort"
  }, /*#__PURE__*/React.createElement("label", null, "Sort by:"), /*#__PURE__*/React.createElement("select", {
    value: sortBy,
    onChange: e => setSortBy(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "newest"
  }, "Newest"), /*#__PURE__*/React.createElement("option", {
    value: "price-low"
  }, "Price: Low to High"), /*#__PURE__*/React.createElement("option", {
    value: "price-high"
  }, "Price: High to Low"))))), /*#__PURE__*/React.createElement("div", {
    className: "kl-shop-content"
  }, /*#__PURE__*/React.createElement("aside", {
    className: "kl-shop-filters"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-filter-section"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "kl-filter-title"
  }, "Categories"), /*#__PURE__*/React.createElement("div", {
    className: "kl-filter-options"
  }, categories.map(cat => /*#__PURE__*/React.createElement("button", {
    key: cat.id,
    className: `kl-filter-btn ${activeCategory === cat.id ? 'active' : ''}`,
    onClick: () => {
      setActiveCategory(cat.id);
      navigate(cat.id === 'all' ? '/shop' : `/category/${cat.id}`);
    }
  }, cat.name, /*#__PURE__*/React.createElement("span", {
    className: "kl-filter-count"
  }, cat.count))))), /*#__PURE__*/React.createElement("div", {
    className: "kl-filter-section"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "kl-filter-title"
  }, "Price Range"), /*#__PURE__*/React.createElement("div", {
    className: "kl-filter-options"
  }, priceRanges.map(range => /*#__PURE__*/React.createElement("button", {
    key: range.id,
    className: `kl-filter-btn ${priceRange === range.id ? 'active' : ''}`,
    onClick: () => handlePriceRangeChange(range.id)
  }, range.label))), /*#__PURE__*/React.createElement("div", {
    className: "kl-price-custom"
  }, /*#__PURE__*/React.createElement("p", {
    className: "kl-price-custom-label"
  }, "Custom Range"), /*#__PURE__*/React.createElement("div", {
    className: "kl-price-inputs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-price-input-wrap"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kl-price-input-prefix"
  }, "$"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    placeholder: "Min",
    value: customMin,
    onChange: e => setCustomMin(e.target.value),
    className: "kl-price-input"
  })), /*#__PURE__*/React.createElement("span", {
    className: "kl-price-input-sep"
  }, "to"), /*#__PURE__*/React.createElement("div", {
    className: "kl-price-input-wrap"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kl-price-input-prefix"
  }, "$"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    placeholder: "Max",
    value: customMax,
    onChange: e => setCustomMax(e.target.value),
    className: "kl-price-input"
  }))), /*#__PURE__*/React.createElement("button", {
    className: "kl-btn kl-btn-apply",
    onClick: handleCustomPriceApply,
    disabled: !customMin && !customMax
  }, "Apply"))), (priceRange !== 'all' || activeCategory !== 'all') && /*#__PURE__*/React.createElement("button", {
    className: "kl-clear-filters",
    onClick: () => {
      handlePriceRangeChange('all');
      setActiveCategory('all');
      navigate('/shop');
    }
  }, "Clear All Filters")), /*#__PURE__*/React.createElement("div", {
    className: "kl-shop-products"
  }, filteredProducts.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "kl-shop-empty"
  }, /*#__PURE__*/React.createElement("p", null, "No sneakers found matching your criteria."), /*#__PURE__*/React.createElement("button", {
    className: "kl-btn kl-btn-primary",
    onClick: () => navigate('/shop')
  }, "View All Products")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "kl-product-grid"
  }, paginatedProducts.map((product, idx) => /*#__PURE__*/React.createElement(ProductCard, {
    key: product.id,
    product: product,
    index: idx
  }))), totalPages > 1 && /*#__PURE__*/React.createElement("div", {
    className: "kl-pagination"
  }, /*#__PURE__*/React.createElement("button", {
    className: "kl-pagination-btn kl-pagination-prev",
    onClick: () => handlePageChange(currentPage - 1),
    disabled: currentPage === 1
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "15 18 9 12 15 6"
  })), "Prev"), /*#__PURE__*/React.createElement("div", {
    className: "kl-pagination-pages"
  }, currentPage > 3 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "kl-pagination-page",
    onClick: () => handlePageChange(1)
  }, "1"), currentPage > 4 && /*#__PURE__*/React.createElement("span", {
    className: "kl-pagination-ellipsis"
  }, "...")), Array.from({
    length: totalPages
  }, (_, i) => i + 1).filter(page => page >= currentPage - 2 && page <= currentPage + 2).map(page => /*#__PURE__*/React.createElement("button", {
    key: page,
    className: `kl-pagination-page ${page === currentPage ? 'active' : ''}`,
    onClick: () => handlePageChange(page)
  }, page)), currentPage < totalPages - 2 && /*#__PURE__*/React.createElement(React.Fragment, null, currentPage < totalPages - 3 && /*#__PURE__*/React.createElement("span", {
    className: "kl-pagination-ellipsis"
  }, "..."), /*#__PURE__*/React.createElement("button", {
    className: "kl-pagination-page",
    onClick: () => handlePageChange(totalPages)
  }, totalPages))), /*#__PURE__*/React.createElement("button", {
    className: "kl-pagination-btn kl-pagination-next",
    onClick: () => handlePageChange(currentPage + 1),
    disabled: currentPage === totalPages
  }, "Next", /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "9 18 15 12 9 6"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "kl-pagination-info"
  }, "Showing ", startIndex + 1, "-", Math.min(startIndex + productsPerPage, filteredProducts.length), " of ", filteredProducts.length, " products")))));
};

// ============================================
// Product Detail Page (Updated)
// ============================================
const ProductDetailPage = () => {
  const {
    route,
    navigate,
    wishlist,
    toggleWishlist
  } = useApp();
  const {
    getProductById,
    getRelatedProducts
  } = window.KicksListData;
  const productId = parseInt(route.params.id);
  const product = getProductById(productId);
  const relatedProducts = getRelatedProducts(productId, 4);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({
    x: 50,
    y: 50
  });
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
    const handleKeyDown = e => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') setSelectedImage(prev => (prev + 1) % product.images.length);
      if (e.key === 'ArrowLeft') setSelectedImage(prev => (prev - 1 + product.images.length) % product.images.length);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, product?.images?.length]);
  if (!product) {
    return /*#__PURE__*/React.createElement("main", {
      className: "kl-error-page"
    }, /*#__PURE__*/React.createElement("h1", null, "Product Not Found"), /*#__PURE__*/React.createElement("p", null, "The sneaker you're looking for doesn't exist."), /*#__PURE__*/React.createElement("button", {
      className: "kl-btn kl-btn-primary",
      onClick: () => navigate('/shop')
    }, "Browse All Sneakers"));
  }
  const handleImageHover = e => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * 100;
    const y = (e.clientY - rect.top) / rect.height * 100;
    setZoomPosition({
      x,
      y
    });
  };
  return /*#__PURE__*/React.createElement("main", {
    className: "kl-product-detail"
  }, /*#__PURE__*/React.createElement("nav", {
    className: "kl-breadcrumb"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#/",
    onClick: e => {
      e.preventDefault();
      navigate('/');
    }
  }, "Home"), /*#__PURE__*/React.createElement("span", {
    className: "kl-breadcrumb-sep"
  }, "/"), /*#__PURE__*/React.createElement("a", {
    href: `#/category/${product.category}`,
    onClick: e => {
      e.preventDefault();
      navigate(`/category/${product.category}`);
    }
  }, product.brand), /*#__PURE__*/React.createElement("span", {
    className: "kl-breadcrumb-sep"
  }, "/"), /*#__PURE__*/React.createElement("span", {
    className: "kl-breadcrumb-current"
  }, product.name)), /*#__PURE__*/React.createElement("div", {
    className: "kl-product-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-gallery"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-gallery-thumbnails"
  }, product.images.map((img, idx) => /*#__PURE__*/React.createElement("button", {
    key: idx,
    className: `kl-thumbnail ${selectedImage === idx ? 'active' : ''}`,
    onClick: () => setSelectedImage(idx)
  }, /*#__PURE__*/React.createElement("img", {
    src: img,
    alt: `View ${idx + 1}`,
    onError: e => {
      e.target.src = 'https://via.placeholder.com/100x100/f5f4f2/a8a29e?text=';
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: `kl-main-image ${isZoomed ? 'zoomed' : ''}`,
    onMouseEnter: () => setIsZoomed(true),
    onMouseLeave: () => setIsZoomed(false),
    onMouseMove: handleImageHover,
    onClick: () => setLightboxOpen(true)
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-image-container",
    style: isZoomed ? {
      backgroundImage: `url(${product.images[selectedImage]})`,
      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`
    } : {}
  }, /*#__PURE__*/React.createElement("img", {
    src: product.images[selectedImage],
    alt: product.name,
    className: isZoomed ? 'hidden' : '',
    onError: e => {
      e.target.src = 'https://via.placeholder.com/600x600/f5f4f2/a8a29e?text=Image+Coming+Soon';
    }
  })), /*#__PURE__*/React.createElement("button", {
    className: "kl-expand-btn"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "15 3 21 3 21 9"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "9 21 3 21 3 15"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "21",
    y1: "3",
    x2: "14",
    y2: "10"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "21",
    x2: "10",
    y2: "14"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "kl-image-counter"
  }, selectedImage + 1, " / ", product.images.length))), /*#__PURE__*/React.createElement("div", {
    className: "kl-product-info-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-info-header"
  }, /*#__PURE__*/React.createElement("p", {
    className: "kl-detail-brand"
  }, product.brand), /*#__PURE__*/React.createElement("h1", {
    className: "kl-detail-name"
  }, product.name), /*#__PURE__*/React.createElement("p", {
    className: "kl-detail-style"
  }, product.category?.toUpperCase())), /*#__PURE__*/React.createElement("div", {
    className: "kl-price-block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-price-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kl-price-label-large"
  }, "Retail Price:"), /*#__PURE__*/React.createElement("span", {
    className: "kl-price-current"
  }, "$", product.retail?.toLocaleString() || 'N/A')), /*#__PURE__*/React.createElement("div", {
    className: "kl-price-meta"
  }, /*#__PURE__*/React.createElement("p", {
    className: "kl-price-note"
  }, "Click below to check current live prices from verified vendors"))), /*#__PURE__*/React.createElement(VendorComparisonTable, {
    product: product
  }), /*#__PURE__*/React.createElement("div", {
    className: "kl-wishlist-action"
  }, /*#__PURE__*/React.createElement("button", {
    className: `kl-wishlist-btn-large ${isWishlisted ? 'active' : ''}`,
    onClick: () => toggleWishlist(productId)
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: isWishlisted ? 'currentColor' : 'none',
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
  })), isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist')), /*#__PURE__*/React.createElement("div", {
    className: "kl-trust-badges"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-badge"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "9 12 11 14 15 10"
  })), /*#__PURE__*/React.createElement("span", null, "All Vendors Verified")), /*#__PURE__*/React.createElement("div", {
    className: "kl-badge"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "12 6 12 12 16 14"
  })), /*#__PURE__*/React.createElement("span", null, "Live Price Links")), /*#__PURE__*/React.createElement("div", {
    className: "kl-badge"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "1",
    y: "4",
    width: "22",
    height: "16",
    rx: "2",
    ry: "2"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "1",
    y1: "10",
    x2: "23",
    y2: "10"
  })), /*#__PURE__*/React.createElement("span", null, "Secure Checkout"))), /*#__PURE__*/React.createElement("div", {
    className: "kl-specs"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "kl-specs-title"
  }, "Product Details"), /*#__PURE__*/React.createElement("dl", {
    className: "kl-specs-list"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-spec-row"
  }, /*#__PURE__*/React.createElement("dt", null, "Brand"), /*#__PURE__*/React.createElement("dd", null, product.brand)), /*#__PURE__*/React.createElement("div", {
    className: "kl-spec-row"
  }, /*#__PURE__*/React.createElement("dt", null, "Release Date"), /*#__PURE__*/React.createElement("dd", null, new Date(product.releaseDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }))), /*#__PURE__*/React.createElement("div", {
    className: "kl-spec-row"
  }, /*#__PURE__*/React.createElement("dt", null, "Retail Price"), /*#__PURE__*/React.createElement("dd", null, "$", product.retail?.toLocaleString())))), /*#__PURE__*/React.createElement("div", {
    className: "kl-description"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "kl-description-title"
  }, "About This Sneaker"), /*#__PURE__*/React.createElement("p", {
    className: "kl-description-text"
  }, product.description)))), relatedProducts.length > 0 && /*#__PURE__*/React.createElement("section", {
    className: "kl-related"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-section-header"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "kl-section-title"
  }, "You May Also Like"), /*#__PURE__*/React.createElement("a", {
    href: "#/shop",
    className: "kl-section-link",
    onClick: e => {
      e.preventDefault();
      navigate('/shop');
    }
  }, "View All ", /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "5",
    y1: "12",
    x2: "19",
    y2: "12"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "12 5 19 12 12 19"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "kl-product-grid"
  }, relatedProducts.map((p, idx) => /*#__PURE__*/React.createElement(ProductCard, {
    key: p.id,
    product: p,
    index: idx
  })))), lightboxOpen && /*#__PURE__*/React.createElement("div", {
    className: "kl-lightbox",
    onClick: () => setLightboxOpen(false)
  }, /*#__PURE__*/React.createElement("button", {
    className: "kl-lightbox-close",
    onClick: () => setLightboxOpen(false)
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  }))), /*#__PURE__*/React.createElement("button", {
    className: "kl-lightbox-nav prev",
    onClick: e => {
      e.stopPropagation();
      setSelectedImage(prev => (prev - 1 + product.images.length) % product.images.length);
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "15 18 9 12 15 6"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "kl-lightbox-content",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("img", {
    src: product.images[selectedImage],
    alt: product.name,
    onError: e => {
      e.target.src = 'https://via.placeholder.com/800x800/f5f4f2/a8a29e?text=Image+Coming+Soon';
    }
  })), /*#__PURE__*/React.createElement("button", {
    className: "kl-lightbox-nav next",
    onClick: e => {
      e.stopPropagation();
      setSelectedImage(prev => (prev + 1) % product.images.length);
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "9 18 15 12 9 6"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "kl-lightbox-thumbnails"
  }, product.images.map((img, idx) => /*#__PURE__*/React.createElement("button", {
    key: idx,
    className: `kl-lightbox-thumb ${selectedImage === idx ? 'active' : ''}`,
    onClick: e => {
      e.stopPropagation();
      setSelectedImage(idx);
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: img,
    alt: `View ${idx + 1}`,
    onError: e => {
      e.target.src = 'https://via.placeholder.com/100x100/f5f4f2/a8a29e?text=';
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: "kl-lightbox-counter"
  }, selectedImage + 1, " / ", product.images.length)));
};

// ============================================
// About Page (Updated)
// ============================================
const AboutPage = () => {
  const {
    navigate
  } = useApp();
  const {
    products
  } = window.KicksListData;
  return /*#__PURE__*/React.createElement("main", {
    className: "kl-about-page"
  }, /*#__PURE__*/React.createElement("section", {
    className: "kl-about-hero"
  }, /*#__PURE__*/React.createElement("h1", null, "Every Sneaker. Every Price.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", null, "One Place.")), /*#__PURE__*/React.createElement("p", null, "Stop tab-hopping between retailers. KicksList brings together prices from 14 verified vendors so you can compare in seconds and buy with confidence.")), /*#__PURE__*/React.createElement("section", {
    className: "kl-about-howitworks"
  }, /*#__PURE__*/React.createElement("h2", null, "How It Works"), /*#__PURE__*/React.createElement("div", {
    className: "kl-about-steps"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-about-step"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kl-about-step-num"
  }, "1"), /*#__PURE__*/React.createElement("h3", null, "We Aggregate Prices"), /*#__PURE__*/React.createElement("p", null, "KicksList pulls live pricing data from 14+ verified retailers and resale marketplaces so you never have to tab-hop again.")), /*#__PURE__*/React.createElement("div", {
    className: "kl-about-step"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kl-about-step-num"
  }, "2"), /*#__PURE__*/React.createElement("h3", null, "You Compare Side-by-Side"), /*#__PURE__*/React.createElement("p", null, "Browse every option in one place — retail and resale, new and pre-owned — and pick the best deal for you.")), /*#__PURE__*/React.createElement("div", {
    className: "kl-about-step"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kl-about-step-num"
  }, "3"), /*#__PURE__*/React.createElement("h3", null, "Buy Direct from the Retailer"), /*#__PURE__*/React.createElement("p", null, "Click through to purchase straight from the vendor. We never handle your payment or personal information.")))), /*#__PURE__*/React.createElement("section", {
    className: "kl-about-values"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-about-value"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kl-about-value-num"
  }, "01"), /*#__PURE__*/React.createElement("h3", null, "Compare Prices Instantly"), /*#__PURE__*/React.createElement("p", null, "See what StockX, GOAT, Nike, Foot Locker, and 10 other vendors are charging — all on one page. No more guessing who has the best deal.")), /*#__PURE__*/React.createElement("div", {
    className: "kl-about-value"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kl-about-value-num"
  }, "02"), /*#__PURE__*/React.createElement("h3", null, "Shop Smarter, Not Harder"), /*#__PURE__*/React.createElement("p", null, "Retail or resale, we show you both. Filter by brand, price range, or release date to find exactly what you want at the price you want to pay.")), /*#__PURE__*/React.createElement("div", {
    className: "kl-about-value"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kl-about-value-num"
  }, "03"), /*#__PURE__*/React.createElement("h3", null, "Every Vendor Verified"), /*#__PURE__*/React.createElement("p", null, "We only link to trusted retailers and authenticated marketplaces. Every vendor on KicksList has a proven track record for selling genuine products."))), /*#__PURE__*/React.createElement("section", {
    className: "kl-about-stats"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-about-stat"
  }, /*#__PURE__*/React.createElement("span", null, "14"), /*#__PURE__*/React.createElement("p", null, "Verified Vendors")), /*#__PURE__*/React.createElement("div", {
    className: "kl-about-stat"
  }, /*#__PURE__*/React.createElement("span", null, products.length.toLocaleString()), /*#__PURE__*/React.createElement("p", null, "Sneakers Listed")), /*#__PURE__*/React.createElement("div", {
    className: "kl-about-stat"
  }, /*#__PURE__*/React.createElement("span", null, "30+"), /*#__PURE__*/React.createElement("p", null, "Brands")), /*#__PURE__*/React.createElement("div", {
    className: "kl-about-stat"
  }, /*#__PURE__*/React.createElement("span", null, "100%"), /*#__PURE__*/React.createElement("p", null, "Authentic Sources"))), /*#__PURE__*/React.createElement("section", {
    className: "kl-about-cta"
  }, /*#__PURE__*/React.createElement("h2", null, "Ready to Find Your Next Pair?"), /*#__PURE__*/React.createElement("div", {
    className: "kl-about-cta-btns"
  }, /*#__PURE__*/React.createElement("button", {
    className: "kl-btn kl-btn-primary",
    onClick: () => navigate('/shop')
  }, "Browse Sneakers"))));
};

// ============================================
// Brands Page
// ============================================
const BrandsPage = () => {
  const {
    navigate
  } = useApp();
  const {
    getProductsByCategory
  } = window.KicksListData;
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
  return /*#__PURE__*/React.createElement("main", {
    className: "kl-brands-page"
  }, /*#__PURE__*/React.createElement("section", {
    className: "kl-brands-hero"
  }, /*#__PURE__*/React.createElement("h1", null, "Our ", /*#__PURE__*/React.createElement("em", null, "Brands")), /*#__PURE__*/React.createElement("p", null, "Explore the iconic sneaker brands we curate. Shop from trusted retailers and authenticated marketplaces.")), /*#__PURE__*/React.createElement("section", {
    className: "kl-brands-grid"
  }, brandIds.map((brandId, idx) => {
    const products = getProductsByCategory(brandId);
    const productCount = products.length;
    const info = brandsInfo[brandId];
    const brandNameMap = {
      'new-balance': 'New Balance',
      'puma': 'Puma',
      'reebok': 'Reebok',
      'ugg': 'UGG',
      'crocs': 'Crocs'
    };
    const brandName = brandNameMap[brandId] || brandId.charAt(0).toUpperCase() + brandId.slice(1);
    return /*#__PURE__*/React.createElement("article", {
      key: brandId,
      className: "kl-brand-card",
      style: {
        animationDelay: `${idx * 100}ms`
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "kl-brand-image"
    }, /*#__PURE__*/React.createElement("img", {
      src: info.featuredImage,
      alt: brandName
    })), /*#__PURE__*/React.createElement("div", {
      className: "kl-brand-content"
    }, /*#__PURE__*/React.createElement("div", {
      className: "kl-brand-header"
    }, /*#__PURE__*/React.createElement("h2", null, brandName), /*#__PURE__*/React.createElement("span", {
      className: "kl-brand-count"
    }, productCount, " Products")), /*#__PURE__*/React.createElement("div", {
      className: "kl-brand-meta"
    }, /*#__PURE__*/React.createElement("span", null, "Est. ", info.founded), /*#__PURE__*/React.createElement("span", null, info.headquarters)), /*#__PURE__*/React.createElement("p", {
      className: "kl-brand-description"
    }, info.description), /*#__PURE__*/React.createElement("ul", {
      className: "kl-brand-highlights"
    }, info.highlights.map((highlight, i) => /*#__PURE__*/React.createElement("li", {
      key: i
    }, highlight))), /*#__PURE__*/React.createElement("button", {
      className: "kl-btn kl-btn-outline",
      onClick: () => navigate(`/category/${brandId}`)
    }, "Browse ", brandName, /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5"
    }, /*#__PURE__*/React.createElement("line", {
      x1: "5",
      y1: "12",
      x2: "19",
      y2: "12"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "12 5 19 12 12 19"
    })))));
  })));
};

// ============================================
// Terms of Service Page
// ============================================
const TermsPage = () => {
  const {
    navigate
  } = useApp();
  return /*#__PURE__*/React.createElement("main", {
    className: "kl-legal-page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-legal-container"
  }, /*#__PURE__*/React.createElement("nav", {
    className: "kl-breadcrumb"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#/",
    onClick: e => {
      e.preventDefault();
      navigate('/');
    }
  }, "Home"), /*#__PURE__*/React.createElement("span", {
    className: "kl-breadcrumb-sep"
  }, "/"), /*#__PURE__*/React.createElement("span", {
    className: "kl-breadcrumb-current"
  }, "Terms of Service")), /*#__PURE__*/React.createElement("h1", null, "Terms of Service"), /*#__PURE__*/React.createElement("p", {
    className: "kl-legal-updated"
  }, "Last Updated: February 12, 2026"), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "1. Acceptance of Terms"), /*#__PURE__*/React.createElement("p", null, "Welcome to KicksList (\"Company,\" \"we,\" \"us,\" or \"our\"). By accessing or using our website at kickslist.net (the \"Service\"), you (\"User,\" \"you,\" or \"your\") agree to be legally bound by these Terms of Service (\"Terms\"), our Privacy Policy, and all applicable laws and regulations. If you do not agree to these Terms, you must immediately discontinue use of the Service."), /*#__PURE__*/React.createElement("p", null, "We reserve the right to modify, amend, or update these Terms at any time and at our sole discretion. Changes become effective immediately upon posting to the Service. Your continued use of the Service after any modifications constitutes your binding acceptance of the revised Terms. It is your responsibility to review these Terms periodically."), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "PLEASE READ THESE TERMS CAREFULLY. THEY CONTAIN AN ARBITRATION AGREEMENT AND CLASS ACTION WAIVER THAT AFFECT YOUR LEGAL RIGHTS."))), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "2. Description of Service"), /*#__PURE__*/React.createElement("p", null, "KicksList is a sneaker discovery and price comparison platform. We aggregate publicly available product information, images, and pricing from third-party retailers and resale marketplaces to help users find and compare sneakers."), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Important — KicksList Does Not Sell Products:"), " KicksList is solely an informational and affiliate referral service. We do not manufacture, sell, ship, warehouse, authenticate, or handle any products. We do not process payments or fulfill orders. All purchases are made directly through the respective third-party retailer or marketplace websites. KicksList is not a party to any transaction between you and any third-party vendor.")), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "3. Affiliate Disclosure"), /*#__PURE__*/React.createElement("p", null, "KicksList participates in affiliate marketing programs, including but not limited to programs operated by Impact, CJ Affiliate, Rakuten, and others. This means we may earn a commission when you click on links to retailers or marketplaces on our Service and make a purchase. This comes at no additional cost to you."), /*#__PURE__*/React.createElement("p", null, "Our affiliate relationships do not influence our product listings, rankings, or the information we display. We strive to provide accurate and unbiased information. However, we cannot guarantee that all product information is complete or current, as this data is sourced from third parties."), /*#__PURE__*/React.createElement("p", null, "In accordance with FTC guidelines, we disclose that affiliate links on this site may generate revenue for KicksList.")), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "4. Product Information and Pricing"), /*#__PURE__*/React.createElement("p", null, "All product information, including names, descriptions, images, and pricing, is sourced from third-party vendors and publicly available data. While we make reasonable efforts to display accurate information, we make no representations or warranties regarding the accuracy, completeness, reliability, or currentness of any product information displayed on our Service."), /*#__PURE__*/React.createElement("p", null, "Prices displayed on KicksList are for informational and reference purposes only. Actual prices, availability, promotions, and product details on vendor websites may differ and may change at any time without notice. You must always verify the final price, product details, and availability directly on the vendor's website before making any purchase."), /*#__PURE__*/React.createElement("p", null, "KicksList shall not be held liable for any pricing errors, product description inaccuracies, or outdated information displayed on our Service.")), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "5. Third-Party Vendors and Links"), /*#__PURE__*/React.createElement("p", null, "Our Service contains links to third-party websites, including but not limited to retailers, resale marketplaces, and other external sites. These third-party sites operate independently of KicksList, and each has its own terms of service, privacy policies, and business practices, which we strongly encourage you to review before engaging with them."), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "KicksList expressly disclaims any and all responsibility and liability for:")), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "The content, accuracy, legality, or practices of any third-party websites"), /*#__PURE__*/React.createElement("li", null, "Any products or services purchased from, or offered by, third-party vendors"), /*#__PURE__*/React.createElement("li", null, "The authenticity, quality, safety, legality, or condition of any products sold by third parties"), /*#__PURE__*/React.createElement("li", null, "Any disputes, claims, or issues between you and any third-party vendor"), /*#__PURE__*/React.createElement("li", null, "Shipping, delivery, returns, exchanges, refunds, or customer service provided by third parties"), /*#__PURE__*/React.createElement("li", null, "Any financial loss, personal injury, or property damage arising from your interactions with third parties"), /*#__PURE__*/React.createElement("li", null, "Any unauthorized charges, fraud, or security breaches occurring on third-party websites")), /*#__PURE__*/React.createElement("p", null, "Any transactions you conduct with third-party vendors are solely between you and that vendor. KicksList acts only as a referral service and assumes no liability whatsoever for any aspect of your dealings with third parties.")), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "6. No Endorsement or Guarantee"), /*#__PURE__*/React.createElement("p", null, "The inclusion of any product, brand, retailer, or marketplace on our Service does not constitute an endorsement, recommendation, or guarantee by KicksList. We do not verify, authenticate, or inspect any products listed on our Service. We do not guarantee that any third-party vendor is legitimate, authorized, or trustworthy. Users assume all risk when purchasing from any third-party vendor linked from our Service.")), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "7. Intellectual Property"), /*#__PURE__*/React.createElement("p", null, "The KicksList name, logo, domain name, and all related marks, as well as the design, layout, look, appearance, and graphics of our Service, are the property of KicksList and are protected by United States and international intellectual property laws. You may not reproduce, distribute, modify, create derivative works of, publicly display, or otherwise use any of our intellectual property without our prior written consent."), /*#__PURE__*/React.createElement("p", null, "Product names, brand names, trademarks, logos, and images displayed on our Service are the property of their respective owners. Their display on our Service is for informational purposes only and does not imply any affiliation with, endorsement by, or sponsorship by those brands or trademark holders. If you believe any content on our Service infringes your intellectual property rights, please contact us using the information in Section 15.")), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "8. DMCA / Copyright Complaints"), /*#__PURE__*/React.createElement("p", null, "If you believe that content on our Service infringes your copyright, please send a written notice to our designated agent at contact@kickslist.net containing: (a) a description of the copyrighted work you claim has been infringed; (b) a description of where the allegedly infringing material is located on our Service; (c) your contact information; (d) a statement that you have a good faith belief that the use is not authorized; (e) a statement under penalty of perjury that the information in your notice is accurate and that you are the copyright owner or authorized to act on the owner's behalf; and (f) your physical or electronic signature.")), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "9. User Conduct"), /*#__PURE__*/React.createElement("p", null, "By using our Service, you agree not to:"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "Use the Service for any unlawful, fraudulent, or malicious purpose"), /*#__PURE__*/React.createElement("li", null, "Attempt to gain unauthorized access to our systems, servers, or networks"), /*#__PURE__*/React.createElement("li", null, "Use automated tools, bots, scrapers, crawlers, or similar technology to access, collect, or extract data from our Service without our express written permission"), /*#__PURE__*/React.createElement("li", null, "Interfere with, disrupt, or place an undue burden on the Service or its infrastructure"), /*#__PURE__*/React.createElement("li", null, "Reproduce, duplicate, copy, sell, resell, or otherwise exploit any part of our Service for commercial purposes without our express written permission"), /*#__PURE__*/React.createElement("li", null, "Attempt to reverse-engineer, decompile, or disassemble any software or technology used in the Service"), /*#__PURE__*/React.createElement("li", null, "Transmit any viruses, malware, or other harmful code"), /*#__PURE__*/React.createElement("li", null, "Impersonate any person or entity, or misrepresent your affiliation with any person or entity"), /*#__PURE__*/React.createElement("li", null, "Circumvent, disable, or otherwise interfere with any security features of the Service")), /*#__PURE__*/React.createElement("p", null, "Violation of these provisions may result in immediate termination of your access to the Service and may subject you to civil and/or criminal liability.")), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "10. Disclaimer of Warranties"), /*#__PURE__*/React.createElement("p", null, "THE SERVICE IS PROVIDED ON AN \"AS IS\" AND \"AS AVAILABLE\" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, KICKSLIST DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, NON-INFRINGEMENT, AND ACCURACY."), /*#__PURE__*/React.createElement("p", null, "WITHOUT LIMITING THE FOREGOING, KICKSLIST MAKES NO WARRANTY OR REPRESENTATION THAT: (A) THE SERVICE WILL MEET YOUR REQUIREMENTS OR EXPECTATIONS; (B) THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE; (C) ANY INFORMATION OBTAINED THROUGH THE SERVICE WILL BE ACCURATE, RELIABLE, OR COMPLETE; (D) ANY DEFECTS OR ERRORS IN THE SERVICE WILL BE CORRECTED; OR (E) THE SERVICE OR ITS SERVERS ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS."), /*#__PURE__*/React.createElement("p", null, "YOU EXPRESSLY ACKNOWLEDGE AND AGREE THAT YOUR USE OF THE SERVICE IS AT YOUR SOLE RISK. KICKSLIST DOES NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR ANY PRODUCT OR SERVICE ADVERTISED OR OFFERED BY A THIRD PARTY THROUGH THE SERVICE OR ANY LINKED WEBSITE.")), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "11. Limitation of Liability"), /*#__PURE__*/React.createElement("p", null, "TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL KICKSLIST, ITS OWNERS, OPERATORS, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AFFILIATES, LICENSORS, OR SERVICE PROVIDERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF PROFITS, REVENUE, GOODWILL, DATA, OR OTHER INTANGIBLE LOSSES, REGARDLESS OF WHETHER SUCH DAMAGES ARE BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY, OR ANY OTHER LEGAL THEORY, AND WHETHER OR NOT KICKSLIST HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES, RESULTING FROM:"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "Your access to, use of, or inability to use the Service"), /*#__PURE__*/React.createElement("li", null, "Any products or services purchased or obtained from third-party vendors through links on our Service"), /*#__PURE__*/React.createElement("li", null, "Any conduct or content of any third party on or linked from the Service"), /*#__PURE__*/React.createElement("li", null, "Unauthorized access to, alteration of, or loss of your data or transmissions"), /*#__PURE__*/React.createElement("li", null, "Any errors, inaccuracies, omissions, or misleading information in our content, including product prices, descriptions, and images"), /*#__PURE__*/React.createElement("li", null, "Any personal injury, property damage, or financial loss of any nature arising from your use of the Service"), /*#__PURE__*/React.createElement("li", null, "Any bugs, viruses, or other harmful code that may be transmitted through the Service")), /*#__PURE__*/React.createElement("p", null, "IN NO EVENT SHALL THE TOTAL AGGREGATE LIABILITY OF KICKSLIST FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THE USE OF THE SERVICE EXCEED THE GREATER OF: (A) THE AMOUNT YOU PAID TO KICKSLIST, IF ANY, IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM; OR (B) ONE HUNDRED U.S. DOLLARS ($100.00)."), /*#__PURE__*/React.createElement("p", null, "SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES, SO SOME OF THE ABOVE LIMITATIONS MAY NOT APPLY TO YOU. IN SUCH JURISDICTIONS, KICKSLIST'S LIABILITY SHALL BE LIMITED TO THE FULLEST EXTENT PERMITTED BY LAW.")), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "12. Indemnification"), /*#__PURE__*/React.createElement("p", null, "You agree to indemnify, defend, and hold harmless KicksList and its owners, operators, officers, directors, employees, agents, affiliates, licensors, and service providers from and against any and all claims, demands, actions, damages, losses, liabilities, judgments, settlements, costs, and expenses (including reasonable attorneys' fees and legal costs) arising out of or relating to: (a) your use of or access to the Service; (b) your violation of these Terms; (c) your violation of any applicable law, regulation, or third-party right; (d) any content or information you submit or transmit through the Service; or (e) any dispute between you and a third-party vendor."), /*#__PURE__*/React.createElement("p", null, "KicksList reserves the right, at your expense, to assume the exclusive defense and control of any matter for which you are required to indemnify us, and you agree to cooperate with our defense of such claims.")), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "13. Dispute Resolution and Arbitration"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "PLEASE READ THIS SECTION CAREFULLY — IT AFFECTS YOUR LEGAL RIGHTS.")), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Binding Arbitration:"), " Any dispute, controversy, or claim arising out of or relating to these Terms or the Service, including the determination of the scope or applicability of this agreement to arbitrate, shall be determined by binding arbitration administered in accordance with the rules of the American Arbitration Association (\"AAA\"). The arbitration shall be conducted by a single arbitrator in the State of California. The language of the arbitration shall be English. Judgment on the arbitration award may be entered in any court having jurisdiction."), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Class Action Waiver:"), " YOU AND KICKSLIST AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS, CONSOLIDATED, OR REPRESENTATIVE PROCEEDING. THE ARBITRATOR MAY NOT CONSOLIDATE MORE THAN ONE PERSON'S CLAIMS AND MAY NOT OTHERWISE PRESIDE OVER ANY FORM OF A CLASS OR REPRESENTATIVE PROCEEDING."), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Waiver of Jury Trial:"), " TO THE EXTENT PERMITTED BY LAW, YOU AND KICKSLIST EACH WAIVE THE RIGHT TO A JURY TRIAL FOR ANY DISPUTES COVERED BY THESE TERMS."), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Exception:"), " Notwithstanding the foregoing, either party may bring an individual action in small claims court for disputes within the jurisdiction of such court, and either party may seek injunctive or equitable relief in any court of competent jurisdiction to protect its intellectual property rights.")), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "14. Governing Law"), /*#__PURE__*/React.createElement("p", null, "These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions. To the extent that arbitration does not apply, you consent to the exclusive jurisdiction of the state and federal courts located in California for the resolution of any disputes.")), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "15. Termination"), /*#__PURE__*/React.createElement("p", null, "KicksList reserves the right to terminate or suspend your access to the Service, without prior notice or liability, for any reason whatsoever, including but not limited to a breach of these Terms. Upon termination, your right to use the Service will immediately cease. All provisions of these Terms that by their nature should survive termination shall survive, including but not limited to ownership provisions, warranty disclaimers, indemnification, arbitration, and limitations of liability.")), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "16. Severability"), /*#__PURE__*/React.createElement("p", null, "If any provision of these Terms is found to be unlawful, void, or unenforceable by a court of competent jurisdiction, that provision shall be deemed severable and shall not affect the validity and enforceability of the remaining provisions, which shall remain in full force and effect.")), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "17. Entire Agreement"), /*#__PURE__*/React.createElement("p", null, "These Terms, together with the Privacy Policy, constitute the entire agreement between you and KicksList regarding the use of the Service and supersede all prior and contemporaneous agreements, understandings, representations, and warranties, both written and oral, regarding the Service.")), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "18. Waiver"), /*#__PURE__*/React.createElement("p", null, "The failure of KicksList to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision. No waiver of any term shall be deemed a further or continuing waiver of such term or any other term.")), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "19. Contact Information"), /*#__PURE__*/React.createElement("p", null, "If you have any questions about these Terms of Service, please contact us at:"), /*#__PURE__*/React.createElement("p", null, "Email: contact@kickslist.net"))));
};

// ============================================
// Privacy Policy Page
// ============================================
const PrivacyPage = () => {
  const {
    navigate
  } = useApp();
  return /*#__PURE__*/React.createElement("main", {
    className: "kl-legal-page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-legal-container"
  }, /*#__PURE__*/React.createElement("nav", {
    className: "kl-breadcrumb"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#/",
    onClick: e => {
      e.preventDefault();
      navigate('/');
    }
  }, "Home"), /*#__PURE__*/React.createElement("span", {
    className: "kl-breadcrumb-sep"
  }, "/"), /*#__PURE__*/React.createElement("span", {
    className: "kl-breadcrumb-current"
  }, "Privacy Policy")), /*#__PURE__*/React.createElement("h1", null, "Privacy Policy"), /*#__PURE__*/React.createElement("p", {
    className: "kl-legal-updated"
  }, "Last Updated: February 12, 2026"), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "1. Introduction"), /*#__PURE__*/React.createElement("p", null, "KicksList (\"Company,\" \"we,\" \"our,\" or \"us\") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at kickslist.net (the \"Service\"). Please read this policy carefully. By using the Service, you consent to the practices described in this Privacy Policy.")), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "2. Information We Collect"), /*#__PURE__*/React.createElement("h3", null, "Information You Voluntarily Provide"), /*#__PURE__*/React.createElement("p", null, "We may collect information you voluntarily provide when you interact with us, such as:"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "Email address (if you subscribe to our newsletter or contact us)"), /*#__PURE__*/React.createElement("li", null, "Name and contact information (if you reach out to us directly)"), /*#__PURE__*/React.createElement("li", null, "Any other information you choose to provide in communications with us")), /*#__PURE__*/React.createElement("h3", null, "Information Automatically Collected"), /*#__PURE__*/React.createElement("p", null, "When you visit our Service, we and our third-party service providers may automatically collect certain information, including:"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "Device and browser information (type, version, operating system)"), /*#__PURE__*/React.createElement("li", null, "IP address and approximate geographic location"), /*#__PURE__*/React.createElement("li", null, "Pages visited, time spent on pages, and navigation paths"), /*#__PURE__*/React.createElement("li", null, "Referring website, search terms, and traffic source"), /*#__PURE__*/React.createElement("li", null, "Date and time of visits"), /*#__PURE__*/React.createElement("li", null, "Clicks on links, including affiliate links to third-party vendors"), /*#__PURE__*/React.createElement("li", null, "Screen resolution and device identifiers"))), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "3. How We Use Your Information"), /*#__PURE__*/React.createElement("p", null, "We use the information we collect for the following purposes:"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "To provide, operate, maintain, and improve our Service"), /*#__PURE__*/React.createElement("li", null, "To analyze website traffic, user behavior, and usage patterns"), /*#__PURE__*/React.createElement("li", null, "To track affiliate link performance and referral conversions"), /*#__PURE__*/React.createElement("li", null, "To send periodic communications, including newsletters and updates (only with your explicit consent)"), /*#__PURE__*/React.createElement("li", null, "To respond to your inquiries, comments, or requests"), /*#__PURE__*/React.createElement("li", null, "To detect, prevent, and address technical issues, fraud, or security concerns"), /*#__PURE__*/React.createElement("li", null, "To comply with legal obligations and enforce our Terms of Service"), /*#__PURE__*/React.createElement("li", null, "To generate aggregated, anonymized, or de-identified data for analytics and business purposes"))), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "4. Cookies and Tracking Technologies"), /*#__PURE__*/React.createElement("p", null, "We use cookies, web beacons, pixels, and similar tracking technologies to:"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "Remember your preferences and settings"), /*#__PURE__*/React.createElement("li", null, "Analyze site traffic and user engagement through services such as Google Analytics 4"), /*#__PURE__*/React.createElement("li", null, "Track affiliate referrals and conversions to our partner vendors"), /*#__PURE__*/React.createElement("li", null, "Improve the functionality and performance of our Service")), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Google Analytics:"), " We use Google Analytics 4, which collects data such as your IP address, browser type, pages visited, and session duration. Google may use this data in accordance with its own privacy policy. You can opt out of Google Analytics by installing the ", /*#__PURE__*/React.createElement("a", {
    href: "https://tools.google.com/dlpage/gaoptout",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Google Analytics Opt-Out Browser Add-on"), "."), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Affiliate Tracking:"), " When you click on affiliate links, our affiliate network partners (including Impact, CJ Affiliate, and Rakuten) may place cookies on your device to track referrals and conversions. These cookies are governed by the respective affiliate network's privacy policy."), /*#__PURE__*/React.createElement("p", null, "You can control and manage cookies through your browser settings. Note that disabling cookies may affect the functionality of our Service. Most browsers allow you to refuse cookies, delete existing cookies, or alert you when cookies are being sent.")), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "5. Third-Party Services and Data Sharing"), /*#__PURE__*/React.createElement("p", null, "Our Service integrates with and may share data with the following categories of third-party services:"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Affiliate Networks (Impact, CJ Affiliate, Rakuten):"), " We share referral data (such as click identifiers) with affiliate networks to track conversions. These networks may place cookies on your device."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Analytics Providers (Google Analytics):"), " We share usage data with analytics providers to understand how users interact with our Service."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Hosting Provider (GitHub Pages):"), " Our Service is hosted on GitHub Pages, which may collect server logs including IP addresses."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Third-Party Retailers:"), " When you click links to vendors like StockX, GOAT, Nike, Foot Locker, or others, those sites will collect information according to their own privacy policies. We encourage you to review them.")), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "We do not sell your personal information."), " We may disclose information to:"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "Service providers who assist in operating our website and business"), /*#__PURE__*/React.createElement("li", null, "Affiliate partners, limited to referral and conversion tracking"), /*#__PURE__*/React.createElement("li", null, "Legal authorities when required by law, subpoena, or court order"), /*#__PURE__*/React.createElement("li", null, "Third parties in connection with a merger, acquisition, or sale of assets"), /*#__PURE__*/React.createElement("li", null, "Any party with your explicit consent"))), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "6. Data Retention"), /*#__PURE__*/React.createElement("p", null, "We retain your personal information only for as long as necessary to fulfill the purposes described in this Privacy Policy, unless a longer retention period is required or permitted by law. Automatically collected data (such as analytics data) is retained according to the default retention settings of our third-party analytics providers.")), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "7. Data Security"), /*#__PURE__*/React.createElement("p", null, "We implement commercially reasonable administrative, technical, and physical security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of electronic transmission or storage is completely secure, and we cannot guarantee the absolute security of your information. You acknowledge that you provide your information at your own risk.")), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "8. Your Rights and Choices"), /*#__PURE__*/React.createElement("p", null, "Depending on your location, you may have certain rights regarding your personal information, including:"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Right to Access:"), " Request a copy of the personal information we hold about you"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Right to Correction:"), " Request correction of inaccurate or incomplete information"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Right to Deletion:"), " Request deletion of your personal information, subject to certain exceptions"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Right to Opt Out:"), " Opt out of marketing communications, cookies, or certain data collection"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Right to Data Portability:"), " Request your data in a structured, commonly used format"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Right to Object:"), " Object to certain types of data processing")), /*#__PURE__*/React.createElement("p", null, "To exercise any of these rights, please contact us at contact@kickslist.net. We will respond to your request within 30 days or as required by applicable law.")), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "9. California Privacy Rights (CCPA/CPRA)"), /*#__PURE__*/React.createElement("p", null, "If you are a California resident, the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA) provide you with additional rights, including:"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "The right to know what personal information is collected, used, shared, or sold"), /*#__PURE__*/React.createElement("li", null, "The right to request deletion of your personal information"), /*#__PURE__*/React.createElement("li", null, "The right to opt out of the sale or sharing of personal information"), /*#__PURE__*/React.createElement("li", null, "The right to non-discrimination for exercising your privacy rights"), /*#__PURE__*/React.createElement("li", null, "The right to correct inaccurate personal information"), /*#__PURE__*/React.createElement("li", null, "The right to limit the use of sensitive personal information")), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "We do not sell or share personal information"), " as defined under the CCPA/CPRA. To submit a verifiable consumer request, please contact us at contact@kickslist.net.")), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "10. European Privacy Rights (GDPR)"), /*#__PURE__*/React.createElement("p", null, "If you are located in the European Economic Area (EEA), United Kingdom, or Switzerland, you have rights under the General Data Protection Regulation (GDPR), including the rights described in Section 8 above. Our legal basis for processing your personal information includes: (a) your consent; (b) our legitimate business interests; and (c) compliance with legal obligations."), /*#__PURE__*/React.createElement("p", null, "If you wish to exercise your GDPR rights or have concerns about our data practices, please contact us at contact@kickslist.net. You also have the right to lodge a complaint with your local data protection authority.")), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "11. Do Not Track Signals"), /*#__PURE__*/React.createElement("p", null, "Some web browsers transmit \"Do Not Track\" (DNT) signals. Because there is no uniform standard for interpreting DNT signals, our Service does not currently respond to DNT signals. However, you can manage your privacy preferences through browser settings and the opt-out tools described in this policy.")), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "12. Children's Privacy"), /*#__PURE__*/React.createElement("p", null, "Our Service is not directed to, and we do not knowingly collect personal information from, children under the age of 13 (or 16 in the EEA). If we become aware that we have collected personal information from a child under the applicable age, we will take steps to delete such information promptly. If you believe we have collected information from a child, please contact us immediately at contact@kickslist.net.")), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "13. International Data Transfers"), /*#__PURE__*/React.createElement("p", null, "Our Service is operated in the United States. If you access the Service from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States, where data protection laws may differ from those in your jurisdiction. By using the Service, you consent to the transfer of your information to the United States.")), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "14. Changes to This Policy"), /*#__PURE__*/React.createElement("p", null, "We may update this Privacy Policy from time to time at our sole discretion. We will notify you of material changes by posting the updated policy on this page and updating the \"Last Updated\" date. Your continued use of the Service after any changes constitutes your acceptance of the revised policy. We encourage you to review this page periodically.")), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "15. Contact Us"), /*#__PURE__*/React.createElement("p", null, "If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:"), /*#__PURE__*/React.createElement("p", null, "Email: contact@kickslist.net"))));
};

// ============================================
// Affiliate Disclosure Page
// ============================================
const AffiliateDisclosurePage = () => {
  const {
    navigate
  } = useApp();
  return /*#__PURE__*/React.createElement("main", {
    className: "kl-legal-page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-legal-container"
  }, /*#__PURE__*/React.createElement("nav", {
    className: "kl-breadcrumb"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#/",
    onClick: e => {
      e.preventDefault();
      navigate('/');
    }
  }, "Home"), /*#__PURE__*/React.createElement("span", {
    className: "kl-breadcrumb-sep"
  }, "/"), /*#__PURE__*/React.createElement("span", {
    className: "kl-breadcrumb-current"
  }, "Affiliate Disclosure")), /*#__PURE__*/React.createElement("h1", null, "Affiliate Disclosure"), /*#__PURE__*/React.createElement("p", {
    className: "kl-legal-updated"
  }, "Last Updated: February 12, 2026"), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "What Is Affiliate Marketing?"), /*#__PURE__*/React.createElement("p", null, "Affiliate marketing is a way for websites like KicksList to earn a small commission by linking to products on retailer websites. When you click one of our links and make a purchase, the retailer pays us a referral fee. This is a standard practice across the internet and is how many free-to-use comparison sites sustain themselves.")), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "Our Affiliate Networks"), /*#__PURE__*/React.createElement("p", null, "KicksList participates in affiliate programs operated by the following networks:"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Impact"), " — Connects us with retailers such as Foot Locker, StockX, GOAT, Dick's Sporting Goods, and New Balance."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "CJ Affiliate"), " — Connects us with retailers such as Nike, Adidas, and Puma."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Rakuten Advertising"), " — Connects us with retailers such as Finish Line, JD Sports, and Reebok.")), /*#__PURE__*/React.createElement("p", null, "These networks provide the tracking technology that attributes a sale to our referral. We only partner with reputable networks that work with well-known, trusted brands.")), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "No Extra Cost to You"), /*#__PURE__*/React.createElement("p", null, "Using our affiliate links does not add any cost to your purchase. The price you see on the retailer's website is exactly what you pay — our commission comes from the retailer, not from you.")), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "Independence of Rankings"), /*#__PURE__*/React.createElement("p", null, "Our affiliate relationships do not influence how we list, rank, or present products. Every sneaker and every vendor is shown based on relevance, not on commission rates. We believe that honest, unbiased information is what makes KicksList valuable — and we intend to keep it that way.")), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "FTC Compliance"), /*#__PURE__*/React.createElement("p", null, "In accordance with the Federal Trade Commission (FTC) guidelines on endorsements and testimonials, we disclose that KicksList may receive compensation for clicks and purchases made through links on this website."), /*#__PURE__*/React.createElement("p", null, "For more information, you can review the FTC's guidelines at ", /*#__PURE__*/React.createElement("a", {
    href: "https://www.ftc.gov/legal-library/browse/rules/endorsement-guides",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      color: 'var(--kl-accent-gold)',
      textDecoration: 'underline'
    }
  }, "ftc.gov/legal-library/browse/rules/endorsement-guides"), "."))));
};

// ============================================
// Contact Page
// ============================================
const ContactPage = () => {
  const {
    navigate
  } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  const handleSubmit = e => {
    e.preventDefault();
    trackEvent('contact_form_submit', {
      subject: formData.subject
    });
    setSubmitted(true);
  };
  return /*#__PURE__*/React.createElement("main", {
    className: "kl-legal-page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-legal-container"
  }, /*#__PURE__*/React.createElement("nav", {
    className: "kl-breadcrumb"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#/",
    onClick: e => {
      e.preventDefault();
      navigate('/');
    }
  }, "Home"), /*#__PURE__*/React.createElement("span", {
    className: "kl-breadcrumb-sep"
  }, "/"), /*#__PURE__*/React.createElement("span", {
    className: "kl-breadcrumb-current"
  }, "Contact")), /*#__PURE__*/React.createElement("h1", null, "Contact Us"), /*#__PURE__*/React.createElement("p", {
    className: "kl-legal-updated"
  }, "We'd love to hear from you"), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "General Inquiries"), /*#__PURE__*/React.createElement("p", null, "For general questions, feedback, or support, reach out to us at ", /*#__PURE__*/React.createElement("a", {
    href: "mailto:contact@kickslist.net",
    style: {
      color: 'var(--kl-accent-gold)',
      textDecoration: 'underline'
    }
  }, "contact@kickslist.net"), ".")), /*#__PURE__*/React.createElement("section", {
    className: "kl-legal-section"
  }, /*#__PURE__*/React.createElement("h2", null, "Business & Partnership Inquiries"), /*#__PURE__*/React.createElement("p", null, "Interested in partnering with KicksList? Whether you're a retailer, brand, or affiliate network, we're open to exploring opportunities. Please use the form below or email us directly.")), submitted ? /*#__PURE__*/React.createElement("div", {
    className: "kl-contact-success"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M22 11.08V12a10 10 0 1 1-5.93-9.14"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "22 4 12 14.01 9 11.01"
  })), /*#__PURE__*/React.createElement("h3", null, "Thank you for reaching out!"), /*#__PURE__*/React.createElement("p", null, "We've received your message and will get back to you as soon as possible.")) : /*#__PURE__*/React.createElement("form", {
    className: "kl-contact-form",
    onSubmit: handleSubmit
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-form-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-form-group"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "contact-name"
  }, "Name"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "contact-name",
    name: "name",
    value: formData.name,
    onChange: handleChange,
    required: true,
    placeholder: "Your name"
  })), /*#__PURE__*/React.createElement("div", {
    className: "kl-form-group"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "contact-email"
  }, "Email"), /*#__PURE__*/React.createElement("input", {
    type: "email",
    id: "contact-email",
    name: "email",
    value: formData.email,
    onChange: handleChange,
    required: true,
    placeholder: "you@example.com"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "kl-form-group"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "contact-subject"
  }, "Subject"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "contact-subject",
    name: "subject",
    value: formData.subject,
    onChange: handleChange,
    required: true,
    placeholder: "What is this regarding?"
  })), /*#__PURE__*/React.createElement("div", {
    className: "kl-form-group"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "contact-message"
  }, "Message"), /*#__PURE__*/React.createElement("textarea", {
    id: "contact-message",
    name: "message",
    value: formData.message,
    onChange: handleChange,
    required: true,
    rows: "6",
    placeholder: "Your message..."
  })), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "kl-btn kl-btn-primary"
  }, "Send Message"))));
};

// ============================================
// FAQ Page
// ============================================
const FAQPage = () => {
  const {
    navigate
  } = useApp();
  const [openIndex, setOpenIndex] = useState(null);
  const faqs = [{
    q: 'What is KicksList?',
    a: 'KicksList is a free sneaker discovery and price comparison platform. We aggregate pricing and product information from 14+ trusted retailers and resale marketplaces so you can find the best deal on authentic sneakers — all in one place.'
  }, {
    q: 'How does KicksList make money?',
    a: 'We participate in affiliate marketing programs through networks like Impact, CJ Affiliate, and Rakuten. When you click a link on our site and make a purchase from a retailer, we may earn a small commission. This never costs you anything extra — the retailer pays us, not you.'
  }, {
    q: 'Are the prices accurate?',
    a: 'We do our best to display current pricing, but prices on vendor websites are live and can change at any time. Always verify the final price on the retailer\'s website before completing a purchase.'
  }, {
    q: 'How do you choose which retailers to include?',
    a: 'We only partner with well-known, trusted retailers and authenticated resale marketplaces. Every vendor on KicksList has a strong reputation for selling genuine products and providing reliable customer service.'
  }, {
    q: 'Is KicksList affiliated with any brands?',
    a: 'No. KicksList is an independent platform. We are not owned by, sponsored by, or directly affiliated with any sneaker brand. Our listings and rankings are not influenced by any brand relationship.'
  }, {
    q: 'Do you sell sneakers directly?',
    a: 'No. KicksList is purely a comparison and referral service. We do not sell, ship, or handle any products. All purchases are made directly through the retailer or marketplace you choose.'
  }, {
    q: 'How do I report an issue?',
    a: 'If you notice incorrect information, a broken link, or any other issue, please let us know at contact@kickslist.net. We appreciate your help in keeping KicksList accurate.'
  }, {
    q: 'Is my data safe?',
    a: 'Yes. We take your privacy seriously. We use Google Analytics for site performance and do not sell your personal information. For full details, please read our Privacy Policy.'
  }];
  return /*#__PURE__*/React.createElement("main", {
    className: "kl-legal-page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-legal-container"
  }, /*#__PURE__*/React.createElement("nav", {
    className: "kl-breadcrumb"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#/",
    onClick: e => {
      e.preventDefault();
      navigate('/');
    }
  }, "Home"), /*#__PURE__*/React.createElement("span", {
    className: "kl-breadcrumb-sep"
  }, "/"), /*#__PURE__*/React.createElement("span", {
    className: "kl-breadcrumb-current"
  }, "FAQ")), /*#__PURE__*/React.createElement("h1", null, "Frequently Asked Questions"), /*#__PURE__*/React.createElement("p", {
    className: "kl-legal-updated"
  }, "Everything you need to know about KicksList"), /*#__PURE__*/React.createElement("div", {
    className: "kl-faq-list"
  }, faqs.map((faq, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: `kl-faq-item ${openIndex === i ? 'open' : ''}`
  }, /*#__PURE__*/React.createElement("button", {
    className: "kl-faq-question",
    onClick: () => setOpenIndex(openIndex === i ? null : i)
  }, /*#__PURE__*/React.createElement("span", null, faq.q), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    className: "kl-faq-chevron"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "6 9 12 15 18 9"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "kl-faq-answer"
  }, /*#__PURE__*/React.createElement("p", null, faq.a)))))));
};

// ============================================
// Cookie Consent Banner
// ============================================
const CookieConsent = () => {
  const [visible, setVisible] = useState(() => {
    return !localStorage.getItem('kickslist-cookies');
  });
  const handleAccept = () => {
    localStorage.setItem('kickslist-cookies', 'accepted');
    trackEvent('cookie_consent_accept');
    setVisible(false);
  };
  if (!visible) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "kl-cookie-banner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-cookie-inner"
  }, /*#__PURE__*/React.createElement("p", null, "We use cookies and similar technologies to improve your experience and analyze site traffic. By continuing to use KicksList, you consent to our use of cookies. ", /*#__PURE__*/React.createElement("a", {
    href: "#/privacy",
    style: {
      color: 'white',
      textDecoration: 'underline'
    }
  }, "Privacy Policy")), /*#__PURE__*/React.createElement("button", {
    className: "kl-cookie-accept",
    onClick: handleAccept
  }, "Accept")));
};

// ============================================
// Footer (Updated with Vendors)
// ============================================
const Footer = () => {
  const {
    navigate
  } = useApp();
  const {
    vendors
  } = window.KicksListVendors;
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(() => {
    return !!localStorage.getItem('kickslist-newsletter');
  });
  const handleNewsletterSubmit = e => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      localStorage.setItem('kickslist-newsletter', newsletterEmail);
      trackEvent('newsletter_signup', {
        email: newsletterEmail
      });
      setNewsletterSubmitted(true);
    }
  };
  return /*#__PURE__*/React.createElement("footer", {
    className: "kl-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-footer-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-footer-brand"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#/",
    className: "kl-logo",
    onClick: e => {
      e.preventDefault();
      navigate('/');
    }
  }, "KicksList"), /*#__PURE__*/React.createElement("p", null, "Discover and shop authentic sneakers from trusted retailers and marketplaces."), /*#__PURE__*/React.createElement("div", {
    className: "kl-footer-socials"
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://twitter.com/kickslist",
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": "Twitter"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
  }))), /*#__PURE__*/React.createElement("a", {
    href: "https://instagram.com/kickslist",
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": "Instagram"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C16.67.014 16.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
  }))), /*#__PURE__*/React.createElement("a", {
    href: "https://tiktok.com/@kickslist",
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": "TikTok"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48V13.4a8.16 8.16 0 005.58 2.2v-3.45a4.85 4.85 0 01-3.77-1.69V6.69h3.77z"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "kl-footer-links"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-footer-col"
  }, /*#__PURE__*/React.createElement("h5", null, "Brands"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#/category/jordan",
    onClick: e => {
      e.preventDefault();
      navigate('/category/jordan');
    }
  }, "Jordan")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#/category/nike",
    onClick: e => {
      e.preventDefault();
      navigate('/category/nike');
    }
  }, "Nike")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#/category/adidas",
    onClick: e => {
      e.preventDefault();
      navigate('/category/adidas');
    }
  }, "Adidas")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#/category/new-balance",
    onClick: e => {
      e.preventDefault();
      navigate('/category/new-balance');
    }
  }, "New Balance")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#/category/puma",
    onClick: e => {
      e.preventDefault();
      navigate('/category/puma');
    }
  }, "Puma")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#/category/reebok",
    onClick: e => {
      e.preventDefault();
      navigate('/category/reebok');
    }
  }, "Reebok")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#/category/yeezy",
    onClick: e => {
      e.preventDefault();
      navigate('/category/yeezy');
    }
  }, "Yeezy")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#/category/ugg",
    onClick: e => {
      e.preventDefault();
      navigate('/category/ugg');
    }
  }, "UGG")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#/category/crocs",
    onClick: e => {
      e.preventDefault();
      navigate('/category/crocs');
    }
  }, "Crocs")))), /*#__PURE__*/React.createElement("div", {
    className: "kl-footer-col"
  }, /*#__PURE__*/React.createElement("h5", null, "Retailers"), /*#__PURE__*/React.createElement("ul", null, vendors.filter(v => v.type === 'retail').map(vendor => /*#__PURE__*/React.createElement("li", {
    key: vendor.id
  }, /*#__PURE__*/React.createElement("a", {
    href: vendor.url,
    target: "_blank",
    rel: "noopener noreferrer"
  }, vendor.name))))), /*#__PURE__*/React.createElement("div", {
    className: "kl-footer-col"
  }, /*#__PURE__*/React.createElement("h5", null, "Resale"), /*#__PURE__*/React.createElement("ul", null, vendors.filter(v => v.type === 'resale').map(vendor => /*#__PURE__*/React.createElement("li", {
    key: vendor.id
  }, /*#__PURE__*/React.createElement("a", {
    href: vendor.url,
    target: "_blank",
    rel: "noopener noreferrer"
  }, vendor.name))))), /*#__PURE__*/React.createElement("div", {
    className: "kl-footer-col"
  }, /*#__PURE__*/React.createElement("h5", null, "Company"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#/about",
    onClick: e => {
      e.preventDefault();
      navigate('/about');
    }
  }, "About Us")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#/brands",
    onClick: e => {
      e.preventDefault();
      navigate('/brands');
    }
  }, "Our Brands")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#/faq",
    onClick: e => {
      e.preventDefault();
      navigate('/faq');
    }
  }, "FAQ")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#/contact",
    onClick: e => {
      e.preventDefault();
      navigate('/contact');
    }
  }, "Contact")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#/affiliate-disclosure",
    onClick: e => {
      e.preventDefault();
      navigate('/affiliate-disclosure');
    }
  }, "Affiliate Disclosure")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#/privacy",
    onClick: e => {
      e.preventDefault();
      navigate('/privacy');
    }
  }, "Privacy Policy")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#/terms",
    onClick: e => {
      e.preventDefault();
      navigate('/terms');
    }
  }, "Terms of Service")))))), /*#__PURE__*/React.createElement("div", {
    className: "kl-footer-newsletter"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-footer-newsletter-inner"
  }, newsletterSubmitted ? /*#__PURE__*/React.createElement("p", {
    className: "kl-newsletter-thanks"
  }, "Thanks for subscribing! We'll keep you in the loop.") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", null, "Stay up to date with the latest drops and deals."), /*#__PURE__*/React.createElement("form", {
    className: "kl-newsletter-form",
    onSubmit: handleNewsletterSubmit
  }, /*#__PURE__*/React.createElement("input", {
    type: "email",
    className: "kl-newsletter-input",
    placeholder: "Enter your email",
    value: newsletterEmail,
    onChange: e => setNewsletterEmail(e.target.value),
    required: true
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "kl-btn kl-btn-primary"
  }, "Subscribe"))))), /*#__PURE__*/React.createElement("div", {
    className: "kl-footer-bottom"
  }, /*#__PURE__*/React.createElement("p", null, "© 2026 KicksList. All rights reserved."), /*#__PURE__*/React.createElement("div", {
    className: "kl-footer-legal"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#/privacy",
    onClick: e => {
      e.preventDefault();
      navigate('/privacy');
    }
  }, "Privacy Policy"), /*#__PURE__*/React.createElement("a", {
    href: "#/terms",
    onClick: e => {
      e.preventDefault();
      navigate('/terms');
    }
  }, "Terms of Service"), /*#__PURE__*/React.createElement("a", {
    href: "#/affiliate-disclosure",
    onClick: e => {
      e.preventDefault();
      navigate('/affiliate-disclosure');
    }
  }, "Affiliate Disclosure"))));
};

// ============================================
// Main App (Cart Drawer removed)
// ============================================
// ============================================
// SEO Helper - Update page title and meta
// ============================================
// ============================================
// Wishlist Page
// ============================================
const WishlistPage = () => {
  const {
    navigate,
    wishlist,
    toggleWishlist
  } = useApp();
  const {
    getProductById
  } = window.KicksListData;
  const wishlistProducts = wishlist.map(id => getProductById(id)).filter(Boolean);
  const clearAll = () => {
    wishlist.forEach(id => toggleWishlist(id));
  };
  return /*#__PURE__*/React.createElement("main", {
    className: "kl-wishlist-page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kl-wishlist-container"
  }, /*#__PURE__*/React.createElement("nav", {
    className: "kl-breadcrumb"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#/",
    onClick: e => {
      e.preventDefault();
      navigate('/');
    }
  }, "Home"), /*#__PURE__*/React.createElement("span", {
    className: "kl-breadcrumb-sep"
  }, "/"), /*#__PURE__*/React.createElement("span", {
    className: "kl-breadcrumb-current"
  }, "Wishlist")), /*#__PURE__*/React.createElement("div", {
    className: "kl-wishlist-header"
  }, /*#__PURE__*/React.createElement("h1", null, "Your Wishlist", wishlistProducts.length > 0 ? ` (${wishlistProducts.length} item${wishlistProducts.length !== 1 ? 's' : ''})` : ''), wishlistProducts.length > 0 && /*#__PURE__*/React.createElement("button", {
    className: "kl-btn kl-btn-outline kl-wishlist-clear",
    onClick: clearAll
  }, "Clear All")), wishlistProducts.length > 0 ? /*#__PURE__*/React.createElement("div", {
    className: "kl-product-grid kl-wishlist-grid"
  }, wishlistProducts.map((product, index) => /*#__PURE__*/React.createElement(ProductCard, {
    key: product.id,
    product: product,
    index: index
  }))) : /*#__PURE__*/React.createElement("div", {
    className: "kl-wishlist-empty"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1",
    className: "kl-wishlist-empty-icon"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
  })), /*#__PURE__*/React.createElement("h2", null, "Your wishlist is empty"), /*#__PURE__*/React.createElement("p", null, "Save sneakers you love by tapping the heart icon on any product."), /*#__PURE__*/React.createElement("button", {
    className: "kl-btn kl-btn-primary",
    onClick: () => navigate('/shop')
  }, "Browse Sneakers"))));
};
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
  const {
    route
  } = useApp();
  const {
    getProductById,
    categories
  } = window.KicksListData;

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
      case 'wishlist':
        title = `Your Wishlist | ${baseTitle}`;
        description = `View and manage your saved sneakers on KicksList.`;
        break;
      case 'affiliate-disclosure':
        title = `Affiliate Disclosure | ${baseTitle}`;
        description = `Learn how KicksList earns revenue through affiliate partnerships with Impact, CJ Affiliate, and Rakuten — at no extra cost to you.`;
        break;
      case 'contact':
        title = `Contact Us | ${baseTitle}`;
        description = `Get in touch with the KicksList team for general inquiries, business partnerships, or feedback.`;
        break;
      case 'faq':
        title = `FAQ | ${baseTitle}`;
        description = `Frequently asked questions about KicksList — how it works, how we make money, data privacy, and more.`;
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
    case 'wishlist':
      PageComponent = WishlistPage;
      break;
    case 'affiliate-disclosure':
      PageComponent = AffiliateDisclosurePage;
      break;
    case 'contact':
      PageComponent = ContactPage;
      break;
    case 'faq':
      PageComponent = FAQPage;
      break;
    default:
      PageComponent = Homepage;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "kl-app"
  }, /*#__PURE__*/React.createElement(Navigation, null), /*#__PURE__*/React.createElement(PageComponent, null), /*#__PURE__*/React.createElement(Footer, null), /*#__PURE__*/React.createElement(CookieConsent, null));
};

// ============================================
// Root
// ============================================
const Root = () => /*#__PURE__*/React.createElement(AppProvider, null, /*#__PURE__*/React.createElement(App, null));

// Render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(/*#__PURE__*/React.createElement(Root, null));
import React, { useState, useEffect, useRef } from 'react';
import './Homepage.css';

/**
 * Homepage - Luxury KicksList marketplace landing page
 *
 * Props:
 * @param {Object[]} featuredProducts - Hero carousel products (2-3 items)
 * @param {Object[]} newDrops - Newly listed sneakers
 * @param {Object[]} trending - Best-selling sneakers
 * @param {Object[]} categories - Category filter options
 * @param {number} cartCount - Number of items in cart
 * @param {Function} onProductClick - Navigate to product detail
 * @param {Function} onCategoryClick - Filter by category
 * @param {Function} onSearch - Search handler
 * @param {Function} onCartClick - Open cart drawer
 * @param {Function} onSellClick - Open sell modal
 */

const Homepage = ({
  featuredProducts = [],
  newDrops = [],
  trending = [],
  categories = [],
  cartCount = 0,
  onProductClick,
  onCategoryClick,
  onSearch,
  onCartClick,
  onSellClick,
}) => {
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isScrolled, setIsScrolled] = useState(false);
  const searchInputRef = useRef(null);

  // Auto-advance hero carousel
  useEffect(() => {
    if (featuredProducts.length <= 1) return;
    const timer = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % featuredProducts.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featuredProducts.length]);

  // Handle scroll for nav styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch?.(searchQuery);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleCategorySelect = (categoryId) => {
    setActiveCategory(categoryId);
    onCategoryClick?.(categoryId);
  };

  return (
    <div className="kl-homepage">
      {/* Announcement Bar */}
      <div className="kl-announcement">
        <span>Complimentary Shipping on Orders Over $300</span>
        <span className="kl-announcement-sep">·</span>
        <span>Every Pair Authenticated</span>
      </div>

      {/* Navigation */}
      <nav className={`kl-nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className="kl-nav-inner">
          <div className="kl-nav-left">
            <a href="/" className="kl-logo">KicksList</a>
            <ul className="kl-nav-links">
              <li><a href="/shop">Shop</a></li>
              <li><a href="/new">New Arrivals</a></li>
              <li><a href="/brands">Brands</a></li>
              <li><a href="/about">About</a></li>
            </ul>
          </div>

          <div className="kl-nav-right">
            <button
              className="kl-nav-icon-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
            </button>

            <a href="/account" className="kl-nav-icon-btn" aria-label="Account">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </a>

            <button
              className="kl-nav-icon-btn kl-cart-btn"
              onClick={onCartClick}
              aria-label="Shopping bag"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {cartCount > 0 && (
                <span className="kl-cart-count">{cartCount}</span>
              )}
            </button>

            <button className="kl-sell-btn" onClick={onSellClick}>
              Sell
            </button>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      <div className={`kl-search-overlay ${searchOpen ? 'open' : ''}`}>
        <div className="kl-search-container">
          <form onSubmit={handleSearchSubmit} className="kl-search-form">
            <svg className="kl-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search sneakers, brands, styles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="kl-search-input"
            />
            <button
              type="button"
              className="kl-search-close"
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery('');
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </form>
          <div className="kl-search-suggestions">
            <p className="kl-search-label">Popular Searches</p>
            <div className="kl-search-tags">
              {['Jordan 4', 'Travis Scott', 'Dunk Low', 'Yeezy 350', 'New Balance 550'].map((tag) => (
                <button
                  key={tag}
                  className="kl-search-tag"
                  onClick={() => {
                    setSearchQuery(tag);
                    onSearch?.(tag);
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

      {/* Hero Section */}
      <section className="kl-hero">
        <div className="kl-hero-slides">
          {featuredProducts.map((product, idx) => (
            <div
              key={product.id}
              className={`kl-hero-slide ${idx === activeHeroSlide ? 'active' : ''}`}
            >
              <div className="kl-hero-content">
                <p className="kl-hero-eyebrow">{product.badge || 'Featured'}</p>
                <h1 className="kl-hero-title">{product.name}</h1>
                <p className="kl-hero-subtitle">{product.tagline || product.brand}</p>
                <div className="kl-hero-actions">
                  <button
                    className="kl-btn kl-btn-primary"
                    onClick={() => onProductClick?.(product.id)}
                  >
                    Shop Now
                  </button>
                  <span className="kl-hero-price">${product.price?.toLocaleString()}</span>
                </div>
              </div>
              <div className="kl-hero-image">
                <img
                  src={product.images?.[0] || product.image}
                  alt={product.name}
                />
              </div>
            </div>
          ))}
        </div>

        {featuredProducts.length > 1 && (
          <div className="kl-hero-nav">
            {featuredProducts.map((_, idx) => (
              <button
                key={idx}
                className={`kl-hero-dot ${idx === activeHeroSlide ? 'active' : ''}`}
                onClick={() => setActiveHeroSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
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

      {/* Category Navigation */}
      <section className="kl-categories">
        <div className="kl-categories-inner">
          <button
            className={`kl-category-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => handleCategorySelect('all')}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`kl-category-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => handleCategorySelect(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Drops */}
      <section className="kl-section kl-drops">
        <div className="kl-section-header">
          <div className="kl-section-title-group">
            <p className="kl-section-eyebrow">Just Listed</p>
            <h2 className="kl-section-title">Featured Drops</h2>
          </div>
          <a href="/new" className="kl-section-link">
            View All
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
        </div>

        <div className="kl-product-grid">
          {newDrops.slice(0, 4).map((product, idx) => (
            <article
              key={product.id}
              className="kl-product-card"
              style={{ animationDelay: `${idx * 100}ms` }}
              onClick={() => onProductClick?.(product.id)}
            >
              {product.badge && (
                <span className={`kl-product-badge ${product.badge.toLowerCase().replace(' ', '-')}`}>
                  {product.badge}
                </span>
              )}
              <button className="kl-product-wishlist" aria-label="Add to wishlist">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
              <div className="kl-product-image">
                <img src={product.images?.[0] || product.image} alt={product.name} />
              </div>
              <div className="kl-product-info">
                <p className="kl-product-brand">{product.brand}</p>
                <h3 className="kl-product-name">{product.name}</h3>
                <div className="kl-product-price-row">
                  <span className="kl-product-price">${product.price?.toLocaleString()}</span>
                  {product.retail && product.retail < product.price && (
                    <span className="kl-product-retail">${product.retail?.toLocaleString()}</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Editorial Banner */}
      <section className="kl-editorial">
        <div className="kl-editorial-content">
          <p className="kl-editorial-eyebrow">The Edit</p>
          <h2 className="kl-editorial-title">Icons of<br /><em>Collaboration</em></h2>
          <p className="kl-editorial-desc">
            Explore the most coveted collaborations in sneaker history—from Travis Scott to Off-White.
          </p>
          <a href="/collections/collaborations" className="kl-btn kl-btn-outline-light">
            Discover More
          </a>
        </div>
        <div className="kl-editorial-images">
          <div className="kl-editorial-img kl-editorial-img-1">
            <img src="https://images.stockx.com/images/Nike-Air-Max-1-Travis-Scott-Wheat-Product.jpg" alt="Travis Scott" />
          </div>
          <div className="kl-editorial-img kl-editorial-img-2">
            <img src="https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Lost-and-Found-Product.jpg" alt="Jordan" />
          </div>
        </div>
      </section>

      {/* Trending Now */}
      <section className="kl-section kl-trending">
        <div className="kl-section-header">
          <div className="kl-section-title-group">
            <p className="kl-section-eyebrow">Most Wanted</p>
            <h2 className="kl-section-title">Trending Now</h2>
          </div>
          <a href="/trending" className="kl-section-link">
            View All
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
        </div>

        <div className="kl-trending-grid">
          {trending.slice(0, 6).map((product, idx) => (
            <article
              key={product.id}
              className="kl-trending-card"
              onClick={() => onProductClick?.(product.id)}
            >
              <span className="kl-trending-rank">{String(idx + 1).padStart(2, '0')}</span>
              <div className="kl-trending-image">
                <img src={product.images?.[0] || product.image} alt={product.name} />
              </div>
              <div className="kl-trending-info">
                <p className="kl-trending-brand">{product.brand}</p>
                <h3 className="kl-trending-name">{product.name}</h3>
                <span className="kl-trending-price">${product.price?.toLocaleString()}</span>
              </div>
              <svg className="kl-trending-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </article>
          ))}
        </div>
      </section>

      {/* Brand Logos */}
      <section className="kl-brands">
        <p className="kl-brands-label">Shop by Brand</p>
        <div className="kl-brands-grid">
          {['Nike', 'Jordan', 'Adidas', 'New Balance', 'Yeezy', 'Asics'].map((brand) => (
            <button
              key={brand}
              className="kl-brand-btn"
              onClick={() => handleCategorySelect(brand.toLowerCase())}
            >
              {brand}
            </button>
          ))}
        </div>
      </section>

      {/* Sell CTA */}
      <section className="kl-sell-cta">
        <div className="kl-sell-cta-content">
          <p className="kl-sell-cta-eyebrow">For Sellers</p>
          <h2 className="kl-sell-cta-title">Turn Your Collection<br />Into Currency</h2>
          <p className="kl-sell-cta-desc">
            List in minutes. We handle authentication, secure payment, and premium shipping.
          </p>
          <button className="kl-btn kl-btn-light" onClick={onSellClick}>
            Start Selling
          </button>
        </div>
        <div className="kl-sell-cta-visual">
          <div className="kl-sell-cta-card">
            <div className="kl-sell-cta-stat">
              <span className="kl-sell-cta-num">$50M+</span>
              <span className="kl-sell-cta-label">Paid to Sellers</span>
            </div>
          </div>
          <div className="kl-sell-cta-card">
            <div className="kl-sell-cta-stat">
              <span className="kl-sell-cta-num">100%</span>
              <span className="kl-sell-cta-label">Authenticated</span>
            </div>
          </div>
          <div className="kl-sell-cta-card">
            <div className="kl-sell-cta-stat">
              <span className="kl-sell-cta-num">3 Days</span>
              <span className="kl-sell-cta-label">Avg. Payout Time</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="kl-trust">
        <div className="kl-trust-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <polyline points="9 12 11 14 15 10"/>
          </svg>
          <div>
            <h4>Authenticity Guaranteed</h4>
            <p>Every sneaker verified by our expert team</p>
          </div>
        </div>
        <div className="kl-trust-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1" y="3" width="15" height="13"/>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
            <circle cx="5.5" cy="18.5" r="2.5"/>
            <circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
          <div>
            <h4>Premium Shipping</h4>
            <p>Complimentary on orders over $300</p>
          </div>
        </div>
        <div className="kl-trust-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
          <div>
            <h4>Easy Returns</h4>
            <p>Hassle-free returns within 14 days</p>
          </div>
        </div>
        <div className="kl-trust-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
            <line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
          <div>
            <h4>Secure Payments</h4>
            <p>Protected by industry-leading encryption</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="kl-footer">
        <div className="kl-footer-main">
          <div className="kl-footer-brand">
            <a href="/" className="kl-logo">KicksList</a>
            <p>The trusted marketplace for authentic sneakers. Buy with confidence. Sell with ease.</p>
            <div className="kl-footer-socials">
              <a href="#" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="#" aria-label="Twitter">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                </svg>
              </a>
              <a href="#" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="kl-footer-links">
            <div className="kl-footer-col">
              <h5>Shop</h5>
              <ul>
                <li><a href="/new">New Arrivals</a></li>
                <li><a href="/brands">Brands</a></li>
                <li><a href="/trending">Trending</a></li>
                <li><a href="/under-retail">Under Retail</a></li>
              </ul>
            </div>
            <div className="kl-footer-col">
              <h5>Sell</h5>
              <ul>
                <li><a href="/sell">How to Sell</a></li>
                <li><a href="/sell/guide">Seller Guide</a></li>
                <li><a href="/sell/pricing">Pricing</a></li>
                <li><a href="/sell/shipping">Shipping</a></li>
              </ul>
            </div>
            <div className="kl-footer-col">
              <h5>Help</h5>
              <ul>
                <li><a href="/faq">FAQ</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/returns">Returns</a></li>
                <li><a href="/size-guide">Size Guide</a></li>
              </ul>
            </div>
            <div className="kl-footer-col">
              <h5>Company</h5>
              <ul>
                <li><a href="/about">About Us</a></li>
                <li><a href="/authentication">Authentication</a></li>
                <li><a href="/careers">Careers</a></li>
                <li><a href="/press">Press</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="kl-footer-bottom">
          <p>&copy; 2025 KicksList. All rights reserved.</p>
          <div className="kl-footer-legal">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;

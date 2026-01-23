import React, { useState, useCallback, useEffect } from 'react';
import './ProductDetail.css';

/**
 * ProductDetail - Luxury sneaker product detail page component
 *
 * Props:
 * @param {Object} product - The main product data
 * @param {string} product.id - Unique product identifier
 * @param {string} product.name - Product name
 * @param {string} product.brand - Brand name (e.g., "Nike", "Jordan")
 * @param {string} product.model - Model name (e.g., "Air Jordan 4")
 * @param {string} product.styleId - Style ID (e.g., "CT8527-016")
 * @param {number} product.price - Current price
 * @param {number} product.retail - Original retail price
 * @param {string} product.condition - Condition (e.g., "New", "Used")
 * @param {number} product.releaseYear - Year of release
 * @param {string} product.description - Full product description
 * @param {string[]} product.images - Array of image URLs
 * @param {Array<{size: string, available: boolean}>} product.sizes - Available sizes
 * @param {boolean} product.inStock - Whether any size is in stock
 * @param {Object[]} relatedProducts - Array of related product objects
 * @param {Function} onAddToBag - Callback when adding to bag
 * @param {Function} onNotifyMe - Callback for out-of-stock notification
 */

const ProductDetail = ({
  product,
  relatedProducts = [],
  onAddToBag,
  onNotifyMe,
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [showNotifyForm, setShowNotifyForm] = useState(false);
  const [addedToBag, setAddedToBag] = useState(false);

  const {
    name,
    brand,
    model,
    styleId,
    price,
    retail,
    condition = 'New',
    releaseYear,
    description,
    images = [],
    sizes = [],
    inStock,
  } = product;

  const availableSizes = sizes.filter(s => s.available);
  const hasStock = inStock && availableSizes.length > 0;

  const handleImageHover = useCallback((e) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  }, [isZoomed]);

  const handleAddToBag = useCallback(() => {
    if (!selectedSize) return;
    setAddedToBag(true);
    onAddToBag?.({ ...product, selectedSize });
    setTimeout(() => setAddedToBag(false), 2000);
  }, [selectedSize, product, onAddToBag]);

  const handleNotifySubmit = useCallback((e) => {
    e.preventDefault();
    onNotifyMe?.({ productId: product.id, email: notifyEmail });
    setShowNotifyForm(false);
    setNotifyEmail('');
  }, [notifyEmail, product.id, onNotifyMe]);

  const handleKeyDown = useCallback((e) => {
    if (!lightboxOpen) return;
    if (e.key === 'Escape') setLightboxOpen(false);
    if (e.key === 'ArrowRight') setSelectedImage((prev) => (prev + 1) % images.length);
    if (e.key === 'ArrowLeft') setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  }, [lightboxOpen, images.length]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [lightboxOpen]);

  return (
    <div className="kl-product-detail">
      {/* Breadcrumb */}
      <nav className="kl-breadcrumb">
        <a href="/">Home</a>
        <span className="kl-breadcrumb-sep">/</span>
        <a href={`/brand/${brand.toLowerCase()}`}>{brand}</a>
        <span className="kl-breadcrumb-sep">/</span>
        <span className="kl-breadcrumb-current">{name}</span>
      </nav>

      <div className="kl-product-main">
        {/* Image Gallery */}
        <div className="kl-gallery">
          <div className="kl-gallery-thumbnails">
            {images.map((img, idx) => (
              <button
                key={idx}
                className={`kl-thumbnail ${selectedImage === idx ? 'active' : ''}`}
                onClick={() => setSelectedImage(idx)}
                aria-label={`View image ${idx + 1}`}
              >
                <img src={img} alt={`${name} view ${idx + 1}`} />
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
                backgroundImage: `url(${images[selectedImage]})`,
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              } : {}}
            >
              <img
                src={images[selectedImage]}
                alt={name}
                className={isZoomed ? 'hidden' : ''}
              />
            </div>
            <button className="kl-expand-btn" aria-label="View full size">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="15 3 21 3 21 9"></polyline>
                <polyline points="9 21 3 21 3 15"></polyline>
                <line x1="21" y1="3" x2="14" y2="10"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg>
            </button>
            <div className="kl-image-counter">
              {selectedImage + 1} / {images.length}
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="kl-product-info">
          <div className="kl-info-header">
            <p className="kl-brand">{brand}</p>
            <h1 className="kl-product-name">{name}</h1>
            <p className="kl-style-id">{styleId}</p>
          </div>

          <div className="kl-price-block">
            <div className="kl-price-row">
              <span className="kl-price-current">${price.toLocaleString()}</span>
              {retail && retail < price && (
                <span className="kl-price-retail">${retail.toLocaleString()}</span>
              )}
            </div>
            {retail && retail < price && (
              <p className="kl-price-note">
                +${(price - retail).toLocaleString()} above retail
              </p>
            )}
          </div>

          {/* Size Selector */}
          <div className="kl-size-section">
            <div className="kl-size-header">
              <span className="kl-size-label">Size</span>
              <button className="kl-size-guide">Size Guide</button>
            </div>

            {hasStock ? (
              <div className="kl-size-selector">
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="kl-size-dropdown"
                >
                  <option value="">Select Size (US)</option>
                  {sizes.map(({ size, available }) => (
                    <option key={size} value={size} disabled={!available}>
                      US {size} {!available ? '— Sold Out' : ''}
                    </option>
                  ))}
                </select>
                <svg className="kl-dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            ) : (
              <p className="kl-out-of-stock-msg">All sizes currently unavailable</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="kl-actions">
            {hasStock ? (
              <button
                className={`kl-add-to-bag ${!selectedSize ? 'disabled' : ''} ${addedToBag ? 'added' : ''}`}
                onClick={handleAddToBag}
                disabled={!selectedSize}
              >
                {addedToBag ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Added to Bag
                  </>
                ) : (
                  'Add to Bag'
                )}
              </button>
            ) : (
              <>
                {!showNotifyForm ? (
                  <button
                    className="kl-notify-btn"
                    onClick={() => setShowNotifyForm(true)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                    Notify Me When Available
                  </button>
                ) : (
                  <form className="kl-notify-form" onSubmit={handleNotifySubmit}>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.value)}
                      required
                      className="kl-notify-input"
                    />
                    <button type="submit" className="kl-notify-submit">
                      Notify Me
                    </button>
                  </form>
                )}
              </>
            )}

            <button className="kl-wishlist-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="kl-trust-badges">
            <div className="kl-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <polyline points="9 12 11 14 15 10"></polyline>
              </svg>
              <span>Authenticity Guaranteed</span>
            </div>
            <div className="kl-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
              <span>Free Shipping Over $300</span>
            </div>
            <div className="kl-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="23 4 23 10 17 10"></polyline>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
              </svg>
              <span>Easy Returns</span>
            </div>
          </div>

          {/* Specs */}
          <div className="kl-specs">
            <h3 className="kl-specs-title">Product Details</h3>
            <dl className="kl-specs-list">
              <div className="kl-spec-row">
                <dt>Brand</dt>
                <dd>{brand}</dd>
              </div>
              <div className="kl-spec-row">
                <dt>Model</dt>
                <dd>{model || name.split("'")[0].trim()}</dd>
              </div>
              <div className="kl-spec-row">
                <dt>Style ID</dt>
                <dd>{styleId}</dd>
              </div>
              <div className="kl-spec-row">
                <dt>Condition</dt>
                <dd>{condition}</dd>
              </div>
              <div className="kl-spec-row">
                <dt>Release Year</dt>
                <dd>{releaseYear}</dd>
              </div>
              <div className="kl-spec-row">
                <dt>Retail Price</dt>
                <dd>${retail?.toLocaleString()}</dd>
              </div>
            </dl>
          </div>

          {/* Description */}
          <div className="kl-description">
            <h3 className="kl-description-title">About This Sneaker</h3>
            <p className="kl-description-text">{description}</p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="kl-related">
          <div className="kl-related-header">
            <h2 className="kl-related-title">You May Also Like</h2>
            <a href="/shop" className="kl-related-link">
              View All
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
          <div className="kl-related-grid">
            {relatedProducts.slice(0, 4).map((item) => (
              <a
                key={item.id}
                href={`/product/${item.id}`}
                className="kl-related-card"
              >
                <div className="kl-related-image-wrap">
                  <img src={item.images?.[0] || item.image} alt={item.name} />
                  {!item.inStock && (
                    <span className="kl-related-badge">Sold Out</span>
                  )}
                </div>
                <div className="kl-related-info">
                  <p className="kl-related-brand">{item.brand}</p>
                  <h3 className="kl-related-name">{item.name}</h3>
                  <p className="kl-related-price">${item.price?.toLocaleString()}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="kl-lightbox" onClick={() => setLightboxOpen(false)}>
          <button
            className="kl-lightbox-close"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <button
            className="kl-lightbox-nav prev"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
            }}
            aria-label="Previous image"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <div className="kl-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={images[selectedImage]} alt={name} />
          </div>

          <button
            className="kl-lightbox-nav next"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage((prev) => (prev + 1) % images.length);
            }}
            aria-label="Next image"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          <div className="kl-lightbox-thumbnails">
            {images.map((img, idx) => (
              <button
                key={idx}
                className={`kl-lightbox-thumb ${selectedImage === idx ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(idx);
                }}
              >
                <img src={img} alt={`View ${idx + 1}`} />
              </button>
            ))}
          </div>

          <div className="kl-lightbox-counter">
            {selectedImage + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;

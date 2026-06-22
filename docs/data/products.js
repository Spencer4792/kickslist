/**
 * KicksList Product Database (Minimal)
 * Products are now loaded from the API. This file only contains
 * helper functions used by the frontend for vendor URL generation.
 */

// Empty products array — all data comes from the API now
const products = [];

// ============================================
// Vendor Price Generation (used by VendorComparisonTable)
// ============================================
function generateVendorPrices(product) {
  const { vendors, getRetailVendors, getResaleVendors, buildAffiliateUrl } = window.KicksListVendors;
  const vendorPrices = [];
  const retailPrice = product.retail;
  const id = product.id;

  // Check for real price data from vendor-prices.js seed
  const realPrices = window.KicksListVendorPrices?.prices?.[id];

  const retailVendors = getRetailVendors();
  const resaleVendors = getResaleVendors();

  // Retail vendors: show MSRP price + search URLs
  retailVendors.forEach((vendor) => {
    const searchTerm = encodeURIComponent(product.name);
    let directUrl;
    switch(vendor.id) {
      case 'nike': directUrl = `https://nike.com/w?q=${searchTerm}`; break;
      case 'footlocker': directUrl = `https://footlocker.com/search?query=${searchTerm}`; break;
      case 'finishline': directUrl = `https://finishline.com/store/browse/search.jsp?searchTerm=${searchTerm}`; break;
      case 'champssports': directUrl = `https://champssports.com/search?query=${searchTerm}`; break;
      case 'jdsports': directUrl = `https://jdsports.com/search/${searchTerm}`; break;
      case 'dickssporting': directUrl = `https://dickssportinggoods.com/search/SearchDisplay?searchTerm=${searchTerm}`; break;
      case 'adidas': directUrl = `https://www.adidas.com/search?q=${searchTerm}`; break;
      case 'puma': directUrl = `https://us.puma.com/us/en/search?query=${searchTerm}`; break;
      case 'newbalance': directUrl = `https://www.newbalance.com/search?q=${searchTerm}`; break;
      case 'reebok': directUrl = `https://www.reebok.com/pages/search-results?q=${searchTerm}`; break;
      default: directUrl = `${vendor.url}/search?q=${searchTerm}`;
    }
    const url = buildAffiliateUrl(vendor, directUrl);

    vendorPrices.push({ vendorId: vendor.id, price: retailPrice, url, inStock: true, type: 'retail', isRealPrice: false });
  });

  // Resale vendors: use real prices when available, search URL fallback otherwise
  resaleVendors.forEach((vendor) => {
    const searchTerm = encodeURIComponent(product.name);
    const vendorData = realPrices?.[vendor.id];

    let price, url, isRealPrice, isLowest;

    if (vendorData && vendorData.price != null) {
      // Real price data
      price = vendorData.price;
      url = buildAffiliateUrl(vendor, vendorData.url);
      isRealPrice = true;
      isLowest = realPrices.lowestVendor === vendor.id;
    } else {
      // No data — use search URL fallback
      price = null;
      isRealPrice = false;
      isLowest = false;
      let directUrl;
      switch(vendor.id) {
        case 'stockx': directUrl = `https://stockx.com/search?s=${searchTerm}`; break;
        case 'goat': directUrl = `https://goat.com/search?query=${searchTerm}`; break;
        case 'ebay': directUrl = `https://ebay.com/sch/i.html?_nkw=${searchTerm}`; break;
        case 'flightclub': directUrl = `https://flightclub.com/search?q=${searchTerm}`; break;
        default: directUrl = `${vendor.url}/search?q=${searchTerm}`;
      }
      url = buildAffiliateUrl(vendor, directUrl);
    }

    vendorPrices.push({ vendorId: vendor.id, price, url, inStock: price != null, type: 'resale', isRealPrice, isLowest });
  });

  return vendorPrices;
}

function getLowestPrice(product) {
  const vendors = generateVendorPrices(product);
  const realResale = vendors.filter(v => v.type === 'resale' && v.isRealPrice && v.price != null);
  if (realResale.length > 0) return Math.min(...realResale.map(v => v.price));
  const inStockVendors = vendors.filter(v => v.inStock && v.price != null);
  if (inStockVendors.length === 0) return null;
  return Math.min(...inStockVendors.map(v => v.price));
}

function getHighestPrice(product) {
  const vendors = generateVendorPrices(product);
  const realResale = vendors.filter(v => v.type === 'resale' && v.isRealPrice && v.price != null);
  if (realResale.length > 0) return Math.max(...realResale.map(v => v.price));
  const inStockVendors = vendors.filter(v => v.inStock && v.price != null);
  if (inStockVendors.length === 0) return null;
  return Math.max(...inStockVendors.map(v => v.price));
}

function getPriceRange(product) {
  return { low: getLowestPrice(product), high: getHighestPrice(product) };
}

function getVendorCount(product) {
  const vendors = generateVendorPrices(product);
  return vendors.filter(v => v.inStock).length;
}

function getBestDeal(product) {
  const vendors = generateVendorPrices(product);
  const realResale = vendors.filter(v => v.type === 'resale' && v.isRealPrice && v.price != null);
  if (realResale.length > 0) return realResale.reduce((min, v) => v.price < min.price ? v : min);
  const inStockVendors = vendors.filter(v => v.inStock && v.price != null);
  if (inStockVendors.length === 0) return null;
  return inStockVendors.reduce((min, v) => v.price < min.price ? v : min);
}

function getSavings(product) {
  const low = getLowestPrice(product);
  const high = getHighestPrice(product);
  if (!low || !high) return 0;
  return high - low;
}

// Empty categories — fetched from API
const categories = [];

// Stub functions — all data comes from API now
function getProductById(id) { return null; }
function getProductsByCategory(category) { return []; }
function searchProducts(query) { return []; }
function getFeaturedProducts() { return []; }
function getTrendingProducts() { return []; }
function getNewDrops(limit = 8) { return []; }
function getRelatedProducts(productId, limit = 4) { return []; }

window.KicksListData = {
  products, categories, getProductById, getProductsByCategory, searchProducts,
  getFeaturedProducts, getTrendingProducts, getNewDrops, getRelatedProducts,
  generateVendorPrices, getLowestPrice, getHighestPrice, getPriceRange,
  getVendorCount, getBestDeal, getSavings
};

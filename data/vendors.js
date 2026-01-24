/**
 * KicksList Vendor Data
 * Trusted marketplace and retail vendors for price comparison
 */

const vendors = [
  // === RETAIL VENDORS ===
  {
    id: 'nike',
    name: 'Nike',
    trustRating: 5.0,
    trustCount: 890000,
    color: '#111111',
    url: 'https://nike.com',
    type: 'retail',
    description: 'Official Nike Store'
  },
  {
    id: 'footlocker',
    name: 'Foot Locker',
    trustRating: 4.5,
    trustCount: 320000,
    color: '#d41a1f',
    url: 'https://footlocker.com',
    type: 'retail',
    description: 'Footwear Retail Chain'
  },
  {
    id: 'finishline',
    name: 'Finish Line',
    trustRating: 4.5,
    trustCount: 185000,
    color: '#0057b8',
    url: 'https://finishline.com',
    type: 'retail',
    description: 'Athletic Footwear Retailer'
  },
  {
    id: 'champssports',
    name: 'Champs Sports',
    trustRating: 4.3,
    trustCount: 145000,
    color: '#00529b',
    url: 'https://champssports.com',
    type: 'retail',
    description: 'Sports Footwear Retailer'
  },
  {
    id: 'jdsports',
    name: 'JD Sports',
    trustRating: 4.4,
    trustCount: 210000,
    color: '#000000',
    url: 'https://jdsports.com',
    type: 'retail',
    description: 'UK-Based Sports Retailer'
  },
  {
    id: 'dickssporting',
    name: "Dick's Sporting",
    trustRating: 4.3,
    trustCount: 275000,
    color: '#006341',
    url: 'https://dickssportinggoods.com',
    type: 'retail',
    description: 'Sporting Goods Retailer'
  },
  // === RESALE MARKETPLACES ===
  {
    id: 'stockx',
    name: 'StockX',
    trustRating: 4.5,
    trustCount: 125000,
    color: '#08a05c',
    url: 'https://stockx.com',
    type: 'resale',
    description: 'Stock Market for Sneakers'
  },
  {
    id: 'goat',
    name: 'GOAT',
    trustRating: 4.5,
    trustCount: 98000,
    color: '#7c3aed',
    url: 'https://goat.com',
    type: 'resale',
    description: 'Sneaker Marketplace'
  },
  {
    id: 'ebay',
    name: 'eBay',
    trustRating: 4.0,
    trustCount: 250000,
    color: '#e53238',
    url: 'https://ebay.com',
    type: 'resale',
    description: 'Online Marketplace'
  },
  {
    id: 'flightclub',
    name: 'Flight Club',
    trustRating: 5.0,
    trustCount: 45000,
    color: '#ff6b00',
    url: 'https://flightclub.com',
    type: 'resale',
    description: 'Premium Sneaker Consignment'
  }
];

// Helper function to get vendor by ID
function getVendorById(vendorId) {
  return vendors.find(v => v.id === vendorId);
}

// Get all retail vendors
function getRetailVendors() {
  return vendors.filter(v => v.type === 'retail');
}

// Get all resale vendors
function getResaleVendors() {
  return vendors.filter(v => v.type === 'resale');
}

// Export for global access
window.KicksListVendors = {
  vendors,
  getVendorById,
  getRetailVendors,
  getResaleVendors
};

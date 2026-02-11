/**
 * KicksList Vendor Data
 * Trusted marketplace and retail vendors
 *
 * Affiliate Integration:
 * 1. Update AFFILIATE_CONFIG with your publisher/partner IDs from each network
 * 2. Update each vendor's affiliate.programId with the advertiser/merchant ID
 * 3. Set affiliate.enabled = true once approved
 */

// Publisher/partner IDs per affiliate network — replace 'PENDING' with real IDs once approved
const AFFILIATE_CONFIG = {
  cj: { publisherId: 'PENDING' },
  impact: { partnerId: 'PENDING' },
  rakuten: { publisherId: 'PENDING' }
};

/**
 * Build an affiliate tracking URL for a vendor.
 * Returns the direct URL unchanged if affiliate is not enabled.
 */
function buildAffiliateUrl(vendor, destinationUrl) {
  if (!vendor.affiliate || !vendor.affiliate.enabled) {
    return destinationUrl;
  }

  const { network, programId } = vendor.affiliate;
  const encoded = encodeURIComponent(destinationUrl);

  switch (network) {
    case 'cj':
      return `https://www.anrdoezrs.net/links/${AFFILIATE_CONFIG.cj.publisherId}/type/dlg/sid/${vendor.id}/${destinationUrl}`;
    case 'impact':
      return `https://goto.target.com/c/${AFFILIATE_CONFIG.impact.partnerId}/${programId}/0?u=${encoded}`;
    case 'rakuten':
      return `https://click.linksynergy.com/deeplink?id=${AFFILIATE_CONFIG.rakuten.publisherId}&mid=${programId}&murl=${encoded}`;
    default:
      return destinationUrl;
  }
}

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
    description: 'Official Nike Store',
    affiliate: { network: 'cj', programId: 'PENDING', enabled: false }
  },
  {
    id: 'footlocker',
    name: 'Foot Locker',
    trustRating: 4.5,
    trustCount: 320000,
    color: '#d41a1f',
    url: 'https://footlocker.com',
    type: 'retail',
    description: 'Footwear Retail Chain',
    affiliate: { network: 'impact', programId: 'PENDING', enabled: false }
  },
  {
    id: 'finishline',
    name: 'Finish Line',
    trustRating: 4.5,
    trustCount: 185000,
    color: '#0057b8',
    url: 'https://finishline.com',
    type: 'retail',
    description: 'Athletic Footwear Retailer',
    affiliate: { network: 'impact', programId: 'PENDING', enabled: false }
  },
  {
    id: 'champssports',
    name: 'Champs Sports',
    trustRating: 4.3,
    trustCount: 145000,
    color: '#00529b',
    url: 'https://champssports.com',
    type: 'retail',
    description: 'Sports Footwear Retailer',
    affiliate: { network: 'impact', programId: 'PENDING', enabled: false }
  },
  {
    id: 'jdsports',
    name: 'JD Sports',
    trustRating: 4.4,
    trustCount: 210000,
    color: '#000000',
    url: 'https://jdsports.com',
    type: 'retail',
    description: 'UK-Based Sports Retailer',
    affiliate: { network: 'rakuten', programId: 'PENDING', enabled: false }
  },
  {
    id: 'dickssporting',
    name: "Dick's Sporting",
    trustRating: 4.3,
    trustCount: 275000,
    color: '#006341',
    url: 'https://dickssportinggoods.com',
    type: 'retail',
    description: 'Sporting Goods Retailer',
    affiliate: { network: 'cj', programId: 'PENDING', enabled: false }
  },
  {
    id: 'adidas',
    name: 'Adidas',
    trustRating: 4.8,
    trustCount: 750000,
    color: '#000000',
    url: 'https://adidas.com',
    type: 'retail',
    description: 'Official Adidas Store',
    affiliate: { network: 'cj', programId: 'PENDING', enabled: false }
  },
  {
    id: 'puma',
    name: 'Puma',
    trustRating: 4.3,
    trustCount: 280000,
    color: '#ba2026',
    url: 'https://puma.com',
    type: 'retail',
    description: 'Official Puma Store',
    affiliate: { network: 'cj', programId: 'PENDING', enabled: false }
  },
  {
    id: 'newbalance',
    name: 'New Balance',
    trustRating: 4.5,
    trustCount: 350000,
    color: '#e21836',
    url: 'https://newbalance.com',
    type: 'retail',
    description: 'Official New Balance Store',
    affiliate: { network: 'rakuten', programId: 'PENDING', enabled: false }
  },
  {
    id: 'reebok',
    name: 'Reebok',
    trustRating: 4.2,
    trustCount: 165000,
    color: '#2b2c2b',
    url: 'https://reebok.com',
    type: 'retail',
    description: 'Official Reebok Store',
    affiliate: { network: 'rakuten', programId: 'PENDING', enabled: false }
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
    description: 'Stock Market for Sneakers',
    affiliate: { network: 'impact', programId: 'PENDING', enabled: false }
  },
  {
    id: 'goat',
    name: 'GOAT',
    trustRating: 4.5,
    trustCount: 98000,
    color: '#7c3aed',
    url: 'https://goat.com',
    type: 'resale',
    description: 'Sneaker Marketplace',
    affiliate: { network: 'impact', programId: 'PENDING', enabled: false }
  },
  {
    id: 'ebay',
    name: 'eBay',
    trustRating: 4.0,
    trustCount: 250000,
    color: '#e53238',
    url: 'https://ebay.com',
    type: 'resale',
    description: 'Online Marketplace',
    affiliate: null
  },
  {
    id: 'flightclub',
    name: 'Flight Club',
    trustRating: 5.0,
    trustCount: 45000,
    color: '#ff6b00',
    url: 'https://flightclub.com',
    type: 'resale',
    description: 'Premium Sneaker Consignment',
    affiliate: null
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
  getResaleVendors,
  buildAffiliateUrl
};

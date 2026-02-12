#!/usr/bin/env node
/**
 * KicksList Multi-Brand Sitemap Scraper
 * Fetches public product sitemaps from multiple brands, extracts product data,
 * deduplicates against existing database, and imports new products into products.js
 *
 * Usage:
 *   node tools/scrape-brands.js [options]
 *
 * Options:
 *   --preview          Show what would be scraped without fetching pages
 *   --limit <num>      Max products to scrape per brand (default: all)
 *   --delay <ms>       Delay between page fetches in ms (default: 500)
 *   --dry-run          Fetch and process but don't write to file
 *   --concurrency <n>  Parallel requests per brand (default: 5)
 *   --brands <list>    Comma-separated brand names to scrape (default: all)
 *   --inspect          Inspect one page from each selected brand (diagnostic mode)
 *   --verbose          Show detailed error messages
 *
 * Supported brands: reebok, on, salomon, crocs, saucony, birkenstock, puma, drmartens, merrell
 * Retailers: stadiumgoods, footlocker, journeys
 * (ASICS blocked - returns 403 on sitemap)
 *
 * Extraction methods by brand:
 *   Reebok        — Shopify .json endpoint
 *   On Running    — JSON-LD structured data
 *   Salomon       — JSON-LD structured data
 *   Crocs         — JSON-LD structured data
 *   Saucony       — OG meta tags + dollar price parsing
 *   Birkenstock   — JSON-LD structured data
 *   Puma          — JSON-LD structured data
 *   Dr. Martens   — JSON-LD (ProductGroup schema, Googlebot UA required)
 *   Merrell       — Schema.org microdata (itemprop)
 *   Stadium Goods — Shopify bulk JSON API (multi-brand retailer)
 *   Foot Locker   — JSON-LD (multi-brand retailer)
 *   Journeys      — JSON-LD (multi-brand retailer)
 *
 * Examples:
 *   node tools/scrape-brands.js --preview
 *   node tools/scrape-brands.js --brands reebok,crocs --limit 20 --dry-run
 *   node tools/scrape-brands.js --brands puma --limit 50
 *   node tools/scrape-brands.js --inspect --brands saucony
 *   node tools/scrape-brands.js --brands stadiumgoods,footlocker,journeys
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
function getOpt(name, def) {
  const i = args.indexOf(name);
  return i !== -1 && args[i + 1] ? args[i + 1] : def;
}
const previewMode = args.includes('--preview');
const dryRun = args.includes('--dry-run');
const inspectMode = args.includes('--inspect');
const maxLimit = parseInt(getOpt('--limit', '0')) || 0;
const delay = parseInt(getOpt('--delay', '500'));
const concurrency = parseInt(getOpt('--concurrency', '5'));
const brandsFilter = getOpt('--brands', '').toLowerCase().split(',').filter(Boolean);

// ---------------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------------
function fetchUrl(url, maxRedirects = 5, userAgent = null) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) return reject(new Error('Too many redirects'));
    const mod = url.startsWith('https') ? https : http;
    const ua = userAgent || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    const req = mod.get(url, {
      headers: {
        'User-Agent': ua,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let location = res.headers.location;
        if (location.startsWith('/')) {
          const parsed = new URL(url);
          location = `${parsed.protocol}//${parsed.host}${location}`;
        }
        return fetchUrl(location, maxRedirects - 1, userAgent).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.setTimeout(20000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ---------------------------------------------------------------------------
// Shoe keyword filter for URL slugs
// ---------------------------------------------------------------------------
const SHOE_KEYWORDS = [
  'shoe', 'shoes', 'sneaker', 'sneakers', 'boot', 'boots', 'clog', 'clogs',
  'slide', 'slides', 'sandal', 'sandals', 'slipper', 'slippers', 'mule',
  'mules', 'moc', 'moccasin', 'trainer', 'trainers', 'runner', 'running',
  'footwear', 'loafer', 'loafers', 'flat', 'flats', 'oxford', 'derby',
  // Brand-specific model keywords
  'gel-', 'gt-2160', 'kayano', 'nimbus', 'noosa', 'kinsei', 'cumulus',
  'cloud', 'cloudmonster', 'cloudnova', 'cloudswift', 'cloudflow', 'cloudrunner',
  'cloudstratus', 'cloudventure', 'cloudace', 'cloudtilt', 'cloudgo', 'cloudsurfer',
  'xt-6', 'xt-4', 'xt-wings', 'acs', 'speedcross', 'x-ultra', 'alphacross',
  'classic-clog', 'echo-clog', 'mega-crush', 'bayaband', 'literide', 'bistro',
  'jazz', 'shadow', 'triumph', 'ride', 'guide', 'endorphin', 'kinvara',
  'peregrine', 'hurricane', 'freedom', 'cohesion', 'tempus',
  'boston', 'arizona', 'madrid', 'gizeh', 'mayari', 'milano', 'zurich',
  'tokio', 'montana', 'bend', 'zermatt',
  'suede', 'speedcat', 'palermo', 'roma', 'future-rider', 'rs-x', 'rs-z',
  'rider', 'clyde', 'slipstream', 'ca-pro', 'mayze', 'carina', 'smash',
  'club-c', 'classic-leather', 'question', 'answer', 'nano', 'floatride',
  'zig', 'instapump', 'kamikaze', 'shaqnosis', 'pump',
];

function isShoeUrl(url) {
  const slug = url.toLowerCase();
  // Exclude obvious non-shoe pages
  if (slug.includes('/blog/') || slug.includes('/article/') || slug.includes('/help/')
    || slug.includes('/account/') || slug.includes('/cart') || slug.includes('/checkout')
    || slug.includes('/gift-card') || slug.includes('/gift_card')
    || slug.includes('/accessories/') || slug.includes('/apparel/')
    || slug.includes('/clothing/') || slug.includes('/bags/')
    || slug.includes('/socks') || slug.includes('/hat') || slug.includes('/cap')
    || slug.includes('/backpack') || slug.includes('/jacket')
    || slug.includes('/hoodie') || slug.includes('/shirt')
    || slug.includes('/short') || slug.includes('/pant')
    || slug.includes('/tight') || slug.includes('/bra')
    || slug.includes('/headband') || slug.includes('/glove')
    || slug.includes('/watch') || slug.includes('/sunglasses')
    || slug.includes('/jibbitz') || slug.includes('/charm')
    || slug.includes('/lace') || slug.includes('/insole')
    || slug.includes('/care-kit') || slug.includes('/cleaner')
  ) {
    return false;
  }
  return SHOE_KEYWORDS.some(kw => slug.includes(kw));
}

// ---------------------------------------------------------------------------
// XML parsing helpers (no dependencies)
// ---------------------------------------------------------------------------
function extractLocs(xml) {
  const urls = [];
  const regex = /<loc>\s*(https?:\/\/[^<\s]+)\s*<\/loc>/gi;
  let m;
  while ((m = regex.exec(xml)) !== null) {
    urls.push(m[1].trim());
  }
  return urls;
}

// ---------------------------------------------------------------------------
// Data extraction methods
// ---------------------------------------------------------------------------

/**
 * Extract from Shopify .json endpoint (Reebok)
 */
function extractShopifyJson(jsonStr, url, brandName, category, options = {}) {
  let data;
  try { data = JSON.parse(jsonStr); } catch { return null; }

  const product = data.product;
  if (!product) return null;

  const name = product.title || '';
  if (!name) return null;

  // Check product type for footwear relevance
  const productType = (product.product_type || '').toLowerCase();

  if (options.retailer) {
    // For retailers, use product_type to filter footwear
    if (productType !== 'shoes' && productType !== 'footwear') return null;
    // Detect brand from vendor
    const vendor = product.vendor || '';
    const detected = detectRetailerBrand(vendor);
    brandName = detected.brand;
    category = detected.category;
  } else {
    const tagsRaw = product.tags || '';
    const tags = (Array.isArray(tagsRaw) ? tagsRaw.join(' ') : String(tagsRaw)).toLowerCase();
    const allText = `${name} ${productType} ${tags}`.toLowerCase();
    // For Reebok, check if it's footwear
    const shoeIndicators = ['shoe', 'sneaker', 'boot', 'clog', 'slide', 'sandal',
      'slipper', 'trainer', 'footwear', 'classic leather', 'club c', 'question',
      'nano', 'floatride', 'zig', 'instapump', 'pump', 'kamikaze', 'answer'];
    const isFootwear = shoeIndicators.some(kw => allText.includes(kw));
    if (!isFootwear) return null;
  }

  // Price from first variant
  let price = 0;
  let retail = 0;
  if (product.variants && product.variants.length > 0) {
    const v = product.variants[0];
    price = parseFloat(v.price) || 0;
    retail = parseFloat(v.compare_at_price) || price;
  }
  if (price === 0) return null;

  // Image
  let imageUrl = '';
  if (product.images && product.images.length > 0) {
    imageUrl = product.images[0].src || '';
  }
  if (product.image && product.image.src && !imageUrl) {
    imageUrl = product.image.src;
  }
  if (!imageUrl) return null;

  // Description
  let description = (product.body_html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 300);

  const releaseDate = product.published_at
    ? product.published_at.split('T')[0]
    : new Date().toISOString().split('T')[0];

  return {
    name: cleanName(name),
    brand: brandName,
    category,
    price,
    retail: retail || price,
    releaseDate,
    description: cleanDescription(description) || `${brandName} ${cleanName(name)}`,
    imageUrl,
    sourceUrl: url,
  };
}

/**
 * Extract from JSON-LD (<script type="application/ld+json">)
 */
function extractJsonLd(html, url, brandName, category, options = {}) {
  const scripts = [];
  const regex = /<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = regex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(m[1]);
      scripts.push(parsed);
    } catch { /* skip invalid JSON-LD */ }
  }

  if (scripts.length === 0) return null;

  // Find Product schema
  let product = null;
  for (const script of scripts) {
    if (Array.isArray(script)) {
      for (const item of script) {
        if (item['@type'] === 'Product' || item['@type'] === 'IndividualProduct') {
          product = item;
          break;
        }
        // Handle ProductGroup (e.g. Dr. Martens) — use first variant
        if (item['@type'] === 'ProductGroup' && item.hasVariant && item.hasVariant.length > 0) {
          product = item.hasVariant[0];
          if (!product.name && item.name) product.name = item.name;
          break;
        }
      }
    } else if (script['@type'] === 'Product' || script['@type'] === 'IndividualProduct') {
      product = script;
    } else if (script['@type'] === 'ProductGroup' && script.hasVariant && script.hasVariant.length > 0) {
      product = script.hasVariant[0];
      if (!product.name && script.name) product.name = script.name;
    } else if (script['@graph'] && Array.isArray(script['@graph'])) {
      for (const item of script['@graph']) {
        if (item['@type'] === 'Product' || item['@type'] === 'IndividualProduct') {
          product = item;
          break;
        }
        if (item['@type'] === 'ProductGroup' && item.hasVariant && item.hasVariant.length > 0) {
          product = item.hasVariant[0];
          if (!product.name && item.name) product.name = item.name;
          break;
        }
      }
    }
    if (product) break;
  }

  if (!product) return null;

  // Retailer brand detection from JSON-LD brand field
  if (options.retailer) {
    let rawBrand = '';
    if (product.brand) {
      rawBrand = typeof product.brand === 'string' ? product.brand : (product.brand.name || '');
    }
    if (rawBrand) {
      const detected = detectRetailerBrand(rawBrand);
      brandName = detected.brand;
      category = detected.category;
    }
  }

  const name = product.name || '';
  if (!name) return null;

  // Price
  let price = 0;
  let retail = 0;
  const offers = product.offers;
  if (offers) {
    if (Array.isArray(offers)) {
      // Take first offer
      const offer = offers[0];
      price = parseFloat(offer.price) || 0;
      retail = price;
    } else if (offers['@type'] === 'AggregateOffer') {
      price = parseFloat(offers.lowPrice) || parseFloat(offers.highPrice) || 0;
      retail = parseFloat(offers.highPrice) || price;
    } else {
      price = parseFloat(offers.price) || 0;
      retail = price;
    }
  }
  if (price === 0) return null;

  // Image
  let imageUrl = '';
  if (product.image) {
    if (typeof product.image === 'string') {
      imageUrl = product.image;
    } else if (Array.isArray(product.image)) {
      imageUrl = typeof product.image[0] === 'string' ? product.image[0] : (product.image[0]?.url || product.image[0]?.contentUrl || '');
    } else if (product.image.url) {
      imageUrl = product.image.url;
    } else if (product.image.contentUrl) {
      imageUrl = product.image.contentUrl;
    }
  }
  if (!imageUrl) {
    // Try og:image fallback
    imageUrl = extractOgTag(html, 'og:image') || '';
  }
  if (!imageUrl) return null;

  // Ensure image URL is absolute
  if (imageUrl.startsWith('//')) {
    imageUrl = 'https:' + imageUrl;
  } else if (imageUrl.startsWith('/')) {
    const parsed = new URL(url);
    imageUrl = `${parsed.protocol}//${parsed.host}${imageUrl}`;
  }

  // Description
  let description = product.description || '';
  description = description
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 300);

  // Release date — not usually in JSON-LD, use today
  const releaseDate = new Date().toISOString().split('T')[0];

  return {
    name: cleanName(name),
    brand: brandName,
    category,
    price,
    retail: retail || price,
    releaseDate,
    description: cleanDescription(description) || `${brandName} ${cleanName(name)}`,
    imageUrl,
    sourceUrl: url,
  };
}

/**
 * Extract from Open Graph meta tags (fallback)
 */
function extractOgTags(html, url, brandName, category) {
  const name = extractOgTag(html, 'og:title') || extractMetaTag(html, 'title');
  if (!name) return null;

  const imageUrl = extractOgTag(html, 'og:image') || '';
  if (!imageUrl) return null;

  // Try to get price from meta tags or page content
  let price = 0;
  const priceTag = extractMetaTag(html, 'product:price:amount')
    || extractOgTag(html, 'product:price:amount');
  if (priceTag) {
    price = parseFloat(priceTag) || 0;
  }
  // Try common price patterns in HTML
  if (price === 0) {
    const priceMatch = html.match(/["']price["']\s*:\s*["']?(\d+\.?\d*)["']?/);
    if (priceMatch) price = parseFloat(priceMatch[1]) || 0;
  }
  // Try data attribute price
  if (price === 0) {
    const dataPrice = html.match(/data-price=["'](\d+\.?\d*)["']/i);
    if (dataPrice) price = parseFloat(dataPrice[1]) || 0;
  }
  // Try dollar amount in product-specific HTML areas
  if (price === 0) {
    // Look for span/div with price classes containing dollar amounts
    const priceClassMatch = html.match(/class=["'][^"']*(?:price|product-price|pdp-price)[^"']*["'][^>]*>\s*\$(\d+\.?\d*)/i);
    if (priceClassMatch) price = parseFloat(priceClassMatch[1]) || 0;
  }
  // Final fallback: first dollar amount on the page (risky but useful for Demandware sites)
  if (price === 0) {
    const dollarMatch = html.match(/\$(\d{2,3}(?:\.\d{2})?)/);
    if (dollarMatch) price = parseFloat(dollarMatch[1]) || 0;
  }
  if (price === 0) return null;

  let description = extractOgTag(html, 'og:description') || extractMetaTag(html, 'description') || '';
  description = description.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 300);

  return {
    name: cleanName(name),
    brand: brandName,
    category,
    price,
    retail: price,
    releaseDate: new Date().toISOString().split('T')[0],
    description: cleanDescription(description) || `${brandName} ${cleanName(name)}`,
    imageUrl: imageUrl.startsWith('//') ? 'https:' + imageUrl : imageUrl,
    sourceUrl: url,
  };
}

/**
 * Extract from Schema.org microdata (itemprop attributes) — used by Merrell/Demandware sites
 */
function extractMicrodata(html, url, brandName, category) {
  // Extract itemprop values — prefer content attribute (more reliable)
  function getItemprop(prop) {
    const m1 = html.match(new RegExp(`itemprop=["']${prop}["'][^>]*content=["']([^"']+)["']`, 'i'));
    if (m1) return m1[1];
    const m2 = html.match(new RegExp(`content=["']([^"']+)["'][^>]*itemprop=["']${prop}["']`, 'i'));
    if (m2) return m2[1];
    return '';
  }

  // For name, prefer og:title or the last breadcrumb itemprop name (which is the product)
  // or look for the product-specific h1/title
  let name = extractOgTag(html, 'og:title') || '';
  if (!name) {
    // Find itemprop name with class="last" (breadcrumb product name)
    const lastNameMatch = html.match(/itemprop=["']name["'][^>]*class=["'][^"']*last[^"']*["'][^>]*>([^<]+)</i);
    if (lastNameMatch) name = lastNameMatch[1].trim();
  }
  if (!name) {
    // Try h1 product name
    const h1Match = html.match(/<h1[^>]*class=["'][^"']*product-name[^"']*["'][^>]*>([^<]+)</i);
    if (h1Match) name = h1Match[1].trim();
  }
  if (!name) return null;

  const price = parseFloat(getItemprop('price')) || 0;
  if (price === 0) return null;

  let imageUrl = extractOgTag(html, 'og:image') || '';
  if (!imageUrl) return null;
  if (imageUrl.startsWith('//')) imageUrl = 'https:' + imageUrl;

  let description = getItemprop('description') || extractOgTag(html, 'og:description') || '';
  description = description
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 300);

  return {
    name: cleanName(name),
    brand: brandName,
    category,
    price,
    retail: price,
    releaseDate: new Date().toISOString().split('T')[0],
    description: cleanDescription(description) || `${brandName} ${cleanName(name)}`,
    imageUrl,
    sourceUrl: url,
  };
}

/**
 * Extract from Journeys maProductJson (embedded JS object)
 */
function extractJourneys(html, url) {
  const maIdx = html.indexOf('maProductJson');
  if (maIdx === -1) return null;

  const jsonStart = html.indexOf('{', maIdx);
  if (jsonStart === -1) return null;

  let depth = 0, jsonEnd = jsonStart;
  for (let i = jsonStart; i < html.length; i++) {
    if (html[i] === '{') depth++;
    if (html[i] === '}') depth--;
    if (depth === 0) { jsonEnd = i + 1; break; }
  }

  let data;
  try { data = JSON.parse(html.substring(jsonStart, jsonEnd)); } catch { return null; }

  const name = (data.Name || '')
    .replace(/&reg;/gi, '').replace(/&trade;/gi, '').replace(/&amp;/g, '&').trim();
  if (!name) return null;

  const price = parseFloat(data.Price) || 0;
  if (price === 0) return null;
  const retail = parseFloat(data.ListPrice) || price;

  // Brand from VendorBrand
  const rawBrand = data.VendorBrand || '';
  const detected = detectRetailerBrand(rawBrand);

  // Image from twitter:image or maProductJson fields
  let imageUrl = '';
  const twitterImg = html.match(/name=["']twitter:image["'][^>]*content=["']([^"']+)/i)
    || html.match(/content=["']([^"']+)["'][^>]*name=["']twitter:image/i);
  if (twitterImg) imageUrl = twitterImg[1];
  if (!imageUrl && data.LargeImageRaw) imageUrl = data.LargeImageRaw;
  if (!imageUrl) return null;
  if (!imageUrl.startsWith('http')) imageUrl = 'https://' + imageUrl;

  let description = (data.ShortDescription || data.LongDescription || '')
    .replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ').trim().substring(0, 300);

  return {
    name: cleanName(name),
    brand: detected.brand,
    category: detected.category,
    price,
    retail,
    releaseDate: new Date().toISOString().split('T')[0],
    description: cleanDescription(description) || `${detected.brand} ${cleanName(name)}`,
    imageUrl,
    sourceUrl: url,
  };
}

/**
 * Extract from __NEXT_DATA__ script tag
 */
function extractNextData(html, url, brandName, category) {
  const match = html.match(/<script\s+id="__NEXT_DATA__"\s+type="application\/json">([\s\S]*?)<\/script>/);
  if (!match) return null;

  let data;
  try { data = JSON.parse(match[1]); } catch { return null; }

  // Walk the data tree looking for product info
  const props = data?.props?.pageProps;
  if (!props) return null;

  // Try common patterns for product data in __NEXT_DATA__
  const product = props.product || props.productData || props.selectedProduct
    || props.initialProduct || props.pdpData?.product;
  if (!product) return null;

  const name = product.name || product.title || product.productName || '';
  if (!name) return null;

  let price = 0;
  if (product.price) {
    price = typeof product.price === 'object'
      ? parseFloat(product.price.current || product.price.amount || product.price.value || 0)
      : parseFloat(product.price);
  } else if (product.prices) {
    price = parseFloat(product.prices.currentPrice || product.prices.salePrice || product.prices.listPrice || 0);
  } else if (product.retailPrice) {
    price = parseFloat(product.retailPrice);
  }
  if (price === 0) return null;

  let imageUrl = '';
  if (product.images && product.images.length > 0) {
    const img = product.images[0];
    imageUrl = typeof img === 'string' ? img : (img.url || img.src || img.href || '');
  } else if (product.image) {
    imageUrl = typeof product.image === 'string' ? product.image : (product.image.url || product.image.src || '');
  } else if (product.thumbnail) {
    imageUrl = product.thumbnail;
  }
  if (!imageUrl) return null;

  if (imageUrl.startsWith('//')) imageUrl = 'https:' + imageUrl;

  let description = product.description || product.longDescription || product.shortDescription || '';
  description = description.replace(/<[^>]+>/g, ' ').replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 300);

  return {
    name: cleanName(name),
    brand: brandName,
    category,
    price,
    retail: parseFloat(product.retailPrice || product.prices?.listPrice || product.prices?.initialPrice || price),
    releaseDate: new Date().toISOString().split('T')[0],
    description: cleanDescription(description) || `${brandName} ${cleanName(name)}`,
    imageUrl,
    sourceUrl: url,
  };
}

// ---------------------------------------------------------------------------
// HTML parsing helpers
// ---------------------------------------------------------------------------
function extractOgTag(html, property) {
  // Match both property= and name= variations
  const regex = new RegExp(`<meta[^>]*(?:property|name)=["']${property.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*content=["']([^"']+)["']`, 'i');
  const match = html.match(regex);
  if (match) return match[1];
  // Try reversed attribute order
  const regex2 = new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*(?:property|name)=["']${property.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'i');
  const match2 = html.match(regex2);
  return match2 ? match2[1] : '';
}

function extractMetaTag(html, name) {
  const regex = new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']+)["']`, 'i');
  const match = html.match(regex);
  if (match) return match[1];
  const regex2 = new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*name=["']${name}["']`, 'i');
  const match2 = html.match(regex2);
  return match2 ? match2[1] : '';
}

function cleanName(name) {
  return name
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, "'")
    .replace(/&trade;/gi, '')
    .replace(/&reg;/gi, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\u2122/g, '') // TM symbol
    .replace(/\u00AE/g, '') // registered symbol
    .replace(/\s*[-|]\s*(Reebok|ASICS|On Running|On|Salomon|Crocs|Saucony|Birkenstock|PUMA|Puma|Dr\.?\s*Martens|Merrell|Stadium Goods|Foot Locker|Journeys)\s*$/i, '')
    .replace(/^DR\.?\s*MARTENS\s+/i, '')
    .replace(/\s*[-|]\s*Official\s*(Site|Store|Website)\s*$/i, '')
    .replace(/"/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanDescription(desc) {
  return desc
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, "'")
    .replace(/&trade;/gi, '')
    .replace(/&reg;/gi, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\u2122/g, '')
    .replace(/\u00AE/g, '')
    .replace(/"/g, "'")
    .replace(/\\/g, '')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ---------------------------------------------------------------------------
// Brand detection for multi-brand retailers
// ---------------------------------------------------------------------------
function detectRetailerBrand(rawBrand) {
  if (!rawBrand) return { brand: 'Unknown', category: 'other' };
  const b = rawBrand.toLowerCase().trim();
  if (b.includes('yeezy')) return { brand: 'Yeezy', category: 'adidas' };
  if (b.includes('jordan')) return { brand: 'Jordan', category: 'jordan' };
  if (b === 'adidas originals' || b === 'adidas') return { brand: 'Adidas', category: 'adidas' };
  if (b.includes('nike')) return { brand: 'Nike', category: 'nike' };
  if (b.includes('new balance')) return { brand: 'New Balance', category: 'other' };
  if (b.includes('reebok')) return { brand: 'Reebok', category: 'reebok' };
  if (b.includes('ugg')) return { brand: 'UGG', category: 'other' };
  if (b.includes('puma')) return { brand: 'Puma', category: 'puma' };
  if (b.includes('converse')) return { brand: 'Converse', category: 'other' };
  if (b.includes('vans')) return { brand: 'Vans', category: 'other' };
  if (b.includes('crocs')) return { brand: 'Crocs', category: 'crocs' };
  if (b.includes('asics')) return { brand: 'ASICS', category: 'other' };
  if (b.includes('hoka')) return { brand: 'Hoka', category: 'other' };
  if (b.includes('on running') || b === 'on') return { brand: 'On', category: 'other' };
  if (b.includes('birkenstock')) return { brand: 'Birkenstock', category: 'other' };
  if (b.includes('timberland')) return { brand: 'Timberland', category: 'other' };
  if (b.includes('dr. martens') || b.includes('dr martens')) return { brand: 'Dr. Martens', category: 'other' };
  if (b.includes('salomon')) return { brand: 'Salomon', category: 'other' };
  if (b.includes('saucony')) return { brand: 'Saucony', category: 'other' };
  if (b.includes('under armour')) return { brand: 'Under Armour', category: 'other' };
  if (b.includes('fear of god')) return { brand: 'Fear of God', category: 'other' };
  return { brand: rawBrand, category: 'other' };
}

// ---------------------------------------------------------------------------
// Brand configurations
// ---------------------------------------------------------------------------
const BRANDS = {
  reebok: {
    name: 'Reebok',
    category: 'reebok',
    sitemapUrl: 'https://www.reebok.com/sitemap_products_1.xml?from=9670376128816&to=10073458180400',
    sitemapType: 'xml',
    extractionMethod: 'shopify-json',
    urlFilter: (url) => url.includes('/products/') && !url.includes('/collections/'),
    transformUrl: (url) => url.endsWith('.json') ? url : url + '.json',
    productUrlPattern: /https:\/\/www\.reebok\.com\/products\/[^<\s"]+/gi,
  },
  // NOTE: ASICS blocks sitemap access with 403 — disabled
  // asics: {
  //   name: 'ASICS',
  //   category: 'other',
  //   sitemapUrl: 'https://www.asics.com/managed-sitemaps/asics/href-sitemap-en-us.xml',
  //   sitemapType: 'xml',
  //   extractionMethod: 'json-ld',
  //   urlFilter: (url) => url.toLowerCase().includes('/shoes/') && url.includes('asics.com'),
  // },
  on: {
    name: 'On',
    category: 'other',
    sitemapUrl: 'https://www.on.com/en-us/products.xml',
    sitemapType: 'xml',
    extractionMethod: 'json-ld',
    urlFilter: (url) => {
      const u = url.toLowerCase();
      // On Running URLs have "shoes-" in the variant slug for actual footwear
      return u.includes('on.com/en-us/')
        && u.includes('-shoes-')
        && !u.includes('/c/');
    },
    productUrlPattern: /https:\/\/www\.on\.com\/en-us\/[^<\s"]+/gi,
  },
  salomon: {
    name: 'Salomon',
    category: 'other',
    sitemapUrl: 'https://www.salomon.com/api/sitemap/products?locale=en-us',
    sitemapType: 'xml',
    extractionMethod: 'json-ld',
    urlFilter: (url) => {
      const u = url.toLowerCase();
      return u.includes('salomon.com')
        && (u.includes('/shoes/') || u.includes('/footwear/') || u.includes('/trail-running-shoes/')
          || u.includes('/hiking-shoes/') || u.includes('/road-running-shoes/')
          || isShoeUrl(u))
        && !u.includes('/c/') // exclude category pages
        && !u.endsWith('/shoes/')
        && !u.endsWith('/footwear/');
    },
    productUrlPattern: /https:\/\/www\.salomon\.com\/[^<\s"]+/gi,
  },
  crocs: {
    name: 'Crocs',
    category: 'crocs',
    sitemapUrl: 'https://www.crocs.com/sitemap_0.xml',
    sitemapType: 'xml',
    extractionMethod: 'json-ld',
    urlFilter: (url) => {
      const u = url.toLowerCase();
      return u.includes('crocs.com')
        && (u.includes('/p/') || u.includes('/product/') || u.match(/\/\d{5,}/))
        && !u.includes('/blog/') && !u.includes('/help/');
    },
    productUrlPattern: /https:\/\/www\.crocs\.com\/[^<\s"]+/gi,
  },
  saucony: {
    name: 'Saucony',
    category: 'other',
    sitemapUrl: 'https://www.saucony.com/en/sitemap_0.xml',
    sitemapType: 'xml',
    extractionMethod: 'json-ld',
    urlFilter: (url) => {
      const u = url.toLowerCase();
      return u.includes('saucony.com')
        && !u.includes('/blog/') && !u.includes('/help/')
        && !u.includes('/sale/') && !u.includes('/collections/')
        && (u.match(/\/[\w-]+-[\w]+\.html/) || u.includes('/shoes/') || isShoeUrl(u));
    },
    productUrlPattern: /https:\/\/www\.saucony\.com\/[^<\s"]+/gi,
  },
  birkenstock: {
    name: 'Birkenstock',
    category: 'other',
    sitemapUrl: 'https://www.birkenstock.com/us/sitemap_1.xml',
    sitemapType: 'xml',
    extractionMethod: 'json-ld',
    urlFilter: (url) => {
      const u = url.toLowerCase();
      return u.includes('birkenstock.com/us/')
        && !u.includes('/blog/') && !u.includes('/help/')
        && !u.includes('/care/') && !u.includes('/accessories/')
        && (u.match(/\/[\w-]+,\d+\.html/) || u.includes('/shoes/') || isShoeUrl(u));
    },
    productUrlPattern: /https:\/\/www\.birkenstock\.com\/us\/[^<\s"]+/gi,
  },
  puma: {
    name: 'Puma',
    category: 'puma',
    sitemapUrl: 'https://us.puma.com/assets/sitemaps/us/sitemap_index.xml',
    sitemapType: 'index', // Sitemap index — must fetch child sitemaps
    extractionMethod: 'json-ld',
    urlFilter: (url) => {
      const u = url.toLowerCase();
      return u.includes('/us/en/pd/')
        && (u.includes('shoe') || u.includes('sneaker') || u.includes('clog')
          || u.includes('slide') || u.includes('sandal') || u.includes('slipper')
          || u.includes('speedcat') || u.includes('palermo') || u.includes('suede')
          || u.includes('slipstream') || u.includes('ca-pro') || u.includes('clyde')
          || u.includes('roma') || u.includes('rider') || u.includes('rs-x')
          || u.includes('mayze') || u.includes('carina') || u.includes('smash'));
    },
    // Fetch all child sitemaps (product pages are in various numbered sitemaps)
    childSitemapFilter: null, // null = fetch all
    productUrlPattern: /https:\/\/us\.puma\.com\/[^<\s"]+/gi,
  },
  drmartens: {
    name: 'Dr. Martens',
    category: 'other',
    sitemapUrl: 'https://www.drmartens.com/us/en/sitemap/Product.xml',
    sitemapType: 'xml',
    extractionMethod: 'json-ld',
    // Dr. Martens requires Googlebot UA for sitemap access
    userAgent: 'Googlebot/2.1 (+http://www.google.com/bot.html)',
    urlFilter: (url) => {
      const u = url.toLowerCase();
      return u.includes('drmartens.com/us/en/')
        && u.includes('/p/')
        && !u.includes('/bags/') && !u.includes('/accessories/')
        && !u.includes('/care-') && !u.includes('/laces')
        && !u.includes('/insole')
        && (u.includes('boot') || u.includes('shoe') || u.includes('sandal')
          || u.includes('oxford') || u.includes('loafer') || u.includes('mule')
          || u.includes('slide') || u.includes('platform') || u.includes('mary-jane')
          || u.includes('derby') || u.includes('1460') || u.includes('1461')
          || u.includes('2976') || u.includes('jadon') || u.includes('sinclair')
          || u.includes('audrick') || u.includes('adrian') || u.includes('jorge')
          || isShoeUrl(u));
    },
    productUrlPattern: /https:\/\/www\.drmartens\.com\/us\/en\/[^<\s"]+/gi,
  },
  merrell: {
    name: 'Merrell',
    category: 'other',
    sitemapUrl: 'https://www.merrell.com/US/en/sitemap_0.xml',
    sitemapType: 'xml',
    extractionMethod: 'microdata',
    urlFilter: (url) => {
      const u = url.toLowerCase();
      // Merrell product URLs end with a SKU like /16256W.html
      return u.includes('merrell.com/us/en/')
        && u.match(/\/\w+\.html$/)
        && !u.includes('/blog/') && !u.includes('/help/')
        && !u.includes('/sale/') && !u.includes('/c/')
        && !u.includes('/content/') && !u.includes('/account/')
        && !u.includes('/cart') && !u.includes('/wishlist')
        && !u.includes('gift-card') && !u.includes('gift_card')
        && !u.includes('/accessories') && !u.includes('/socks')
        && !u.includes('/insole') && !u.includes('/lace');
    },
    productUrlPattern: /https:\/\/www\.merrell\.com\/US\/en\/[^<\s"]+/gi,
  },
  // -----------------------------------------------------------------------
  // Multi-brand retailers
  // -----------------------------------------------------------------------
  stadiumgoods: {
    name: 'Stadium Goods',
    category: 'other',
    extractionMethod: 'shopify-bulk',
    retailer: true,
    shopifyBaseUrl: 'https://www.stadiumgoods.com',
    // Focus on brands the user wants more of
    targetBrands: ['Yeezy', 'Adidas', 'Reebok', 'UGG', 'Nike', 'Jordan', 'New Balance', 'ASICS', 'Puma', 'Converse', 'Vans', 'Hoka', 'Fear of God'],
  },
  footlocker: {
    name: 'Foot Locker',
    category: 'other',
    sitemapUrl: 'https://www.footlocker.com/products-sitemap.xml',
    sitemapType: 'xml',
    extractionMethod: 'json-ld',
    retailer: true,
    urlFilter: (url) => {
      const u = url.toLowerCase();
      return u.includes('/product/')
        && !u.includes('t-shirt') && !u.includes('shorts') && !u.includes('hoodie')
        && !u.includes('pants') && !u.includes('jacket') && !u.includes('backpack')
        && !u.includes('hat') && !u.includes('socks') && !u.includes('beanie')
        && !u.includes('jersey') && !u.includes('fleece') && !u.includes('crew')
        && !u.includes('jogger');
    },
  },
  journeys: {
    name: 'Journeys',
    category: 'other',
    sitemapUrl: 'https://www.journeys.com/sitemap.xml',
    sitemapType: 'xml',
    extractionMethod: 'journeys',
    retailer: true,
    urlFilter: (url) => {
      const u = url.toLowerCase();
      return u.includes('/product/')
        && !u.includes('socks') && !u.includes('backpack') && !u.includes('care-kit')
        && !u.includes('liners') && !u.includes('footie') && !u.includes('lace-pack');
    },
  },
};

// ---------------------------------------------------------------------------
// Load existing products for dedup
// ---------------------------------------------------------------------------
function loadExisting() {
  const productsPath = path.join(__dirname, '..', 'data', 'products.js');
  const content = fs.readFileSync(productsPath, 'utf8');

  const nameSet = new Set();
  const nameRegex = /name:\s*"([^"]+)"/g;
  let m;
  while ((m = nameRegex.exec(content)) !== null) {
    nameSet.add(m[1].toLowerCase().trim());
  }

  const idMatches = content.match(/id:\s*(\d+)/g);
  let maxId = 0;
  if (idMatches) {
    const ids = idMatches.map(x => parseInt(x.replace('id:', '').trim()));
    maxId = Math.max(...ids.filter(id => !isNaN(id) && id < 100000));
  }

  return { nameSet, maxId, content };
}

// ---------------------------------------------------------------------------
// Write products to products.js
// ---------------------------------------------------------------------------
function formatProduct(p) {
  const imgArray = `["${p.imageUrl}"]`;
  return `  {
    id: ${p.id},
    name: "${p.name.replace(/"/g, '\\"')}",
    brand: "${p.brand}",
    category: "${p.category}",
    price: ${p.price},
    retail: ${p.retail},
    releaseDate: "${p.releaseDate}",
    description: "${p.description.replace(/"/g, '\\"')}",
    images: ${imgArray},
    inStock: true, featured: false, trending: false
  }`;
}

function writeProducts(products, existingContent) {
  const productsPath = path.join(__dirname, '..', 'data', 'products.js');

  const productsStart = existingContent.indexOf('const products = [');
  if (productsStart === -1) throw new Error('Could not find products array');

  const after = existingContent.slice(productsStart);
  const endPatterns = [
    /\}\s*\n\];\s*\n\s*\n\/\//,
    /\}\s*\n\];\s*\nfunction /,
    /\}\s*\n\];\s*\nconst /,
    /\}\s*\n\];\s*\n\s*function /,
  ];

  let insertPoint = -1;
  for (const pattern of endPatterns) {
    const match = after.match(pattern);
    if (match) { insertPoint = productsStart + match.index + 1; break; }
  }

  if (insertPoint === -1) {
    const firstEnd = after.indexOf('];');
    const beforeEnd = after.slice(0, firstEnd);
    const lastBrace = beforeEnd.lastIndexOf('}');
    insertPoint = productsStart + lastBrace + 1;
  }

  const formatted = products.map(formatProduct).join(',\n');
  const newContent = existingContent.slice(0, insertPoint) + ',\n' + formatted + existingContent.slice(insertPoint);

  fs.writeFileSync(productsPath, newContent);

  const docsPath = path.join(__dirname, '..', 'docs', 'data', 'products.js');
  if (fs.existsSync(path.dirname(docsPath))) {
    fs.writeFileSync(docsPath, newContent);
  }

  return productsPath;
}

// ---------------------------------------------------------------------------
// Sitemap fetching
// ---------------------------------------------------------------------------
async function fetchSitemapUrls(brand) {
  console.log(`  Fetching sitemap: ${brand.sitemapUrl}`);

  const { status, body } = await fetchUrl(brand.sitemapUrl, 5, brand.userAgent || null);
  if (status !== 200) {
    console.log(`  ERROR: Sitemap returned HTTP ${status}`);
    return [];
  }

  let urls = [];

  if (brand.sitemapType === 'index') {
    // This is a sitemap index — extract child sitemap URLs first
    const childUrls = extractLocs(body);
    console.log(`  Sitemap index contains ${childUrls.length} child sitemaps`);

    // Filter to product sitemaps only
    const productSitemaps = brand.childSitemapFilter
      ? childUrls.filter(brand.childSitemapFilter)
      : childUrls;
    console.log(`  Product sitemaps to fetch: ${productSitemaps.length}`);

    // Fetch each child sitemap
    for (const childUrl of productSitemaps) {
      try {
        await sleep(300);
        const { status: childStatus, body: childBody } = await fetchUrl(childUrl);
        if (childStatus === 200) {
          const childProductUrls = extractLocs(childBody);
          urls.push(...childProductUrls);
          console.log(`    ${childUrl.split('/').pop()}: ${childProductUrls.length} URLs`);
        }
      } catch (e) {
        console.log(`    Error fetching child sitemap: ${e.message}`);
      }
    }
  } else {
    urls = extractLocs(body);
  }

  console.log(`  Total URLs in sitemap: ${urls.length}`);
  return urls;
}

// ---------------------------------------------------------------------------
// Extract product from a single page
// ---------------------------------------------------------------------------
async function extractFromPage(url, brand) {
  let fetchUrlToUse = url;

  // Shopify JSON endpoint
  if (brand.extractionMethod === 'shopify-json') {
    fetchUrlToUse = brand.transformUrl ? brand.transformUrl(url) : url;
  }

  const { status, body } = await fetchUrl(fetchUrlToUse, 5, brand.userAgent || null);
  if (status !== 200) return null;

  let product = null;
  const options = brand.retailer ? { retailer: true } : {};

  switch (brand.extractionMethod) {
    case 'shopify-json':
      product = extractShopifyJson(body, url, brand.name, brand.category, options);
      break;

    case 'json-ld':
      // Try JSON-LD first, then __NEXT_DATA__, then OG tags
      product = extractJsonLd(body, url, brand.name, brand.category, options);
      if (!product) product = extractNextData(body, url, brand.name, brand.category);
      if (!product) product = extractOgTags(body, url, brand.name, brand.category);
      break;

    case 'next-data':
      product = extractNextData(body, url, brand.name, brand.category);
      if (!product) product = extractJsonLd(body, url, brand.name, brand.category);
      if (!product) product = extractOgTags(body, url, brand.name, brand.category);
      break;

    case 'og-tags':
      product = extractOgTags(body, url, brand.name, brand.category);
      break;

    case 'microdata':
      product = extractMicrodata(body, url, brand.name, brand.category);
      if (!product) product = extractOgTags(body, url, brand.name, brand.category);
      // Filter out non-shoe items (gift cards, accessories)
      if (product && /gift\s*card|insole|lace\s*kit|sock|backpack/i.test(product.name)) product = null;
      break;

    case 'journeys':
      product = extractJourneys(body, url);
      break;

    default:
      // Try all methods in order
      product = extractJsonLd(body, url, brand.name, brand.category);
      if (!product) product = extractNextData(body, url, brand.name, brand.category);
      if (!product) product = extractOgTags(body, url, brand.name, brand.category);
      break;
  }

  // For retailers, filter out non-shoe products by name
  if (product && brand.retailer) {
    const n = product.name.toLowerCase();
    if (/\bsock\b|\bsocks\b|quarter pack|ankle pack|cushion crew|6-pack|3-pack|\bhat\b|\bcap\b|\bbeanie\b|headband|\bbackpack\b|belt bag|\bjersey\b|t-shirt|\bhoodie\b|\bjogger\b|\bfleece\b|\binsole\b|\bjibbitz\b|\bcharm\b|\bglove\b|\bjacket\b|\bshorts\b/i.test(n)) {
      product = null;
    }
  }

  return product;
}

// ---------------------------------------------------------------------------
// Shopify bulk JSON API scraper (for multi-brand retailers like Stadium Goods)
// ---------------------------------------------------------------------------
async function scrapeShopifyBulk(brand, existingNames, seenNames) {
  console.log(`\n--- ${brand.name} (Shopify Bulk API) ---`);

  const baseUrl = brand.shopifyBaseUrl;
  const scraped = [];
  let page = 1;
  let totalFetched = 0;
  let dupes = 0;
  let noData = 0;
  let errors = 0;

  if (previewMode) {
    console.log(`  Will fetch products from ${baseUrl}/products.json (paginated)`);
    console.log('  Run without --preview to scrape.');
    return { scraped: [], errors: 0, dupes: 0, noData: 0 };
  }

  while (true) {
    const url = `${baseUrl}/products.json?limit=250&page=${page}`;

    let data;
    try {
      const { status, body } = await fetchUrl(url);
      if (status !== 200) {
        console.log(`\n  Page ${page}: HTTP ${status}`);
        errors++;
        break;
      }
      data = JSON.parse(body);
    } catch (e) {
      console.log(`\n  Page ${page}: ${e.message}`);
      errors++;
      break;
    }

    if (!data.products || data.products.length === 0) break;
    totalFetched += data.products.length;

    for (const product of data.products) {
      // Filter for shoes via product_type
      const productType = (product.product_type || '').toLowerCase();
      if (productType !== 'shoes' && productType !== 'footwear') { noData++; continue; }

      // Detect brand from vendor
      const vendor = product.vendor || '';
      const detected = detectRetailerBrand(vendor);

      // Filter to target brands if specified
      if (brand.targetBrands && !brand.targetBrands.some(tb => tb.toLowerCase() === detected.brand.toLowerCase())) {
        continue;
      }

      const name = cleanName(product.title || '');
      if (!name) { noData++; continue; }

      // Dedup
      const normName = name.toLowerCase().trim();
      if (existingNames.has(normName) || seenNames.has(normName)) { dupes++; continue; }

      // Price from first variant
      let price = 0, retail = 0;
      if (product.variants && product.variants.length > 0) {
        price = parseFloat(product.variants[0].price) || 0;
        retail = parseFloat(product.variants[0].compare_at_price) || price;
      }
      if (price === 0) { noData++; continue; }

      // Image
      let imageUrl = '';
      if (product.images && product.images.length > 0) {
        imageUrl = product.images[0].src || '';
      }
      if (!imageUrl) { noData++; continue; }

      // Description
      let description = (product.body_html || '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&[a-z]+;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 300);

      const releaseDate = product.published_at
        ? product.published_at.split('T')[0]
        : new Date().toISOString().split('T')[0];

      seenNames.add(normName);
      scraped.push({
        name,
        brand: detected.brand,
        category: detected.category,
        price,
        retail: retail || price,
        releaseDate,
        description: cleanDescription(description) || `${detected.brand} ${name}`,
        imageUrl,
        sourceUrl: `${baseUrl}/products/${product.handle}`,
      });
    }

    process.stdout.write(`\r  [page ${page}] ${totalFetched} fetched, ${scraped.length} new, ${dupes} dupes, ${noData} filtered`);

    if (data.products.length < 250) break;
    page++;
    await sleep(delay);

    if (maxLimit > 0 && scraped.length >= maxLimit) break;
  }

  console.log('');
  return { scraped, errors, dupes, noData };
}

// ---------------------------------------------------------------------------
// Scrape a single brand
// ---------------------------------------------------------------------------
async function scrapeBrand(brandKey, brand, existingNames, seenNames) {
  // Dispatch to Shopify bulk API for retailer configs that use it
  if (brand.extractionMethod === 'shopify-bulk') {
    return scrapeShopifyBulk(brand, existingNames, seenNames);
  }
  console.log(`\n--- ${brand.name} ---`);

  // Step 1: Fetch sitemap URLs
  let allUrls;
  try {
    allUrls = await fetchSitemapUrls(brand);
  } catch (e) {
    console.log(`  ERROR fetching sitemap: ${e.message}`);
    return { scraped: [], errors: 0, dupes: 0, noData: 0 };
  }

  if (allUrls.length === 0) {
    console.log('  No URLs found in sitemap.');
    return { scraped: [], errors: 0, dupes: 0, noData: 0 };
  }

  // Step 2: Filter for shoes/footwear
  const shoeUrls = allUrls.filter(brand.urlFilter);
  console.log(`  Shoe URLs (filtered): ${shoeUrls.length}`);

  if (shoeUrls.length === 0) {
    // If shoe filter is too aggressive, try the general shoe keyword filter
    const fallbackUrls = allUrls.filter(isShoeUrl);
    if (fallbackUrls.length > 0) {
      console.log(`  Fallback shoe filter found ${fallbackUrls.length} URLs`);
      shoeUrls.push(...fallbackUrls);
    }
  }

  const toScrape = maxLimit > 0 ? shoeUrls.slice(0, maxLimit) : shoeUrls;
  console.log(`  Will scrape: ${toScrape.length} URLs`);

  if (previewMode) {
    console.log('  Preview mode — sample URLs:');
    toScrape.slice(0, 10).forEach((u, i) => console.log(`    ${i + 1}. ${u}`));
    if (toScrape.length > 10) console.log(`    ... and ${toScrape.length - 10} more`);
    return { scraped: [], errors: 0, dupes: 0, noData: 0 };
  }

  // Step 3: Scrape pages in batches
  const scraped = [];
  let errors = 0;
  let skippedDupe = 0;
  let skippedNoData = 0;

  for (let i = 0; i < toScrape.length; i += concurrency) {
    const batch = toScrape.slice(i, i + concurrency);

    const results = await Promise.allSettled(batch.map(async (url) => {
      try {
        const product = await extractFromPage(url, brand);
        return { url, product };
      } catch (e) {
        return { url, error: e.message };
      }
    }));

    for (const result of results) {
      if (result.status === 'rejected') {
        errors++;
        if (args.includes('--verbose')) console.log(`\n    REJECTED: ${result.reason}`);
        continue;
      }
      const { url, product, error } = result.value;
      if (error) {
        errors++;
        if (args.includes('--verbose')) console.log(`\n    ERROR [${url}]: ${error}`);
        continue;
      }

      if (!product) { skippedNoData++; continue; }

      // Dedup against existing and within this run
      const normName = product.name.toLowerCase().trim();
      if (existingNames.has(normName) || seenNames.has(normName)) {
        skippedDupe++;
        continue;
      }
      seenNames.add(normName);
      scraped.push(product);
    }

    const done = Math.min(i + concurrency, toScrape.length);
    process.stdout.write(`\r  [${done}/${toScrape.length}] ${brand.name}: ${scraped.length} new, ${skippedDupe} dupes, ${skippedNoData} no-data, ${errors} errors`);

    if (i + concurrency < toScrape.length) await sleep(delay);
  }

  console.log(''); // newline after progress
  return { scraped, errors, dupes: skippedDupe, noData: skippedNoData };
}

// ---------------------------------------------------------------------------
// Inspect mode: test one page from a brand to diagnose extraction
// ---------------------------------------------------------------------------
async function inspectBrand(brandKey) {
  const brand = BRANDS[brandKey];
  if (!brand) {
    console.log(`Unknown brand: ${brandKey}`);
    return;
  }
  console.log(`\nInspecting ${brand.name} (${brand.extractionMethod})...\n`);

  // Fetch sitemap to get one URL
  const allUrls = await fetchSitemapUrls(brand);
  const shoeUrls = allUrls.filter(brand.urlFilter);
  if (shoeUrls.length === 0) {
    console.log('No shoe URLs found');
    return;
  }
  const testUrl = shoeUrls[0];
  console.log(`\nTest URL: ${testUrl}`);

  let fetchUrlToUse = testUrl;
  if (brand.extractionMethod === 'shopify-json' && brand.transformUrl) {
    fetchUrlToUse = brand.transformUrl(testUrl);
    console.log(`Shopify JSON URL: ${fetchUrlToUse}`);
  }

  const { status, body } = await fetchUrl(fetchUrlToUse);
  console.log(`HTTP Status: ${status}`);
  console.log(`Body length: ${body.length}`);

  // Check for JSON-LD
  const jsonLdBlocks = body.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  console.log(`\nJSON-LD blocks: ${jsonLdBlocks ? jsonLdBlocks.length : 0}`);
  if (jsonLdBlocks) {
    jsonLdBlocks.forEach((block, i) => {
      const content = block.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
      try {
        const parsed = JSON.parse(content);
        const type = parsed['@type'] || (parsed['@graph'] ? 'graph' : 'unknown');
        console.log(`  Block ${i}: @type=${type}, keys=${Object.keys(parsed).join(',')}`);
        if (type === 'Product' || (parsed['@graph'] && parsed['@graph'].find(x => x['@type'] === 'Product'))) {
          const product = type === 'Product' ? parsed : parsed['@graph'].find(x => x['@type'] === 'Product');
          console.log(`    Name: ${product.name}`);
          console.log(`    Image: ${JSON.stringify(product.image).substring(0, 100)}`);
          console.log(`    Offers: ${JSON.stringify(product.offers).substring(0, 200)}`);
        }
      } catch (e) {
        console.log(`  Block ${i}: parse error - ${e.message}`);
      }
    });
  }

  // Check for __NEXT_DATA__
  const nextData = body.includes('__NEXT_DATA__');
  console.log(`\n__NEXT_DATA__: ${nextData}`);

  // Check OG tags
  const ogTitle = body.match(/property=["']og:title["'][^>]*content=["']([^"']+)/i)
    || body.match(/content=["']([^"']+)["'][^>]*property=["']og:title["']/i);
  const ogImage = body.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i)
    || body.match(/content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
  console.log(`\nog:title: ${ogTitle ? ogTitle[1] : 'NONE'}`);
  console.log(`og:image: ${ogImage ? ogImage[1].substring(0, 80) : 'NONE'}`);

  // Price patterns
  const pricePatterns = body.match(/"price"\s*:\s*"?\d/g);
  console.log(`\nPrice patterns in body: ${pricePatterns ? pricePatterns.length : 0}`);

  // Additional price patterns
  const pricePatterns2 = body.match(/\$\d+\.?\d*/g);
  console.log(`Dollar patterns in body: ${pricePatterns2 ? pricePatterns2.length : 0}`);
  if (pricePatterns2) console.log(`  First 5: ${pricePatterns2.slice(0, 5).join(', ')}`);

  // Product:price meta
  const priceMeta = body.match(/product:price:amount/i);
  console.log(`product:price:amount meta: ${priceMeta ? 'YES' : 'NO'}`);

  // Data attributes with prices
  const dataPrice = body.match(/data-price=["']([^"']+)/i);
  console.log(`data-price attribute: ${dataPrice ? dataPrice[1] : 'NONE'}`);

  // Salesforce/Demandware patterns
  const sfccPrice = body.match(/"price"\s*:\s*\{[^}]*"sales"\s*:\s*\{[^}]*"value"\s*:\s*(\d+)/);
  console.log(`SFCC price: ${sfccPrice ? sfccPrice[1] : 'NONE'}`);

  // Try extraction
  console.log(`\n--- Extraction attempt ---`);
  const product = brand.extractionMethod === 'shopify-json'
    ? extractShopifyJson(body, testUrl, brand.name, brand.category)
    : extractJsonLd(body, testUrl, brand.name, brand.category)
      || extractNextData(body, testUrl, brand.name, brand.category)
      || extractOgTags(body, testUrl, brand.name, brand.category);

  if (product) {
    console.log('SUCCESS:');
    console.log(`  Name: ${product.name}`);
    console.log(`  Price: $${product.price}`);
    console.log(`  Image: ${product.imageUrl.substring(0, 80)}...`);
    console.log(`  Description: ${product.description.substring(0, 100)}...`);
  } else {
    console.log('FAILED: No product data extracted');
    console.log('\nFirst 2000 chars of body:');
    console.log(body.substring(0, 2000));
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  // Handle --inspect mode
  if (inspectMode) {
    if (brandsFilter.length === 0) {
      console.log('Usage: --inspect --brands <brand>');
      return;
    }
    for (const brandKey of brandsFilter) {
      await inspectBrand(brandKey);
    }
    return;
  }

  console.log('\nKicksList Multi-Brand Sitemap Scraper');
  console.log('======================================\n');

  // Determine which brands to scrape
  const brandKeys = Object.keys(BRANDS);
  const selectedBrands = brandsFilter.length > 0
    ? brandKeys.filter(k => brandsFilter.includes(k))
    : brandKeys;

  if (selectedBrands.length === 0) {
    console.log('No matching brands found. Available brands:');
    brandKeys.forEach(k => console.log(`  ${k} (${BRANDS[k].name})`));
    return;
  }

  console.log(`Brands: ${selectedBrands.map(k => BRANDS[k].name).join(', ')}`);
  if (maxLimit > 0) console.log(`Limit: ${maxLimit} per brand`);
  console.log(`Concurrency: ${concurrency}, Delay: ${delay}ms`);
  if (previewMode) console.log('Mode: PREVIEW');
  if (dryRun) console.log('Mode: DRY RUN');
  console.log();

  // Load existing for dedup
  const { nameSet: existingNames, maxId, content: existingContent } = loadExisting();
  console.log(`Existing products: ${existingNames.size} (max ID: ${maxId})`);

  // Track all names across brands to avoid cross-brand dupes
  const seenNames = new Set();
  const allScraped = [];
  const brandStats = {};

  // Scrape each brand
  for (const brandKey of selectedBrands) {
    const brand = BRANDS[brandKey];
    const result = await scrapeBrand(brandKey, brand, existingNames, seenNames);
    allScraped.push(...result.scraped);
    brandStats[brand.name] = result;
  }

  if (previewMode) {
    console.log('\nRun without --preview to scrape.');
    return;
  }

  // Summary
  console.log('\n======================================');
  console.log('  Scraping Summary');
  console.log('======================================');

  let totalErrors = 0;
  let totalDupes = 0;
  let totalNoData = 0;

  for (const [brandName, stats] of Object.entries(brandStats)) {
    console.log(`  ${brandName}: ${stats.scraped.length} new, ${stats.dupes} dupes, ${stats.noData} no-data, ${stats.errors} errors`);
    totalErrors += stats.errors;
    totalDupes += stats.dupes;
    totalNoData += stats.noData;
  }

  console.log(`\n  Total new products: ${allScraped.length}`);
  console.log(`  Total duplicates: ${totalDupes}`);
  console.log(`  Total no-data: ${totalNoData}`);
  console.log(`  Total errors: ${totalErrors}`);

  if (allScraped.length === 0) {
    console.log('\nNo new products to add.');
    return;
  }

  // Assign IDs
  allScraped.forEach((p, i) => { p.id = maxId + 1 + i; });

  // Category summary
  const cats = {};
  const brands = {};
  allScraped.forEach(p => {
    cats[p.category] = (cats[p.category] || 0) + 1;
    brands[p.brand] = (brands[p.brand] || 0) + 1;
  });
  console.log('\nBy brand:');
  Object.entries(brands).sort((a, b) => b[1] - a[1]).forEach(([b, n]) => console.log(`  ${b}: ${n}`));
  console.log('\nBy category:');
  Object.entries(cats).sort((a, b) => b[1] - a[1]).forEach(([c, n]) => console.log(`  ${c}: ${n}`));

  // Samples
  console.log('\nSample products:');
  allScraped.slice(0, 8).forEach((p, i) => {
    console.log(`  ${i + 1}. [${p.id}] ${p.name} — ${p.brand} — $${p.price}`);
  });
  if (allScraped.length > 8) console.log(`  ... and ${allScraped.length - 8} more`);

  if (dryRun) {
    console.log('\n--- DRY RUN — no files written ---');
    return;
  }

  // Write
  console.log('\nWriting to data/products.js...');
  const writtenPath = writeProducts(allScraped, existingContent);
  console.log(`Written to ${writtenPath}`);

  const docsPath = path.join(__dirname, '..', 'docs', 'data', 'products.js');
  if (fs.existsSync(docsPath)) {
    console.log(`Copied to ${docsPath}`);
  }

  const lastId = maxId + allScraped.length;
  console.log(`\n======================================`);
  console.log(`  Multi-Brand Scrape Complete`);
  console.log(`======================================`);
  console.log(`  New products added:  ${allScraped.length}`);
  console.log(`  New ID range:        ${maxId + 1} - ${lastId}`);
  console.log(`  Total products:      ${lastId}`);
  console.log(`======================================\n`);
}

main().catch(err => {
  console.error('\nFatal error:', err.message);
  process.exit(1);
});

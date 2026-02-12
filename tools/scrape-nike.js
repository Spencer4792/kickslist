#!/usr/bin/env node
/**
 * KicksList Nike Sitemap Scraper
 * Fetches Nike's public product sitemap, filters for footwear,
 * scrapes product data from each page, and imports into products.js
 *
 * Usage:
 *   node tools/scrape-nike.js [options]
 *
 * Options:
 *   --preview        Show what would be scraped without fetching pages
 *   --limit <num>    Max products to scrape (default: all)
 *   --delay <ms>     Delay between page fetches in ms (default: 500)
 *   --dry-run        Fetch and process but don't write to file
 *   --concurrency <n> Parallel requests (default: 5)
 */

const https = require('https');
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
const maxLimit = parseInt(getOpt('--limit', '0')) || 0;
const delay = parseInt(getOpt('--delay', '500'));
const concurrency = parseInt(getOpt('--concurrency', '5'));

// ---------------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------------
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ---------------------------------------------------------------------------
// Shoe keyword filter — applied to URL slugs
// ---------------------------------------------------------------------------
const SHOE_KEYWORDS = [
  'shoe', 'shoes', 'sneaker', 'sneakers', 'boot', 'boots', 'clog', 'clogs',
  'slide', 'slides', 'sandal', 'sandals', 'slipper', 'slippers', 'mule',
  'mules', 'moc', 'moccasin', 'trainer', 'trainers',
  // Specific Nike shoe models in URL slugs
  'air-force', 'air-max', 'dunk', 'jordan', 'blazer', 'cortez', 'vomero',
  'pegasus', 'react', 'huarache', 'presto', 'flyknit', 'waffle',
  'metcon', 'free-rn', 'zoom', 'sb-dunk', 'p-6000', 'v2k', 'shox',
  'air-rift', 'killshot', 'monarch', 'spiridon',
];

function isShoeUrl(url) {
  const slug = url.toLowerCase();
  return SHOE_KEYWORDS.some(kw => slug.includes(kw));
}

// ---------------------------------------------------------------------------
// Extract product data from Nike page HTML
// ---------------------------------------------------------------------------
function extractProduct(html, url) {
  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/);
  if (!match) return null;

  let data;
  try { data = JSON.parse(match[1]); } catch { return null; }

  const props = data?.props?.pageProps;
  if (!props) return null;

  const product = props.selectedProduct;
  if (!product) return null;

  // Only footwear
  if (product.productType && product.productType !== 'FOOTWEAR') return null;

  const info = product.productInfo || {};
  const prices = product.prices || {};
  const images = props.colorwayImages || [];

  const title = info.title || '';
  const subtitle = info.subtitle || '';
  if (!title) return null;

  // Get image
  let imageUrl = '';
  if (images.length > 0) {
    const img = images[0];
    // Use squarishImg and swap template for larger size
    imageUrl = img.squarishImg || img.portraitImg || '';
    // Convert to a good size - replace t_default with t_PDP_1728_v1 for high res
    imageUrl = imageUrl.replace('/t_default/', '/t_PDP_864_v1/');
  }
  if (!imageUrl) return null;

  const name = buildName(title, product.colorDescription);
  const price = prices.currentPrice || prices.initialPrice || 0;
  const retail = prices.initialPrice || prices.currentPrice || 0;
  const releaseDate = product.availabilityDate
    ? product.availabilityDate.split('T')[0]
    : new Date().toISOString().split('T')[0];
  const description = (info.productDescription || '').replace(/[\r\n]+/g, ' ').replace(/"/g, "'").substring(0, 300);
  const genders = product.genders || [];
  const styleColor = product.styleColor || '';

  return {
    name: name.replace(/"/g, "'"),
    brand: 'Nike',
    category: detectCategory(title),
    price,
    retail,
    releaseDate,
    description: description || `Nike ${name}`,
    imageUrl,
    subtitle,
    genders,
    styleColor,
    sourceUrl: url,
  };
}

function buildName(title, colorDescription) {
  let name = title;
  if (colorDescription && !title.toLowerCase().includes(colorDescription.toLowerCase())) {
    const clean = colorDescription.replace(/\//g, '-');
    if (clean.length < 30) {
      name = `${name} '${clean}'`;
    }
  }
  return name;
}

function detectCategory(title) {
  const t = title.toLowerCase();
  if (t.includes('jordan')) return 'jordan';
  if (t.includes('dunk') || t.includes('air max') || t.includes('air force') ||
      t.includes('blazer') || t.includes('cortez') || t.includes('nike'))
    return 'nike';
  return 'nike'; // It's Nike.com, default to nike
}

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
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log('\nKicksList Nike Sitemap Scraper');
  console.log('==============================\n');

  // Step 1: Fetch sitemap
  console.log('Fetching Nike US product sitemap...');
  const { body: sitemapXml } = await fetchUrl('https://www.nike.com/sitemap-v2-pdp-en-us.xml');

  // Parse URLs
  const urlMatches = sitemapXml.match(/<loc>(https:\/\/www\.nike\.com\/t\/[^<]+)<\/loc>/g) || [];
  const allUrls = urlMatches.map(m => m.replace(/<\/?loc>/g, ''));
  console.log(`Total product URLs: ${allUrls.length}`);

  // Filter for shoes
  const shoeUrls = allUrls.filter(isShoeUrl);
  console.log(`Shoe URLs (filtered): ${shoeUrls.length}`);

  // Load existing for dedup
  const { nameSet: existingNames, maxId, content: existingContent } = loadExisting();
  console.log(`Existing products: ${existingNames.size} (max ID: ${maxId})`);

  const toScrape = maxLimit > 0 ? shoeUrls.slice(0, maxLimit) : shoeUrls;
  console.log(`Will scrape: ${toScrape.length} URLs\n`);

  if (previewMode) {
    console.log('Preview mode — sample URLs:');
    toScrape.slice(0, 20).forEach((u, i) => console.log(`  ${i + 1}. ${u}`));
    if (toScrape.length > 20) console.log(`  ... and ${toScrape.length - 20} more`);
    console.log('\nRun without --preview to scrape.');
    return;
  }

  // Step 2: Scrape pages in batches
  const scraped = [];
  let errors = 0;
  let skippedType = 0;
  let skippedDupe = 0;
  let skippedNoData = 0;
  const seenNames = new Set();

  for (let i = 0; i < toScrape.length; i += concurrency) {
    const batch = toScrape.slice(i, i + concurrency);

    const results = await Promise.allSettled(batch.map(async (url) => {
      try {
        const { status, body } = await fetchUrl(url);
        if (status !== 200) return { url, error: `HTTP ${status}` };
        return { url, html: body };
      } catch (e) {
        return { url, error: e.message };
      }
    }));

    for (const result of results) {
      if (result.status === 'rejected') { errors++; continue; }
      const { url, html, error } = result.value;
      if (error) { errors++; continue; }

      const product = extractProduct(html, url);
      if (!product) { skippedNoData++; continue; }

      // Dedup against existing
      const normName = product.name.toLowerCase().trim();
      if (existingNames.has(normName) || seenNames.has(normName)) {
        skippedDupe++;
        continue;
      }
      seenNames.add(normName);
      scraped.push(product);
    }

    const done = Math.min(i + concurrency, toScrape.length);
    process.stdout.write(`\r[${done}/${toScrape.length}] Scraped — ${scraped.length} new, ${skippedDupe} dupes, ${errors} errors`);

    if (i + concurrency < toScrape.length) await sleep(delay);
  }

  console.log('\n');
  console.log(`Scraping complete:`);
  console.log(`  Pages fetched: ${toScrape.length}`);
  console.log(`  New products: ${scraped.length}`);
  console.log(`  Duplicates skipped: ${skippedDupe}`);
  console.log(`  No data / non-footwear: ${skippedNoData}`);
  console.log(`  Errors: ${errors}`);

  if (scraped.length === 0) {
    console.log('\nNo new products to add.');
    return;
  }

  // Assign IDs
  scraped.forEach((p, i) => { p.id = maxId + 1 + i; });

  // Category summary
  const cats = {};
  scraped.forEach(p => { cats[p.category] = (cats[p.category] || 0) + 1; });
  console.log('\nBy category:');
  Object.entries(cats).sort((a, b) => b[1] - a[1]).forEach(([c, n]) => console.log(`  ${c}: ${n}`));

  // Samples
  console.log('\nSample products:');
  scraped.slice(0, 5).forEach((p, i) => {
    console.log(`  ${i + 1}. [${p.id}] ${p.name} — $${p.price}`);
  });
  if (scraped.length > 5) console.log(`  ... and ${scraped.length - 5} more`);

  if (dryRun) {
    console.log('\n--- DRY RUN — no files written ---');
    return;
  }

  // Write
  console.log('\nWriting to data/products.js...');
  const writtenPath = writeProducts(scraped, existingContent);
  console.log(`Written to ${writtenPath}`);

  const lastId = maxId + scraped.length;
  console.log(`\n==============================`);
  console.log(`  Nike Scrape Complete`);
  console.log(`==============================`);
  console.log(`  New products added:  ${scraped.length}`);
  console.log(`  New ID range:        ${maxId + 1} - ${lastId}`);
  console.log(`  Total products:      ${lastId}`);
  console.log(`==============================\n`);
}

main().catch(err => {
  console.error('\nFatal error:', err.message);
  process.exit(1);
});

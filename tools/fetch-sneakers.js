#!/usr/bin/env node
/**
 * KicksList Sneaker Fetcher
 * Fetches sneaker data from StockX/GOAT/FlightClub via Sneaks-API
 *
 * Usage:
 *   node tools/fetch-sneakers.js <search-query> [options]
 *
 * Options:
 *   --limit <num>      Number of results to fetch (default: 20, max recommended: 100)
 *   --output <file>    Output CSV filename (default: tools/fetched-<query>.csv)
 *   --brand <name>     Override brand detection (Jordan, Nike, Adidas, Yeezy, New Balance)
 *   --popular          Fetch most popular sneakers instead of searching
 *
 * Examples:
 *   node tools/fetch-sneakers.js "Air Jordan 1" --limit 50
 *   node tools/fetch-sneakers.js "Nike Dunk" --limit 100
 *   node tools/fetch-sneakers.js "Yeezy 350" --limit 30
 *   node tools/fetch-sneakers.js --popular --limit 40
 */

const SneaksAPI = require('sneaks-api');
const fs = require('fs');
const path = require('path');

const sneaks = new SneaksAPI();

// Parse command line arguments
const args = process.argv.slice(2);
const popularMode = args.includes('--popular');

// Find option values
function getOptionValue(optionName) {
  const idx = args.indexOf(optionName);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
}

const limit = parseInt(getOptionValue('--limit')) || 20;
const outputFile = getOptionValue('--output');
const forceBrand = getOptionValue('--brand');

// Find query (first arg that's not an option or option value)
const optionFlags = ['--limit', '--output', '--brand', '--popular'];
let query = null;
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (optionFlags.includes(arg)) {
    // Skip this flag and its value (if it takes one)
    if (arg !== '--popular') i++;
    continue;
  }
  query = arg;
  break;
}

if (!query && !popularMode) {
  console.log(`
KicksList Sneaker Fetcher
Fetches sneaker data from StockX/GOAT/FlightClub via Sneaks-API

Usage:
  node tools/fetch-sneakers.js <search-query> [options]

Options:
  --limit <num>      Number of results to fetch (default: 20, max: 100)
  --output <file>    Output CSV filename (default: tools/fetched-<query>.csv)
  --brand <name>     Override brand detection
  --popular          Fetch most popular sneakers instead of searching

Examples:
  node tools/fetch-sneakers.js "Air Jordan 1" --limit 50
  node tools/fetch-sneakers.js "Nike Dunk" --limit 100
  node tools/fetch-sneakers.js "Yeezy 350" --limit 30
  node tools/fetch-sneakers.js --popular --limit 40

After fetching, import with:
  node tools/import-products.js <csv-file> --preview
  node tools/import-products.js <csv-file>
`);
  process.exit(1);
}

// Brand detection from product name
function detectBrand(name, shoeName) {
  const combined = `${name} ${shoeName}`.toLowerCase();

  if (combined.includes('jordan') || combined.includes('aj1') || combined.includes('aj4')) {
    return { brand: 'Jordan', category: 'jordan' };
  }
  if (combined.includes('yeezy')) {
    return { brand: 'Yeezy', category: 'yeezy' };
  }
  if (combined.includes('new balance') || combined.includes('nb ')) {
    return { brand: 'New Balance', category: 'new-balance' };
  }
  if (combined.includes('adidas') || combined.includes('samba') || combined.includes('gazelle') || combined.includes('superstar')) {
    return { brand: 'Adidas', category: 'adidas' };
  }
  if (combined.includes('nike') || combined.includes('dunk') || combined.includes('air max') || combined.includes('air force')) {
    return { brand: 'Nike', category: 'nike' };
  }

  return { brand: 'Other', category: 'other' };
}

// Convert sneaker object to CSV row
function sneakerToRow(sneaker) {
  const { brand, category } = forceBrand
    ? { brand: forceBrand, category: forceBrand.toLowerCase().replace(' ', '-') }
    : detectBrand(sneaker.brand || '', sneaker.shoeName || '');

  // Build product name with colorway
  let name = sneaker.shoeName || sneaker.name || 'Unknown';
  if (sneaker.colorway && !name.toLowerCase().includes(sneaker.colorway.toLowerCase())) {
    // Only add colorway if it's not already in the name
    const colorwayClean = sneaker.colorway.replace(/\//g, '-');
    if (colorwayClean.length < 30) {
      name = `${name} '${colorwayClean}'`;
    }
  }

  // Get price (use retail or lowest resale)
  const retailPrice = sneaker.retailPrice || 0;
  const lowestResell = Math.min(
    sneaker.lowestResellPrice?.stockX || Infinity,
    sneaker.lowestResellPrice?.goat || Infinity,
    sneaker.lowestResellPrice?.flightClub || Infinity,
    sneaker.lowestResellPrice?.stadiumGoods || Infinity
  );
  const price = lowestResell !== Infinity ? lowestResell : retailPrice;

  // Get image URL
  const image = sneaker.thumbnail || sneaker.image?.thumbnail || '';

  // Format release date
  let releaseDate = '';
  if (sneaker.releaseDate) {
    try {
      const date = new Date(sneaker.releaseDate);
      if (!isNaN(date.getTime())) {
        releaseDate = date.toISOString().split('T')[0];
      }
    } catch (e) {
      releaseDate = '';
    }
  }

  // Build description
  let description = sneaker.description || '';
  if (!description && sneaker.colorway) {
    description = `Features the ${sneaker.colorway} colorway.`;
  }
  // Clean description for CSV (remove newlines, limit length)
  description = description.replace(/[\r\n]+/g, ' ').replace(/"/g, "'").substring(0, 300);

  return {
    name: name.replace(/"/g, "'"),
    brand,
    category,
    price: price || retailPrice || 0,
    retail: retailPrice || price || 0,
    releaseDate,
    description,
    images: image,
    inStock: 'true',
    featured: 'false',
    trending: 'false',
    styleId: sneaker.styleID || '',
    stockxUrl: sneaker.resellLinks?.stockX || '',
    goatUrl: sneaker.resellLinks?.goat || ''
  };
}

// Escape CSV field
function escapeCSV(field) {
  if (field === null || field === undefined) return '';
  const str = String(field);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Convert rows to CSV
function toCSV(rows) {
  const headers = ['name', 'brand', 'category', 'price', 'retail', 'releaseDate', 'description', 'images', 'inStock', 'featured', 'trending'];
  const headerLine = headers.join(',');

  const dataLines = rows.map(row =>
    headers.map(h => escapeCSV(row[h])).join(',')
  );

  return [headerLine, ...dataLines].join('\n');
}

// Main function
async function main() {
  console.log('\nKicksList Sneaker Fetcher');
  console.log('========================\n');

  const fetchPromise = new Promise((resolve, reject) => {
    const callback = (products, err) => {
      if (err) {
        reject(err);
      } else {
        resolve(products);
      }
    };

    if (popularMode) {
      console.log(`Fetching ${limit} most popular sneakers...`);
      sneaks.getMostPopular(limit, callback);
    } else {
      console.log(`Searching for "${query}" (limit: ${limit})...`);
      sneaks.getProducts(query, limit, callback);
    }
  });

  try {
    const products = await fetchPromise;

    if (!products || products.length === 0) {
      console.log('\nNo products found.');
      process.exit(0);
    }

    console.log(`Found ${products.length} products\n`);

    // Convert to CSV rows
    const rows = products.map(sneakerToRow);

    // Filter out rows with no name or price
    const validRows = rows.filter(r => r.name && r.name !== 'Unknown' && r.price > 0);

    if (validRows.length < rows.length) {
      console.log(`Filtered out ${rows.length - validRows.length} invalid products`);
    }

    // Summary
    console.log('--- Summary ---');
    const brandCount = {};
    validRows.forEach(r => {
      brandCount[r.brand] = (brandCount[r.brand] || 0) + 1;
    });
    Object.entries(brandCount).sort((a, b) => b[1] - a[1]).forEach(([brand, count]) => {
      console.log(`  ${brand}: ${count}`);
    });

    // Show sample
    console.log('\n--- Sample Products ---');
    validRows.slice(0, 3).forEach((r, i) => {
      console.log(`${i + 1}. ${r.name}`);
      console.log(`   Brand: ${r.brand} | Price: $${r.price} | Retail: $${r.retail}`);
      console.log(`   Release: ${r.releaseDate || 'N/A'}`);
    });

    // Generate output filename
    const defaultFilename = popularMode
      ? 'fetched-popular.csv'
      : `fetched-${query.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.csv`;
    const outputPath = outputFile || path.join(__dirname, defaultFilename);

    // Write CSV
    const csv = toCSV(validRows);
    fs.writeFileSync(outputPath, csv);

    console.log(`\n✓ Saved ${validRows.length} products to ${outputPath}`);
    console.log('\nNext steps:');
    console.log(`  1. Review: open ${outputPath}`);
    console.log(`  2. Preview import: node tools/import-products.js ${outputPath} --preview`);
    console.log(`  3. Import: node tools/import-products.js ${outputPath}`);

  } catch (error) {
    console.error('\nError fetching data:', error.message);
    process.exit(1);
  }
}

main();

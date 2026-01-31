#!/usr/bin/env node
/**
 * KicksList CSV Product Importer
 *
 * Usage:
 *   node tools/import-products.js <csv-file> [options]
 *
 * Options:
 *   --output <file>    Output to a separate JS file instead of appending to products.js
 *   --preview          Preview the products without writing to file
 *   --start-id <num>   Override the starting ID (default: auto-detect from products.js)
 *
 * Examples:
 *   node tools/import-products.js tools/new-shoes.csv --preview
 *   node tools/import-products.js tools/new-shoes.csv
 *   node tools/import-products.js tools/new-shoes.csv --output data/new-products.js
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const csvFile = args.find(arg => !arg.startsWith('--'));
const preview = args.includes('--preview');
const outputIndex = args.indexOf('--output');
const outputFile = outputIndex !== -1 ? args[outputIndex + 1] : null;
const startIdIndex = args.indexOf('--start-id');
const manualStartId = startIdIndex !== -1 ? parseInt(args[startIdIndex + 1]) : null;

if (!csvFile) {
  console.log(`
KicksList CSV Product Importer

Usage:
  node tools/import-products.js <csv-file> [options]

Options:
  --output <file>    Output to a separate JS file instead of appending to products.js
  --preview          Preview the products without writing to file
  --start-id <num>   Override the starting ID (default: auto-detect from products.js)

Examples:
  node tools/import-products.js tools/new-shoes.csv --preview
  node tools/import-products.js tools/new-shoes.csv
  node tools/import-products.js tools/new-shoes.csv --output data/new-products.js

CSV Format (see tools/product-template.csv for example):
  name, brand, category, price, retail, releaseDate, description, images, inStock, featured, trending

  - category must be one of: jordan, nike, yeezy, adidas, new-balance, other
  - images can be a single URL or multiple URLs separated by |
  - inStock, featured, trending should be true/false (defaults to true, false, false)
`);
  process.exit(1);
}

// Valid categories
const VALID_CATEGORIES = ['jordan', 'nike', 'yeezy', 'adidas', 'new-balance', 'other'];

// Brand to category mapping for auto-detection
const BRAND_CATEGORY_MAP = {
  'jordan': 'jordan',
  'air jordan': 'jordan',
  'nike': 'nike',
  'nike sb': 'nike',
  'nike dunk': 'nike',
  'yeezy': 'yeezy',
  'adidas': 'adidas',
  'adidas originals': 'adidas',
  'new balance': 'new-balance',
  'new-balance': 'new-balance',
};

function parseCSV(content) {
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length < 2) {
    throw new Error('CSV file must have a header row and at least one data row');
  }

  // Parse header
  const header = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase());

  // Required columns
  const requiredCols = ['name', 'brand', 'price'];
  for (const col of requiredCols) {
    if (!header.includes(col)) {
      throw new Error(`Missing required column: ${col}`);
    }
  }

  // Parse data rows
  const products = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0 || values.every(v => !v.trim())) continue;

    const row = {};
    header.forEach((col, idx) => {
      row[col] = values[idx]?.trim() || '';
    });
    products.push(row);
  }

  return products;
}

function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);

  return values;
}

function detectCategory(brand) {
  const normalizedBrand = brand.toLowerCase().trim();
  return BRAND_CATEGORY_MAP[normalizedBrand] || 'other';
}

function convertToProduct(row, id) {
  const brand = row.brand || 'Unknown';
  const category = row.category && VALID_CATEGORIES.includes(row.category.toLowerCase())
    ? row.category.toLowerCase()
    : detectCategory(brand);

  // Parse images (can be single URL or multiple separated by |)
  let images = [];
  if (row.images) {
    images = row.images.split('|').map(url => url.trim()).filter(url => url);
  }

  // Parse boolean fields with defaults
  const parseBoolean = (value, defaultValue) => {
    if (value === '' || value === undefined) return defaultValue;
    return value.toLowerCase() === 'true' || value === '1';
  };

  return {
    id,
    name: row.name,
    brand,
    category,
    price: parseInt(row.price) || 0,
    retail: parseInt(row.retail) || parseInt(row.price) || 0,
    releaseDate: row.releasedate || row.releaseDate || new Date().toISOString().split('T')[0],
    description: row.description || `${brand} ${row.name}`,
    images,
    inStock: parseBoolean(row.instock || row.inStock, true),
    featured: parseBoolean(row.featured, false),
    trending: parseBoolean(row.trending, false)
  };
}

function formatProduct(product) {
  const imageArray = product.images.length > 0
    ? `["${product.images.join('", "')}"]`
    : '[]';

  return `  {
    id: ${product.id},
    name: "${product.name.replace(/"/g, '\\"')}",
    brand: "${product.brand.replace(/"/g, '\\"')}",
    category: "${product.category}",
    price: ${product.price},
    retail: ${product.retail},
    releaseDate: "${product.releaseDate}",
    description: "${product.description.replace(/"/g, '\\"')}",
    images: ${imageArray},
    inStock: ${product.inStock}, featured: ${product.featured}, trending: ${product.trending}
  }`;
}

function getLastProductId() {
  const productsPath = path.join(__dirname, '..', 'data', 'products.js');
  if (!fs.existsSync(productsPath)) {
    return 0;
  }

  const content = fs.readFileSync(productsPath, 'utf8');
  const matches = content.match(/id:\s*(\d+)/g);
  if (!matches) return 0;

  const ids = matches.map(m => parseInt(m.replace('id:', '').trim()));
  return Math.max(...ids.filter(id => !isNaN(id) && id < 10000)); // Filter out non-product IDs
}

function main() {
  // Check if CSV file exists
  const csvPath = path.resolve(csvFile);
  if (!fs.existsSync(csvPath)) {
    console.error(`Error: CSV file not found: ${csvPath}`);
    process.exit(1);
  }

  // Read and parse CSV
  console.log(`\nReading CSV file: ${csvPath}`);
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const rows = parseCSV(csvContent);
  console.log(`Found ${rows.length} products in CSV\n`);

  if (rows.length === 0) {
    console.log('No products to import.');
    process.exit(0);
  }

  // Determine starting ID
  const lastId = manualStartId !== null ? manualStartId - 1 : getLastProductId();
  console.log(`Starting ID: ${lastId + 1}`);

  // Convert rows to products
  const products = rows.map((row, index) => convertToProduct(row, lastId + 1 + index));

  // Validate and report
  console.log('\n--- Import Summary ---');
  const categoryCount = {};
  const brandCount = {};
  let warnings = [];

  products.forEach((p, i) => {
    categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
    brandCount[p.brand] = (brandCount[p.brand] || 0) + 1;

    if (p.images.length === 0) {
      warnings.push(`Product ${p.id} "${p.name}" has no images`);
    }
    if (p.price === 0) {
      warnings.push(`Product ${p.id} "${p.name}" has price of 0`);
    }
  });

  console.log('\nBy Category:');
  Object.entries(categoryCount).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}`);
  });

  console.log('\nBy Brand:');
  Object.entries(brandCount).sort((a, b) => b[1] - a[1]).forEach(([brand, count]) => {
    console.log(`  ${brand}: ${count}`);
  });

  if (warnings.length > 0) {
    console.log('\nWarnings:');
    warnings.slice(0, 10).forEach(w => console.log(`  ⚠ ${w}`));
    if (warnings.length > 10) {
      console.log(`  ... and ${warnings.length - 10} more warnings`);
    }
  }

  // Generate output
  const formattedProducts = products.map(formatProduct).join(',\n');

  if (preview) {
    console.log('\n--- Preview (first 3 products) ---\n');
    products.slice(0, 3).forEach(p => {
      console.log(formatProduct(p) + ',\n');
    });
    console.log(`... and ${products.length - 3} more products\n`);
    console.log('Run without --preview to write to file.');
    return;
  }

  if (outputFile) {
    // Write to separate file
    const output = `// Generated by import-products.js on ${new Date().toISOString()}
// ${products.length} products imported from ${path.basename(csvPath)}

const importedProducts = [
${formattedProducts}
];

// To use: copy these products into data/products.js
module.exports = { importedProducts };
`;
    fs.writeFileSync(outputFile, output);
    console.log(`\n✓ Wrote ${products.length} products to ${outputFile}`);
  } else {
    // Append to products.js
    const productsPath = path.join(__dirname, '..', 'data', 'products.js');
    let content = fs.readFileSync(productsPath, 'utf8');

    // Find the products array specifically by looking for the pattern:
    // The products array ends before "// Vendor" or "function generate" or "const categories"
    // We need to find the ]; that closes the products array, not the categories array

    // Find where "const products = [" starts
    const productsStart = content.indexOf('const products = [');
    if (productsStart === -1) {
      console.error('Error: Could not find products array in products.js');
      process.exit(1);
    }

    // Find the end of products array - it's followed by either:
    // - "// " comment for vendor section
    // - "function " for helper functions
    // - "const categories" for categories array
    const afterProducts = content.slice(productsStart);

    // Look for "];" followed by blank lines and then a comment, function, or const
    const endPatterns = [
      /\}\s*\n\];\s*\n\s*\n\/\//,      // }]; followed by blank line and comment
      /\}\s*\n\];\s*\nfunction /,       // }]; followed by function
      /\}\s*\n\];\s*\nconst /,          // }]; followed by const
      /\}\s*\n\];\s*\n\s*function /,    // }]; with whitespace then function
    ];

    let insertPoint = -1;
    for (const pattern of endPatterns) {
      const match = afterProducts.match(pattern);
      if (match) {
        // Find position of the "}" before "];"
        insertPoint = productsStart + match.index + 1; // +1 to be after the "}"
        break;
      }
    }

    if (insertPoint === -1) {
      // Fallback: find first ]; after products start
      const firstArrayEnd = afterProducts.indexOf('];');
      if (firstArrayEnd === -1) {
        console.error('Error: Could not find insertion point in products.js');
        process.exit(1);
      }
      // Find the } before ];
      const beforeEnd = afterProducts.slice(0, firstArrayEnd);
      const lastBrace = beforeEnd.lastIndexOf('}');
      insertPoint = productsStart + lastBrace + 1;
    }

    // Insert after the last product's closing brace
    const newContent = content.slice(0, insertPoint) + ',\n' + formattedProducts + content.slice(insertPoint);
    fs.writeFileSync(productsPath, newContent);

    console.log(`\n✓ Added ${products.length} products to data/products.js`);
    console.log(`  New ID range: ${lastId + 1} - ${lastId + products.length}`);
    console.log(`  Total products: ${lastId + products.length}`);
  }
}

main();

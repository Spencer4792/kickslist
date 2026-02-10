import { PrismaClient, VendorType } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as vm from 'vm';

const prisma = new PrismaClient();

// ============================================
// Parse products.js - extract the products array
// ============================================
function parseProductsFile(): any[] {
  const filePath = path.resolve(__dirname, '../../data/products.js');
  const content = fs.readFileSync(filePath, 'utf-8');

  // Extract just the products array (from line 6 to the closing ];)
  // The array starts with "const products = [" and ends before the helper functions
  const arrayStart = content.indexOf('const products = [');
  if (arrayStart === -1) throw new Error('Could not find products array in products.js');

  // Find the matching closing bracket by counting brackets
  let depth = 0;
  let arrayEnd = -1;
  let inString = false;
  let stringChar = '';
  let escaped = false;

  for (let i = content.indexOf('[', arrayStart); i < content.length; i++) {
    const char = content[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = true;
      continue;
    }

    if (inString) {
      if (char === stringChar) {
        inString = false;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      inString = true;
      stringChar = char;
      continue;
    }

    if (char === '[') depth++;
    if (char === ']') {
      depth--;
      if (depth === 0) {
        arrayEnd = i + 1;
        break;
      }
    }
  }

  if (arrayEnd === -1) throw new Error('Could not find end of products array');

  const arrayStr = content.substring(content.indexOf('[', arrayStart), arrayEnd);

  // Evaluate the array in a sandbox
  const sandbox = { result: null as any };
  vm.createContext(sandbox);
  vm.runInContext(`result = ${arrayStr}`, sandbox);

  return sandbox.result;
}

// ============================================
// Parse vendors.js - extract the vendors array
// ============================================
function parseVendorsFile(): any[] {
  const filePath = path.resolve(__dirname, '../../data/vendors.js');
  const content = fs.readFileSync(filePath, 'utf-8');

  const arrayStart = content.indexOf('const vendors = [');
  if (arrayStart === -1) throw new Error('Could not find vendors array in vendors.js');

  let depth = 0;
  let arrayEnd = -1;
  let inString = false;
  let stringChar = '';
  let escaped = false;

  for (let i = content.indexOf('[', arrayStart); i < content.length; i++) {
    const char = content[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = true;
      continue;
    }

    if (inString) {
      if (char === stringChar) {
        inString = false;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      inString = true;
      stringChar = char;
      continue;
    }

    if (char === '[') depth++;
    if (char === ']') {
      depth--;
      if (depth === 0) {
        arrayEnd = i + 1;
        break;
      }
    }
  }

  if (arrayEnd === -1) throw new Error('Could not find end of vendors array');

  const arrayStr = content.substring(content.indexOf('[', arrayStart), arrayEnd);

  const sandbox = { result: null as any };
  vm.createContext(sandbox);
  vm.runInContext(`result = ${arrayStr}`, sandbox);

  return sandbox.result;
}

// ============================================
// Generate vendor price URL
// ============================================
function generateVendorUrl(vendorId: string, productName: string, vendorBaseUrl: string): string {
  const searchTerm = encodeURIComponent(productName);

  switch (vendorId) {
    case 'nike': return `https://nike.com/w?q=${searchTerm}`;
    case 'footlocker': return `https://footlocker.com/search?query=${searchTerm}`;
    case 'finishline': return `https://finishline.com/store/browse/search.jsp?searchTerm=${searchTerm}`;
    case 'champssports': return `https://champssports.com/search?query=${searchTerm}`;
    case 'jdsports': return `https://jdsports.com/search/${searchTerm}`;
    case 'dickssporting': return `https://dickssportinggoods.com/search/SearchDisplay?searchTerm=${searchTerm}`;
    case 'stockx': return `https://stockx.com/search?s=${searchTerm}`;
    case 'goat': return `https://goat.com/search?query=${searchTerm}`;
    case 'ebay': return `https://ebay.com/sch/i.html?_nkw=${searchTerm}`;
    case 'flightclub': return `https://flightclub.com/search?q=${searchTerm}`;
    default: return `${vendorBaseUrl}/search?q=${searchTerm}`;
  }
}

// Seeded random matching the original products.js logic
function seededRandom(seed: number, index: number): number {
  const x = Math.sin(seed * 9999 + index * 7777) * 10000;
  return x - Math.floor(x);
}

// ============================================
// Main seed function
// ============================================
async function main() {
  console.log('🌱 KicksList Database Seeder');
  console.log('============================\n');

  // Parse source data files
  console.log('📂 Parsing data files...');
  const rawProducts = parseProductsFile();
  const rawVendors = parseVendorsFile();
  console.log(`  Found ${rawProducts.length} products`);
  console.log(`  Found ${rawVendors.length} vendors\n`);

  // Seed Vendors
  console.log('🏪 Seeding vendors...');
  for (const vendor of rawVendors) {
    await prisma.vendor.upsert({
      where: { id: vendor.id },
      update: {
        name: vendor.name,
        color: vendor.color || null,
        trustRating: vendor.trustRating || null,
        reviewCount: vendor.trustCount || 0,
        url: vendor.url || null,
        type: vendor.type as VendorType,
        description: vendor.description || null,
        isActive: true,
      },
      create: {
        id: vendor.id,
        name: vendor.name,
        color: vendor.color || null,
        trustRating: vendor.trustRating || null,
        reviewCount: vendor.trustCount || 0,
        url: vendor.url || null,
        type: vendor.type as VendorType,
        description: vendor.description || null,
        isActive: true,
      },
    });
  }
  console.log(`  ✓ ${rawVendors.length} vendors seeded\n`);

  // Seed Products
  console.log('👟 Seeding products...');
  let productCount = 0;
  const batchSize = 50;

  for (let i = 0; i < rawProducts.length; i += batchSize) {
    const batch = rawProducts.slice(i, i + batchSize);

    for (const rawProduct of batch) {
      const releaseDate = rawProduct.releaseDate
        ? new Date(rawProduct.releaseDate)
        : null;

      // Validate the date
      const validReleaseDate = releaseDate && !isNaN(releaseDate.getTime())
        ? releaseDate
        : null;

      await prisma.product.upsert({
        where: { id: rawProduct.id },
        update: {
          name: rawProduct.name,
          brand: rawProduct.brand,
          category: rawProduct.category,
          retailPrice: rawProduct.retail || null,
          currentLowestPrice: rawProduct.price || null,
          releaseDate: validReleaseDate,
          description: rawProduct.description || null,
          images: rawProduct.images || [],
          isFeatured: rawProduct.featured || false,
          isTrending: rawProduct.trending || false,
          badge: rawProduct.badge || null,
        },
        create: {
          id: rawProduct.id,
          name: rawProduct.name,
          brand: rawProduct.brand,
          category: rawProduct.category,
          retailPrice: rawProduct.retail || null,
          currentLowestPrice: rawProduct.price || null,
          releaseDate: validReleaseDate,
          description: rawProduct.description || null,
          images: rawProduct.images || [],
          isFeatured: rawProduct.featured || false,
          isTrending: rawProduct.trending || false,
          badge: rawProduct.badge || null,
        },
      });

      productCount++;
    }

    console.log(`  Seeded ${Math.min(i + batchSize, rawProducts.length)}/${rawProducts.length} products...`);
  }
  console.log(`  ✓ ${productCount} products seeded\n`);

  // Seed VendorPrices (generate for each product × vendor combo)
  console.log('💰 Seeding vendor prices...');
  let vendorPriceCount = 0;

  const retailVendors = rawVendors.filter((v: any) => v.type === 'retail');
  const resaleVendors = rawVendors.filter((v: any) => v.type === 'resale');

  for (let i = 0; i < rawProducts.length; i++) {
    const product = rawProducts[i];
    const basePrice = product.price;
    const retailPrice = product.retail;
    const productId = product.id;

    // Generate retail vendor prices
    for (let j = 0; j < retailVendors.length; j++) {
      const vendor = retailVendors[j];
      const rand = seededRandom(productId, j);
      const inStock = rand > 0.6;
      let price = retailPrice;
      if (rand > 0.85) {
        price = Math.round(retailPrice * (0.85 + rand * 0.1));
      }

      const url = generateVendorUrl(vendor.id, product.name, vendor.url);

      await prisma.vendorPrice.upsert({
        where: {
          productId_vendorId: { productId, vendorId: vendor.id },
        },
        update: {
          price: price || null,
          url,
          inStock,
          lastFetchedAt: new Date(),
        },
        create: {
          productId,
          vendorId: vendor.id,
          price: price || null,
          url,
          inStock,
        },
      });
      vendorPriceCount++;
    }

    // Generate resale vendor prices
    for (let j = 0; j < resaleVendors.length; j++) {
      const vendor = resaleVendors[j];
      const rand = seededRandom(productId, j + 100);
      const variance = (rand - 0.5) * 0.3;
      let price = Math.round(basePrice * (1 + variance));
      if (vendor.id === 'flightclub') price = Math.round(price * 1.12);
      else if (vendor.id === 'goat') price = Math.round(price * 0.97);
      const inStock = rand > 0.1;

      const url = generateVendorUrl(vendor.id, product.name, vendor.url);

      await prisma.vendorPrice.upsert({
        where: {
          productId_vendorId: { productId, vendorId: vendor.id },
        },
        update: {
          price: price || null,
          url,
          inStock,
          lastFetchedAt: new Date(),
        },
        create: {
          productId,
          vendorId: vendor.id,
          price: price || null,
          url,
          inStock,
        },
      });
      vendorPriceCount++;
    }

    if ((i + 1) % 100 === 0 || i === rawProducts.length - 1) {
      console.log(`  Generated prices for ${i + 1}/${rawProducts.length} products...`);
    }
  }
  console.log(`  ✓ ${vendorPriceCount} vendor prices seeded\n`);

  // Seed Feed Sources
  console.log('📡 Seeding feed sources...');

  await prisma.feedSource.upsert({
    where: { id: 'kicksdb-stockx' },
    update: {
      name: 'KicksDB - StockX',
      adapterType: 'kicksdb',
      isActive: true,
      syncInterval: 1440, // 24 hours
      config: {
        endpoint: '/v3/stockx/products',
        sourceName: 'kicksdb-stockx',
        limit: 50,
        maxPages: 4,
      },
    },
    create: {
      id: 'kicksdb-stockx',
      name: 'KicksDB - StockX',
      adapterType: 'kicksdb',
      isActive: true,
      syncInterval: 1440,
      config: {
        endpoint: '/v3/stockx/products',
        sourceName: 'kicksdb-stockx',
        limit: 50,
        maxPages: 4,
      },
    },
  });

  await prisma.feedSource.upsert({
    where: { id: 'kicksdb-goat' },
    update: {
      name: 'KicksDB - GOAT',
      adapterType: 'kicksdb',
      isActive: true,
      syncInterval: 1440,
      config: {
        endpoint: '/v3/goat/products',
        sourceName: 'kicksdb-goat',
        limit: 50,
        maxPages: 4,
      },
    },
    create: {
      id: 'kicksdb-goat',
      name: 'KicksDB - GOAT',
      adapterType: 'kicksdb',
      isActive: true,
      syncInterval: 1440,
      config: {
        endpoint: '/v3/goat/products',
        sourceName: 'kicksdb-goat',
        limit: 50,
        maxPages: 4,
      },
    },
  });

  console.log('  ✓ 2 feed sources seeded\n');

  // Summary
  const totalProducts = await prisma.product.count();
  const totalVendors = await prisma.vendor.count();
  const totalVendorPrices = await prisma.vendorPrice.count();
  const totalFeedSources = await prisma.feedSource.count();

  console.log('============================');
  console.log('✅ Seeding complete!');
  console.log(`  Products:      ${totalProducts}`);
  console.log(`  Vendors:       ${totalVendors}`);
  console.log(`  Vendor Prices: ${totalVendorPrices}`);
  console.log(`  Feed Sources:  ${totalFeedSources}`);
  console.log('============================\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

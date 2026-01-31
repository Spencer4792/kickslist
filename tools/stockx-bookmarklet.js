/**
 * StockX Product Extractor Bookmarklet
 *
 * Extracts sneaker data from a StockX product page and copies it as CSV.
 *
 * To install:
 * 1. Create a new bookmark in your browser
 * 2. Name it "Extract Sneaker"
 * 3. For the URL, paste the minified bookmarklet code below
 *
 * To use:
 * 1. Go to any StockX product page (e.g., stockx.com/air-jordan-1-retro-high-og-chicago)
 * 2. Click the bookmarklet
 * 3. Data is copied to clipboard as a CSV row
 * 4. Paste into your CSV file
 */

(function() {
  // Try to get JSON-LD structured data first (most reliable)
  let data = {};

  const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
  for (const script of jsonLdScripts) {
    try {
      const json = JSON.parse(script.textContent);
      if (json['@type'] === 'Product' || (Array.isArray(json) && json[0]?.['@type'] === 'Product')) {
        const product = Array.isArray(json) ? json[0] : json;
        data = {
          name: product.name || '',
          brand: product.brand?.name || '',
          description: product.description || '',
          image: product.image?.[0] || product.image || '',
          price: product.offers?.lowPrice || product.offers?.price || '',
          sku: product.sku || ''
        };
        break;
      }
    } catch (e) {}
  }

  // Fallback: scrape from DOM
  if (!data.name) {
    // Product name - try multiple selectors
    const nameEl = document.querySelector('[data-testid="product-name"]') ||
                   document.querySelector('h1[data-component="primary-product-title"]') ||
                   document.querySelector('h1');
    data.name = nameEl?.textContent?.trim() || '';
  }

  if (!data.brand) {
    // Brand detection from page or URL
    const brandEl = document.querySelector('[data-testid="product-brand"]') ||
                    document.querySelector('[data-component="secondary-product-title"]');
    data.brand = brandEl?.textContent?.trim() || '';

    // Detect from product name if not found
    if (!data.brand && data.name) {
      const nameLower = data.name.toLowerCase();
      if (nameLower.includes('jordan') || nameLower.includes('aj1') || nameLower.includes('aj4')) {
        data.brand = 'Jordan';
      } else if (nameLower.includes('yeezy')) {
        data.brand = 'Yeezy';
      } else if (nameLower.includes('new balance')) {
        data.brand = 'New Balance';
      } else if (nameLower.includes('adidas') || nameLower.includes('samba')) {
        data.brand = 'Adidas';
      } else if (nameLower.includes('nike') || nameLower.includes('dunk') || nameLower.includes('air max') || nameLower.includes('air force')) {
        data.brand = 'Nike';
      }
    }
  }

  if (!data.image) {
    // Get main product image
    const imgEl = document.querySelector('[data-testid="product-media"] img') ||
                  document.querySelector('.product-media img') ||
                  document.querySelector('img[src*="images.stockx.com"]');
    data.image = imgEl?.src || '';
    // Clean up image URL - get highest quality
    if (data.image && data.image.includes('?')) {
      data.image = data.image.split('?')[0] + '?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90';
    }
  }

  // Get prices
  const priceEl = document.querySelector('[data-testid="product-detail-price"]') ||
                  document.querySelector('[data-component="primary-price"]') ||
                  document.querySelector('.sale-price');
  const priceText = priceEl?.textContent || '';
  const priceMatch = priceText.match(/\$?([\d,]+)/);
  data.price = priceMatch ? priceMatch[1].replace(',', '') : data.price || '';

  // Get retail price
  const retailEl = document.querySelector('[data-testid="product-detail-retail-price"]') ||
                   Array.from(document.querySelectorAll('span')).find(el =>
                     el.textContent?.toLowerCase().includes('retail'));
  if (retailEl) {
    const retailMatch = retailEl.textContent.match(/\$?([\d,]+)/);
    data.retail = retailMatch ? retailMatch[1].replace(',', '') : '';
  }
  data.retail = data.retail || data.price;

  // Get release date
  const dateEl = document.querySelector('[data-testid="product-detail-release-date"]') ||
                 Array.from(document.querySelectorAll('span, p')).find(el =>
                   el.textContent?.match(/release/i) && el.textContent?.match(/\d{1,2}\/\d{1,2}\/\d{2,4}|\w+ \d{1,2}, \d{4}/i));
  if (dateEl) {
    const dateMatch = dateEl.textContent.match(/(\d{1,2}\/\d{1,2}\/\d{2,4})|(\w+ \d{1,2}, \d{4})/i);
    if (dateMatch) {
      try {
        const d = new Date(dateMatch[0]);
        if (!isNaN(d.getTime())) {
          data.releaseDate = d.toISOString().split('T')[0];
        }
      } catch(e) {}
    }
  }
  data.releaseDate = data.releaseDate || '';

  // Get description from meta or page
  if (!data.description) {
    const metaDesc = document.querySelector('meta[name="description"]');
    data.description = metaDesc?.content || '';
  }

  // Determine category from brand
  let category = 'other';
  const brandLower = (data.brand || '').toLowerCase();
  const nameLower = (data.name || '').toLowerCase();
  if (brandLower.includes('jordan') || nameLower.includes('jordan')) {
    category = 'jordan';
  } else if (brandLower.includes('yeezy') || nameLower.includes('yeezy')) {
    category = 'yeezy';
  } else if (brandLower.includes('new balance') || nameLower.includes('new balance')) {
    category = 'new-balance';
  } else if (brandLower.includes('adidas') || nameLower.includes('adidas')) {
    category = 'adidas';
  } else if (brandLower.includes('nike') || nameLower.includes('nike') || nameLower.includes('dunk') || nameLower.includes('air')) {
    category = 'nike';
  }

  // Clean description for CSV
  data.description = (data.description || '')
    .replace(/[\r\n]+/g, ' ')
    .replace(/"/g, "'")
    .substring(0, 300);

  // Format as CSV row
  const escapeCSV = (val) => {
    const str = String(val || '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  };

  const csvRow = [
    escapeCSV(data.name),
    escapeCSV(data.brand),
    escapeCSV(category),
    escapeCSV(data.price),
    escapeCSV(data.retail),
    escapeCSV(data.releaseDate),
    escapeCSV(data.description),
    escapeCSV(data.image),
    'true',  // inStock
    'false', // featured
    'false'  // trending
  ].join(',');

  // Copy to clipboard
  navigator.clipboard.writeText(csvRow).then(() => {
    // Show success notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:16px 24px;border-radius:8px;z-index:99999;font-family:system-ui;box-shadow:0 4px 12px rgba(0,0,0,0.3);max-width:400px;">
        <div style="font-weight:bold;margin-bottom:8px;">✓ Sneaker Copied!</div>
        <div style="font-size:14px;opacity:0.9;">${data.name || 'Unknown'}</div>
        <div style="font-size:12px;margin-top:4px;opacity:0.7;">${data.brand} · $${data.price}</div>
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }).catch(err => {
    // Fallback: show data in prompt
    prompt('Copy this CSV row:', csvRow);
  });

  // Also log to console for debugging
  console.log('Extracted sneaker data:', data);
  console.log('CSV row:', csvRow);
})();

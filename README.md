# KicksList

> Discover & Shop Authentic Sneakers

Compare prices on 20,000+ sneakers from trusted retailers and resale marketplaces. Find the best deal on Jordan, Nike, Adidas, Yeezy, New Balance, and more — all in one place.

**Live at [kickslist.net](https://kickslist.net)**

---

## Features

- **Price Comparison** — See prices from StockX, GOAT, Foot Locker, JD Sports, and other retailers side by side
- **20,000+ Products** — Nike, Jordan, Adidas, Yeezy, New Balance, Puma, UGG, Crocs, Birkenstock, and more
- **Search & Filter** — Find sneakers by name, brand, or category
- **Brand Pages** — Browse curated collections for each brand
- **Product Details** — View images, retail prices, and direct links to buy
- **New Drops** — See the latest releases across all brands
- **Mobile Responsive** — Works on any device

---

## Tech Stack

- **Frontend:** React (via HTM/Preact), single-page app
- **Hosting:** GitHub Pages with custom domain
- **Data:** Static product database (20,000+ entries)
- **Analytics:** Google Analytics 4
- **SEO:** Sitemap, robots.txt, structured data (JSON-LD)

---

## Project Structure

```
kickslist/
├── docs/                # Deployed site (GitHub Pages)
│   ├── index.html       # Main app entry point
│   ├── app/             # React components
│   │   └── main.jsx     # App logic, routing, UI
│   ├── data/
│   │   ├── products.js  # Product database
│   │   └── vendors.js   # Retailer configs & affiliate setup
│   ├── styles/          # CSS
│   ├── robots.txt       # Bot crawl rules
│   ├── sitemap.xml      # Search engine sitemap
│   └── CNAME            # Custom domain config
├── tools/               # Data pipeline scripts
│   ├── scrape-brands.js # Multi-brand sitemap scraper (12 sources)
│   ├── scrape-nike.js   # Nike sitemap scraper
│   ├── fetch-sneakers.js# Single-query sneaker fetcher
│   └── import-products.js# CSV to products.js importer
├── data/                # Source product data
├── app/                 # Source app code
└── package.json
```

---

## Scraping Tools

The `tools/` directory contains scripts for building the product database:

```bash
# Scrape from brand sites (Nike, Adidas, Puma, Reebok, etc.)
node tools/scrape-brands.js --brands nike,adidas,puma

# Scrape from multi-brand retailers (Stadium Goods, Foot Locker, Journeys)
node tools/scrape-brands.js --brands stadiumgoods,footlocker,journeys

# Dry run (preview without writing)
node tools/scrape-brands.js --brands nike --dry-run

# List all available brands
node tools/scrape-brands.js --list
```

### Supported Sources

| Source | Type | Method |
|--------|------|--------|
| Nike | Brand site | Sitemap + JSON-LD |
| Adidas | Brand site | Sitemap + JSON-LD |
| Puma | Brand site | Sitemap + JSON-LD |
| New Balance | Brand site | Sitemap + Shopify JSON |
| Reebok | Brand site | Sitemap + Shopify JSON |
| Crocs | Brand site | Sitemap + JSON-LD |
| UGG | Brand site | Sitemap + JSON-LD |
| Dr. Martens | Brand site | Sitemap + Shopify JSON |
| Merrell | Brand site | Sitemap + Shopify JSON |
| Stadium Goods | Retailer | Shopify Bulk API |
| Foot Locker | Retailer | Sitemap + JSON-LD |
| Journeys | Retailer | Sitemap + Custom (maProductJson) |

---

## Local Development

```bash
npm install
npm start
# Opens at http://localhost:3000
```

---

## License

MIT

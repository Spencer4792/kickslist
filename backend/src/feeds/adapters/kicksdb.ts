import { FeedAdapter, FeedResult, NormalizedProduct, NormalizedVendorPrice } from "../types";

const KICKSDB_BASE_URL = "https://api.kicks.dev";

/**
 * Unified interface covering both StockX and GOAT response fields.
 * StockX uses: title, image, gallery, min_price, secondary_title, breadcrumbs
 * GOAT uses:   name, image_url, images, colorway, retail_prices, category
 */
interface KicksDBProduct {
  id: string | number;
  // StockX: title, GOAT: name
  title?: string;
  name?: string;
  brand: string;
  model?: string;
  gender?: string;
  description?: string;
  // StockX: image, GOAT: image_url
  image?: string;
  image_url?: string;
  sku?: string;
  slug?: string;
  product_type?: string;
  category?: string;
  secondary_category?: string;
  categories?: string[];
  breadcrumbs?: { value: string; alias: string; level: number }[];
  // StockX: gallery, GOAT: images
  gallery?: string[];
  images?: string[];
  link?: string;
  rank?: number;
  weekly_orders?: number;
  // StockX fields
  primary_title?: string;
  secondary_title?: string;
  min_price?: number;
  max_price?: number;
  avg_price?: number;
  short_description?: string;
  upcoming?: boolean;
  // GOAT fields
  colorway?: string;
  season?: string;
  release_date?: string;
  retail_prices?: number | null;
  // Common
  created_at?: string;
  updated_at?: string;
}

interface KicksDBResponse {
  data: KicksDBProduct[];
  meta?: {
    total?: number;
    current_page?: number;
    per_page?: number;
  };
}

function categorizeProduct(raw: KicksDBProduct): string {
  // Use breadcrumbs for StockX (more accurate subcategory)
  if (raw.breadcrumbs && raw.breadcrumbs.length >= 2) {
    const subcategory = raw.breadcrumbs[1]?.value;
    if (subcategory) return subcategory;
  }

  // Use product_type for categorization
  if (raw.product_type) {
    const type = raw.product_type.toLowerCase();
    if (type === "sneakers" || type === "shoes") return "Sneakers";
    if (type === "tops" || type === "bottoms" || type === "outerwear") return "Apparel";
    if (type === "accessories") return "Accessories";
    return raw.product_type.charAt(0).toUpperCase() + raw.product_type.slice(1);
  }

  const title = (raw.title || raw.name || "").toLowerCase();
  if (title.includes("slide") || title.includes("sandal")) return "Slides & Sandals";
  if (title.includes("boot")) return "Boots";
  return "Sneakers";
}

/**
 * Determine vendor ID from the source endpoint.
 */
function vendorIdFromEndpoint(endpoint: string): string {
  if (endpoint.includes("/stockx/")) return "stockx";
  if (endpoint.includes("/goat/")) return "goat";
  if (endpoint.includes("/flightclub/")) return "flightclub";
  return "stockx";
}

function normalizeProduct(
  raw: KicksDBProduct,
  sourceName: string,
  vendorId: string
): NormalizedProduct {
  const vendorPrices: NormalizedVendorPrice[] = [];
  const productName = raw.title || raw.name || "";

  // StockX provides min_price; GOAT provides retail_prices
  const price = raw.min_price ?? raw.retail_prices ?? null;
  const link = raw.link || null;

  if (price != null && price > 0 && link) {
    vendorPrices.push({
      vendorId,
      price,
      url: link,
      inStock: true,
      isAffiliateUrl: link.includes("pvxt.net") || link.includes("sjv.io") || link.includes("goto.target"),
    });
  }

  // Parse release/created date
  const dateStr = raw.release_date || raw.created_at || null;
  const parsedDate = dateStr ? new Date(dateStr) : null;
  const validDate = parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate : null;

  // Build image list from whichever fields are available
  const imageList: string[] = [];
  const mainImage = raw.image || raw.image_url || null;
  if (mainImage) imageList.push(mainImage);

  // StockX uses gallery, GOAT uses images
  const extraImages = raw.gallery || raw.images || [];
  for (const img of extraImages) {
    if (img && !imageList.includes(img)) imageList.push(img);
  }

  // Colorway: StockX uses secondary_title, GOAT uses colorway directly
  const colorway = raw.colorway || raw.secondary_title || null;

  return {
    sourceId: String(raw.id),
    sourceName,
    name: productName,
    brand: raw.brand || "Unknown",
    category: categorizeProduct(raw),
    sku: raw.sku || null,
    styleId: raw.sku || null,
    slug: raw.slug || null,
    colorway,
    gender: raw.gender || null,
    retailPrice: raw.retail_prices ?? null,
    releaseDate: validDate,
    description: raw.description || raw.short_description || null,
    images: imageList,
    vendorPrices,
  };
}

async function fetchPage(
  endpoint: string,
  apiKey: string,
  page: number,
  limit: number
): Promise<KicksDBResponse> {
  const url = `${KICKSDB_BASE_URL}${endpoint}?page=${page}&limit=${limit}`;
  const response = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`KicksDB API error ${response.status}: ${text}`);
  }

  return response.json() as Promise<KicksDBResponse>;
}

export class KicksDBAdapter implements FeedAdapter {
  readonly name = "kicksdb";

  async fetch(config: Record<string, unknown>): Promise<FeedResult> {
    const apiKey = (config.apiKey as string) || process.env.KICKSDB_API_KEY;
    if (!apiKey) {
      return { products: [], totalFetched: 0, errors: ["KICKSDB_API_KEY not configured"] };
    }

    const endpoint = (config.endpoint as string) || "/v3/stockx/products";
    const sourceName = (config.sourceName as string) || "kicksdb-stockx";
    const limit = (config.limit as number) || 50;
    const maxPages = (config.maxPages as number) || 4;
    const vendorId = vendorIdFromEndpoint(endpoint);

    const products: NormalizedProduct[] = [];
    const errors: string[] = [];

    for (let page = 1; page <= maxPages; page++) {
      try {
        const data = await fetchPage(endpoint, apiKey, page, limit);

        if (!data.data || data.data.length === 0) break;

        for (const raw of data.data) {
          try {
            products.push(normalizeProduct(raw, sourceName, vendorId));
          } catch (err) {
            errors.push(`Failed to normalize product ${raw.id}: ${err}`);
          }
        }

        if (data.data.length < limit) break;
      } catch (err) {
        errors.push(`Failed to fetch page ${page} from ${endpoint}: ${err}`);
        break;
      }
    }

    return {
      products,
      totalFetched: products.length,
      errors,
    };
  }
}

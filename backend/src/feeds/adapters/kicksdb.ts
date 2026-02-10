import { FeedAdapter, FeedResult, NormalizedProduct, NormalizedVendorPrice } from "../types";

const KICKSDB_BASE_URL = "https://api.kicks.dev";

interface KicksDBProduct {
  id: string;
  name: string;
  brand: string;
  sku: string;
  slug: string;
  colorway: string;
  gender: string;
  retailPrice: number;
  releaseDate: string;
  description: string;
  image: string;
  thumbnail: string;
  links: {
    stockX?: string;
    goat?: string;
    flightClub?: string;
  };
  lowestResellPrice?: {
    stockX?: number;
    goat?: number;
    flightClub?: number;
  };
}

interface KicksDBResponse {
  count: number;
  results: KicksDBProduct[];
}

function categorizeFromName(name: string, brand: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("dunk") || lower.includes("force 1") || lower.includes("jordan 1")) return "Lifestyle";
  if (lower.includes("run") || lower.includes("pegasus") || lower.includes("ultraboost")) return "Running";
  if (lower.includes("slide") || lower.includes("foam")) return "Slides";
  if (brand.toLowerCase() === "new balance") return "Lifestyle";
  return "Lifestyle";
}

function normalizeProduct(
  raw: KicksDBProduct,
  sourceName: string
): NormalizedProduct {
  const vendorPrices: NormalizedVendorPrice[] = [];

  if (raw.lowestResellPrice?.stockX != null && raw.links?.stockX) {
    vendorPrices.push({
      vendorId: "stockx",
      price: raw.lowestResellPrice.stockX,
      url: raw.links.stockX,
      inStock: raw.lowestResellPrice.stockX > 0,
      isAffiliateUrl: false,
    });
  }

  if (raw.lowestResellPrice?.goat != null && raw.links?.goat) {
    vendorPrices.push({
      vendorId: "goat",
      price: raw.lowestResellPrice.goat,
      url: raw.links.goat,
      inStock: raw.lowestResellPrice.goat > 0,
      isAffiliateUrl: false,
    });
  }

  if (raw.lowestResellPrice?.flightClub != null && raw.links?.flightClub) {
    vendorPrices.push({
      vendorId: "flightclub",
      price: raw.lowestResellPrice.flightClub,
      url: raw.links.flightClub,
      inStock: raw.lowestResellPrice.flightClub > 0,
      isAffiliateUrl: false,
    });
  }

  const releaseDate = raw.releaseDate ? new Date(raw.releaseDate) : null;
  const validReleaseDate = releaseDate && !isNaN(releaseDate.getTime()) ? releaseDate : null;

  const images: string[] = [];
  if (raw.image) images.push(raw.image);
  if (raw.thumbnail && raw.thumbnail !== raw.image) images.push(raw.thumbnail);

  return {
    sourceId: raw.id,
    sourceName,
    name: raw.name,
    brand: raw.brand || "Unknown",
    category: categorizeFromName(raw.name, raw.brand),
    sku: raw.sku || null,
    styleId: raw.sku || null,
    slug: raw.slug || null,
    colorway: raw.colorway || null,
    gender: raw.gender || null,
    retailPrice: raw.retailPrice || null,
    releaseDate: validReleaseDate,
    description: raw.description || null,
    images,
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
    const maxPages = (config.maxPages as number) || 4; // 4 pages × 50 = 200 products

    const products: NormalizedProduct[] = [];
    const errors: string[] = [];

    for (let page = 1; page <= maxPages; page++) {
      try {
        const data = await fetchPage(endpoint, apiKey, page, limit);

        if (!data.results || data.results.length === 0) break;

        for (const raw of data.results) {
          try {
            products.push(normalizeProduct(raw, sourceName));
          } catch (err) {
            errors.push(`Failed to normalize product ${raw.id}: ${err}`);
          }
        }

        // If we got fewer results than the limit, we've reached the end
        if (data.results.length < limit) break;
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

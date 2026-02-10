export interface NormalizedVendorPrice {
  vendorId: string; // must match existing Vendor.id (e.g. "stockx", "goat")
  price: number | null;
  url: string;
  inStock: boolean;
  isAffiliateUrl: boolean;
}

export interface NormalizedProduct {
  sourceId: string; // unique ID from the source (e.g. KicksDB product ID)
  sourceName: string; // e.g. "kicksdb-stockx", "kicksdb-goat"
  name: string;
  brand: string;
  category: string;
  sku: string | null; // style ID like "DD1391-100"
  styleId: string | null;
  slug: string | null;
  colorway: string | null;
  gender: string | null;
  retailPrice: number | null;
  releaseDate: Date | null;
  description: string | null;
  images: string[];
  vendorPrices: NormalizedVendorPrice[];
}

export interface FeedResult {
  products: NormalizedProduct[];
  totalFetched: number;
  errors: string[];
}

export interface FeedAdapter {
  readonly name: string;
  fetch(config: Record<string, unknown>): Promise<FeedResult>;
}

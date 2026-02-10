export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  sku?: string;
  retailPrice: number | null;
  currentLowestPrice: number | null;
  releaseDate: string | null;
  description: string | null;
  images: string[];
  isFeatured: boolean;
  isTrending: boolean;
  badge?: string | null;
  vendorPrices?: VendorPrice[];
}

export interface Vendor {
  id: string;
  name: string;
  logoUrl?: string;
  color?: string;
  trustRating: number;
  reviewCount: number;
  url?: string;
  type: 'retail' | 'resale';
  description?: string;
  isActive: boolean;
}

export interface VendorPrice {
  id: number;
  productId: number;
  vendorId: string;
  price: number | null;
  url: string;
  lastFetchedAt: string;
  inStock: boolean;
  vendor: Vendor;
}

export interface Brand {
  name: string;
  category: string;
  count: number;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  subscriptionTier: 'free' | 'pro';
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  ProductDetail: { productId: number };
  BrandDetail: { brand: string; category: string };
  Auth: undefined;
  Paywall: undefined;
};

export interface SubscriptionInfo {
  plan: 'monthly' | 'yearly';
  status: 'active' | 'cancelled' | 'expired';
  currentPeriodEnd: string;
}

export type TabParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  MarketplaceTab: undefined;
  AlertsTab: undefined;
  ProfileTab: undefined;
};

export interface PriceAlert {
  id: number;
  productId: number;
  targetPrice: number;
  isTriggered: boolean;
  triggeredAt: string | null;
  triggeredPrice: number | null;
  createdAt: string;
  product: {
    id: number;
    name: string;
    brand: string;
    images: string[];
    currentLowestPrice: number | null;
    retailPrice: number | null;
  };
}

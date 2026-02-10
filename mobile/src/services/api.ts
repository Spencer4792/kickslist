import axios from 'axios';
import { Product, Vendor, Brand, AuthResponse, User, PriceAlert, DropAlert, CreateDropAlertPayload, SubscriptionInfo } from '../types';
import { tokenStorage } from './tokenStorage';

const API_BASE_URL = __DEV__ ? 'http://localhost:3001/api' : 'https://api.kickslist.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor: attach Bearer token
api.interceptors.request.use(async (config) => {
  const token = await tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401 with token refresh
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await tokenStorage.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
        await tokenStorage.setAccessToken(data.accessToken);
        await tokenStorage.setRefreshToken(data.refreshToken);

        processQueue(null, data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        await tokenStorage.clearTokens();
        throw refreshError;
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export interface PaginatedResponse<T> {
  products: T[];
  total: number;
  page: number;
  totalPages: number;
}

export const productsApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    brand?: string;
    category?: string;
    sort?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => api.get<PaginatedResponse<Product>>('/products', { params }),

  getById: (id: number) => api.get<{ product: Product }>(`/products/${id}`),

  getFeatured: () => api.get<{ products: Product[] }>('/products/featured'),

  getTrending: () => api.get<{ products: Product[] }>('/products/trending'),

  getRelated: (id: number) => api.get<{ products: Product[] }>(`/products/${id}/related`),

  search: (q: string) => api.get<{ products: Product[]; total: number }>('/search', { params: { q } }),
};

export const brandsApi = {
  getAll: () => api.get<{ brands: Brand[] }>('/brands'),
};

export const vendorsApi = {
  getAll: () => api.get<{ vendors: Vendor[] }>('/vendors'),
};

export const categoriesApi = {
  getAll: () => api.get<{ categories: { name: string; count: number }[] }>('/categories'),
};

export const authApi = {
  register: (data: { email: string; password: string; name?: string }) =>
    api.post<AuthResponse>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),

  refresh: (refreshToken: string) =>
    api.post<{ accessToken: string; refreshToken: string }>('/auth/refresh', { refreshToken }),

  logout: () => api.post('/auth/logout'),

  me: () => api.get<{ user: User }>('/auth/me'),
};

export const wishlistApi = {
  getAll: () => api.get<{ wishlist: Array<{ productId: number; product: Product }> }>('/wishlist'),

  add: (productId: number) => api.post(`/wishlist/${productId}`),

  remove: (productId: number) => api.delete(`/wishlist/${productId}`),

  sync: (productIds: number[]) =>
    api.post<{ wishlist: Array<{ productId: number; product: Product }> }>('/wishlist/sync', { productIds }),
};

export const priceAlertsApi = {
  getAll: () => api.get<{ alerts: PriceAlert[] }>('/price-alerts'),

  create: (productId: number, targetPrice: number) =>
    api.post<{ alert: PriceAlert }>('/price-alerts', { productId, targetPrice }),

  delete: (alertId: number) => api.delete(`/price-alerts/${alertId}`),

  getCount: () => api.get<{ count: number }>('/price-alerts/count'),
};

export const dropAlertsApi = {
  getAll: () => api.get<{ alerts: DropAlert[] }>('/drop-alerts'),

  create: (data: CreateDropAlertPayload) =>
    api.post<{ alert: DropAlert }>('/drop-alerts', data),

  delete: (alertId: number) => api.delete(`/drop-alerts/${alertId}`),
};

export const pushTokenApi = {
  register: (pushToken: string) => api.put('/auth/push-token', { pushToken }),
};

export const subscriptionApi = {
  getStatus: () =>
    api.get<{ tier: 'free' | 'pro'; subscription: SubscriptionInfo | null }>('/subscription'),
};

export default api;

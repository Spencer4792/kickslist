import { create } from 'zustand';
import { User, PriceAlert, DropAlert, CreateDropAlertPayload, SubscriptionInfo } from '../types';
import { authApi, wishlistApi, priceAlertsApi, dropAlertsApi, subscriptionApi } from '../services/api';
import { tokenStorage } from '../services/tokenStorage';
import { checkProEntitlement, logoutPurchases } from '../services/purchases';

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;

  // Wishlist
  wishlist: number[];

  // Price Alerts
  alerts: PriceAlert[];
  isAlertsLoading: boolean;

  // Drop Alerts
  dropAlerts: DropAlert[];
  isDropAlertsLoading: boolean;

  // Subscription
  subscription: SubscriptionInfo | null;

  // Search
  searchQuery: string;

  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;

  // Wishlist actions
  toggleWishlist: (productId: number) => void;
  isWishlisted: (productId: number) => boolean;

  // Price Alert actions
  fetchAlerts: () => Promise<void>;
  createAlert: (productId: number, targetPrice: number) => Promise<void>;
  deleteAlert: (alertId: number) => Promise<void>;
  hasActiveAlertForProduct: (productId: number) => boolean;
  activeAlertCount: () => number;

  // Drop Alert actions
  fetchDropAlerts: () => Promise<void>;
  createDropAlert: (data: CreateDropAlertPayload) => Promise<void>;
  deleteDropAlert: (alertId: number) => Promise<void>;

  // Subscription actions
  syncSubscription: () => Promise<void>;

  // Search actions
  setSearchQuery: (query: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isAuthLoading: true,
  wishlist: [],
  alerts: [],
  isAlertsLoading: false,
  dropAlerts: [],
  isDropAlertsLoading: false,
  subscription: null,
  searchQuery: '',

  login: async (email, password) => {
    const { data } = await authApi.login({ email, password });
    await tokenStorage.setAccessToken(data.accessToken);
    await tokenStorage.setRefreshToken(data.refreshToken);
    set({ user: data.user, isAuthenticated: true });

    // Sync local wishlist to server
    const localWishlist = get().wishlist;
    if (localWishlist.length > 0) {
      try {
        const { data: syncData } = await wishlistApi.sync(localWishlist);
        set({ wishlist: syncData.wishlist.map((w) => w.productId) });
      } catch {
        // Keep local wishlist on sync failure
      }
    } else {
      // Load server wishlist
      try {
        const { data: wlData } = await wishlistApi.getAll();
        set({ wishlist: wlData.wishlist.map((w) => w.productId) });
      } catch {
        // Keep empty wishlist on failure
      }
    }

    // Load alerts
    get().fetchAlerts();
    get().fetchDropAlerts();

    // Sync subscription
    get().syncSubscription();
  },

  register: async (email, password, name) => {
    const { data } = await authApi.register({ email, password, name });
    await tokenStorage.setAccessToken(data.accessToken);
    await tokenStorage.setRefreshToken(data.refreshToken);
    set({ user: data.user, isAuthenticated: true });

    // Sync local wishlist to server
    const localWishlist = get().wishlist;
    if (localWishlist.length > 0) {
      try {
        const { data: syncData } = await wishlistApi.sync(localWishlist);
        set({ wishlist: syncData.wishlist.map((w) => w.productId) });
      } catch {
        // Keep local wishlist on sync failure
      }
    }

    // Load alerts
    get().fetchAlerts();
    get().fetchDropAlerts();

    // Sync subscription
    get().syncSubscription();
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout API errors
    }
    try {
      await logoutPurchases();
    } catch {
      // Ignore RevenueCat logout errors
    }
    await tokenStorage.clearTokens();
    set({ user: null, isAuthenticated: false, wishlist: [], alerts: [], dropAlerts: [], subscription: null });
  },

  restoreSession: async () => {
    try {
      const accessToken = await tokenStorage.getAccessToken();
      if (!accessToken) {
        set({ isAuthLoading: false });
        return;
      }

      const { data } = await authApi.me();
      set({ user: data.user, isAuthenticated: true });

      // Load server wishlist
      try {
        const { data: wlData } = await wishlistApi.getAll();
        set({ wishlist: wlData.wishlist.map((w) => w.productId) });
      } catch {
        // Keep local wishlist
      }

      // Load alerts
      get().fetchAlerts();
      get().fetchDropAlerts();

      // Sync subscription
      get().syncSubscription();
    } catch {
      await tokenStorage.clearTokens();
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isAuthLoading: false });
    }
  },

  toggleWishlist: (productId) => {
    const { wishlist, isAuthenticated } = get();
    const isCurrentlyWishlisted = wishlist.includes(productId);

    // Optimistic update
    set({
      wishlist: isCurrentlyWishlisted
        ? wishlist.filter((id) => id !== productId)
        : [...wishlist, productId],
    });

    // Server sync if authenticated
    if (isAuthenticated) {
      const apiCall = isCurrentlyWishlisted
        ? wishlistApi.remove(productId)
        : wishlistApi.add(productId);

      apiCall.catch(() => {
        // Rollback on failure
        set({
          wishlist: isCurrentlyWishlisted
            ? [...get().wishlist, productId]
            : get().wishlist.filter((id) => id !== productId),
        });
      });
    }
  },

  isWishlisted: (productId) => get().wishlist.includes(productId),

  fetchAlerts: async () => {
    set({ isAlertsLoading: true });
    try {
      const { data } = await priceAlertsApi.getAll();
      set({ alerts: data.alerts });
    } catch {
      // Keep existing alerts on failure
    } finally {
      set({ isAlertsLoading: false });
    }
  },

  createAlert: async (productId, targetPrice) => {
    const { data } = await priceAlertsApi.create(productId, targetPrice);
    set({ alerts: [data.alert, ...get().alerts] });
  },

  deleteAlert: async (alertId) => {
    const previousAlerts = get().alerts;

    // Optimistic update
    set({ alerts: previousAlerts.filter((a) => a.id !== alertId) });

    try {
      await priceAlertsApi.delete(alertId);
    } catch {
      // Rollback on failure
      set({ alerts: previousAlerts });
      throw new Error('Failed to delete alert');
    }
  },

  hasActiveAlertForProduct: (productId) =>
    get().alerts.some((a) => a.productId === productId && !a.isTriggered),

  activeAlertCount: () =>
    get().alerts.filter((a) => !a.isTriggered).length,

  fetchDropAlerts: async () => {
    set({ isDropAlertsLoading: true });
    try {
      const { data } = await dropAlertsApi.getAll();
      set({ dropAlerts: data.alerts });
    } catch {
      // Keep existing drop alerts on failure
    } finally {
      set({ isDropAlertsLoading: false });
    }
  },

  createDropAlert: async (payload) => {
    const { data } = await dropAlertsApi.create(payload);
    set({ dropAlerts: [data.alert, ...get().dropAlerts] });
  },

  deleteDropAlert: async (alertId) => {
    const previousAlerts = get().dropAlerts;

    // Optimistic update
    set({ dropAlerts: previousAlerts.filter((a) => a.id !== alertId) });

    try {
      await dropAlertsApi.delete(alertId);
    } catch {
      // Rollback on failure
      set({ dropAlerts: previousAlerts });
      throw new Error('Failed to delete drop alert');
    }
  },

  syncSubscription: async () => {
    try {
      // Fast path: check RevenueCat entitlement for immediate UI
      const isPro = await checkProEntitlement();
      if (isPro) {
        const currentUser = get().user;
        if (currentUser && currentUser.subscriptionTier !== 'pro') {
          set({ user: { ...currentUser, subscriptionTier: 'pro' } });
        }
      }

      // Source of truth: fetch from backend
      const { data } = await subscriptionApi.getStatus();
      const currentUser = get().user;
      if (currentUser) {
        set({
          user: { ...currentUser, subscriptionTier: data.tier },
          subscription: data.subscription,
        });
      }
    } catch {
      // Keep current subscription state on failure
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
}));

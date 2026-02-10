import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  RefreshControl,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, borderRadius, shadows } from '../theme';
import { RootStackParamList, Product } from '../types';
import { productsApi, categoriesApi, brandsApi } from '../services/api';
import {
  categories as localCategories,
  brands as localBrands,
  getFeaturedProducts,
  getTrendingProducts,
} from '../data/products';
import ProductCard from '../components/ProductCard';
import LoadingState from '../components/LoadingState';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');
  const heroRef = useRef<ScrollView>(null);
  const heroTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const [featured, setFeatured] = useState<Product[]>([]);
  const [trending, setTrending] = useState<Product[]>([]);
  const [categories, setCategories] = useState(localCategories);
  const [brandsList, setBrandsList] = useState(localBrands);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [featuredRes, trendingRes, categoriesRes, brandsRes] = await Promise.allSettled([
        productsApi.getFeatured(),
        productsApi.getTrending(),
        categoriesApi.getAll(),
        brandsApi.getAll(),
      ]);

      if (featuredRes.status === 'fulfilled') {
        setFeatured(featuredRes.value.data.products);
      } else {
        setFeatured(getFeaturedProducts());
      }

      if (trendingRes.status === 'fulfilled') {
        setTrending(trendingRes.value.data.products);
      } else {
        setTrending(getTrendingProducts());
      }

      if (categoriesRes.status === 'fulfilled') {
        const apiCats = categoriesRes.value.data.categories;
        const total = apiCats.reduce((sum, c) => sum + c.count, 0);
        setCategories([
          { id: 'all', name: 'All', count: total },
          ...apiCats.map((c) => ({ id: c.name.toLowerCase().replace(/\s+/g, '-'), name: c.name, count: c.count })),
        ]);
      }

      if (brandsRes.status === 'fulfilled') {
        setBrandsList(
          brandsRes.value.data.brands.map((b) => ({
            name: b.name,
            id: b.name.toLowerCase().replace(/\s+/g, '-'),
          }))
        );
      }
    } catch {
      // Full fallback to local data
      setFeatured(getFeaturedProducts());
      setTrending(getTrendingProducts());
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  const heroProducts = featured.slice(0, 3);

  // Auto-rotate hero carousel
  useEffect(() => {
    if (heroProducts.length <= 1) return;
    heroTimer.current = setInterval(() => {
      setActiveHeroSlide((prev) => {
        const next = (prev + 1) % heroProducts.length;
        heroRef.current?.scrollTo({ x: next * SCREEN_WIDTH, animated: true });
        return next;
      });
    }, 6000);
    return () => { if (heroTimer.current) clearInterval(heroTimer.current); };
  }, [heroProducts.length]);

  const handleHeroScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveHeroSlide(index);
  };

  if (isLoading && featured.length === 0) {
    return <LoadingState />;
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accentGold} />
      }
    >
      {/* Hero Carousel */}
      <View style={styles.hero}>
        <ScrollView
          ref={heroRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleHeroScroll}
          decelerationRate="fast"
        >
          {heroProducts.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={styles.heroSlide}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
            >
              <View style={styles.heroContent}>
                <Text style={styles.heroEyebrow}>Editor's Pick</Text>
                <Text style={styles.heroTitle}>{product.name}</Text>
                <Text style={styles.heroBrand}>{product.brand}</Text>
                {product.retailPrice && (
                  <Text style={styles.heroPrice}>Retail ${product.retailPrice.toLocaleString()}</Text>
                )}
              </View>
              <View style={styles.heroImageContainer}>
                <Image
                  source={{ uri: product.images[0] }}
                  style={styles.heroImage}
                  contentFit="contain"
                  transition={300}
                />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {heroProducts.length > 1 && (
          <View style={styles.heroDots}>
            {heroProducts.map((_, idx) => (
              <View key={idx} style={[styles.heroDot, idx === activeHeroSlide && styles.heroDotActive]} />
            ))}
          </View>
        )}
      </View>

      {/* Category Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categories}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.categoryPill, activeCategory === cat.id && styles.categoryPillActive]}
            onPress={() => setActiveCategory(cat.id)}
          >
            <Text style={[styles.categoryText, activeCategory === cat.id && styles.categoryTextActive]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Featured Drops */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>Just Listed</Text>
            <Text style={styles.sectionTitle}>Featured Drops</Text>
          </View>
        </View>
        <View style={styles.productGrid}>
          {featured.slice(0, 4).map((product) => (
            <View key={product.id} style={styles.productGridItem}>
              <ProductCard product={product} />
            </View>
          ))}
        </View>
      </View>

      {/* Trending Now */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>Most Wanted</Text>
            <Text style={styles.sectionTitle}>Trending Now</Text>
          </View>
        </View>
        {trending.slice(0, 6).map((product, idx) => (
          <TouchableOpacity
            key={product.id}
            style={styles.trendingCard}
            onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
          >
            <Text style={styles.trendingRank}>{String(idx + 1).padStart(2, '0')}</Text>
            <View style={styles.trendingImageContainer}>
              <Image
                source={{ uri: product.images[0] }}
                style={styles.trendingImage}
                contentFit="contain"
              />
            </View>
            <View style={styles.trendingInfo}>
              <Text style={styles.trendingBrand}>{product.brand}</Text>
              <Text style={styles.trendingName} numberOfLines={2}>{product.name}</Text>
              {product.retailPrice && (
                <Text style={styles.trendingPrice}>Retail ${product.retailPrice.toLocaleString()}</Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Shop by Brand */}
      <View style={styles.brandsSection}>
        <Text style={styles.brandsLabel}>Shop by Brand</Text>
        <View style={styles.brandsGrid}>
          {brandsList.map((brand) => (
            <TouchableOpacity
              key={brand.id}
              style={styles.brandButton}
            >
              <Text style={styles.brandButtonText}>{brand.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Trust Section */}
      <View style={styles.trustSection}>
        <View style={styles.trustItem}>
          <Ionicons name="shield-checkmark-outline" size={24} color={colors.textSecondary} />
          <View>
            <Text style={styles.trustTitle}>All Vendors Verified</Text>
            <Text style={styles.trustDesc}>Every vendor is authenticated</Text>
          </View>
        </View>
        <View style={styles.trustItem}>
          <Ionicons name="time-outline" size={24} color={colors.textSecondary} />
          <View>
            <Text style={styles.trustTitle}>Compare Live Prices</Text>
            <Text style={styles.trustDesc}>Direct links to 10+ vendors</Text>
          </View>
        </View>
        <View style={styles.trustItem}>
          <Ionicons name="star-outline" size={24} color={colors.textSecondary} />
          <View>
            <Text style={styles.trustTitle}>Trust Ratings</Text>
            <Text style={styles.trustDesc}>Vendor reviews before you buy</Text>
          </View>
        </View>
      </View>

      <View style={{ height: spacing.xxxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  // Hero
  hero: {
    backgroundColor: colors.bgTertiary,
  },
  heroSlide: {
    width: SCREEN_WIDTH,
    flexDirection: 'row',
    padding: spacing.xl,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxl,
    minHeight: 280,
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: spacing.md,
  },
  heroEyebrow: {
    fontSize: 11,
    color: colors.accentGold,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 28,
    marginBottom: 4,
  },
  heroBrand: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  heroPrice: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  heroImageContainer: {
    width: 160,
    height: 160,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingBottom: spacing.lg,
  },
  heroDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.borderMedium,
  },
  heroDotActive: {
    backgroundColor: colors.accentDark,
    width: 18,
  },
  // Categories
  categories: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  categoryPill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.bgTertiary,
  },
  categoryPillActive: {
    backgroundColor: colors.bgDark,
  },
  categoryText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: colors.textInverse,
  },
  // Section
  section: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.lg,
  },
  sectionEyebrow: {
    fontSize: 11,
    color: colors.accentGold,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  // Product Grid
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  productGridItem: {
    width: (SCREEN_WIDTH - spacing.lg * 2 - spacing.md) / 2,
  },
  // Trending
  trendingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  trendingRank: {
    fontSize: 18,
    fontWeight: '300',
    color: colors.textTertiary,
    width: 30,
    fontVariant: ['tabular-nums'],
  },
  trendingImageContainer: {
    width: 56,
    height: 56,
    backgroundColor: colors.bgTertiary,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
  },
  trendingImage: {
    width: '100%',
    height: '100%',
  },
  trendingInfo: {
    flex: 1,
  },
  trendingBrand: {
    fontSize: 10,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '500',
  },
  trendingName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 17,
  },
  trendingPrice: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  // Brands
  brandsSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
  },
  brandsLabel: {
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  brandsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  brandButton: {
    backgroundColor: colors.bgSecondary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  brandButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  // Trust
  trustSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    gap: spacing.lg,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  trustTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  trustDesc: {
    fontSize: 12,
    color: colors.textTertiary,
  },
});

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../theme';
import { Product } from '../types';
import { productsApi, categoriesApi } from '../services/api';
import {
  categories as localCategories,
  getProductsByCategory,
} from '../data/products';
import ProductCard from '../components/ProductCard';
import LoadingState from '../components/LoadingState';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
];

export default function ShopScreen() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState(localCategories);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchProducts = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    try {
      const params: any = { page: pageNum, limit: 20, sort: sortBy };
      if (activeCategory !== 'all') {
        params.category = activeCategory;
      }

      const { data } = await productsApi.getAll(params);
      if (append) {
        setProducts((prev) => [...prev, ...data.products]);
      } else {
        setProducts(data.products);
      }
      setTotalPages(data.totalPages);
      setTotal(data.total);
      setPage(pageNum);
    } catch {
      // Fallback to local data
      if (!append) {
        setProducts(getProductsByCategory(activeCategory));
        setTotal(getProductsByCategory(activeCategory).length);
      }
    }
  }, [activeCategory, sortBy]);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await categoriesApi.getAll();
      const apiCats = data.categories;
      const catTotal = apiCats.reduce((sum, c) => sum + c.count, 0);
      setCategories([
        { id: 'all', name: 'All', count: catTotal },
        ...apiCats.map((c) => ({ id: c.name.toLowerCase().replace(/\s+/g, '-'), name: c.name, count: c.count })),
      ]);
    } catch {
      // Keep local categories
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchProducts(1), fetchCategories()]).finally(() => setIsLoading(false));
  }, [activeCategory, sortBy]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProducts(1).finally(() => setRefreshing(false));
  }, [fetchProducts]);

  const loadMore = useCallback(() => {
    if (isLoadingMore || page >= totalPages) return;
    setIsLoadingMore(true);
    fetchProducts(page + 1, true).finally(() => setIsLoadingMore(false));
  }, [page, totalPages, isLoadingMore, fetchProducts]);

  const renderProduct = useCallback(
    ({ item, index }: { item: Product; index: number }) => (
      <View style={[styles.gridItem, index % 2 === 0 ? { marginRight: spacing.md / 2 } : { marginLeft: spacing.md / 2 }]}>
        <ProductCard product={item} />
      </View>
    ),
    []
  );

  const ListHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>
          {activeCategory === 'all' ? 'All Sneakers' : categories.find(c => c.id === activeCategory)?.name}
        </Text>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortMenu(!showSortMenu)}
        >
          <Ionicons name="swap-vertical" size={16} color={colors.textSecondary} />
          <Text style={styles.sortButtonText}>
            {SORT_OPTIONS.find(s => s.id === sortBy)?.label}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.count}>{total} Products</Text>

      {showSortMenu && (
        <View style={styles.sortMenu}>
          {SORT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.sortOption, sortBy === option.id && styles.sortOptionActive]}
              onPress={() => {
                setSortBy(option.id);
                setShowSortMenu(false);
              }}
            >
              <Text style={[styles.sortOptionText, sortBy === option.id && styles.sortOptionTextActive]}>
                {option.label}
              </Text>
              {sortBy === option.id && (
                <Ionicons name="checkmark" size={16} color={colors.accentDark} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

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
    </View>
  );

  if (isLoading && products.length === 0) {
    return <LoadingState />;
  }

  return (
    <FlatList
      data={products}
      renderItem={renderProduct}
      keyExtractor={(item) => String(item.id)}
      numColumns={2}
      contentContainerStyle={styles.list}
      ListHeaderComponent={ListHeader}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Ionicons name="search-outline" size={48} color={colors.textTertiary} />
          <Text style={styles.emptyTitle}>No sneakers found</Text>
          <Text style={styles.emptyDesc}>Try a different category or filter</Text>
        </View>
      }
      ListFooterComponent={
        isLoadingMore ? (
          <View style={styles.loadingMore}>
            <ActivityIndicator color={colors.accentGold} />
          </View>
        ) : null
      }
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accentGold} />
      }
      showsVerticalScrollIndicator={false}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  count: {
    fontSize: 13,
    color: colors.textTertiary,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.bgTertiary,
    borderRadius: borderRadius.md,
  },
  sortButtonText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  sortMenu: {
    backgroundColor: colors.bgSecondary,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderColor: colors.borderLight,
  },
  sortOptionActive: {
    backgroundColor: colors.bgTertiary,
  },
  sortOptionText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  sortOptionTextActive: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  categories: {
    gap: spacing.sm,
    marginBottom: spacing.md,
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
  gridItem: {
    flex: 1,
    marginBottom: spacing.md,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    gap: spacing.sm,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  emptyDesc: {
    fontSize: 14,
    color: colors.textTertiary,
  },
  loadingMore: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
});

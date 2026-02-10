import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';
import { Product } from '../types';
import { productsApi } from '../services/api';
import { searchProducts as localSearch } from '../data/products';
import { useAppStore } from '../store/useAppStore';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';

export default function SearchScreen() {
  const searchQuery = useAppStore((s) => s.searchQuery);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);
  const [results, setResults] = useState<Product[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(async (query?: string) => {
    const q = (query || searchQuery).trim();
    if (!q) return;

    setHasSearched(true);
    setIsSearching(true);

    try {
      const { data } = await productsApi.search(q);
      setResults(data.products);
    } catch {
      // Fallback to local search
      setResults(localSearch(q));
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handlePopularSearch = (query: string) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  const renderProduct = ({ item, index }: { item: Product; index: number }) => (
    <View style={[styles.gridItem, index % 2 === 0 ? { marginRight: spacing.md / 2 } : { marginLeft: spacing.md / 2 }]}>
      <ProductCard product={item} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmit={() => handleSearch()}
          showPopularSearches={!hasSearched}
          onPopularSearchPress={handlePopularSearch}
        />
      </View>

      {hasSearched ? (
        isSearching ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accentGold} />
          </View>
        ) : (
          <FlatList
            data={results}
            renderItem={renderProduct}
            keyExtractor={(item) => String(item.id)}
            numColumns={2}
            contentContainerStyle={styles.list}
            ListHeaderComponent={
              <Text style={styles.resultCount}>
                {results.length} result{results.length !== 1 ? 's' : ''} for "{searchQuery}"
              </Text>
            }
            ListEmptyComponent={
              <View style={styles.empty}>
                <Ionicons name="search-outline" size={48} color={colors.textTertiary} />
                <Text style={styles.emptyTitle}>No results found</Text>
                <Text style={styles.emptyDesc}>Try searching for something else</Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
          />
        )
      ) : (
        <View style={styles.initialState}>
          <Ionicons name="search" size={48} color={colors.textMuted} />
          <Text style={styles.initialTitle}>Find Your Next Pair</Text>
          <Text style={styles.initialDesc}>Search sneakers, brands, and styles</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  resultCount: {
    fontSize: 13,
    color: colors.textTertiary,
    marginBottom: spacing.md,
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
  initialState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    paddingBottom: 100,
  },
  initialTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  initialDesc: {
    fontSize: 14,
    color: colors.textTertiary,
  },
});

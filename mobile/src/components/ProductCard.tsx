import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, borderRadius, shadows } from '../theme';
import { Product, RootStackParamList } from '../types';
import { useAppStore } from '../store/useAppStore';
import PriceDisplay from './PriceDisplay';

interface ProductCardProps {
  product: Product;
}

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x400/f5f4f2/a8a29e?text=Image+Coming+Soon';

export default function ProductCard({ product }: ProductCardProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const toggleWishlist = useAppStore((s) => s.toggleWishlist);
  const isWishlisted = useAppStore((s) => s.isWishlisted(product.id));

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
    >
      {product.badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{product.badge}</Text>
        </View>
      )}

      <Pressable
        style={styles.wishlistButton}
        onPress={(e) => {
          e.stopPropagation?.();
          toggleWishlist(product.id);
        }}
        hitSlop={8}
      >
        <Ionicons
          name={isWishlisted ? 'heart' : 'heart-outline'}
          size={20}
          color={isWishlisted ? '#ef4444' : colors.textTertiary}
        />
      </Pressable>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.images[0] || PLACEHOLDER_IMAGE }}
          style={styles.image}
          contentFit="contain"
          placeholder={PLACEHOLDER_IMAGE}
          transition={200}
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <PriceDisplay product={product} />
        <Text style={styles.compareLink}>Compare Live Prices →</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.bgSecondary,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.bgDark,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    zIndex: 2,
  },
  badgeText: {
    color: colors.textInverse,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  wishlistButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    zIndex: 2,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: borderRadius.full,
    padding: 6,
  },
  imageContainer: {
    backgroundColor: colors.bgTertiary,
    aspectRatio: 1,
    padding: spacing.lg,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: {
    padding: spacing.md,
    gap: 4,
  },
  brand: {
    fontSize: 11,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '500',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 18,
  },
  compareLink: {
    fontSize: 12,
    color: colors.accentGold,
    fontWeight: '500',
    marginTop: 4,
  },
});

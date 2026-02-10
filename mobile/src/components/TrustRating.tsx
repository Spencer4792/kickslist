import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';

interface TrustRatingProps {
  rating: number;
  showCount?: boolean;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function TrustRating({ rating, showCount = false, count = 0, size = 'md' }: TrustRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const starSize = size === 'sm' ? 12 : size === 'md' ? 16 : 20;
  const fontSize = size === 'sm' ? 11 : size === 'md' ? 13 : 15;

  return (
    <View style={styles.container}>
      <View style={styles.stars}>
        {[...Array(fullStars)].map((_, i) => (
          <Ionicons key={`full-${i}`} name="star" size={starSize} color={colors.starFull} />
        ))}
        {hasHalfStar && (
          <Ionicons name="star-half" size={starSize} color={colors.starFull} />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Ionicons key={`empty-${i}`} name="star-outline" size={starSize} color={colors.starEmpty} />
        ))}
      </View>
      <Text style={[styles.ratingText, { fontSize }]}>{rating.toFixed(1)}</Text>
      {showCount && count > 0 && (
        <Text style={[styles.countText, { fontSize: fontSize - 1 }]}>
          ({count.toLocaleString()})
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stars: {
    flexDirection: 'row',
    gap: 1,
  },
  ratingText: {
    color: colors.textSecondary,
    fontWeight: '500',
  },
  countText: {
    color: colors.textTertiary,
  },
});

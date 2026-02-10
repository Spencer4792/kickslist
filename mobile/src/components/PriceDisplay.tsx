import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { Product } from '../types';

interface PriceDisplayProps {
  product: Product;
}

export default function PriceDisplay({ product }: PriceDisplayProps) {
  const retailPrice = product.retailPrice;

  if (!retailPrice) {
    return <Text style={styles.unavailable}>Price Unavailable</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Retail:</Text>
      <Text style={styles.price}>${retailPrice.toLocaleString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 13,
    color: colors.textTertiary,
  },
  price: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  unavailable: {
    fontSize: 13,
    color: colors.textTertiary,
    fontStyle: 'italic',
  },
});

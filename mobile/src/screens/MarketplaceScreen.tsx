import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';

export default function MarketplaceScreen() {
  return (
    <View style={styles.container}>
      <Ionicons name="storefront-outline" size={64} color={colors.textMuted} />
      <Text style={styles.title}>P2P Marketplace</Text>
      <Text style={styles.subtitle}>Coming Soon</Text>
      <Text style={styles.description}>
        Buy and sell sneakers directly with other collectors. Upload photos, set your price, and connect with buyers.
      </Text>
      <View style={styles.features}>
        <View style={styles.feature}>
          <Ionicons name="camera-outline" size={20} color={colors.accentGold} />
          <Text style={styles.featureText}>List your sneakers with photos</Text>
        </View>
        <View style={styles.feature}>
          <Ionicons name="shield-checkmark-outline" size={20} color={colors.accentGold} />
          <Text style={styles.featureText}>Secure payments via Stripe</Text>
        </View>
        <View style={styles.feature}>
          <Ionicons name="pricetag-outline" size={20} color={colors.accentGold} />
          <Text style={styles.featureText}>Only 8% platform fee</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bgPrimary,
    padding: spacing.xl,
    gap: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  subtitle: {
    fontSize: 14,
    color: colors.accentGold,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  features: {
    marginTop: spacing.xl,
    gap: spacing.lg,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  featureText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

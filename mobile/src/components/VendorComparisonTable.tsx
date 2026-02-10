import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { colors, spacing, borderRadius } from '../theme';
import { VendorPrice } from '../types';
import TrustRating from './TrustRating';

interface VendorComparisonTableProps {
  vendorPrices: VendorPrice[];
}

function VendorRow({ vendorPrice, isResale }: { vendorPrice: VendorPrice; isResale: boolean }) {
  const vendor = vendorPrice.vendor;

  return (
    <View style={styles.row}>
      <View style={styles.vendorInfo}>
        <Text style={[styles.vendorName, vendor.color ? { color: vendor.color } : null]}>
          {vendor.name}
        </Text>
        <View style={[styles.typeBadge, isResale ? styles.resaleBadge : styles.retailBadge]}>
          <Text style={[styles.typeBadgeText, isResale ? styles.resaleText : styles.retailText]}>
            {isResale ? 'Resale' : 'Retail'}
          </Text>
        </View>
      </View>

      <View style={styles.ratingContainer}>
        <TrustRating rating={vendor.trustRating} size="sm" />
        <Text style={styles.reviewCount}>({vendor.reviewCount.toLocaleString()})</Text>
      </View>

      <TouchableOpacity
        style={styles.shopButton}
        onPress={() => Linking.openURL(vendorPrice.url)}
      >
        <Text style={styles.shopButtonText}>
          {isResale ? 'Check Price' : 'Check Stock'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function VendorComparisonTable({ vendorPrices }: VendorComparisonTableProps) {
  const resaleVendors = vendorPrices.filter((vp) => vp.vendor.type === 'resale');
  const retailVendors = vendorPrices.filter((vp) => vp.vendor.type === 'retail');

  return (
    <View style={styles.container}>
      {resaleVendors.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Resale Marketplaces</Text>
            <Text style={styles.sectionSubtitle}>Authenticated · Live market prices</Text>
          </View>
          {resaleVendors.map((vp) => (
            <VendorRow key={vp.vendorId} vendorPrice={vp} isResale={true} />
          ))}
        </View>
      )}

      {retailVendors.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Retail Stores</Text>
            <Text style={styles.sectionSubtitle}>Official retailers</Text>
          </View>
          {retailVendors.map((vp) => (
            <VendorRow key={vp.vendorId} vendorPrice={vp} isResale={false} />
          ))}
        </View>
      )}

      <Text style={styles.disclosure}>
        Prices on vendor sites are live and may change. We may earn a commission when you shop through our links.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xl,
  },
  section: {
    gap: spacing.sm,
  },
  sectionHeader: {
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 2,
  },
  row: {
    backgroundColor: colors.bgTertiary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  vendorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  vendorName: {
    fontSize: 15,
    fontWeight: '600',
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  retailBadge: {
    backgroundColor: '#dcfce7',
  },
  resaleBadge: {
    backgroundColor: '#ede9fe',
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  retailText: {
    color: colors.retailBadge,
  },
  resaleText: {
    color: colors.resaleBadge,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewCount: {
    fontSize: 11,
    color: colors.textTertiary,
  },
  shopButton: {
    backgroundColor: colors.bgDark,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    marginTop: 4,
  },
  shopButtonText: {
    color: colors.textInverse,
    fontSize: 13,
    fontWeight: '600',
  },
  disclosure: {
    fontSize: 11,
    color: colors.textTertiary,
    lineHeight: 16,
    textAlign: 'center',
  },
});

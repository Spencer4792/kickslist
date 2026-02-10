import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, borderRadius, shadows } from '../theme';
import { RootStackParamList, Product } from '../types';
import { productsApi } from '../services/api';
import { getProductById as localGetProduct, getRelatedProducts as localGetRelated } from '../data/products';
import { vendors as localVendors } from '../data/vendors';
import { useAppStore } from '../store/useAppStore';
import ImageGallery from '../components/ImageGallery';
import VendorComparisonTable from '../components/VendorComparisonTable';
import ProductCard from '../components/ProductCard';
import TrustRating from '../components/TrustRating';
import LoadingState from '../components/LoadingState';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FREE_TIER_MAX_ALERTS = 3;

export default function ProductDetailScreen() {
  const route = useRoute<Props['route']>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { productId } = route.params;

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [targetPriceInput, setTargetPriceInput] = useState('');
  const [isCreatingAlert, setIsCreatingAlert] = useState(false);

  const toggleWishlist = useAppStore((s) => s.toggleWishlist);
  const isWishlisted = useAppStore((s) => s.isWishlisted(productId));
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const user = useAppStore((s) => s.user);
  const hasActiveAlert = useAppStore((s) => s.hasActiveAlertForProduct(productId));
  const activeAlertCount = useAppStore((s) => s.activeAlertCount());
  const createAlert = useAppStore((s) => s.createAlert);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setIsLoading(true);
      try {
        const [productRes, relatedRes] = await Promise.allSettled([
          productsApi.getById(productId),
          productsApi.getRelated(productId),
        ]);

        if (cancelled) return;

        if (productRes.status === 'fulfilled') {
          setProduct(productRes.value.data.product);
        } else {
          // Fallback to local
          const local = localGetProduct(productId);
          if (local) {
            // Build mock vendor prices for local fallback
            const vendorPrices = localVendors.map((vendor, idx) => ({
              id: idx + 1,
              productId,
              vendorId: vendor.id,
              price: null as number | null,
              url: vendor.url || '#',
              lastFetchedAt: new Date().toISOString(),
              inStock: true,
              vendor,
            }));
            setProduct({ ...local, vendorPrices });
          }
        }

        if (relatedRes.status === 'fulfilled') {
          setRelated(relatedRes.value.data.products);
        } else {
          setRelated(localGetRelated(productId, 4));
        }
      } catch {
        // Full fallback
        const local = localGetProduct(productId);
        if (local) setProduct(local);
        setRelated(localGetRelated(productId, 4));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [productId]);

  const handleSetAlert = () => {
    if (!isAuthenticated) {
      navigation.navigate('Auth');
      return;
    }

    if (hasActiveAlert) return;

    if (user?.subscriptionTier === 'free' && activeAlertCount >= FREE_TIER_MAX_ALERTS) {
      Alert.alert(
        'Alert Limit Reached',
        'Free accounts are limited to 3 active price alerts. Upgrade to Pro for unlimited alerts.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Upgrade to Pro',
            onPress: () => navigation.navigate('Paywall'),
          },
        ]
      );
      return;
    }

    // Pre-fill with a suggestion if we have current price
    if (product?.currentLowestPrice) {
      const suggested = Math.floor(Number(product.currentLowestPrice) * 0.9);
      setTargetPriceInput(String(suggested));
    } else {
      setTargetPriceInput('');
    }
    setAlertModalVisible(true);
  };

  const handleCreateAlert = async () => {
    const price = parseFloat(targetPriceInput);
    if (isNaN(price) || price <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid target price.');
      return;
    }

    setIsCreatingAlert(true);
    try {
      await createAlert(productId, price);
      setAlertModalVisible(false);
      setTargetPriceInput('');
      Alert.alert('Alert Set!', `We'll notify you when the price drops to $${price.toFixed(0)} or below.`);
    } catch (err: any) {
      const message = err?.response?.data?.error || 'Failed to create alert. Please try again.';
      Alert.alert('Error', message);
    } finally {
      setIsCreatingAlert(false);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!product) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.textTertiary} />
        <Text style={styles.errorTitle}>Product Not Found</Text>
        <Text style={styles.errorDesc}>The sneaker you're looking for doesn't exist.</Text>
        <TouchableOpacity style={styles.errorButton} onPress={() => navigation.goBack()}>
          <Text style={styles.errorButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <ImageGallery images={product.images} />

        <View style={styles.content}>
          {/* Product Info */}
          <View style={styles.infoHeader}>
            <Text style={styles.brand}>{product.brand}</Text>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.category}>{product.category?.toUpperCase()}</Text>
          </View>

          {/* Price Block */}
          <View style={styles.priceBlock}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Retail Price:</Text>
              <Text style={styles.priceValue}>
                ${product.retailPrice?.toLocaleString() || 'N/A'}
              </Text>
            </View>
            <Text style={styles.priceNote}>
              Check current live prices from verified vendors below
            </Text>
          </View>

          {/* Vendor Comparison */}
          {product.vendorPrices && product.vendorPrices.length > 0 && (
            <VendorComparisonTable vendorPrices={product.vendorPrices} />
          )}

          {/* Wishlist Button */}
          <TouchableOpacity
            style={[styles.wishlistButton, isWishlisted && styles.wishlistButtonActive]}
            onPress={() => toggleWishlist(productId)}
          >
            <Ionicons
              name={isWishlisted ? 'heart' : 'heart-outline'}
              size={20}
              color={isWishlisted ? '#fff' : colors.textPrimary}
            />
            <Text style={[styles.wishlistButtonText, isWishlisted && styles.wishlistButtonTextActive]}>
              {isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
            </Text>
          </TouchableOpacity>

          {/* Price Alert Button */}
          <TouchableOpacity
            style={[
              styles.alertButton,
              hasActiveAlert && styles.alertButtonActive,
            ]}
            onPress={handleSetAlert}
            disabled={hasActiveAlert}
          >
            <Ionicons
              name={hasActiveAlert ? 'checkmark-circle' : 'notifications-outline'}
              size={20}
              color={hasActiveAlert ? colors.accentSuccess : colors.accentGold}
            />
            <Text style={[
              styles.alertButtonText,
              hasActiveAlert && styles.alertButtonTextActive,
            ]}>
              {hasActiveAlert ? 'Alert Set' : 'Set Price Alert'}
            </Text>
          </TouchableOpacity>

          {/* Trust Badges */}
          <View style={styles.trustBadges}>
            <View style={styles.trustBadge}>
              <Ionicons name="shield-checkmark-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.trustBadgeText}>All Vendors Verified</Text>
            </View>
            <View style={styles.trustBadge}>
              <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.trustBadgeText}>Live Price Links</Text>
            </View>
            <View style={styles.trustBadge}>
              <Ionicons name="card-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.trustBadgeText}>Secure Checkout</Text>
            </View>
          </View>

          {/* Specs */}
          <View style={styles.specs}>
            <Text style={styles.specsTitle}>Product Details</Text>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Brand</Text>
              <Text style={styles.specValue}>{product.brand}</Text>
            </View>
            {product.releaseDate && (
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Release Date</Text>
                <Text style={styles.specValue}>
                  {new Date(product.releaseDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            )}
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Retail Price</Text>
              <Text style={styles.specValue}>${product.retailPrice?.toLocaleString()}</Text>
            </View>
          </View>

          {/* Description */}
          {product.description && (
            <View style={styles.description}>
              <Text style={styles.descriptionTitle}>About This Sneaker</Text>
              <Text style={styles.descriptionText}>{product.description}</Text>
            </View>
          )}

          {/* Related Products */}
          {related.length > 0 && (
            <View style={styles.related}>
              <Text style={styles.relatedTitle}>You May Also Like</Text>
              <FlatList
                data={related}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={styles.relatedList}
                renderItem={({ item }) => (
                  <View style={styles.relatedItem}>
                    <ProductCard product={item} />
                  </View>
                )}
              />
            </View>
          )}
        </View>

        <View style={{ height: spacing.xxxl }} />
      </ScrollView>

      {/* Target Price Modal */}
      <Modal
        visible={alertModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAlertModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Price Alert</Text>
            <Text style={styles.modalProductName} numberOfLines={2}>{product.name}</Text>
            {product.currentLowestPrice != null && (
              <Text style={styles.modalCurrentPrice}>
                Current lowest: ${Number(product.currentLowestPrice).toFixed(0)}
              </Text>
            )}

            <View style={styles.modalInputRow}>
              <Text style={styles.modalDollarSign}>$</Text>
              <TextInput
                style={styles.modalInput}
                value={targetPriceInput}
                onChangeText={setTargetPriceInput}
                keyboardType="numeric"
                placeholder="Enter target price"
                placeholderTextColor={colors.textTertiary}
                autoFocus
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setAlertModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSetButton, isCreatingAlert && { opacity: 0.6 }]}
                onPress={handleCreateAlert}
                disabled={isCreatingAlert}
              >
                <Text style={styles.modalSetText}>
                  {isCreatingAlert ? 'Setting...' : 'Set Alert'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bgPrimary,
    padding: spacing.xl,
    gap: spacing.md,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  errorDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  errorButton: {
    backgroundColor: colors.bgDark,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },
  errorButtonText: {
    color: colors.textInverse,
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: spacing.lg,
    gap: spacing.xl,
  },
  // Info
  infoHeader: {
    gap: 4,
  },
  brand: {
    fontSize: 13,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '500',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 30,
  },
  category: {
    fontSize: 12,
    color: colors.textTertiary,
    letterSpacing: 0.5,
    marginTop: 4,
  },
  // Price
  priceBlock: {
    backgroundColor: colors.bgTertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  priceLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  priceValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  priceNote: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: spacing.sm,
  },
  // Wishlist
  wishlistButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.borderMedium,
  },
  wishlistButtonActive: {
    backgroundColor: colors.accentDark,
    borderColor: colors.accentDark,
  },
  wishlistButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  wishlistButtonTextActive: {
    color: '#fff',
  },
  // Price Alert Button
  alertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.accentGold,
  },
  alertButtonActive: {
    backgroundColor: colors.bgTertiary,
    borderColor: colors.accentSuccess,
  },
  alertButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accentGold,
  },
  alertButtonTextActive: {
    color: colors.accentSuccess,
  },
  // Trust Badges
  trustBadges: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.borderLight,
  },
  trustBadge: {
    alignItems: 'center',
    gap: 4,
  },
  trustBadgeText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  // Specs
  specs: {
    gap: spacing.sm,
  },
  specsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderColor: colors.borderLight,
  },
  specLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  specValue: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  // Description
  description: {
    gap: spacing.sm,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  // Related
  related: {
    marginHorizontal: -spacing.lg,
    paddingTop: spacing.lg,
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  relatedList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  relatedItem: {
    width: (SCREEN_WIDTH - spacing.lg * 2 - spacing.md) / 2,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: colors.bgSecondary,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.xl,
    gap: spacing.md,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  modalProductName: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  modalCurrentPrice: {
    fontSize: 13,
    color: colors.textTertiary,
  },
  modalInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgTertiary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  modalDollarSign: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },
  modalInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    paddingVertical: spacing.md,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.borderMedium,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  modalSetButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.bgDark,
    alignItems: 'center',
  },
  modalSetText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textInverse,
  },
});

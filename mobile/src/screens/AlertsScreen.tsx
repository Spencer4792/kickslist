import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { colors, spacing, borderRadius } from '../theme';
import { RootStackParamList, PriceAlert, DropAlert } from '../types';
import { useAppStore } from '../store/useAppStore';
import LoadingState from '../components/LoadingState';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function AlertsScreen() {
  const navigation = useNavigation<Nav>();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const user = useAppStore((s) => s.user);
  const alerts = useAppStore((s) => s.alerts);
  const isAlertsLoading = useAppStore((s) => s.isAlertsLoading);
  const fetchAlerts = useAppStore((s) => s.fetchAlerts);
  const deleteAlert = useAppStore((s) => s.deleteAlert);
  const activeAlertCount = useAppStore((s) => s.activeAlertCount());
  const dropAlerts = useAppStore((s) => s.dropAlerts);
  const isDropAlertsLoading = useAppStore((s) => s.isDropAlertsLoading);
  const fetchDropAlerts = useAppStore((s) => s.fetchDropAlerts);
  const deleteDropAlert = useAppStore((s) => s.deleteDropAlert);

  const activeAlerts = alerts.filter((a) => !a.isTriggered);
  const triggeredAlerts = alerts.filter((a) => a.isTriggered);

  const onRefresh = useCallback(() => {
    fetchAlerts();
    fetchDropAlerts();
  }, [fetchAlerts, fetchDropAlerts]);

  const handleDelete = useCallback((alert: PriceAlert) => {
    Alert.alert(
      'Delete Alert',
      `Remove price alert for ${alert.product.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteAlert(alert.id).catch(() => {
              Alert.alert('Error', 'Failed to delete alert. Please try again.');
            });
          },
        },
      ]
    );
  }, [deleteAlert]);

  const handleDeleteDropAlert = useCallback((alert: DropAlert) => {
    const description = buildDropAlertDescription(alert);
    Alert.alert(
      'Delete Drop Alert',
      `Remove this ${alert.alertType} alert?\n${description}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteDropAlert(alert.id).catch(() => {
              Alert.alert('Error', 'Failed to delete alert. Please try again.');
            });
          },
        },
      ]
    );
  }, [deleteDropAlert]);

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="notifications-outline" size={64} color={colors.textMuted} />
        <Text style={styles.title}>Price Alerts</Text>
        <Text style={styles.description}>
          Sign in to set target prices and get notified when prices drop.
        </Text>
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => navigation.navigate('Auth')}
        >
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Loading
  if (isAlertsLoading && alerts.length === 0 && isDropAlertsLoading && dropAlerts.length === 0) {
    return <LoadingState />;
  }

  // Empty state
  if (alerts.length === 0 && dropAlerts.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <RefreshControl refreshing={isAlertsLoading} onRefresh={onRefresh} />
        <Ionicons name="notifications-outline" size={64} color={colors.textMuted} />
        <Text style={styles.title}>No Alerts Yet</Text>
        <Text style={styles.description}>
          Browse sneakers and set a target price, or create a drop alert to get notified.
        </Text>
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => navigation.navigate('MainTabs')}
        >
          <Text style={styles.signInButtonText}>Browse Sneakers</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.signInButton, styles.secondaryButton]}
          onPress={() => navigation.navigate('CreateDropAlert')}
        >
          <Text style={styles.secondaryButtonText}>Create Drop Alert</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderAlertItem = ({ item }: { item: PriceAlert }) => {
    const imageUrl = item.product.images?.[0];

    return (
      <TouchableOpacity
        style={styles.alertRow}
        onPress={() => navigation.navigate('ProductDetail', { productId: item.productId })}
        activeOpacity={0.7}
      >
        <View style={styles.alertImageContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.alertImage} contentFit="cover" />
          ) : (
            <View style={[styles.alertImage, styles.alertImagePlaceholder]}>
              <Ionicons name="image-outline" size={24} color={colors.textMuted} />
            </View>
          )}
        </View>

        <View style={styles.alertInfo}>
          <Text style={styles.alertBrand}>{item.product.brand}</Text>
          <Text style={styles.alertName} numberOfLines={2}>{item.product.name}</Text>
          <View style={styles.alertPriceRow}>
            <Text style={styles.alertTargetLabel}>Target:</Text>
            <Text style={styles.alertTargetPrice}>${Number(item.targetPrice).toFixed(0)}</Text>
            {item.isTriggered ? (
              <View style={styles.triggeredBadge}>
                <Text style={styles.triggeredBadgeText}>
                  Triggered at ${Number(item.triggeredPrice).toFixed(0)}
                </Text>
              </View>
            ) : (
              item.product.currentLowestPrice != null && (
                <Text style={styles.alertCurrentPrice}>
                  Current: ${Number(item.product.currentLowestPrice).toFixed(0)}
                </Text>
              )
            )}
          </View>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="trash-outline" size={18} color={colors.textTertiary} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderDropAlertItem = (alert: DropAlert) => {
    const description = buildDropAlertDescription(alert);

    return (
      <View style={styles.alertRow} key={`drop-${alert.id}`}>
        <View style={styles.dropAlertIconContainer}>
          <Ionicons
            name={alert.alertType === 'drop' ? 'flash' : 'refresh'}
            size={22}
            color={colors.accentGold}
          />
        </View>

        <View style={styles.alertInfo}>
          <View style={styles.dropAlertTypeRow}>
            <View style={[styles.dropAlertBadge, alert.alertType === 'restock' && styles.restockBadge]}>
              <Text style={styles.dropAlertBadgeText}>
                {alert.alertType === 'drop' ? 'DROP' : 'RESTOCK'}
              </Text>
            </View>
            {alert.triggeredCount > 0 && (
              <Text style={styles.triggeredCountText}>
                Triggered {alert.triggeredCount}x
              </Text>
            )}
          </View>
          <Text style={styles.alertName} numberOfLines={2}>{description}</Text>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteDropAlert(alert)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="trash-outline" size={18} color={colors.textTertiary} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderSectionHeader = (title: string, count: number, action?: { label: string; onPress: () => void }) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderLeft}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionCount}>{count}</Text>
      </View>
      {action && (
        <TouchableOpacity onPress={action.onPress}>
          <Text style={styles.sectionAction}>{action.label}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Build flat data with section markers
  type ListItem =
    | { type: 'header'; title: string; count: number; action?: { label: string; onPress: () => void }; key: string }
    | { type: 'alert'; alert: PriceAlert; key: string }
    | { type: 'dropAlert'; alert: DropAlert; key: string };

  const listData: ListItem[] = [];

  // Price Alerts sections
  if (activeAlerts.length > 0) {
    listData.push({ type: 'header', title: 'Active Price Alerts', count: activeAlerts.length, key: 'header-active' });
    activeAlerts.forEach((a) => listData.push({ type: 'alert', alert: a, key: `alert-${a.id}` }));
  }
  if (triggeredAlerts.length > 0) {
    listData.push({ type: 'header', title: 'Triggered', count: triggeredAlerts.length, key: 'header-triggered' });
    triggeredAlerts.forEach((a) => listData.push({ type: 'alert', alert: a, key: `alert-${a.id}` }));
  }

  // Drop Alerts section
  listData.push({
    type: 'header',
    title: 'Drop Alerts',
    count: dropAlerts.length,
    action: { label: '+ Add', onPress: () => navigation.navigate('CreateDropAlert') },
    key: 'header-drop-alerts',
  });
  dropAlerts.forEach((a) => listData.push({ type: 'dropAlert', alert: a, key: `drop-${a.id}` }));

  return (
    <View style={styles.container}>
      {/* Tier banner */}
      <TouchableOpacity
        style={styles.tierBanner}
        onPress={() => {
          if (user?.subscriptionTier !== 'pro') {
            navigation.navigate('Paywall');
          }
        }}
        activeOpacity={user?.subscriptionTier === 'pro' ? 1 : 0.7}
      >
        {user?.subscriptionTier === 'pro' ? (
          <Text style={styles.tierText}>Pro: Unlimited Alerts</Text>
        ) : (
          <Text style={styles.tierText}>
            {activeAlertCount}/3 price alerts used · Upgrade for Unlimited
          </Text>
        )}
      </TouchableOpacity>

      <FlatList
        data={listData}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => {
          if (item.type === 'header') {
            return renderSectionHeader(item.title, item.count, item.action);
          }
          if (item.type === 'dropAlert') {
            return renderDropAlertItem(item.alert);
          }
          return renderAlertItem({ item: item.alert });
        }}
        refreshControl={
          <RefreshControl refreshing={isAlertsLoading || isDropAlertsLoading} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

function buildDropAlertDescription(alert: DropAlert): string {
  const parts: string[] = [];
  if (alert.brand) parts.push(alert.brand);
  if (alert.category) parts.push(alert.category);
  if (alert.keywords) parts.push(`"${alert.keywords}"`);
  if (alert.minPrice != null || alert.maxPrice != null) {
    const min = alert.minPrice != null ? `$${Number(alert.minPrice).toFixed(0)}` : '';
    const max = alert.maxPrice != null ? `$${Number(alert.maxPrice).toFixed(0)}` : '';
    if (min && max) parts.push(`${min}-${max}`);
    else if (min) parts.push(`${min}+`);
    else parts.push(`up to ${max}`);
  }
  return parts.length > 0 ? parts.join(' · ') : 'All products';
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
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  signInButton: {
    backgroundColor: colors.bgDark,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },
  signInButtonText: {
    color: colors.textInverse,
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginTop: spacing.sm,
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  tierBanner: {
    backgroundColor: colors.bgTertiary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  tierText: {
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: spacing.xxxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.bgPrimary,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionCount: {
    fontSize: 13,
    color: colors.textTertiary,
    fontWeight: '500',
  },
  sectionAction: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.accentGold,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.bgSecondary,
    gap: spacing.md,
  },
  alertImageContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: colors.bgTertiary,
  },
  alertImage: {
    width: 56,
    height: 56,
  },
  alertImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertInfo: {
    flex: 1,
    gap: 2,
  },
  alertBrand: {
    fontSize: 11,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '500',
  },
  alertName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 18,
  },
  alertPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 2,
  },
  alertTargetLabel: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  alertTargetPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accentSuccess,
  },
  alertCurrentPrice: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  triggeredBadge: {
    backgroundColor: colors.accentGold,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginLeft: spacing.xs,
  },
  triggeredBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  deleteButton: {
    padding: spacing.sm,
  },
  separator: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginLeft: spacing.lg + 56 + spacing.md,
  },
  dropAlertIconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    backgroundColor: colors.bgTertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropAlertTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dropAlertBadge: {
    backgroundColor: colors.bgDark,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  restockBadge: {
    backgroundColor: colors.accentSuccess,
  },
  dropAlertBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  triggeredCountText: {
    fontSize: 11,
    color: colors.textTertiary,
  },
});

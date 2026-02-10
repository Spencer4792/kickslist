import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, borderRadius, shadows } from '../theme';
import { RootStackParamList } from '../types';
import { useAppStore } from '../store/useAppStore';

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const user = useAppStore((s) => s.user);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const logout = useAppStore((s) => s.logout);
  const subscription = useAppStore((s) => s.subscription);

  const isPro = user?.subscriptionTier === 'pro';

  function getSubscriptionSubtitle(): string {
    if (!isPro || !subscription) {
      return '$4.99/mo · Unlimited alerts & more';
    }
    const planLabel = subscription.plan === 'yearly' ? 'Yearly' : 'Monthly';
    if (subscription.status === 'cancelled') {
      const endDate = new Date(subscription.currentPeriodEnd).toLocaleDateString();
      return `${planLabel} · Expires ${endDate}`;
    }
    const renewDate = new Date(subscription.currentPeriodEnd).toLocaleDateString();
    return `${planLabel} · Renews ${renewDate}`;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar & Auth Section */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarPlaceholder}>
          <Ionicons
            name={isAuthenticated ? 'person' : 'person'}
            size={32}
            color={isAuthenticated ? colors.accentGold : colors.textTertiary}
          />
        </View>
        {isAuthenticated && user ? (
          <>
            <Text style={styles.userName}>{user.name || 'KicksList User'}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            {isPro && (
              <View style={styles.proBadge}>
                <Ionicons name="diamond" size={12} color={colors.accentGold} />
                <Text style={styles.proBadgeText}>Pro</Text>
              </View>
            )}
            <TouchableOpacity style={styles.signOutButton} onPress={logout}>
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.welcomeText}>Welcome to KicksList</Text>
            <Text style={styles.welcomeDesc}>Sign in to save your wishlist, set price alerts, and more.</Text>
            <TouchableOpacity
              style={styles.signInButton}
              onPress={() => navigation.navigate('Auth')}
            >
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        <Text style={styles.menuSectionTitle}>Shopping</Text>
        <MenuItem icon="heart-outline" label="Wishlist" badge={!isAuthenticated ? "Sign In" : undefined} />
        <MenuItem icon="notifications-outline" label="Price Alerts" badge="Coming Soon" />
        <MenuItem icon="receipt-outline" label="Order History" badge="Coming Soon" />
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.menuSectionTitle}>Marketplace</Text>
        <MenuItem icon="add-circle-outline" label="Sell a Sneaker" badge="Coming Soon" />
        <MenuItem icon="list-outline" label="My Listings" badge="Coming Soon" />
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.menuSectionTitle}>Subscription</Text>
        <MenuItem
          icon="diamond-outline"
          label="KicksList Pro"
          subtitle={getSubscriptionSubtitle()}
          badge={isPro ? 'Active' : undefined}
          onPress={() => {
            if (isPro) return;
            navigation.navigate('Paywall');
          }}
        />
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.menuSectionTitle}>Settings</Text>
        <MenuItem icon="settings-outline" label="Settings" />
        <MenuItem icon="help-circle-outline" label="Help & Support" />
        <MenuItem icon="document-text-outline" label="Terms of Service" />
        <MenuItem icon="shield-outline" label="Privacy Policy" />
      </View>

      <Text style={styles.version}>KicksList v1.0.0</Text>
    </ScrollView>
  );
}

function MenuItem({ icon, label, subtitle, badge, onPress }: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle?: string;
  badge?: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Ionicons name={icon} size={20} color={colors.textSecondary} />
      <View style={styles.menuItemContent}>
        <Text style={styles.menuItemLabel}>{label}</Text>
        {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
      </View>
      {badge && (
        <View style={[styles.badge, badge === 'Active' && styles.activeBadge]}>
          <Text style={[styles.badgeText, badge === 'Active' && styles.activeBadgeText]}>{badge}</Text>
        </View>
      )}
      <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  content: {
    paddingBottom: spacing.xxxl,
  },
  // Profile Header
  profileHeader: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.bgSecondary,
    borderBottomWidth: 1,
    borderColor: colors.borderLight,
  },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.bgTertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  userEmail: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.bgTertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    marginTop: spacing.sm,
  },
  proBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accentGold,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  welcomeDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 260,
    lineHeight: 18,
  },
  signInButton: {
    backgroundColor: colors.bgDark,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    marginTop: spacing.lg,
  },
  signInText: {
    color: colors.textInverse,
    fontSize: 14,
    fontWeight: '600',
  },
  signOutButton: {
    borderWidth: 1,
    borderColor: colors.borderMedium,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    marginTop: spacing.lg,
  },
  signOutText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  // Menu
  menuSection: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  menuSectionTitle: {
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
    gap: spacing.md,
    ...shadows.sm,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemLabel: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 2,
  },
  badge: {
    backgroundColor: colors.bgTertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    fontSize: 10,
    color: colors.textTertiary,
    fontWeight: '600',
  },
  activeBadge: {
    backgroundColor: colors.accentGold,
  },
  activeBadgeText: {
    color: '#fff',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: spacing.xxl,
  },
});

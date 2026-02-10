import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius } from '../theme';
import { useAppStore } from '../store/useAppStore';

export default function CreateDropAlertScreen() {
  const navigation = useNavigation();
  const createDropAlert = useAppStore((s) => s.createDropAlert);

  const [alertType, setAlertType] = useState<'drop' | 'restock'>('drop');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [keywords, setKeywords] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    const hasAnyCriteria = brand.trim() || category.trim() || keywords.trim() || minPrice.trim() || maxPrice.trim();
    if (!hasAnyCriteria) {
      Alert.alert('Missing Criteria', 'Please set at least one filter criteria for your alert.');
      return;
    }

    setIsLoading(true);
    try {
      await createDropAlert({
        alertType,
        ...(brand.trim() ? { brand: brand.trim() } : {}),
        ...(category.trim() ? { category: category.trim() } : {}),
        ...(keywords.trim() ? { keywords: keywords.trim() } : {}),
        ...(minPrice.trim() ? { minPrice: parseFloat(minPrice) } : {}),
        ...(maxPrice.trim() ? { maxPrice: parseFloat(maxPrice) } : {}),
      });
      navigation.goBack();
    } catch (err: any) {
      const message = err?.response?.data?.error || 'Failed to create alert. Please try again.';
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create Drop Alert</Text>
        <Text style={styles.subtitle}>Get notified when matching products appear or restock.</Text>

        {/* Alert Type Picker */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Alert Type</Text>
          <View style={styles.segmentedControl}>
            <TouchableOpacity
              style={[styles.segment, alertType === 'drop' && styles.segmentActive]}
              onPress={() => setAlertType('drop')}
            >
              <Text style={[styles.segmentText, alertType === 'drop' && styles.segmentTextActive]}>
                New Drop
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segment, alertType === 'restock' && styles.segmentActive]}
              onPress={() => setAlertType('restock')}
            >
              <Text style={[styles.segmentText, alertType === 'restock' && styles.segmentTextActive]}>
                Restock
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Brand */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Brand</Text>
          <TextInput
            style={styles.input}
            value={brand}
            onChangeText={setBrand}
            placeholder="e.g. Jordan, Nike, adidas"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>

        {/* Category */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category</Text>
          <TextInput
            style={styles.input}
            value={category}
            onChangeText={setCategory}
            placeholder="e.g. Sneakers, Slides"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>

        {/* Keywords */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Keywords</Text>
          <TextInput
            style={styles.input}
            value={keywords}
            onChangeText={setKeywords}
            placeholder="e.g. Retro, Dunk Low, Travis"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text style={styles.hint}>Comma-separated. Matches if any keyword appears in the product name.</Text>
        </View>

        {/* Price Range */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Price Range</Text>
          <View style={styles.priceRow}>
            <TextInput
              style={[styles.input, styles.priceInput]}
              value={minPrice}
              onChangeText={setMinPrice}
              placeholder="Min $"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
            />
            <Text style={styles.priceSeparator}>-</Text>
            <TextInput
              style={[styles.input, styles.priceInput]}
              value={maxPrice}
              onChangeText={setMaxPrice}
              placeholder="Max $"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleCreate}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.textInverse} />
          ) : (
            <Text style={styles.buttonText}>Create Alert</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    gap: spacing.xs,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  input: {
    backgroundColor: colors.bgSecondary,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 15,
    color: colors.textPrimary,
  },
  hint: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: colors.bgSecondary,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: colors.bgDark,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  segmentTextActive: {
    color: colors.textInverse,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  priceInput: {
    flex: 1,
  },
  priceSeparator: {
    fontSize: 16,
    color: colors.textMuted,
  },
  button: {
    backgroundColor: colors.bgDark,
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.textInverse,
    fontSize: 15,
    fontWeight: '600',
  },
});

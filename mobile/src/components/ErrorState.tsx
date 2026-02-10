import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../theme';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message = 'Something went wrong', onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline-outline" size={48} color={colors.textTertiary} />
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
    gap: spacing.md,
  },
  message: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.bgDark,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  retryText: {
    color: colors.textInverse,
    fontSize: 14,
    fontWeight: '600',
  },
});

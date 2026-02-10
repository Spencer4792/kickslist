import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ScrollView, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  showPopularSearches?: boolean;
  onPopularSearchPress?: (query: string) => void;
}

const POPULAR_SEARCHES = ['Jordan 4', 'Travis Scott', 'Dunk Low', 'Yeezy 350', 'New Balance 550'];

export default function SearchBar({
  value,
  onChangeText,
  onSubmit,
  placeholder = 'Search sneakers, brands, styles...',
  showPopularSearches = false,
  onPopularSearchPress,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Ionicons name="search" size={18} color={colors.textTertiary} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          returnKeyType="search"
          onSubmitEditing={onSubmit}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      {showPopularSearches && !value && (
        <View style={styles.popularContainer}>
          <Text style={styles.popularLabel}>Popular Searches</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.popularTags}
          >
            {POPULAR_SEARCHES.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={styles.popularTag}
                onPress={() => onPopularSearchPress?.(tag)}
              >
                <Text style={styles.popularTagText}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgTertiary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    paddingVertical: 4,
  },
  popularContainer: {
    gap: spacing.sm,
  },
  popularLabel: {
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  popularTags: {
    gap: spacing.sm,
  },
  popularTag: {
    backgroundColor: colors.bgTertiary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  popularTagText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});

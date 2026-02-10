import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Image } from 'expo-image';
import { colors, spacing, borderRadius } from '../theme';

interface ImageGalleryProps {
  images: string[];
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PLACEHOLDER = 'https://via.placeholder.com/600x600/f5f4f2/a8a29e?text=Image+Coming+Soon';

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / SCREEN_WIDTH);
    if (index !== activeIndex && index >= 0 && index < images.length) {
      setActiveIndex(index);
    }
  };

  const scrollToIndex = (index: number) => {
    scrollRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        decelerationRate="fast"
      >
        {images.map((uri, idx) => (
          <View key={idx} style={styles.slide}>
            <Image
              source={{ uri: uri || PLACEHOLDER }}
              style={styles.image}
              contentFit="contain"
              transition={200}
            />
          </View>
        ))}
      </ScrollView>

      {images.length > 1 && (
        <>
          <View style={styles.dots}>
            {images.map((_, idx) => (
              <View
                key={idx}
                style={[styles.dot, idx === activeIndex && styles.dotActive]}
              />
            ))}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnails}
          >
            {images.map((uri, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => scrollToIndex(idx)}
                style={[styles.thumbnail, idx === activeIndex && styles.thumbnailActive]}
              >
                <Image
                  source={{ uri: uri || PLACEHOLDER }}
                  style={styles.thumbnailImage}
                  contentFit="contain"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgTertiary,
  },
  slide: {
    width: SCREEN_WIDTH,
    aspectRatio: 1,
    padding: spacing.xl,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.borderMedium,
  },
  dotActive: {
    backgroundColor: colors.accentDark,
    width: 18,
    borderRadius: 3,
  },
  thumbnails: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.bgSecondary,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  thumbnailActive: {
    borderColor: colors.accentDark,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
});

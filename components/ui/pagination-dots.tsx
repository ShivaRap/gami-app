import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  interpolate,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface PaginationDotsProps {
  currentIndex: number;
  total: number;
  scrollX: SharedValue<number>;
  width: number;
}

interface PaginationDotProps {
  index: number;
  currentIndex: number;
  width: number;
  scrollX: SharedValue<number>;
  activeColor: string;
  inactiveColor: string;
}

function PaginationDot({
  index,
  currentIndex,
  width,
  scrollX,
  activeColor,
  inactiveColor,
}: PaginationDotProps) {
  const inputRange = [
    (index - 1) * width,
    index * width,
    (index + 1) * width,
  ];

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollX.value, inputRange, [0.8, 1.2, 0.8], 'clamp');
    const opacity = interpolate(scrollX.value, inputRange, [0.4, 1, 0.4], 'clamp');

    return {
      transform: [
        { scale: withSpring(scale, { damping: 15, stiffness: 150 }) },
      ],
      opacity: withSpring(opacity, { damping: 15, stiffness: 150 }),
    };
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          backgroundColor: index === currentIndex ? activeColor : inactiveColor,
        },
        animatedStyle,
      ]}
    />
  );
}

export function PaginationDots({
  currentIndex,
  total,
  scrollX,
  width,
}: PaginationDotsProps) {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => (
        <PaginationDot
          key={index}
          index={index}
          currentIndex={currentIndex}
          width={width}
          scrollX={scrollX}
          activeColor={palette.pastel.pink}
          inactiveColor={palette.border}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});



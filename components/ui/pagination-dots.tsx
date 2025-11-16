import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface PaginationDotsProps {
  currentIndex: number;
  total: number;
  scrollX: Animated.SharedValue<number>;
  width: number;
}

export function PaginationDots({
  currentIndex,
  total,
  scrollX,
  width,
}: PaginationDotsProps) {
  const colorScheme = useColorScheme();
  const pastelColor = Colors[colorScheme ?? 'light'].pastel.pink;

  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => {
        const inputRange = [
          (index - 1) * width,
          index * width,
          (index + 1) * width,
        ];

        const animatedStyle = useAnimatedStyle(() => {
          const scale = interpolate(
            scrollX.value,
            inputRange,
            [0.8, 1.2, 0.8],
            'clamp'
          );
          const opacity = interpolate(
            scrollX.value,
            inputRange,
            [0.4, 1, 0.4],
            'clamp'
          );

          return {
            transform: [{ scale: withSpring(scale, { damping: 15, stiffness: 150 }) }],
            opacity: withSpring(opacity, { damping: 15, stiffness: 150 }),
          };
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === currentIndex
                    ? pastelColor
                    : Colors[colorScheme ?? 'light'].border,
              },
              animatedStyle,
            ]}
          />
        );
      })}
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



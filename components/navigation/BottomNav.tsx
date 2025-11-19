import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useBottomNav } from '@/contexts/BottomNavContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol, type IconSymbolName } from '@/components/ui/icon-symbol';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface TabItem {
  name: string;
  route: string;
  icon: IconSymbolName;
  label: string;
}

const tabs: TabItem[] = [
  { name: 'stats', route: '/(tabs)/stats', icon: 'house.fill', label: 'Home' },
  { name: 'walk', route: '/(tabs)/walk', icon: 'figure.walk', label: 'Walk' },
  { name: 'settings', route: '/(tabs)/settings', icon: 'gearshape.fill', label: 'Settings' },
];

function TabButton({
  tab,
  active,
  onPress,
  colorScheme,
}: {
  tab: TabItem;
  active: boolean;
  onPress: () => void;
  colorScheme: 'light' | 'dark' | null | undefined;
}) {
  const scale = useSharedValue(1);

  const tabAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(1.1, { damping: 10, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 200 });
  };

  return (
    <AnimatedTouchable
      style={[styles.tab, tabAnimatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.7}>
      <IconSymbol
        name={tab.icon}
        size={24}
        color={
          active
            ? Colors[colorScheme ?? 'light'].pastel.pink
            : Colors[colorScheme ?? 'light'].tabIconDefault
        }
      />
      <Text
        style={[
          styles.tabLabel,
          {
            color: active
              ? Colors[colorScheme ?? 'light'].pastel.pink
              : Colors[colorScheme ?? 'light'].tabIconDefault,
          },
        ]}>
        {tab.label}
      </Text>
    </AnimatedTouchable>
  );
}

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const colorScheme = useColorScheme();
  const { isVisible } = useBottomNav();
  const insets = useSafeAreaInsets();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: isVisible
            ? withSpring(0, { damping: 15, stiffness: 150 })
            : withSpring(100, { damping: 15, stiffness: 150 }),
        },
      ],
      opacity: isVisible
        ? withSpring(1, { damping: 15, stiffness: 150 })
        : withSpring(0, { damping: 15, stiffness: 150 }),
    };
  });

  if (!isVisible) {
    return null;
  }

  const handleTabPress = (tab: TabItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(tab.route as any);
  };

  const isActive = (route: string) => {
    return pathname === route || pathname?.includes(route.split('/').pop() || '');
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: Colors[colorScheme ?? 'light'].cardBackground,
          borderTopColor: Colors[colorScheme ?? 'light'].border,
          paddingBottom: Math.max(insets.bottom, 8),
        },
        animatedStyle,
      ]}>
      <View style={styles.tabs}>
        {tabs.map((tab) => {
          const active = isActive(tab.route);

          return (
            <TabButton
              key={tab.name}
              tab={tab}
              active={active}
              onPress={() => handleTabPress(tab)}
              colorScheme={colorScheme}
            />
          );
        })}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    minHeight: 44, // HIG minimum tap target
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
});


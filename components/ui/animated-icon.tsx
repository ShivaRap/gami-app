import React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { IconSymbol } from './icon-symbol';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface AnimatedIconProps {
  name: string;
  size?: number;
  color?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export function AnimatedIcon({
  name,
  size = 24,
  color,
  onPress,
  style,
}: AnimatedIconProps) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const handlePress = () => {
    if (onPress) {
      scale.value = withSpring(1.2, {
        damping: 10,
        stiffness: 200,
      });
      rotation.value = withSpring(rotation.value + 15, {
        damping: 10,
        stiffness: 200,
      });
      setTimeout(() => {
        scale.value = withSpring(1, {
          damping: 10,
          stiffness: 200,
        });
        rotation.value = withSpring(0, {
          damping: 10,
          stiffness: 200,
        });
      }, 200);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const content = (
    <Animated.View style={animatedStyle}>
      <IconSymbol name={name as any} size={size} color={color || '#000'} />
    </Animated.View>
  );

  if (onPress) {
    return (
      <AnimatedTouchable
        onPress={handlePress}
        activeOpacity={0.7}
        style={style}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        {content}
      </AnimatedTouchable>
    );
  }

  return <Animated.View style={style}>{content}</Animated.View>;
}


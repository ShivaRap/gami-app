/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

// Pastel color palette for Gāmi
export const PastelColors = {
  pink: '#FFB3D9',
  blue: '#B3D9FF',
  purple: '#D9B3FF',
  green: '#B3FFD9',
  yellow: '#FFF4B3',
  peach: '#FFD9B3',
  lavender: '#E6D9FF',
  mint: '#D9FFE6',
  coral: '#FFB3B3',
  sky: '#B3E6FF',
};

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    // Pastel colors for light mode
    pastel: PastelColors,
    cardBackground: '#FAFAFA',
    border: '#E0E0E0',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    // Slightly darker pastels for dark mode
    pastel: {
      pink: '#CC8FA8',
      blue: '#8FA8CC',
      purple: '#A88FCC',
      green: '#8FCCA8',
      yellow: '#CCC48F',
      peach: '#CCA88F',
      lavender: '#B8A8CC',
      mint: '#A8CCB8',
      coral: '#CC8F8F',
      sky: '#8FB8CC',
    },
    cardBackground: '#1F1F1F',
    border: '#333333',
  },
};

// Animation timing constants matching iOS HIG (~0.35s ease-in-out)
export const AnimationTiming = {
  fast: 200,
  normal: 350,
  slow: 500,
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
};

export const Fonts = {
  body: 'DM-Sans-Regular', // Default weight for UI/body copy
  bodyMedium: 'DM-Sans-Medium',
  bodyBold: 'DM-Sans-Bold',
  bodyBlack: 'DM-Sans-Black',
  heading: 'BebasNeue-Regular',
};

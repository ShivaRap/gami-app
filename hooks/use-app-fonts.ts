import { useFonts } from 'expo-font';

const FONT_SOURCES = {
  'DM-Sans-Thin': require('../fonts/DMSans-100Thin.ttf'),
  'DM-Sans-ThinItalic': require('../fonts/DMSans-100Thin_Italic.ttf'),
  'DM-Sans-ExtraLight': require('../fonts/DMSans-200ExtraLight.ttf'),
  'DM-Sans-ExtraLightItalic': require('../fonts/DMSans-200ExtraLight_Italic.ttf'),
  'DM-Sans-Light': require('../fonts/DMSans-300Light.ttf'),
  'DM-Sans-LightItalic': require('../fonts/DMSans-300Light_Italic.ttf'),
  'DM-Sans-Regular': require('../fonts/DMSans-400Regular.ttf'),
  'DM-Sans-RegularItalic': require('../fonts/DMSans-400Regular_Italic.ttf'),
  'DM-Sans-Medium': require('../fonts/DMSans-500Medium.ttf'),
  'DM-Sans-MediumItalic': require('../fonts/DMSans-500Medium_Italic.ttf'),
  'DM-Sans-SemiBold': require('../fonts/DMSans-600SemiBold.ttf'),
  'DM-Sans-SemiBoldItalic': require('../fonts/DMSans-600SemiBold_Italic.ttf'),
  'DM-Sans-Bold': require('../fonts/DMSans-700Bold.ttf'),
  'DM-Sans-BoldItalic': require('../fonts/DMSans-700Bold_Italic.ttf'),
  'DM-Sans-ExtraBold': require('../fonts/DMSans-800ExtraBold.ttf'),
  'DM-Sans-ExtraBoldItalic': require('../fonts/DMSans-800ExtraBold_Italic.ttf'),
  'DM-Sans-Black': require('../fonts/DMSans-900Black.ttf'),
  'DM-Sans-BlackItalic': require('../fonts/DMSans-900Black_Italic.ttf'),
  'BebasNeue-Regular': require('../fonts/BebasNeue-Regular.ttf'),
};

export function useAppFonts() {
  return useFonts(FONT_SOURCES);
}

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Text, TextInput, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Colors, Fonts } from '@/constants/theme';
import { BottomNavProvider } from '@/contexts/BottomNavContext';
import { useAppFonts } from '@/hooks/use-app-fonts';
import { useColorScheme } from '@/hooks/use-color-scheme';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useAppFonts();

  useEffect(() => {
    if (fontError) {
      console.error('Failed to load fonts:', fontError);
      // Hide splash screen even if fonts failed to load
      SplashScreen.hideAsync();
      return;
    }

    if (!fontsLoaded) {
      return;
    }

    if (!Text.defaultProps) {
      Text.defaultProps = {};
    }
    const existingTextStyle = Text.defaultProps.style;
    Text.defaultProps.style = [
      { fontFamily: Fonts.body },
      ...(Array.isArray(existingTextStyle)
        ? existingTextStyle
        : existingTextStyle
        ? [existingTextStyle]
        : []),
    ];

    if (!TextInput.defaultProps) {
      TextInput.defaultProps = {};
    }
    const existingInputStyle = TextInput.defaultProps.style;
    TextInput.defaultProps.style = [
      { fontFamily: Fonts.body },
      ...(Array.isArray(existingInputStyle)
        ? existingInputStyle
        : existingInputStyle
        ? [existingInputStyle]
        : []),
    ];

    SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  // Don't render until fonts are loaded or failed to load
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <BottomNavProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors[colorScheme ?? 'light'].background,
            }}>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="onboarding" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="kudos" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
          </View>
          <StatusBar
            style={colorScheme === 'dark' ? 'light' : 'dark'}
            translucent
            backgroundColor="transparent"
          />
        </ThemeProvider>
      </BottomNavProvider>
    </SafeAreaProvider>
  );
}

import { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getOnboardingComplete } from '@/utils/storage';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Keep the splash screen visible while we check onboarding status
SplashScreen.preventAutoHideAsync();

export default function SplashScreenComponent() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    let mounted = true;

    async function checkOnboarding() {
      // Small delay to ensure navigator is mounted
      await new Promise((resolve) => setTimeout(resolve, 100));
      
      if (!mounted) return;

      try {
        const isComplete = await getOnboardingComplete();
        
        if (!mounted) return;

        // Hide splash screen
        await SplashScreen.hideAsync();

        // Additional small delay before navigation
        await new Promise((resolve) => setTimeout(resolve, 50));

        if (!mounted) return;

        // Navigate based on onboarding status
        if (isComplete) {
          router.replace('/(tabs)/stats');
        } else {
          router.replace('/onboarding');
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        if (!mounted) return;
        
        // Default to onboarding on error
        await SplashScreen.hideAsync();
        setTimeout(() => {
          if (mounted) {
            router.replace('/onboarding');
          }
        }, 50);
      }
    }

    checkOnboarding();

    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? 'light'].background },
      ]}>
      <View style={styles.content}>
        <ActivityIndicator
          size="large"
          color={Colors[colorScheme ?? 'light'].pastel.pink}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


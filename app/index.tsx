import { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getOnboardingComplete } from '@/utils/storage';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SplashScreenComponent() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    let mounted = true;

    async function checkOnboarding() {
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (!mounted) return;

      try {
        const isComplete = await getOnboardingComplete();

        if (!mounted) return;

        await new Promise((resolve) => setTimeout(resolve, 50));

        if (!mounted) return;

        router.replace(isComplete ? '/(tabs)/stats' : '/onboarding');
      } catch (error) {
        console.error('Error checking onboarding status:', error);

        if (!mounted) return;

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

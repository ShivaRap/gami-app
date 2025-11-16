import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import ConfettiCannon from 'react-native-confetti-cannon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBottomNav } from '@/contexts/BottomNavContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function KudosScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { show } = useBottomNav();

  useEffect(() => {
    // Show bottom nav again
    show();

    // Auto-navigate back to stats after 3 seconds
    const timer = setTimeout(() => {
      router.replace('/(tabs)/stats');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router, show]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? 'light'].background },
      ]}>
      <ConfettiCannon
        count={200}
        origin={{ x: -10, y: 0 }}
        fadeOut
        autoStart
      />
      <View style={styles.content}>
        <Text style={[styles.emoji, { color: Colors[colorScheme ?? 'light'].text }]}>
          🎉
        </Text>
        <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
          Great Job!
        </Text>
        <Text
          style={[
            styles.message,
            { color: Colors[colorScheme ?? 'light'].text },
          ]}>
          You completed your interval walking session!
        </Text>
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
    padding: 20,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 28,
  },
});



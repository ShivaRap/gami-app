import { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ListRenderItem,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { setOnboardingComplete } from '@/utils/storage';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AnimatedButton } from '@/components/ui/animated-button';
import { PaginationDots } from '@/components/ui/pagination-dots';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingCard {
  id: string;
  title: string;
  description: string;
  color: string;
}

const onboardingData: OnboardingCard[] = [
  {
    id: '1',
    title: 'Welcome to Gāmi',
    description:
      'Your personal interval walking trainer. Start your journey to better health with guided walking sessions.',
    color: Colors.light.pastel.pink,
  },
  {
    id: '2',
    title: 'Interval Walking',
    description:
      'Follow our proven 30-minute program: 3 minutes slow pace, then 3 minutes fast pace. Repeat for optimal results.',
    color: Colors.light.pastel.blue,
  },
  {
    id: '3',
    title: 'Track Your Progress',
    description:
      'Monitor your sessions, see your stats, and celebrate your achievements. Let\'s get started!',
    color: Colors.light.pastel.green,
  },
];

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<OnboardingCard>);

export default function OnboardingScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const scrollX = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleGetStarted = async () => {
    await setOnboardingComplete();
    router.replace('/(tabs)/stats');
  };

  const renderCard: ListRenderItem<OnboardingCard> = ({ item, index }) => {
    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: item.color,
            width: SCREEN_WIDTH,
          },
        ]}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
          {index === onboardingData.length - 1 && (
            <View style={styles.buttonContainer}>
              <AnimatedButton
                title="Get Started"
                onPress={handleGetStarted}
                variant="primary"
                style={styles.button}
              />
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? 'light'].background },
      ]}>
      <AnimatedFlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setCurrentIndex(index);
        }}
      />
      <PaginationDots
        currentIndex={currentIndex}
        total={onboardingData.length}
        scrollX={scrollX}
        width={SCREEN_WIDTH}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  cardContent: {
    alignItems: 'center',
    maxWidth: 300,
  },
  cardTitle: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: '#11181C',
  },
  cardDescription: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    color: '#11181C',
    marginBottom: 32,
  },
  buttonContainer: {
    marginTop: 24,
    width: '100%',
  },
  button: {
    minWidth: 200,
  },
});



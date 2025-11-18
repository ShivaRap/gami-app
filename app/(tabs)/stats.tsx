import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface SessionStats {
  date: string;
  duration: number;
  intervals: number;
}

// Placeholder: In a real app, this would come from storage/API
const hasStats = false;
const recentSession: SessionStats | null = null;

const researchLinks = [
  {
    title: 'Interval Walking Research',
    url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4241367/',
  },
  {
    title: 'Benefits of Interval Training',
    url: 'https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/interval-training/art-20044588',
  },
];

export default function StatsScreen() {
  const colorScheme = useColorScheme();
  const [stats, setStats] = useState<SessionStats | null>(recentSession);
  const [hasCompletedSessions, setHasCompletedSessions] = useState(hasStats);

  // In a real app, load stats from storage here
  useEffect(() => {
    // Placeholder: Load stats from AsyncStorage
  }, []);

  const handleLinkPress = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error('Failed to open URL:', err)
    );
  };

  if (!hasCompletedSessions) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: Colors[colorScheme ?? 'light'].background },
        ]}>
        <ScrollView
          contentContainerStyle={styles.emptyContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Welcome to Gāmi!
            </Text>
            <Text
              style={[
                styles.emptyDescription,
                { color: Colors[colorScheme ?? 'light'].text },
              ]}>
              Get started with your first interval walking session. Here's how it works:
            </Text>
            <View style={styles.instructionsContainer}>
              <View style={styles.instructionItem}>
                <View
                  style={[
                    styles.instructionNumber,
                    { backgroundColor: Colors[colorScheme ?? 'light'].pastel.pink },
                  ]}>
                  <Text style={styles.instructionNumberText}>1</Text>
                </View>
                <Text style={[styles.instructionText, { color: Colors[colorScheme ?? 'light'].text }]}>
                  Start with 3 minutes of slow-paced walking
                </Text>
              </View>
              <View style={styles.instructionItem}>
                <View
                  style={[
                    styles.instructionNumber,
                    { backgroundColor: Colors[colorScheme ?? 'light'].pastel.blue },
                  ]}>
                  <Text style={styles.instructionNumberText}>2</Text>
                </View>
                <Text style={[styles.instructionText, { color: Colors[colorScheme ?? 'light'].text }]}>
                  Switch to 3 minutes of fast-paced walking
                </Text>
              </View>
              <View style={styles.instructionItem}>
                <View
                  style={[
                    styles.instructionNumber,
                    { backgroundColor: Colors[colorScheme ?? 'light'].pastel.green },
                  ]}>
                  <Text style={styles.instructionNumberText}>3</Text>
                </View>
                <Text style={[styles.instructionText, { color: Colors[colorScheme ?? 'light'].text }]}>
                  Repeat for a total of 30 minutes
                </Text>
              </View>
            </View>
            <View style={styles.researchSection}>
              <Text
                style={[
                  styles.researchTitle,
                  { color: Colors[colorScheme ?? 'light'].text },
                ]}>
                Learn More
              </Text>
              {researchLinks.map((link, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleLinkPress(link.url)}
                  style={[
                    styles.researchLink,
                    {
                      backgroundColor: Colors[colorScheme ?? 'light'].cardBackground,
                      borderColor: Colors[colorScheme ?? 'light'].border,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.researchLinkText,
                      { color: Colors[colorScheme ?? 'light'].pastel.blue },
                    ]}>
                    {link.title} →
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? 'light'].background },
      ]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
          Your Stats
        </Text>
        {stats && (
          <View
            style={[
              styles.statsCard,
              {
                backgroundColor: Colors[colorScheme ?? 'light'].cardBackground,
                borderColor: Colors[colorScheme ?? 'light'].border,
              },
            ]}>
            <Text
              style={[
                styles.statsCardTitle,
                { color: Colors[colorScheme ?? 'light'].text },
              ]}>
              Most Recent Session
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text
                  style={[
                    styles.statValue,
                    { color: Colors[colorScheme ?? 'light'].pastel.pink },
                  ]}>
                  {stats.duration}
                </Text>
                <Text
                  style={[
                    styles.statLabel,
                    { color: Colors[colorScheme ?? 'light'].text },
                  ]}>
                  Minutes
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text
                  style={[
                    styles.statValue,
                    { color: Colors[colorScheme ?? 'light'].pastel.blue },
                  ]}>
                  {stats.intervals}
                </Text>
                <Text
                  style={[
                    styles.statLabel,
                    { color: Colors[colorScheme ?? 'light'].text },
                  ]}>
                  Intervals
                </Text>
              </View>
            </View>
            <Text
              style={[
                styles.statsDate,
                { color: Colors[colorScheme ?? 'light'].text },
              ]}>
              {stats.date}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  emptyContent: {
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 24,
    fontFamily: Fonts.heading,
    letterSpacing: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: Fonts.heading,
    letterSpacing: 1,
  },
  emptyDescription: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 26,
    fontFamily: Fonts.body,
  },
  instructionsContainer: {
    width: '100%',
    marginBottom: 32,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  instructionNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  instructionNumberText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#11181C',
    fontFamily: Fonts.heading,
    letterSpacing: 0.5,
  },
  instructionText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
    fontFamily: Fonts.body,
  },
  researchSection: {
    width: '100%',
    marginTop: 32,
  },
  researchTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    fontFamily: Fonts.heading,
    letterSpacing: 0.5,
  },
  researchLink: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  researchLinkText: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: Fonts.body,
  },
  statsCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  statsCardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    fontFamily: Fonts.heading,
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 4,
    fontFamily: Fonts.heading,
    letterSpacing: 1,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
    fontFamily: Fonts.body,
  },
  statsDate: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
    fontFamily: Fonts.body,
  },
});


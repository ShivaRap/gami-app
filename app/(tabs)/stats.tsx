import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface SessionStats {
  date: string;
  duration: number;
  intervals: number;
}

// Placeholder: In a real app, this would come from storage/API
const hasStats = false;
const recentSession: SessionStats | null = null;

type ResearchLink = Readonly<{
  title: string;
  url: string;
}>;

type InstructionStep = Readonly<{
  number: string;
  text: string;
  accent: keyof typeof Colors.light.pastel;
}>;

const researchLinks: ResearchLink[] = [
  {
    title: 'Interval Walking Research',
    url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4241367/',
  },
  {
    title: 'Benefits of Interval Training',
    url: 'https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/interval-training/art-20044588',
  },
];

const instructionSteps: InstructionStep[] = [
  {
    number: '1',
    text: 'Start with 3 minutes of slow-paced walking',
    accent: 'pink',
  },
  {
    number: '2',
    text: 'Switch to 3 minutes of fast-paced walking',
    accent: 'blue',
  },
  {
    number: '3',
    text: 'Repeat for a total of 30 minutes',
    accent: 'green',
  },
];

export default function StatsScreen() {
  const theme = useColorScheme() ?? 'light';
  const palette = Colors[theme];
  const instructionNumberTextColor =
    theme === 'dark' ? palette.background : palette.text;
  const [stats] = useState<SessionStats | null>(recentSession);
  const [hasCompletedSessions] = useState(hasStats);

  // In a real app, load stats from storage here
  useEffect(() => {
    // Placeholder: Load stats from AsyncStorage
  }, []);

  const handleLinkPress = useCallback((url: string) => {
    Linking.openURL(url).catch((error: unknown) => {
      console.error('Failed to open URL:', error);
    });
  }, []);

  if (!hasCompletedSessions) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: palette.background },
        ]}>
        <ScrollView
          contentContainerStyle={styles.emptyContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: palette.text }]}>
              Welcome to Gāmi!
            </Text>
            <Text
              style={[
                styles.emptyDescription,
                { color: palette.text },
              ]}>
              Get started with your first interval walking session. Here’s how it works:
            </Text>
            <View style={styles.instructionsContainer}>
              {instructionSteps.map((step) => (
                <View key={step.number} style={styles.instructionItem}>
                  <View
                    style={[
                      styles.instructionNumber,
                      { backgroundColor: palette.pastel[step.accent] },
                    ]}>
                    <Text
                      style={[
                        styles.instructionNumberText,
                        { color: instructionNumberTextColor },
                      ]}>
                      {step.number}
                    </Text>
                  </View>
                  <Text style={[styles.instructionText, { color: palette.text }]}>
                    {step.text}
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.researchSection}>
              <Text
                style={[
                  styles.researchTitle,
                  { color: palette.text },
                ]}>
                Learn More
              </Text>
              {researchLinks.map((link) => (
                <TouchableOpacity
                  key={link.title}
                  onPress={() => handleLinkPress(link.url)}
                  style={[
                    styles.researchLink,
                    {
                      backgroundColor: palette.cardBackground,
                      borderColor: palette.border,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.researchLinkText,
                      { color: palette.pastel.blue },
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
        { backgroundColor: palette.background },
      ]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: palette.text }]}>
          Your Stats
        </Text>
        {stats && (
          <View
            style={[
              styles.statsCard,
              {
                backgroundColor: palette.cardBackground,
                borderColor: palette.border,
              },
            ]}>
            <Text
              style={[
                styles.statsCardTitle,
                { color: palette.text },
              ]}>
              Most Recent Session
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text
                  style={[
                    styles.statValue,
                    { color: palette.pastel.pink },
                  ]}>
                  {stats.duration}
                </Text>
                <Text
                  style={[
                    styles.statLabel,
                    { color: palette.text },
                  ]}>
                  Minutes
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text
                  style={[
                    styles.statValue,
                    { color: palette.pastel.blue },
                  ]}>
                  {stats.intervals}
                </Text>
                <Text
                  style={[
                    styles.statLabel,
                    { color: palette.text },
                  ]}>
                  Intervals
                </Text>
              </View>
            </View>
            <Text
              style={[
                styles.statsDate,
                { color: palette.text },
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
  },
  emptyDescription: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 26,
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
  },
  instructionText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
  },
  researchSection: {
    width: '100%',
    marginTop: 32,
  },
  researchTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
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
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  statsDate: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
});



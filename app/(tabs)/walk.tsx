import { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useBottomNav } from '@/contexts/BottomNavContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AnimatedButton } from '@/components/ui/animated-button';

type Phase = 'slow' | 'fast';

const PHASE_DURATION = 180; // 3 minutes in seconds
const TOTAL_SESSION_DURATION = 1800; // 30 minutes in seconds
const TOTAL_INTERVALS = 5; // 5 cycles

// Format seconds to MM:SS
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Get color for phase
function getPhaseColor(phase: Phase, colorScheme: 'light' | 'dark' | null | undefined): string {
  return phase === 'slow'
    ? Colors[colorScheme ?? 'light'].pastel.blue
    : Colors[colorScheme ?? 'light'].pastel.pink;
}

export default function WalkScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { hide, show } = useBottomNav();
  
  // Session state
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<Phase>('slow');
  const [phaseTimeRemaining, setPhaseTimeRemaining] = useState(PHASE_DURATION);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [currentInterval, setCurrentInterval] = useState(1);
  const [devMode, setDevMode] = useState(false);
  
  // Refs for timer and gesture handling
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTapRef = useRef<number>(0);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate next phase
  const getNextPhase = useCallback((elapsed?: number): Phase | 'complete' => {
    const elapsedTime = elapsed !== undefined ? elapsed : totalElapsed;
    if (elapsedTime >= TOTAL_SESSION_DURATION) {
      return 'complete';
    }
    return currentPhase === 'slow' ? 'fast' : 'slow';
  }, [currentPhase, totalElapsed]);

  // Handle phase transition
  const transitionToNextPhase = useCallback((elapsedTime?: number) => {
    const nextPhase = getNextPhase(elapsedTime);
    
    if (nextPhase === 'complete') {
      // Session complete
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsSessionActive(false);
      show(); // Restore bottom nav
      router.push('/kudos');
      return;
    }

    // Transition to next phase
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (nextPhase === 'slow') {
      // Moving to slow pace means starting a new interval
      setCurrentInterval((prev) => Math.min(prev + 1, TOTAL_INTERVALS));
    }
    
    setCurrentPhase(nextPhase);
    setPhaseTimeRemaining(PHASE_DURATION);
  }, [getNextPhase, router, show]);

  // Skip to next phase (dev mode)
  const skipToNextPhase = useCallback(() => {
    if (!devMode) return;
    
    // Prevent skipping if we're at the last phase of the last interval
    if (currentInterval === TOTAL_INTERVALS && currentPhase === 'fast') {
      // Already at the last phase, can't skip
      return;
    }
    
    // Add the remaining phase time to total elapsed when skipping
    setTotalElapsed((prev) => {
      const skippedTime = phaseTimeRemaining;
      const newTotal = prev + skippedTime;
      
      // If skipping would complete the session, mark it complete
      if (newTotal >= TOTAL_SESSION_DURATION) {
        // Session will complete on next transition
        return TOTAL_SESSION_DURATION;
      }
      return newTotal;
    });
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    transitionToNextPhase();
  }, [devMode, transitionToNextPhase, currentInterval, currentPhase, phaseTimeRemaining]);

  // Handle timer tick
  useEffect(() => {
    if (!isSessionActive) return;

    intervalRef.current = setInterval(() => {
      setTotalElapsed((prevTotal) => {
        const newTotal = prevTotal + 1;
        
        // Check if session is complete first
        if (newTotal >= TOTAL_SESSION_DURATION) {
          setTimeout(() => {
            // Pass the new total elapsed time directly to avoid state timing issues
            transitionToNextPhase(newTotal);
          }, 0);
          return newTotal;
        }

        // Update phase timer
        setPhaseTimeRemaining((prevPhase) => {
          if (prevPhase <= 1) {
            // Phase complete, transition to next phase
            setTimeout(() => {
              transitionToNextPhase();
            }, 0);
            return 0;
          }
          return prevPhase - 1;
        });

        return newTotal;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isSessionActive, transitionToNextPhase]);

  // Handle long press for dev mode toggle
  const handleLongPress = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    
    longPressTimerRef.current = setTimeout(() => {
      setDevMode((prev) => {
        const newMode = !prev;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        return newMode;
      });
      longPressTimerRef.current = null;
    }, 500); // 500ms for long press
  }, []);

  // Handle double tap for skip phase
  const handleDoubleTap = useCallback(() => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap detected
      skipToNextPhase();
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  }, [skipToNextPhase]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  const handleStartSession = () => {
    setIsSessionActive(true);
    setCurrentPhase('slow');
    setPhaseTimeRemaining(PHASE_DURATION);
    setTotalElapsed(0);
    setCurrentInterval(1);
    setDevMode(false);
    hide(); // Hide bottom navigation bar
  };

  const handleEndSession = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsSessionActive(false);
    show(); // Restore bottom nav
    router.push('/kudos');
  };

  const phaseColor = getPhaseColor(currentPhase, colorScheme);
  const formattedPhaseTime = formatTime(phaseTimeRemaining);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? 'light'].background },
      ]}>
      <View style={styles.content}>
        {!isSessionActive ? (
          <>
            <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
              Ready to Walk?
            </Text>
            <Text
              style={[
                styles.description,
                { color: Colors[colorScheme ?? 'light'].text },
              ]}>
              Start your interval walking session. You’ll walk for 30 minutes total:
            </Text>
            <View style={styles.instructions}>
              <View style={styles.instructionRow}>
                <View
                  style={[
                    styles.instructionBadge,
                    { backgroundColor: Colors[colorScheme ?? 'light'].pastel.blue },
                  ]}>
                  <Text style={styles.instructionBadgeText}>3 min</Text>
                </View>
                <Text style={[styles.instructionText, { color: Colors[colorScheme ?? 'light'].text }]}>
                  Slow pace
                </Text>
              </View>
              <Text style={[styles.instructionArrow, { color: Colors[colorScheme ?? 'light'].text }]}>
                ↓
              </Text>
              <View style={styles.instructionRow}>
                <View
                  style={[
                    styles.instructionBadge,
                    { backgroundColor: Colors[colorScheme ?? 'light'].pastel.pink },
                  ]}>
                  <Text style={styles.instructionBadgeText}>3 min</Text>
                </View>
                <Text style={[styles.instructionText, { color: Colors[colorScheme ?? 'light'].text }]}>
                  Fast pace
                </Text>
              </View>
              <Text style={[styles.instructionRepeat, { color: Colors[colorScheme ?? 'light'].text }]}>
                Repeat 5 times
              </Text>
            </View>
            <AnimatedButton
              title="Start Session"
              onPress={handleStartSession}
              variant="primary"
              style={styles.startButton}
            />
          </>
        ) : (
          <>
            <Text style={[styles.sessionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Session in Progress
            </Text>
            {devMode && (
              <View style={styles.devBadge}>
                <Text style={styles.devBadgeText}>DEV MODE</Text>
              </View>
            )}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleDoubleTap}
              onLongPress={handleLongPress}
              onPressOut={() => {
                if (longPressTimerRef.current) {
                  clearTimeout(longPressTimerRef.current);
                  longPressTimerRef.current = null;
                }
              }}>
              <View style={styles.timerContainer}>
                <Text style={[styles.timerLabel, { color: Colors[colorScheme ?? 'light'].text }]}>
                  Current Phase
                </Text>
                <Text style={[styles.timerValue, { color: phaseColor }]}>
                  {currentPhase === 'slow' ? 'Slow Pace' : 'Fast Pace'}
                </Text>
                <Text style={[styles.timerTime, { color: Colors[colorScheme ?? 'light'].text }]}>
                  {formattedPhaseTime}
                </Text>
                <Text style={[styles.intervalLabel, { color: Colors[colorScheme ?? 'light'].text }]}>
                  Interval {currentInterval} of {TOTAL_INTERVALS}
                </Text>
                {devMode && (
                  <Text style={[styles.devHint, { color: Colors[colorScheme ?? 'light'].text }]}>
                    Double tap to skip phase
                  </Text>
                )}
              </View>
            </TouchableOpacity>
            <AnimatedButton
              title="End Session"
              onPress={handleEndSession}
              variant="outline"
              style={styles.endButton}
            />
          </>
        )}
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
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 26,
  },
  instructions: {
    alignItems: 'center',
    marginBottom: 40,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  instructionBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  instructionBadgeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#11181C',
  },
  instructionText: {
    fontSize: 18,
    fontWeight: '500',
  },
  instructionArrow: {
    fontSize: 24,
    marginVertical: 8,
  },
  instructionRepeat: {
    fontSize: 16,
    marginTop: 16,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  startButton: {
    minWidth: 200,
  },
  sessionTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  devBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  devBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 40,
    padding: 20,
  },
  timerLabel: {
    fontSize: 16,
    marginBottom: 8,
    opacity: 0.7,
  },
  timerValue: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 16,
  },
  timerTime: {
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 8,
  },
  intervalLabel: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 8,
  },
  devHint: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 8,
    fontStyle: 'italic',
  },
  endButton: {
    minWidth: 200,
  },
});

import { AnimatedButton } from '@/components/ui/animated-button';
import { FastPaceView } from '@/components/walk/FastPaceView';
import { SlowPaceView } from '@/components/walk/SlowPaceView';
import { Colors, Fonts } from '@/constants/theme';
import { useBottomNav } from '@/contexts/BottomNavContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

export default function WalkScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { hide, show } = useBottomNav();
  const palette = Colors[colorScheme ?? 'light'];
  
  // Session state
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<Phase>('slow');
  const [phaseTimeRemaining, setPhaseTimeRemaining] = useState(PHASE_DURATION);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [currentInterval, setCurrentInterval] = useState(1);
  const [devMode, setDevMode] = useState(false);
  
  // Refs for timer and gesture handling
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    impactAsync(ImpactFeedbackStyle.Medium);
    
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
    
    impactAsync(ImpactFeedbackStyle.Light);
    transitionToNextPhase();
  }, [devMode, transitionToNextPhase, currentInterval, currentPhase, phaseTimeRemaining]);

  // Handle timer tick
  useEffect(() => {
    if (!isSessionActive || isPaused) {
      // Clear interval if session is inactive or paused
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

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
  }, [isSessionActive, isPaused, transitionToNextPhase]);

  // Handle long press for dev mode toggle
  const handleLongPress = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    
    longPressTimerRef.current = setTimeout(() => {
      setDevMode((prev) => {
        const newMode = !prev;
        impactAsync(ImpactFeedbackStyle.Light);
        return newMode;
      });
      longPressTimerRef.current = null;
    }, 500); // 500ms for long press
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
      show();
    };
  }, [show]);

  const handleStartSession = () => {
    setIsSessionActive(true);
    setIsPaused(false);
    setCurrentPhase('slow');
    setPhaseTimeRemaining(PHASE_DURATION);
    setTotalElapsed(0);
    setCurrentInterval(1);
    setDevMode(false);
    hide(); // Hide bottom navigation bar
  };

  const handlePauseResume = () => {
    setIsPaused((prev) => !prev);
    impactAsync(ImpactFeedbackStyle.Light);
  };

  const handleEndSession = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsSessionActive(false);
    setIsPaused(false);
    show(); // Restore bottom nav
    router.push('/kudos');
  };

  const formattedPhaseTime = formatTime(phaseTimeRemaining);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: palette.background },
      ]}>
      {!isSessionActive ? (
        <View style={styles.content}>
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
        </View>
      ) : currentPhase === 'slow' ? (
        <SlowPaceView
          phaseTimeRemaining={formattedPhaseTime}
          isPaused={isPaused}
          onPauseResume={handlePauseResume}
          onStopSession={handleEndSession}
          devMode={devMode}
          onSkip={skipToNextPhase}
          onLongPress={handleLongPress}
        />
      ) : (
        <FastPaceView
          phaseTimeRemaining={formattedPhaseTime}
          isPaused={isPaused}
          onPauseResume={handlePauseResume}
          onStopSession={handleEndSession}
          devMode={devMode}
          onSkip={skipToNextPhase}
          onLongPress={handleLongPress}
        />
      )}
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
    fontFamily: Fonts.heading,
    letterSpacing: 1,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 26,
    fontFamily: Fonts.body,
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
    fontFamily: Fonts.body,
  },
  instructionText: {
    fontSize: 18,
    fontWeight: '500',
    fontFamily: Fonts.body,
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
    fontFamily: Fonts.body,
  },
  startButton: {
    minWidth: 200,
  },
});

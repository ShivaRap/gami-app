import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Fonts } from '@/constants/theme';

interface SlowPaceViewProps {
  phaseTimeRemaining: string;
  isPaused: boolean;
  onPauseResume: () => void;
  onStopSession: () => void;
  devMode?: boolean;
  onSkip?: () => void;
  onLongPress?: () => void;
}

const SLOW_PACE_BG = '#FFF8E7'; // Soft Cream
const SLOW_PACE_TEXT = '#1A1A1A'; // Deep Ink

export function SlowPaceView({
  phaseTimeRemaining,
  isPaused,
  onPauseResume,
  onStopSession,
  devMode = false,
  onSkip,
  onLongPress,
}: SlowPaceViewProps) {
  return (
    <View style={styles.container}>
      {/* DEV: Skip chip */}
      {devMode && (
        <TouchableOpacity
          style={styles.devSkipButton}
          onPress={onSkip}
          activeOpacity={0.7}>
          <Text style={styles.devSkipText}>DEV: Skip</Text>
        </TouchableOpacity>
      )}

      {/* Title */}
      <TouchableOpacity
        onLongPress={onLongPress}
        activeOpacity={1}
        delayLongPress={500}>
        <Text style={styles.title}>Slow Pace</Text>
      </TouchableOpacity>

      {/* Lottie placeholder with gradient overlay */}
      <View style={styles.lottieContainer}>
        <View style={styles.lottiePlaceholder}>
          {/* Placeholder for Lottie animation */}
          <Text style={styles.lottiePlaceholderText}>🎵</Text>
        </View>
        <LinearGradient
          colors={['transparent', SLOW_PACE_BG]}
          locations={[0.3, 1]}
          style={styles.gradientOverlay}
        />
      </View>

      {/* Timer */}
      <Text style={styles.timer}>{phaseTimeRemaining}</Text>

      {/* Pause/Resume Button */}
      <TouchableOpacity
        style={styles.pauseResumeButton}
        onPress={onPauseResume}
        activeOpacity={0.8}>
        <Text style={styles.pauseResumeButtonText}>
          {isPaused ? 'Resume' : 'Pause'}
        </Text>
      </TouchableOpacity>

      {/* Stop Session */}
      <TouchableOpacity
        style={styles.stopSessionButton}
        onPress={onStopSession}
        activeOpacity={0.7}>
        <Text style={styles.stopSessionText}>Stop Session</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SLOW_PACE_BG,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  devSkipButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 10,
  },
  devSkipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A1A',
    fontFamily: Fonts?.rounded,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: SLOW_PACE_TEXT,
    marginBottom: 32,
    fontFamily: Fonts?.rounded,
    textAlign: 'center',
  },
  lottieContainer: {
    width: 200,
    height: 200,
    marginBottom: 32,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottiePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  lottiePlaceholderText: {
    fontSize: 80,
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    borderRadius: 16,
  },
  timer: {
    fontSize: 72,
    fontWeight: '700',
    color: SLOW_PACE_TEXT,
    marginBottom: 32,
    fontFamily: Fonts?.rounded,
    textAlign: 'center',
    // Subtle inset shadow effect
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  pauseResumeButton: {
    backgroundColor: SLOW_PACE_BG,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 20,
    minWidth: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    // Subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(26, 26, 26, 0.1)',
  },
  pauseResumeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: SLOW_PACE_TEXT,
    fontFamily: Fonts?.rounded,
  },
  stopSessionButton: {
    paddingVertical: 8,
  },
  stopSessionText: {
    fontSize: 16,
    fontWeight: '400',
    color: SLOW_PACE_TEXT,
    opacity: 0.7,
    fontFamily: Fonts?.rounded,
  },
});


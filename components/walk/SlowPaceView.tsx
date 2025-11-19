import { Fonts } from '@/constants/theme';
import LottieView from 'lottie-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

      {/* Card-like content container */}
      <View style={styles.cardContainer}>
        <View style={styles.content}>
          {/* Title */}
          <TouchableOpacity
            onLongPress={onLongPress}
            activeOpacity={1}
            delayLongPress={500}>
            <Text style={styles.title}>SLOW PACE</Text>
          </TouchableOpacity>

          {/* Lottie animation with shadow */}
          <View style={styles.lottieContainer}>
            <LottieView
              source={require('@/assets/animations/slow-pace-walk.json')}
              autoPlay
              loop
              style={styles.lottieAnimation}
              speed={isPaused ? 0 : 1}
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SLOW_PACE_BG,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: SLOW_PACE_BG,
    borderRadius: 32,
    paddingVertical: 48,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  devSkipButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(224, 224, 224, 0.9)',
    zIndex: 10,
  },
  devSkipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1A1A1A',
    fontFamily: Fonts.body,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: SLOW_PACE_TEXT,
    marginBottom: 32,
    fontFamily: Fonts.heading,
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  lottieContainer: {
    width: 320,
    height: 320,
    marginBottom: 24,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
  },
  timer: {
    fontSize: 160,
    fontWeight: '700',
    color: SLOW_PACE_TEXT,
    marginTop: 0,
    marginBottom: 20,
    fontFamily: Fonts.bodyBlack,
    textAlign: 'center',
    letterSpacing: -8,
  },
  pauseResumeButton: {
    backgroundColor: SLOW_PACE_BG,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 28,
    minWidth: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(26, 26, 26, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  pauseResumeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: SLOW_PACE_TEXT,
    fontFamily: Fonts.body,
  },
  stopSessionButton: {
    paddingVertical: 8,
  },
  stopSessionText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#8A8A8A',
    fontFamily: Fonts.body,
  },
});

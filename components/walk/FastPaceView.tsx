import { Fonts } from '@/constants/theme';
import LottieView from 'lottie-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FastPaceViewProps {
  phaseTimeRemaining: string;
  isPaused: boolean;
  onPauseResume: () => void;
  onStopSession: () => void;
  devMode?: boolean;
  onSkip?: () => void;
  onLongPress?: () => void;
}

const FAST_PACE_BG = '#FF746C'; // Fast Coral
const FAST_PACE_TEXT = '#FFFFFF'; // Pure White

export function FastPaceView({
  phaseTimeRemaining,
  isPaused,
  onPauseResume,
  onStopSession,
  devMode = false,
  onSkip,
  onLongPress,
}: FastPaceViewProps) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={styles.container}>
      {/* DEV: Skip chip */}
      {devMode && (
        <TouchableOpacity
          style={[styles.devSkipButton, { top: insets.top + 12 }]}
          onPress={onSkip}
          activeOpacity={0.7}>
          <Text style={styles.devSkipText}>DEV: Skip</Text>
        </TouchableOpacity>
      )}

      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <TouchableOpacity
          onLongPress={onLongPress}
          activeOpacity={1}
          delayLongPress={500}>
          <Text style={styles.title}>FAST PACE</Text>
        </TouchableOpacity>

        {/* Lottie animation with shadow */}
        <View style={styles.lottieContainer}>
          <LottieView
            source={require('@/assets/animations/fast-pace-walk.json')}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FAST_PACE_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 56,
  },
  devSkipButton: {
    position: 'absolute',
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 10,
  },
  devSkipText: {
    fontSize: 11,
    fontWeight: '600',
    color: FAST_PACE_TEXT,
    fontFamily: Fonts.body,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: FAST_PACE_TEXT,
    marginBottom: 24,
    fontFamily: Fonts.heading,
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  lottieContainer: {
    width: 320,
    height: 320,
    marginBottom: 16,
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
    fontSize: 140,
    fontWeight: '700',
    color: FAST_PACE_TEXT,
    marginTop: 0,
    marginBottom: 24,
    fontFamily: Fonts.bodyBlack,
    textAlign: 'center',
    letterSpacing: -8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    paddingHorizontal: 4,
  },
  pauseResumeButton: {
    backgroundColor: FAST_PACE_BG,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 28,
    minWidth: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  pauseResumeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: FAST_PACE_TEXT,
    fontFamily: Fonts.body,
  },
  stopSessionButton: {
    paddingVertical: 8,
  },
  stopSessionText: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: Fonts.body,
  },
});

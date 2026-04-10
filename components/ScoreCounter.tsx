import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useDerivedValue,
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import { COLORS, GAME_DATA } from '../constants/theme';
import { useScoreCounter } from '../hooks/useScoreCounter';

interface Props {
  onComplete: () => void;
}

export default function ScoreCounter({ onComplete }: Props) {
  const [displayScore, setDisplayScore] = useState(0);
  const pulseScale = useSharedValue(1);

  // Called from UI thread via runOnJS — updates React state for the number display
  const updateDisplay = useCallback((val: number) => {
    setDisplayScore(val);
  }, []);

  const handleComplete = useCallback(() => {
    // Pop the score number on finish
    pulseScale.value = withSequence(
      withSpring(1.12, { damping: 6, stiffness: 300 }),
      withSpring(1.0, { damping: 10, stiffness: 200 }),
    );
    onComplete();
  }, [onComplete]);

  const { scoreProgress } = useScoreCounter(handleComplete);

  // Derive integer score value and push to JS for display (safe: low-freq updates)
  useDerivedValue(() => {
    const val = Math.round(scoreProgress.value * GAME_DATA.finalScore);
    runOnJS(updateDisplay)(val);
  });

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.label}>YOUR SCORE</Text>
      <Animated.View style={pulseStyle}>
        <Text style={styles.score}>{displayScore.toLocaleString()}</Text>
      </Animated.View>
      <View style={styles.underline} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    letterSpacing: 4,
    color: COLORS.accentGlow,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  score: {
    fontSize: 80,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: -2,
    lineHeight: 88,
    textShadowColor: COLORS.scoreShadow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 28,
  },
  underline: {
    marginTop: 6,
    width: 60,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.accent,
    opacity: 0.7,
  },
});

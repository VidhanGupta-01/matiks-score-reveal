import React, { useEffect, useCallback } from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { COLORS, TIMING } from '../constants/theme';

interface Props {
  visible: boolean;
}

export default function ShareButton({ visible }: Props) {
  const shimmerX = useSharedValue(-1);   // -1 → 1 (normalized)
  const containerOpacity = useSharedValue(0);
  const containerTranslateY = useSharedValue(24);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    if (!visible) return;

    // Slide in
    containerOpacity.value = withTiming(1, { duration: 400 });
    containerTranslateY.value = withSpring(0, { damping: 14, stiffness: 160 });

    // Shimmer loop: left to right
    shimmerX.value = withRepeat(
      withSequence(
        withTiming(1, { duration: TIMING.shimmerDuration }),
        withTiming(-1, { duration: 0 }),
      ),
      -1,
      false,
    );
  }, [visible]);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    pressScale.value = withSequence(
      withTiming(0.93, { duration: 90 }),
      withSpring(1.0, { damping: 8, stiffness: 300 }),
    );
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [
      { translateY: containerTranslateY.value },
      { scale: pressScale.value },
    ],
  }));

  const shimmerStyle = useAnimatedStyle(() => {
    // Shimmer is a bright streak that sweeps left → right
    const left = interpolate(
      shimmerX.value,
      [-1, 1],
      [-80, 320],
      Extrapolation.CLAMP,
    );
    return {
      left,
    };
  });

  return (
    <Animated.View style={[styles.wrapper, containerStyle]}>
      <Pressable style={styles.button} onPress={handlePress}>
        {/* Shimmer overlay */}
        <Animated.View style={[styles.shimmer, shimmerStyle]} pointerEvents="none" />
        <Text style={styles.icon}>✦</Text>
        <Text style={styles.label}>Share Result</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingHorizontal: 32,
    marginTop: 8,
  },
  button: {
    height: 58,
    borderRadius: 18,
    backgroundColor: COLORS.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    overflow: 'hidden',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.55,
    shadowRadius: 20,
    elevation: 14,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 60,
    backgroundColor: 'rgba(255,255,255,0.22)',
    transform: [{ skewX: '-18deg' }],
  },
  icon: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.85,
  },
  label: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 0.6,
  },
});

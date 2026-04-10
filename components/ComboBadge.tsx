import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { COLORS, GAME_DATA, TIMING } from '../constants/theme';

interface Props {
  visible: boolean;
}

export default function ComboBadge({ visible }: Props) {
  const badgeScale = useSharedValue(0);
  const badgeOpacity = useSharedValue(0);
  const flameScale = useSharedValue(1);
  const flameOpacity = useSharedValue(1);

  useEffect(() => {
    if (!visible) return;

    // Badge bounce: 0 → 1.15 → 1.0
    badgeOpacity.value = withTiming(1, { duration: 80 });
    badgeScale.value = withSequence(
      withSpring(1.15, { damping: 5, stiffness: 280 }),
      withSpring(1.0, { damping: 10, stiffness: 220 }),
    );

    // Flame looping pulse — scale + opacity
    flameScale.value = withDelay(
      400,
      withRepeat(
        withSequence(
          withTiming(1.35, { duration: TIMING.flamePulse * 0.45 }),
          withTiming(0.9, { duration: TIMING.flamePulse * 0.55 }),
        ),
        -1,
        true,
      ),
    );

    flameOpacity.value = withDelay(
      400,
      withRepeat(
        withSequence(
          withTiming(0.65, { duration: TIMING.flamePulse * 0.45 }),
          withTiming(1.0, { duration: TIMING.flamePulse * 0.55 }),
        ),
        -1,
        true,
      ),
    );
  }, [visible]);

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
    opacity: badgeOpacity.value,
  }));

  const flameStyle = useAnimatedStyle(() => ({
    transform: [{ scale: flameScale.value }],
    opacity: flameOpacity.value,
  }));

  return (
    <Animated.View style={[styles.badge, badgeStyle]}>
      <Animated.Text style={[styles.flame, flameStyle]}>🔥</Animated.Text>
      <Text style={styles.text}>
        {GAME_DATA.comboStreak} Combo Streak!
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderColor: COLORS.fireOrange,
    borderWidth: 1.5,
    borderRadius: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
    shadowColor: COLORS.fireOrange,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 16,
    elevation: 12,
  },
  flame: {
    fontSize: 22,
  },
  text: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.fireYellow,
    letterSpacing: 0.5,
  },
});

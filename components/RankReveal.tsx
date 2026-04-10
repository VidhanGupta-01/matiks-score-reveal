import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { COLORS, GAME_DATA } from '../constants/theme';

interface Props {
  visible: boolean;
}

export default function RankReveal({ visible }: Props) {
  const translateY = useSharedValue(60);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!visible) return;

    // 200ms after parent triggers this component
    opacity.value = withDelay(
      0,
      withTiming(1, { duration: 380 }),
    );
    translateY.value = withDelay(
      0,
      withSpring(0, { damping: 14, stiffness: 160 }),
    );
  }, [visible]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>GLOBAL RANK</Text>
      <View style={styles.row}>
        <Text style={styles.hash}>#</Text>
        <Text style={styles.rank}>{GAME_DATA.rank}</Text>
      </View>
      <Text style={styles.sub}>of {GAME_DATA.totalPlayers.toLocaleString()} players</Text>
      <View style={styles.podium}>
        {['🥇', '🥈', '🥉'].map((medal, i) => (
          <View
            key={i}
            style={[
              styles.podiumItem,
              i + 1 === GAME_DATA.rank && styles.podiumActive,
            ]}
          >
            <Text style={styles.podiumMedal}>{medal}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 4,
  },
  label: {
    fontSize: 10,
    letterSpacing: 4,
    color: COLORS.rankSub,
    fontWeight: '700',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  hash: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.accentGlow,
    marginTop: 8,
  },
  rank: {
    fontSize: 64,
    fontWeight: '900',
    color: COLORS.rankText,
    letterSpacing: -2,
    lineHeight: 70,
    textShadowColor: COLORS.accent,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
  sub: {
    fontSize: 13,
    color: COLORS.rankSub,
    fontWeight: '500',
    marginTop: 2,
    letterSpacing: 0.3,
  },
  podium: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  podiumItem: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: COLORS.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  podiumActive: {
    borderColor: COLORS.gold,
    backgroundColor: 'rgba(255, 209, 102, 0.12)',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 10,
  },
  podiumMedal: {
    fontSize: 22,
  },
});

/**
 * Matiks — Post-Game Score Reveal Screen
 *
 * Animation sequence:
 * 1. 0ms      — Background & branding fade in
 * 2. 600ms    — Score counter starts ticking (0 → 2840 with overshoot)
 * 3. +0ms     — Combo badge entry (triggered immediately with score)
 * 4. +200ms   — Rank reveal slides up (staggered after score completes)
 * 5. +400ms   — Share button slides in
 * 6. score    — Confetti burst fires when score finishes
 *    complete
 *
 * All animations: Reanimated 3, fully UI-thread safe.
 * No setState inside animation callbacks (only runOnJS for display value).
 */

import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { COLORS } from '../constants/theme';
import BackgroundGlow from '../components/BackgroundGlow';
import MatiksBranding from '../components/MatiksBranding';
import ScoreCounter from '../components/ScoreCounter';
import ComboBadge from '../components/ComboBadge';
import RankReveal from '../components/RankReveal';
import StatRow from '../components/StatRow';
import ShareButton from '../components/ShareButton';
import ConfettiCanvas from '../components/ConfettiCanvas';

export default function ScoreRevealScreen() {
  // JS-side state only controls *which* components become visible.
  // The actual animations are handled inside each component via Reanimated.
  const [comboVisible, setComboVisible] = useState(false);
  const [rankVisible, setRankVisible] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(false);

  // Initial screen fade-in
  const screenOpacity = useSharedValue(0);
  screenOpacity.value = withTiming(1, { duration: 500 });

  const screenStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  // Called (via runOnJS) when score counter animation finishes
  const handleScoreComplete = useCallback(() => {
    setConfettiTrigger(true);

    // Staggered cascade for downstream elements
    setTimeout(() => setRankVisible(true), 200);
    setTimeout(() => setShareVisible(true), 400);
  }, []);

  // Combo badge fires right as score starts (600ms delay is in useScoreCounter)
  // We trigger it slightly ahead so it's already bouncing as score ticks
  const [comboStarted, setComboStarted] = useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => {
      setComboVisible(true);
      setComboStarted(true);
    }, 700); // just after score counter begins
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <BackgroundGlow />

      <SafeAreaView style={styles.safe}>
        <Animated.View style={[styles.container, screenStyle]}>

          {/* ── Branding ── */}
          <View style={styles.brandRow}>
            <MatiksBranding />
          </View>

          {/* ── Divider ── */}
          <View style={styles.divider} />

          {/* ── Score Counter ── */}
          <View style={styles.section}>
            <ScoreCounter onComplete={handleScoreComplete} />
          </View>

          {/* ── Combo Badge ── */}
          <View style={styles.comboRow}>
            <ComboBadge visible={comboVisible} />
          </View>

          {/* ── Divider ── */}
          <View style={styles.divider} />

          {/* ── Rank Reveal ── */}
          <View style={styles.section}>
            <RankReveal visible={rankVisible} />
          </View>

          {/* ── Stat Pills ── */}
          <View style={styles.statSection}>
            <StatRow />
          </View>

          {/* ── Share Button ── */}
          <View style={styles.shareSection}>
            <ShareButton visible={shareVisible} />
          </View>

          {/* ── Plays on Matiks tagline ── */}
          <View style={styles.footer}>
            <View style={styles.footerDot} />
            <Animated.Text style={styles.footerText}>
              Play again on Matiks
            </Animated.Text>
            <View style={styles.footerDot} />
          </View>

        </Animated.View>
      </SafeAreaView>

      {/* ── Confetti burst (absolute, above everything) ── */}
      <ConfettiCanvas trigger={confettiTrigger} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 2,
  },
  brandRow: {
    marginBottom: 4,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(124,58,255,0.3)',
    marginVertical: 10,
    borderRadius: 1,
  },
  section: {
    alignItems: 'center',
    width: '100%',
  },
  comboRow: {
    marginTop: 10,
    marginBottom: 2,
  },
  statSection: {
    width: '100%',
    paddingHorizontal: 8,
  },
  shareSection: {
    width: '100%',
    marginTop: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    opacity: 0.45,
  },
  footerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.accentGlow,
  },
  footerText: {
    fontSize: 11,
    color: COLORS.accentGlow,
    letterSpacing: 2,
    fontWeight: '600',
  },
});

/**
 * ConfettiCanvas
 *
 * Pure React Native implementation using Reanimated 3 + Animated.View.
 * Each particle has: randomised trajectory, rotation, color, size, and fade-out.
 * No third-party animation libraries.
 *
 * Architecture note:
 * - Each particle owns its own useSharedValue instances (ui-thread safe)
 * - withTiming / withSpring run fully on the UI thread
 * - JS side only sets initial state and triggers; no setState in animation callbacks
 */

import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '../constants/theme';

const { width: W, height: H } = Dimensions.get('window');

const PARTICLE_COUNT = 60;

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

interface ParticleConfig {
  id: number;
  color: string;
  size: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  rotation: number;
  delay: number;
  duration: number;
  shape: 'square' | 'rect' | 'circle';
}

function generateParticles(): ParticleConfig[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    color: COLORS.confetti[Math.floor(Math.random() * COLORS.confetti.length)],
    size: randomBetween(6, 13),
    startX: randomBetween(W * 0.15, W * 0.85),
    startY: H * 0.35,
    endX: randomBetween(-40, W + 40),
    endY: randomBetween(H * 0.55, H * 1.1),
    rotation: randomBetween(-720, 720),
    delay: randomBetween(0, 500),
    duration: randomBetween(1200, 2200),
    shape: (['square', 'rect', 'circle'] as const)[Math.floor(Math.random() * 3)],
  }));
}

interface ParticleProps {
  config: ParticleConfig;
  trigger: boolean;
}

function Particle({ config, trigger }: ParticleProps) {
  const x = useSharedValue(config.startX);
  const y = useSharedValue(config.startY);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!trigger) return;

    const easing = Easing.out(Easing.quad);

    opacity.value = withDelay(config.delay, withTiming(1, { duration: 80 }));

    x.value = withDelay(
      config.delay,
      withTiming(config.endX, { duration: config.duration, easing }),
    );

    y.value = withDelay(
      config.delay,
      withTiming(config.endY, { duration: config.duration, easing }),
    );

    rotate.value = withDelay(
      config.delay,
      withTiming(config.rotation, { duration: config.duration, easing }),
    );

    // Fade out in last 40% of duration
    const fadeStart = config.delay + config.duration * 0.6;
    opacity.value = withDelay(
      fadeStart,
      withTiming(0, { duration: config.duration * 0.4 }),
    );
  }, [trigger]);

  const style = useAnimatedStyle(() => {
    const borderRadius =
      config.shape === 'circle'
        ? config.size / 2
        : config.shape === 'rect'
        ? 2
        : 3;
    const height =
      config.shape === 'rect' ? config.size * 0.45 : config.size;

    return {
      position: 'absolute',
      width: config.size,
      height,
      borderRadius,
      backgroundColor: config.color,
      opacity: opacity.value,
      transform: [
        { translateX: x.value },
        { translateY: y.value },
        { rotate: `${rotate.value}deg` },
      ],
    };
  });

  return <Animated.View style={style} />;
}

interface Props {
  trigger: boolean;
}

export default function ConfettiCanvas({ trigger }: Props) {
  const particles = useMemo(generateParticles, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p) => (
        <Particle key={p.id} config={p} trigger={trigger} />
      ))}
    </View>
  );
}

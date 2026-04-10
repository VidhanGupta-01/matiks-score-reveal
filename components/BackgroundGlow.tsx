import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function BackgroundGlow() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Top violet glow */}
      <View style={styles.glowTop} />
      {/* Bottom amber glow */}
      <View style={styles.glowBottom} />
      {/* Grid lines */}
      <View style={styles.gridContainer}>
        {Array.from({ length: 8 }).map((_, i) => (
          <View key={i} style={styles.gridLine} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  glowTop: {
    position: 'absolute',
    top: -120,
    left: '50%',
    marginLeft: -180,
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: 'rgba(124,58,255,0.14)',
    // RN doesn't support CSS blur, but we layer it for a soft glow feel
  },
  glowBottom: {
    position: 'absolute',
    bottom: -80,
    right: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255,107,53,0.08)',
  },
  gridContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  gridLine: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
});

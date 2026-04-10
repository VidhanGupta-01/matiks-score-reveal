import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { COLORS } from '../constants/theme';

export default function MatiksBranding() {
  return (
    <View style={styles.container}>
      <View style={styles.logoMark}>
        <Text style={styles.logoSymbol}>⬡</Text>
      </View>
      <Text style={styles.brandName}>MATIKS</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>DUEL OVER</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  logoMark: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoSymbol: {
    fontSize: 24,
    color: COLORS.accent,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 4,
  },
  badge: {
    backgroundColor: 'rgba(124,58,255,0.18)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.accentGlow,
    letterSpacing: 2,
  },
});

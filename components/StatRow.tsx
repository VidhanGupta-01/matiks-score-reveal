import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { COLORS } from '../constants/theme';

const STATS = [
  { label: 'Accuracy', value: '94%' },
  { label: 'Avg Time', value: '1.8s' },
  { label: 'XP Earned', value: '+480' },
];

export default function StatRow() {
  return (
    <View style={styles.row}>
      {STATS.map((s, i) => (
        <View key={i} style={styles.pill}>
          <Text style={styles.value}>{s.value}</Text>
          <Text style={styles.label}>{s.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
    marginBottom: 4,
  },
  pill: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(124,58,255,0.2)',
  },
  value: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 0.2,
  },
  label: {
    fontSize: 10,
    color: COLORS.rankSub,
    marginTop: 2,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});

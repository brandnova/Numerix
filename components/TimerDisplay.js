import { View, Text, StyleSheet } from 'react-native';
import { SPACING } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';

export default function TimerDisplay({ timeLeft, totalTime }) {
  const { colors } = useTheme();
  
  const percentage = (timeLeft / totalTime) * 100;
  let color = colors.success;
  
  if (percentage <= 25) color = colors.danger;
  else if (percentage <= 50) color = colors.warning;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Time Left</Text>
        <Text style={[styles.time, { color: color }]}>{timeLeft}s</Text>
      </View>
      <View style={[styles.barContainer, { backgroundColor: colors.border }]}>
        <View style={[styles.bar, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  time: {
    fontSize: 14,
    fontWeight: '700',
  },
  barContainer: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 3,
  },
});
import { View, Text, StyleSheet } from 'react-native';
import { SPACING, TYPOGRAPHY } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';

export default function TrialIndicator({ trialsLeft, totalTrials }) {
  const { colors } = useTheme();
  const percentage = (trialsLeft / totalTrials) * 100;
  let color = colors.success;
  
  if (percentage <= 30) color = colors.danger;
  else if (percentage <= 50) color = colors.warning;

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBg }]}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Attempts
        </Text>
        <Text style={[styles.count, { color: colors.text }]}>
          {trialsLeft}/{totalTrials}
        </Text>
      </View>
      <View style={[styles.barContainer, { backgroundColor: colors.border }]}>
        <View style={[styles.bar, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  label: {
    ...TYPOGRAPHY.caption,
  },
  count: {
    fontSize: 14,
    fontWeight: '600',
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
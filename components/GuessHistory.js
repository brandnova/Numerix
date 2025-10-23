import { View, Text, StyleSheet } from 'react-native';
import { SPACING, TYPOGRAPHY } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';

function GuessHistoryItem({ guess, target }) {
  const { colors } = useTheme();
  const difference = Math.abs(guess - target);
  const tooHigh = guess > target;

  let bgColor = colors.cardBg;
  let textColor = colors.textSecondary;
  
  if (difference <= 5) {
    bgColor = colors.danger + '15';
    textColor = colors.danger;
  } else if (difference <= 15) {
    bgColor = colors.warning + '15';
    textColor = colors.warning;
  }

  return (
    <View style={[styles.item, { backgroundColor: bgColor }]}>
      <Text style={[styles.number, { color: textColor }]}>{guess}</Text>
      <Text style={[styles.arrow, { color: textColor }]}>
        {tooHigh ? '↓' : '↑'}
      </Text>
    </View>
  );
}

export default function GuessHistory({ guesses, targetNumber }) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.textSecondary }]}>
        Guess History
      </Text>
      <View style={styles.grid}>
        {guesses.map((guess, index) => (
          <GuessHistoryItem
            key={index}
            guess={guess}
            target={targetNumber}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.xl,
  },
  title: {
    ...TYPOGRAPHY.caption,
    marginBottom: SPACING.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  item: {
    borderRadius: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  number: {
    fontSize: 15,
    fontWeight: '600',
  },
  arrow: {
    fontSize: 14,
    fontWeight: '600',
  },
});
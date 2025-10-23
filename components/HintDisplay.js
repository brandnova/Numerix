import { View, Text, StyleSheet } from 'react-native';
import { SPACING } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';

export default function HintDisplay({ hint, gameStatus, proximity }) {
  const { colors } = useTheme();
  
  let bgColor = colors.cardBg;
  let textColor = colors.text;

  if (gameStatus === 'won') {
    bgColor = colors.success + '15';
    textColor = colors.success;
  } else if (gameStatus === 'lost') {
    bgColor = colors.danger + '15';
    textColor = colors.danger;
  } else if (proximity === 'very_close') {
    bgColor = colors.danger + '15';
    textColor = colors.danger;
  } else if (proximity === 'close') {
    bgColor = colors.warning + '15';
    textColor = colors.warning;
  } else if (proximity === 'medium') {
    bgColor = colors.primary + '15';
    textColor = colors.primary;
  }

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={[styles.text, { color: textColor }]}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});
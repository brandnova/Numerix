import { View, Text, StyleSheet } from 'react-native';
import { SPACING } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';

export default function AchievementBadge({ achievement, unlocked }) {
  const { colors } = useTheme();

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: colors.cardBg,
        borderColor: colors.border 
      },
      !unlocked && styles.containerLocked
    ]}>
      <View style={styles.content}>
        <View style={[
          styles.icon,
          unlocked ? 
            { 
              backgroundColor: colors.success + '20',
              borderColor: colors.success 
            } : 
            { backgroundColor: colors.border }
        ]}>
          <Text style={[styles.iconText, { color: colors.text }]}>
            {unlocked ? '✓' : '?'}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={[
            styles.title,
            { color: colors.text },
            !unlocked && { color: colors.textMuted }
          ]}>
            {achievement.title}
          </Text>
          <Text style={[
            styles.description,
            { color: colors.textSecondary },
            !unlocked && { color: colors.textMuted }
          ]}>
            {achievement.description}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    borderWidth: 1,
  },
  containerLocked: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  iconText: {
    fontSize: 24,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
});
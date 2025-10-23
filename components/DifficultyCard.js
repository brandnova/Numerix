import { Pressable, View, Text, StyleSheet, Animated } from 'react-native';
import { SPACING, TYPOGRAPHY } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';

export default function DifficultyCard({ difficulty, config, stats, onSelect }) {
  const { colors } = useTheme();
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={() => onSelect(difficulty)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View 
        style={[
          styles.card,
          { 
            backgroundColor: colors.cardBg,
            borderColor: colors.border,
            transform: [{ scale: scaleAnim }] 
          }
        ]}
      >
        <View style={styles.header}>
          <Text style={[styles.name, { color: colors.text }]}>{config.name}</Text>
          <View style={[styles.badge, { backgroundColor: colors[config.color] }]} />
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Range</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>1-{config.max}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Attempts</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>{config.trials}</Text>
          </View>
          {stats && stats.wins > 0 && (
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Best</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>{stats.bestAttempts || '-'}</Text>
            </View>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: SPACING.md,
    padding: SPACING.xl,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
  },
  badge: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.xxl,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
});
import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { TYPOGRAPHY, SPACING } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import { Storage } from '../utils/storage';

export default function StatisticsScreen() {
  const { colors } = useTheme();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const userStats = await Storage.getStats();
    setStats(userStats);
  };

  if (!stats) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading statistics...</Text>
      </View>
    );
  }

  const winRate = stats.totalGames > 0 
    ? ((stats.totalWins / stats.totalGames) * 100).toFixed(1)
    : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: colors.text }]}>Statistics</Text>

        {/* Overall Stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Overall Performance</Text>
          <View style={styles.statsGrid}>
            <StatCard label="Total Games" value={stats.totalGames} colors={colors} />
            <StatCard label="Wins" value={stats.totalWins} color={colors.success} colors={colors} />
            <StatCard label="Losses" value={stats.totalLosses} color={colors.danger} colors={colors} />
            <StatCard label="Win Rate" value={`${winRate}%`} color={colors.primary} colors={colors} />
          </View>
        </View>

        {/* Streaks */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Streaks</Text>
          <View style={styles.statsGrid}>
            <StatCard label="Current Streak" value={stats.currentWinStreak} colors={colors} />
            <StatCard label="Longest Streak" value={stats.longestWinStreak} color={colors.warning} colors={colors} />
            <StatCard label="Perfect Games" value={stats.perfectGames} color={colors.success} colors={colors} />
            <StatCard label="Comebacks" value={stats.comebacks} color={colors.danger} colors={colors} />
          </View>
        </View>

        {/* By Difficulty */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Performance by Difficulty</Text>
          {Object.entries(stats.byDifficulty).map(([key, data]) => (
            <DifficultyStats key={key} difficulty={key} data={data} colors={colors} />
          ))}
        </View>

        {/* Daily Challenge */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Daily Challenge</Text>
          <View style={styles.statsGrid}>
            <StatCard label="Current Streak" value={stats.dailyStreak} color={colors.primary} colors={colors} />
            <StatCard label="Completed" value="0" colors={colors} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function StatCard({ label, value, color, colors }) {
  return (
    <View style={[styles.statCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
      <Text style={[styles.statValue, { color: color || colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

function DifficultyStats({ difficulty, data, colors }) {
  const winRate = data.games > 0 
    ? ((data.wins / data.games) * 100).toFixed(0)
    : 0;
  
  const avgAttempts = data.wins > 0
    ? (data.totalAttempts / data.wins).toFixed(1)
    : 0;

  return (
    <View style={[styles.difficultyCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
      <Text style={[styles.difficultyName, { color: colors.text }]}>
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </Text>
      <View style={styles.difficultyStats}>
        <View style={styles.difficultyStatItem}>
          <Text style={[styles.difficultyStatValue, { color: colors.text }]}>{data.games}</Text>
          <Text style={[styles.difficultyStatLabel, { color: colors.textSecondary }]}>Games</Text>
        </View>
        <View style={styles.difficultyStatItem}>
          <Text style={[styles.difficultyStatValue, { color: colors.text }]}>{data.wins}</Text>
          <Text style={[styles.difficultyStatLabel, { color: colors.textSecondary }]}>Wins</Text>
        </View>
        <View style={styles.difficultyStatItem}>
          <Text style={[styles.difficultyStatValue, { color: colors.text }]}>{winRate}%</Text>
          <Text style={[styles.difficultyStatLabel, { color: colors.textSecondary }]}>Win Rate</Text>
        </View>
        <View style={styles.difficultyStatItem}>
          <Text style={[styles.difficultyStatValue, { color: colors.text }]}>
            {data.bestAttempts || '-'}
          </Text>
          <Text style={[styles.difficultyStatLabel, { color: colors.textSecondary }]}>Best</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.xxl,
    paddingTop: 50,
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginTop: 100,
  },
  title: {
    ...TYPOGRAPHY.title,
    marginBottom: SPACING.xxl,
  },
  section: {
    marginBottom: SPACING.xxl + SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.caption,
    marginBottom: SPACING.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  statCard: {
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    borderWidth: 1,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
  },
  difficultyCard: {
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
  },
  difficultyName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  difficultyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  difficultyStatItem: {
    alignItems: 'center',
  },
  difficultyStatValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  difficultyStatLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
  },
});
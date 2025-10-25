import { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { TYPOGRAPHY, SPACING } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import { Storage } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';

export default function StatisticsScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [stats, setStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [dailyData, setDailyData] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const userStats = await Storage.getStats();
    const userAchievements = await Storage.getAchievements();
    const dailyChallengeData = await Storage.getDailyChallenge();
    
    setStats(userStats);
    setAchievements(userAchievements);
    setDailyData(dailyChallengeData);
  };

  if (!stats || !dailyData) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading statistics...</Text>
      </View>
    );
  }

  // Calculate comprehensive statistics
  const winRate = stats.totalGames > 0 
    ? ((stats.totalWins / stats.totalGames) * 100).toFixed(1)
    : 0;

  const totalDailyWins = dailyData.results ? dailyData.results.filter(r => r.won).length : 0;
  const totalAttempts = Object.values(stats.byDifficulty).reduce((sum, diff) => sum + diff.totalAttempts, 0);
  const avgAttemptsPerWin = stats.totalWins > 0 ? (totalAttempts / stats.totalWins).toFixed(1) : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header - Consistent with Settings Screen */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Statistics</Text>
          <Pressable 
            onPress={() => navigation.goBack()} 
            style={[styles.backButton, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
          >
            <Text style={[styles.backButtonText, { color: colors.text }]}>Back</Text>
          </Pressable>
        </View>

        {/* Overall Performance */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Overall Performance</Text>
          <View style={styles.statsGrid}>
            <StatCard label="Total Games" value={stats.totalGames} colors={colors} />
            <StatCard label="Wins" value={stats.totalWins} color={colors.success} colors={colors} />
            <StatCard label="Losses" value={stats.totalLosses} color={colors.danger} colors={colors} />
            <StatCard label="Win Rate" value={`${winRate}%`} color={winRate >= 50 ? colors.success : colors.warning} colors={colors} />
          </View>
        </View>

        {/* Game Efficiency */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Game Efficiency</Text>
          <View style={styles.statsGrid}>
            <StatCard label="Avg Attempts/Win" value={avgAttemptsPerWin} colors={colors} />
            <StatCard label="Perfect Games" value={stats.perfectGames} color={colors.success} colors={colors} />
            <StatCard label="Comebacks" value={stats.comebacks} color={colors.danger} colors={colors} />
            <StatCard label="Total Attempts" value={totalAttempts} colors={colors} />
          </View>
        </View>

        {/* Speed Mode Stats */}
        {stats.speedStats && stats.speedStats.totalGames > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Speed Mode</Text>
            <View style={styles.statsGrid}>
              <View style={[styles.statCard, { backgroundColor: colors.cardBg }]}>
                <Text style={[styles.statValue, { color: colors.primary }]}>
                  {stats.speedStats.totalGames}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Games</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: colors.cardBg }]}>
                <Text style={[styles.statValue, { color: colors.success }]}>
                  {stats.speedStats.totalWins}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Wins</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: colors.cardBg }]}>
                <Text style={[styles.statValue, { color: colors.warning }]}>
                  {stats.speedStats.bestTime ? `${stats.speedStats.bestTime}s` : '-'}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Best Time</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: colors.cardBg }]}>
                <Text style={[styles.statValue, { color: colors.info }]}>
                  {stats.speedStats.highestScore}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>High Score</Text>
              </View>
            </View>
          </View>
        )}

        {/* Streaks */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Streaks</Text>
          <View style={styles.statsGrid}>
            <StatCard label="Current Win Streak" value={stats.currentWinStreak} colors={colors} />
            <StatCard label="Longest Win Streak" value={stats.longestWinStreak} color={colors.warning} colors={colors} />
            <StatCard label="Daily Streak" value={dailyData.currentStreak} color={colors.primary} colors={colors} />
            <StatCard label="Longest Daily" value={dailyData.longestStreak} color={colors.success} colors={colors} />
          </View>
        </View>

        {/* Achievements Progress */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Achievements</Text>
          <View style={[styles.achievementCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={styles.achievementHeader}>
              <Text style={[styles.achievementTitle, { color: colors.text }]}>
                Unlocked: {achievements.length}/25
              </Text>
              <Text style={[styles.achievementPercentage, { color: colors.primary }]}>
                {Math.round((achievements.length / 25) * 100)}%
              </Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${(achievements.length / 25) * 100}%`,
                    backgroundColor: colors.primary 
                  }
                ]} 
              />
            </View>
          </View>
        </View>

        {/* Performance by Difficulty */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Performance by Difficulty</Text>
          {Object.entries(stats.byDifficulty).map(([key, data]) => (
            <DifficultyStats key={key} difficulty={key} data={data} colors={colors} />
          ))}
        </View>

        {/* Daily Challenge Stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Daily Challenge</Text>
          <View style={styles.statsGrid}>
            <StatCard label="Completed" value={totalDailyWins} color={colors.success} colors={colors} />
            <StatCard label="Total Played" value={dailyData.results?.length || 0} colors={colors} />
            <StatCard label="Success Rate" 
              value={dailyData.results?.length > 0 
                ? `${Math.round((totalDailyWins / dailyData.results.length) * 100)}%` 
                : '0%'} 
              colors={colors} 
            />
            <StatCard label="Best Attempt" 
              value={Math.min(...(dailyData.results?.filter(r => r.won).map(r => r.attempts) || [7])) || '-'} 
              colors={colors} 
            />
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
    : '-';

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
        <View style={styles.difficultyStatItem}>
          <Text style={[styles.difficultyStatValue, { color: colors.text }]}>
            {avgAttempts}
          </Text>
          <Text style={[styles.difficultyStatLabel, { color: colors.textSecondary }]}>Avg/Win</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  title: {
    ...TYPOGRAPHY.title,
  },
  backButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: SPACING.sm,
    borderWidth: 1,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.caption,
    marginBottom: SPACING.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  statCard: {
    borderRadius: SPACING.md,
    padding: SPACING.md,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    borderWidth: 1,
    minHeight: 70,
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
    fontSize: 10,
  },
  achievementCard: {
    borderRadius: SPACING.md,
    padding: SPACING.md,
    borderWidth: 1,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  achievementPercentage: {
    fontSize: 14,
    fontWeight: '700',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  difficultyCard: {
    borderRadius: SPACING.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
  },
  difficultyName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  difficultyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  difficultyStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  difficultyStatValue: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  difficultyStatLabel: {
    fontSize: 9,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});
import { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { TYPOGRAPHY, SPACING } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import { Storage } from '../utils/storage';

export default function GameModesScreen({ navigation }) {
  const { colors } = useTheme();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadStats();
    });
    return unsubscribe;
  }, [navigation]);

  const loadStats = async () => {
    const userStats = await Storage.getStats();
    setStats(userStats);
  };

  const gameModes = [
    {
      id: 'classic',
      name: 'Classic Mode',
      icon: '🎯',
      description: 'Traditional number guessing with limited attempts',
      color: colors.primary,
      action: () => navigation.navigate('Home'),
      stats: stats ? `${stats.totalWins} wins` : 'Not played yet',
    },
    {
      id: 'daily',
      name: 'Daily Challenge',
      icon: '📅',
      description: 'Unique challenge every day with special rules',
      color: colors.success,
      action: () => navigation.navigate('DailyChallenge'),
      stats: stats?.dailyStreak ? `${stats.dailyStreak} day streak` : 'Start your streak',
    },
    {
      id: 'speed',
      name: 'Speed Challenge',
      icon: '⚡',
      description: 'Race against time with unlimited attempts',
      color: colors.warning,
      action: () => navigation.navigate('SpeedMode'),
      stats: stats?.speedStats?.bestTime ? `Best: ${stats.speedStats.bestTime}s` : 'Not played yet',
    },
    {
      id: 'puzzle',
      name: 'Puzzle Mode',
      icon: '🧩',
      description: 'Solve mathematical puzzles to find the number',
      color: colors.purple,
      disabled: false,
      action: () => navigation.navigate('PuzzleMode'),
      stats: stats?.puzzleStats?.totalWins 
        ? `${stats.puzzleStats.totalWins} solved` 
        : 'Not played yet',
    },
    {
      id: 'coming_soon_2',
      name: 'Multiplayer Mode',
      icon: '👥',
      description: 'Compete with friends in real-time',
      color: colors.info,
      disabled: true,
      stats: 'Coming Soon',
    },
  ];

  if (!stats) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header - Consistent with Settings Screen */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Game Modes</Text>
          <Pressable 
            onPress={() => navigation.goBack()} 
            style={[styles.backButton, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
          >
            <Text style={[styles.backButtonText, { color: colors.text }]}>Back</Text>
          </Pressable>
        </View>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Choose your challenge
        </Text>

        {/* Game Mode Cards */}
        <View style={styles.modesContainer}>
          {gameModes.map((mode) => (
            <Pressable
              key={mode.id}
              onPress={mode.disabled ? null : mode.action}
              style={[
                styles.modeCard,
                { 
                  backgroundColor: colors.cardBg,
                  borderColor: mode.color,
                  opacity: mode.disabled ? 0.5 : 1,
                }
              ]}
              disabled={mode.disabled}
            >
              {/* Icon and Badge */}
              <View style={styles.modeHeader}>
                <View style={[styles.iconContainer, { backgroundColor: mode.color + '20' }]}>
                  <Text style={styles.modeIcon}>{mode.icon}</Text>
                </View>
                {mode.disabled && (
                  <View style={[styles.comingSoonBadge, { backgroundColor: colors.textSecondary }]}>
                    <Text style={styles.comingSoonText}>Soon</Text>
                  </View>
                )}
              </View>

              {/* Content */}
              <View style={styles.modeContent}>
                <Text style={[styles.modeName, { color: colors.text }]}>
                  {mode.name}
                </Text>
                <Text style={[styles.modeDescription, { color: colors.textSecondary }]}>
                  {mode.description}
                </Text>
                
                {/* Stats */}
                <View style={styles.modeFooter}>
                  <Text style={[styles.modeStats, { color: mode.color }]}>
                    {mode.stats}
                  </Text>
                  {!mode.disabled && (
                    <Text style={[styles.playArrow, { color: mode.color }]}>
                      Play ➡
                    </Text>
                  )}
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Overall Stats */}
        <View style={[styles.overallStats, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <Text style={[styles.overallStatsTitle, { color: colors.textSecondary }]}>
            Your Overall Stats
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {stats.totalGames}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Games Played
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.success }]}>
                {stats.totalWins}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Total Wins
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.warning }]}>
                {stats.totalGames > 0 ? Math.round((stats.totalWins / stats.totalGames) * 100) : 0}%
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Win Rate
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  // Updated Header - Consistent with Settings Screen
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
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
  subtitle: {
    fontSize: 16,
    marginBottom: SPACING.xxl,
  },
  modesContainer: {
    gap: SPACING.lg,
    marginBottom: SPACING.xxl,
  },
  modeCard: {
    borderRadius: SPACING.lg,
    padding: SPACING.xl,
    borderWidth: 2,
  },
  modeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeIcon: {
    fontSize: 32,
  },
  comingSoonBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: SPACING.xs,
  },
  comingSoonText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  modeContent: {
    gap: SPACING.sm,
  },
  modeName: {
    fontSize: 20,
    fontWeight: '700',
  },
  modeDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  modeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  modeStats: {
    fontSize: 13,
    fontWeight: '600',
  },
  playArrow: {
    fontSize: 16,
    fontWeight: '700',
  },
  overallStats: {
    borderRadius: SPACING.lg,
    padding: SPACING.xl,
    borderWidth: 1,
  },
  overallStatsTitle: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: SPACING.lg,
    letterSpacing: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});
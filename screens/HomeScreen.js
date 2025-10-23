import { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { TYPOGRAPHY, SPACING } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import { DIFFICULTIES } from '../constants/difficulties';
import { Storage } from '../utils/storage';
import DifficultyCard from '../components/DifficultyCard';
import { DailyChallengeGenerator } from '../utils/dailyChallengeGenerator';

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const [stats, setStats] = useState(null);
  const [achievementProgress, setAchievementProgress] = useState({ unlocked: 0, total: 0 });
  const [dailyData, setDailyData] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  // Refresh data when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    const userStats = await Storage.getStats();
    const achievements = await Storage.getAchievements();
    const dailyChallengeData = await Storage.getDailyChallenge();
    
    // Check today's status
    const hasCompleted = DailyChallengeGenerator.hasCompletedToday(dailyChallengeData);
    const hasPlayed = DailyChallengeGenerator.hasPlayedToday(dailyChallengeData);
    
    console.log('🏠 Home Screen Data Loaded:', {
      currentStreak: dailyChallengeData.currentStreak,
      longestStreak: dailyChallengeData.longestStreak,
      hasCompleted,
      hasPlayed,
      totalResults: dailyChallengeData.results?.length,
    });
    
    setStats(userStats);
    setDailyData({
      ...dailyChallengeData,
      hasCompleted,
      hasPlayed,
    });
    setAchievementProgress({
      unlocked: achievements.length,
      total: 25,
    });
  };

  const handlePlayGame = (difficulty) => {
    navigation.navigate('Game', { 
      mode: 'classic', 
      difficulty: difficulty 
    });
  };

  const handleDailyChallenge = () => {
    navigation.navigate('DailyChallenge');
  };

  const handleViewStreak = () => {
    navigation.navigate('StreakCalendar');
  };

  if (!stats || !dailyData) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
      </View>
    );
  }

  const winRate = stats.totalGames > 0 ? Math.round((stats.totalWins / stats.totalGames) * 100) : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Stats */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.title, { color: colors.text }]}>NUMERIX</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {stats.totalWins} Wins • {winRate}% Win Rate
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Pressable 
              style={[styles.settingsButton, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
              onPress={() => navigation.navigate('Settings')}
            >
              <Text style={[styles.settingsIcon, { color: colors.text }]}>⚙️</Text>
            </Pressable>
          </View>
        </View>

        {/* Daily Challenge Card - Prominent */}
        <Pressable 
          style={[
            styles.dailyChallengeCard, 
            { 
              backgroundColor: dailyData.hasCompleted ? colors.success : colors.primary,
            }
          ]}
          onPress={handleDailyChallenge}
        >
          <View style={styles.dailyChallengeContent}>
            <View style={styles.dailyChallengeLeft}>
              <View style={styles.dailyChallengeBadge}>
                <Text style={styles.dailyChallengeBadgeText}>
                  {dailyData.hasCompleted ? '✓' : '📅'}
                </Text>
              </View>
              <View style={styles.dailyChallengeInfo}>
                <Text style={styles.dailyChallengeTitle}>
                  {dailyData.hasCompleted ? 'Daily Challenge Complete!' : 'Daily Challenge'}
                </Text>
                <Text style={styles.dailyChallengeSubtitle}>
                  {dailyData.hasCompleted 
                    ? `Amazing! Keep your streak alive`
                    : dailyData.hasPlayed
                      ? `Try again to complete today's challenge`
                      : 'New challenge available'}
                </Text>
              </View>
            </View>
            <View style={styles.dailyChallengeRight}>
              <View style={styles.streakBadge}>
                <Text style={styles.streakNumber}>{dailyData.currentStreak || 0}</Text>
                <Text style={styles.streakLabel}>
                  {dailyData.currentStreak === 1 ? 'Day' : 'Days'}
                </Text>
              </View>
              <Text style={styles.dailyChallengeArrow}>
                {dailyData.hasCompleted ? '👑' : '➡'}
              </Text>
            </View>
          </View>
        </Pressable>

        {/* Game Modes Button */}
        <Pressable 
          style={[styles.gameModesButton, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
          onPress={() => navigation.navigate('GameModes')}
        >
          <View style={styles.gameModesContent}>
            <View style={styles.gameModesLeft}>
              <Text style={styles.gameModesIcon}>🎮</Text>
              <View>
                <Text style={[styles.gameModesTitle, { color: colors.text }]}>Game Modes</Text>
                <Text style={[styles.gameModesSubtitle, { color: colors.textSecondary }]}>
                  Explore different challenges
                </Text>
              </View>
            </View>
            <Text style={[styles.gameModesArrow, { color: colors.textSecondary }]}>➡</Text>
          </View>
        </Pressable>

        {/* Stats Grid - Compact */}
        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {dailyData.currentStreak || 0}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Daily Streak</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <Text style={[styles.statValue, { color: colors.warning }]}>
                {dailyData.longestStreak || 0}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Best Streak</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <Text style={[styles.statValue, { color: colors.success }]}>
                {stats.currentWinStreak}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Win Streak</Text>
            </View>
            
            {/* <View style={[styles.statCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {stats.perfectGames}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Perfect</Text>
            </View> */}
          </View>
        </View>

        {/* Classic Mode Section */}
        <View style={styles.classicSection}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Classic Mode</Text>
          <View style={styles.difficultiesContainer}>
            {Object.entries(DIFFICULTIES).map(([key, config]) => (
              <DifficultyCard
                key={key}
                difficulty={key}
                config={config}
                stats={stats.byDifficulty[key]}
                onSelect={handlePlayGame}
              />
            ))}
          </View>
        </View>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <Pressable 
            style={[styles.navButton, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
            onPress={handleViewStreak}
          >
            <Text style={[styles.navButtonIcon, { color: colors.text }]}>📅</Text>
            <Text style={[styles.navButtonText, { color: colors.text }]}>Calendar</Text>
          </Pressable>

          <Pressable 
            style={[styles.navButton, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
            onPress={() => navigation.navigate('Statistics')}
          >
            <Text style={[styles.navButtonIcon, { color: colors.text }]}>📊</Text>
            <Text style={[styles.navButtonText, { color: colors.text }]}>Statistics</Text>
          </Pressable>

          <Pressable 
            style={[styles.navButton, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
            onPress={() => navigation.navigate('Achievements')}
          >
            <Text style={[styles.navButtonIcon, { color: colors.text }]}>🏆</Text>
            <Text style={[styles.navButtonText, { color: colors.text }]}>Achievements</Text>
          </Pressable>
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
    padding: SPACING.lg,
    paddingTop: 50,
    paddingBottom: SPACING.xxl,
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginTop: 100,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    marginLeft: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.title,
    fontSize: 28,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    letterSpacing: 0.3,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    fontSize: 18,
  },

  // Daily Challenge Card
  dailyChallengeCard: {
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  dailyChallengeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dailyChallengeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dailyChallengeBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  dailyChallengeBadgeText: {
    fontSize: 24,
  },
  dailyChallengeInfo: {
    flex: 1,
  },
  dailyChallengeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  dailyChallengeSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 16,
  },
  dailyChallengeRight: {
    alignItems: 'center',
    marginLeft: SPACING.md,
  },
  streakBadge: {
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  streakNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: 28,
  },
  streakLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dailyChallengeArrow: {
    fontSize: 20,
    color: '#ffffff',
  },

  // Game Modes Button
  gameModesButton: {
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
  },
  gameModesContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gameModesLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  gameModesIcon: {
    fontSize: 32,
  },
  gameModesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  gameModesSubtitle: {
    fontSize: 13,
  },
  gameModesArrow: {
    fontSize: 20,
    fontWeight: '700',
  },

  // Stats Section
  statsSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    ...TYPOGRAPHY.caption,
    fontSize: 11,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    justifyContent: 'space-between',
  },
  statCard: {
    width: 'calc(50% - 4px)',
    borderRadius: SPACING.sm,
    padding: SPACING.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Classic Mode Section
  classicSection: {
    marginBottom: SPACING.lg,
  },
  difficultiesContainer: {
    gap: SPACING.sm,
  },

  // Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  navButton: {
    flex: 1,
    borderRadius: SPACING.sm,
    padding: SPACING.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  navButtonText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
import { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { TYPOGRAPHY, SPACING } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import { DIFFICULTIES } from '../constants/difficulties';
import { Storage } from '../utils/storage';
import DifficultyCard from '../components/DifficultyCard';

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const [stats, setStats] = useState(null);
  const [achievementProgress, setAchievementProgress] = useState({ unlocked: 0, total: 0 });

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
    
    setStats(userStats);
    setAchievementProgress({
      unlocked: achievements.length,
      total: 25,
    });
  };

  const handlePlayGame = (difficulty) => {
    if (!DIFFICULTIES[difficulty]) {
      console.error('Invalid difficulty:', difficulty);
      return;
    }
    navigation.navigate('Game', { difficulty, mode: 'classic' });
  };

  const handleDailyChallenge = () => {
    navigation.navigate('DailyChallenge');
  };

  if (!stats) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>NUMERIX</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Number Guessing Challenge</Text>
        </View>

        {/* Quick Stats Overview */}
        <View style={[styles.statsOverview, { backgroundColor: colors.cardBg }]}>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.totalWins}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Wins</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.totalGames}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Played</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {stats.totalGames > 0 ? Math.round((stats.totalWins / stats.totalGames) * 100) : 0}%
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Win Rate</Text>
          </View>
        </View>

        {/* Daily Challenge Button */}
        <Pressable 
          style={[styles.dailyChallengeButton, { backgroundColor: colors.primary }]}
          onPress={handleDailyChallenge}
        >
          <View>
            <Text style={styles.dailyChallengeTitle}>Daily Challenge</Text>
            <Text style={styles.dailyChallengeSubtitle}>
              Streak: {stats.dailyStreak} days
            </Text>
          </View>
          <Text style={styles.dailyChallengeArrow}>→</Text>
        </Pressable>

        {/* Difficulty Selection */}
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

        {/* Bottom Navigation Buttons */}
        <View style={styles.navigationButtons}>
          <Pressable 
            style={[styles.navButton, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
            onPress={() => navigation.navigate('Statistics')}
          >
            <Text style={[styles.navButtonText, { color: colors.text }]}>Statistics</Text>
            <Text style={[styles.navButtonSubtext, { color: colors.textSecondary }]}>
              View detailed stats
            </Text>
          </Pressable>

          <Pressable 
            style={[styles.navButton, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
            onPress={() => navigation.navigate('Achievements')}
          >
            <Text style={[styles.navButtonText, { color: colors.text }]}>Achievements</Text>
            <Text style={[styles.navButtonSubtext, { color: colors.textSecondary }]}>
              {achievementProgress.unlocked}/{achievementProgress.total} unlocked
            </Text>
          </Pressable>

          <Pressable 
            style={[styles.navButton, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={[styles.navButtonText, { color: colors.text }]}>Settings</Text>
            <Text style={[styles.navButtonSubtext, { color: colors.textSecondary }]}>
              Themes, audio & more
            </Text>
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
    padding: SPACING.xxl,
    paddingTop: 50,
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
  },
  header: {
    marginBottom: SPACING.xxl + SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.title,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 15,
    letterSpacing: 0.5,
  },
  statsOverview: {
    flexDirection: 'row',
    borderRadius: SPACING.md,
    padding: SPACING.xl,
    marginBottom: SPACING.xxl,
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
  },
  statDivider: {
    width: 1,
  },
  dailyChallengeButton: {
    borderRadius: SPACING.md,
    padding: SPACING.xl,
    marginBottom: SPACING.xxl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dailyChallengeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: SPACING.xs,
  },
  dailyChallengeSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  dailyChallengeArrow: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '700',
  },
  sectionTitle: {
    ...TYPOGRAPHY.caption,
    marginBottom: SPACING.md,
  },
  difficultiesContainer: {
    gap: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  navigationButtons: {
    gap: SPACING.md,
  },
  navButton: {
    borderRadius: SPACING.md,
    padding: SPACING.xl,
    borderWidth: 1,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  navButtonSubtext: {
    fontSize: 13,
  },
});
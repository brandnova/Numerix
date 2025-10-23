import { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Alert } from 'react-native';
import { TYPOGRAPHY, SPACING } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import { DailyChallengeGenerator } from '../utils/dailyChallengeGenerator';
import { Storage } from '../utils/storage';

export default function DailyChallengeScreen({ navigation }) {
  const { colors } = useTheme();
  const [dailyData, setDailyData] = useState(null);
  const [todayChallenge, setTodayChallenge] = useState(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    loadDailyData();
  }, []);

  // Refresh when screen gets focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadDailyData();
    });
    return unsubscribe;
  }, [navigation]);

  const loadDailyData = async () => {
    const data = await Storage.getDailyChallenge();
    const challenge = DailyChallengeGenerator.getTodayChallenge();
    
    const played = DailyChallengeGenerator.hasPlayedToday(data);
    const completed = DailyChallengeGenerator.hasCompletedToday(data);
    
    console.log('📅 Daily Challenge Screen Data:', {
      challenge,
      played,
      completed,
      currentStreak: data.currentStreak,
    });
    
    setDailyData(data);
    setTodayChallenge(challenge);
    setHasPlayed(played);
    setHasCompleted(completed);
  };

  const handlePlayChallenge = () => {
    if (!todayChallenge) {
      Alert.alert('Error', 'Could not load today\'s challenge');
      return;
    }

    console.log('🚀 Starting Daily Challenge:', todayChallenge);

    navigation.navigate('Game', {
      mode: 'daily',
      dailyChallenge: todayChallenge,
    });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleViewStreak = () => {
    navigation.navigate('StreakCalendar');
  };

  if (!dailyData || !todayChallenge) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.content}>
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
        </View>
      </View>
    );
  }

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const getDifficultyColor = (difficulty) => {
    const colorMap = {
      easy: colors.success,
      medium: colors.warning,
      hard: colors.danger,
      chaotic: colors.primary,
    };
    return colorMap[difficulty] || colors.text;
  };

  const getSpecialRuleDisplay = (rule) => {
    if (!rule) return null;
    
    const ruleMap = {
      'no_consecutive_direction': 'Cannot guess in the same direction twice in a row',
      'reverse_hints': 'Hints are reversed - higher means lower!',
      'only_multiples_of_5': 'Only multiples of 5 are allowed',
      'time_limit_60': '60 second time limit',
      'time_limit_30': '30 second time limit',
    };
    
    return ruleMap[rule] || rule.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header - Consistent with Settings Screen */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Daily Challenge</Text>
          <Pressable 
            onPress={handleGoBack} 
            style={[styles.backButton, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
          >
            <Text style={[styles.backButtonText, { color: colors.text }]}>Back</Text>
          </Pressable>
        </View>

        <Text style={[styles.date, { color: colors.textSecondary }]}>{today}</Text>

        {/* Challenge Info Card */}
        <View style={[styles.challengeCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={styles.challengeHeader}>
            <Text style={[styles.challengeTitle, { color: colors.text }]}>
              Today's Challenge
            </Text>
            {hasCompleted && (
              <View style={[styles.completedBadge, { backgroundColor: colors.success + '20', borderColor: colors.success }]}>
                <Text style={[styles.completedText, { color: colors.success }]}>✓ Completed</Text>
              </View>
            )}
          </View>

          <View style={styles.challengeDetails}>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Range</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                1-{todayChallenge.maxRange}
              </Text>
            </View>
            <View style={[styles.detailDivider, { backgroundColor: colors.border }]} />
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Attempts</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {todayChallenge.trials}
              </Text>
            </View>
            <View style={[styles.detailDivider, { backgroundColor: colors.border }]} />
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Difficulty</Text>
              <Text style={[styles.detailValue, { color: getDifficultyColor(todayChallenge.difficulty) }]}>
                {todayChallenge.difficulty.charAt(0).toUpperCase() + todayChallenge.difficulty.slice(1)}
              </Text>
            </View>
          </View>

          {/* Special Rules */}
          {todayChallenge.specialRule && (
            <View style={[styles.specialRuleCard, { backgroundColor: colors.warning + '15', borderColor: colors.warning }]}>
              <Text style={[styles.specialRuleTitle, { color: colors.warning }]}>⚠️ Special Rule</Text>
              <Text style={[styles.specialRuleText, { color: colors.text }]}>
                {getSpecialRuleDisplay(todayChallenge.specialRule)}
              </Text>
            </View>
          )}

          {/* Instructions */}
          <View style={styles.instructions}>
            <Text style={[styles.instructionsText, { color: colors.textSecondary }]}>
              Guess the number between 1 and {todayChallenge.maxRange} in {todayChallenge.trials} attempts
              {todayChallenge.specialRule ? '. Special rules apply!' : '.'}
            </Text>
          </View>
        </View>

        {/* Streak Info */}
        <View style={[styles.streakCard, { backgroundColor: colors.primary + '15', borderColor: colors.primary }]}>
          <View style={styles.streakContent}>
            <View style={styles.streakLeft}>
              <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>Current Streak</Text>
              <Text style={[styles.streakValue, { color: colors.primary }]}>
                {dailyData.currentStreak} {dailyData.currentStreak === 1 ? 'day' : 'days'}
              </Text>
            </View>
            <View style={[styles.streakDivider, { backgroundColor: colors.border }]} />
            <View style={styles.streakRight}>
              <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>Best Streak</Text>
              <Text style={[styles.streakValue, { color: colors.primary }]}>
                {dailyData.longestStreak} {dailyData.longestStreak === 1 ? 'day' : 'days'}
              </Text>
            </View>
          </View>
          {dailyData.currentStreak > 0 && (
            <Text style={[styles.streakEncouragement, { color: colors.textSecondary }]}>
              🔥 Keep the streak alive!
            </Text>
          )}
        </View>

        {/* Play Button - Updated Styling */}
        <Pressable 
          onPress={handlePlayChallenge}
          style={({ pressed }) => [
            styles.playButton,
            { 
              backgroundColor: hasCompleted ? colors.success : colors.primary,
              opacity: pressed ? 0.8 : 1,
            }
          ]}
        >
          <Text style={styles.playButtonText}>
            {hasCompleted 
              ? '✓ Completed - Play Again?' 
              : hasPlayed
                ? '↻ Retry Challenge' 
                : '▶ Play Today\'s Challenge'
            }
          </Text>
        </Pressable>

        {/* Streak Calendar Button - Updated Styling */}
        <Pressable 
          onPress={handleViewStreak}
          style={({ pressed }) => [
            styles.calendarButton, 
            { 
              backgroundColor: colors.cardBg, 
              borderColor: colors.border,
              opacity: pressed ? 0.8 : 1,
            }
          ]}
        >
          <View style={styles.calendarButtonContent}>
            <Text style={[styles.calendarButtonText, { color: colors.text }]}>📅 View Streak Calendar</Text>
            <Text style={[styles.calendarButtonArrow, { color: colors.textSecondary }]}>➡</Text>
          </View>
        </Pressable>

        {/* Info Text */}
        <View style={styles.infoSection}>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Complete daily challenges to build your streak and earn achievements!
          </Text>
          {hasPlayed && !hasCompleted && (
            <Text style={[styles.retryText, { color: colors.warning }]}>
              You can retry today's challenge until you complete it!
            </Text>
          )}
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
    paddingBottom: SPACING.xxl,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    fontSize: 16,
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
  date: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: SPACING.xxl,
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
  challengeCard: {
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  challengeTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  completedBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: SPACING.sm,
    borderWidth: 1,
  },
  completedText: {
    fontSize: 12,
    fontWeight: '600',
  },
  challengeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    ...TYPOGRAPHY.caption,
    marginBottom: SPACING.xs,
    fontSize: 11,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  detailDivider: {
    width: 1,
    marginHorizontal: SPACING.sm,
  },
  specialRuleCard: {
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
  },
  specialRuleTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  specialRuleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  instructions: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  instructionsText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  streakCard: {
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakLeft: {
    flex: 1,
    alignItems: 'center',
  },
  streakRight: {
    flex: 1,
    alignItems: 'center',
  },
  streakDivider: {
    width: 1,
    height: 40,
    marginHorizontal: SPACING.md,
  },
  streakLabel: {
    fontSize: 12,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  streakValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  streakEncouragement: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: SPACING.md,
    fontStyle: 'italic',
  },
  // Updated Button Styles
  playButton: {
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  calendarButton: {
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
  },
  calendarButtonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calendarButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  calendarButtonArrow: {
    fontSize: 18,
    fontWeight: '700',
  },
  infoSection: {
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '500',
    fontStyle: 'italic',
  },
});
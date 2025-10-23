import { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { TYPOGRAPHY, SPACING } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import { DailyChallengeGenerator } from '../utils/dailyChallengeGenerator';
import { Storage } from '../utils/storage';

export default function DailyChallengeScreen({ navigation }) {
  const { colors } = useTheme();
  const [dailyData, setDailyData] = useState(null);
  const [hasPlayedToday, setHasPlayedToday] = useState(false);
  const [todayChallenge, setTodayChallenge] = useState(null);

  useEffect(() => {
    loadDailyData();
  }, []);

  const loadDailyData = async () => {
    const data = await Storage.getDailyChallenge();
    const challenge = DailyChallengeGenerator.getTodayChallenge();
    const played = DailyChallengeGenerator.hasPlayedToday(data.lastPlayedDate);
    
    setDailyData(data);
    setTodayChallenge(challenge);
    setHasPlayedToday(played);
  };

  const handlePlayChallenge = () => {
    if (hasPlayedToday) {
      Alert.alert(
        'Already Completed',
        'You have already completed today\'s challenge. Come back tomorrow!',
        [{ text: 'OK' }]
      );
      return;
    }

    navigation.navigate('Game', {
      difficulty: 'medium',
      mode: 'daily',
      targetNumber: todayChallenge.targetNumber,
    });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  if (!dailyData || !todayChallenge) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
      </View>
    );
  }

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Pressable 
          onPress={handleGoBack} 
          style={[
            styles.backButton, 
            { 
              backgroundColor: colors.cardBg,
              borderColor: colors.border 
            }
          ]}
        >
          <Text style={[styles.backButtonText, { color: colors.text }]}>Back</Text>
        </Pressable>

        <Text style={[styles.title, { color: colors.text }]}>Daily Challenge</Text>
        <Text style={[styles.date, { color: colors.textSecondary }]}>{today}</Text>

        {/* Challenge Info Card */}
        <View style={[
          styles.challengeCard, 
          { 
            backgroundColor: colors.cardBg,
            borderColor: colors.border 
          }
        ]}>
          <View style={styles.challengeHeader}>
            <Text style={[styles.challengeTitle, { color: colors.text }]}>
              Today's Challenge
            </Text>
            {hasPlayedToday && (
              <View style={[
                styles.completedBadge,
                {
                  backgroundColor: colors.success + '20',
                  borderColor: colors.success
                }
              ]}>
                <Text style={[styles.completedText, { color: colors.success }]}>
                  Completed
                </Text>
              </View>
            )}
          </View>

          <View style={styles.challengeDetails}>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                Range
              </Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>1-100</Text>
            </View>
            <View style={[styles.detailDivider, { backgroundColor: colors.border }]} />
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                Attempts
              </Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>7</Text>
            </View>
            <View style={[styles.detailDivider, { backgroundColor: colors.border }]} />
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                Difficulty
              </Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>Medium</Text>
            </View>
          </View>
        </View>

        {/* Streak Info */}
        <View style={[
          styles.streakCard,
          {
            backgroundColor: colors.primary + '15',
            borderColor: colors.primary
          }
        ]}>
          <Text style={[styles.streakTitle, { color: colors.textSecondary }]}>
            Your Streak
          </Text>
          <Text style={[styles.streakValue, { color: colors.primary }]}>
            {dailyData.currentStreak} days
          </Text>
          <Text style={[styles.streakSubtext, { color: colors.textSecondary }]}>
            Longest: {dailyData.longestStreak} days
          </Text>
        </View>

        {/* Play Button */}
        <Pressable 
          onPress={handlePlayChallenge}
          style={[
            styles.playButton,
            { backgroundColor: colors.primary },
            hasPlayedToday && { backgroundColor: colors.border }
          ]}
          disabled={hasPlayedToday}
        >
          <Text style={styles.playButtonText}>
            {hasPlayedToday ? 'Come Back Tomorrow' : 'Play Today\'s Challenge'}
          </Text>
        </Pressable>

        {/* Info Text */}
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          Complete daily challenges to build your streak and earn achievements!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.xxl,
    paddingTop: 50,
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginTop: 100,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: SPACING.sm,
    borderWidth: 1,
    marginBottom: SPACING.xxl,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  title: {
    ...TYPOGRAPHY.title,
    marginBottom: SPACING.xs,
  },
  date: {
    fontSize: 15,
    marginBottom: SPACING.xxl,
  },
  challengeCard: {
    borderRadius: SPACING.md,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
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
    fontWeight: '600',
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
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    ...TYPOGRAPHY.caption,
    marginBottom: SPACING.xs,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  detailDivider: {
    width: 1,
  },
  streakCard: {
    borderRadius: SPACING.md,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.xxl,
    borderWidth: 1,
  },
  streakTitle: {
    fontSize: 14,
    marginBottom: SPACING.sm,
  },
  streakValue: {
    fontSize: 48,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  streakSubtext: {
    fontSize: 13,
  },
  playButton: {
    borderRadius: SPACING.md,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  playButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
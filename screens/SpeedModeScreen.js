import { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Alert } from 'react-native';
import { TYPOGRAPHY, SPACING } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import { Storage } from '../utils/storage';
import { SpeedChallengeGenerator } from '../utils/speedChallengeGenerator';

export default function SpeedModeScreen({ navigation }) {
  const { colors } = useTheme();
  const [speedStats, setSpeedStats] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');

  useEffect(() => {
    loadSpeedStats();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadSpeedStats();
    });
    return unsubscribe;
  }, [navigation]);

  const loadSpeedStats = async () => {
    const stats = await Storage.getSpeedStats();
    setSpeedStats(stats);
  };

  const difficulties = [
    {
      id: 'easy',
      name: 'Relaxed',
      icon: '🌱',
      description: 'Perfect for beginners',
      range: '1-50',
      time: 45,
      color: colors.success,
      stats: speedStats?.easy,
    },
    {
      id: 'medium',
      name: 'Balanced',
      icon: '⚡',
      description: 'Good challenge',
      range: '1-100',
      time: 60,
      color: colors.warning,
      stats: speedStats?.medium,
    },
    {
      id: 'hard',
      name: 'Intense',
      icon: '🔥',
      description: 'For speed demons',
      range: '1-200',
      time: 75,
      color: colors.danger,
      stats: speedStats?.hard,
    },
    {
      id: 'extreme',
      name: 'Extreme',
      icon: '💀',
      description: 'Ultimate test',
      range: '1-500',
      time: 90,
      color: colors.purple,
      stats: speedStats?.extreme,
    },
  ];

  const handleStartSpeed = (difficulty) => {
    const challenge = SpeedChallengeGenerator.generateChallenge(difficulty);
    
    console.log('⚡ Starting Speed Challenge:', challenge);

    navigation.navigate('Game', {
      mode: 'speed',
      speedChallenge: challenge,
    });
  };

  const handleRandomSpeed = () => {
    const randomDiff = difficulties[Math.floor(Math.random() * difficulties.length)];
    handleStartSpeed(randomDiff.id);
  };

  if (!speedStats) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
      </View>
    );
  }

  const totalSpeedGames = speedStats.totalGames || 0;
  const totalSpeedWins = speedStats.totalWins || 0;
  const bestTime = speedStats.bestTime || null;
  const avgGuesses = speedStats.averageGuesses || 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>⚡ Speed Mode</Text>
          <Pressable 
            onPress={() => navigation.goBack()} 
            style={[styles.backButton, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
          >
            <Text style={[styles.backButtonText, { color: colors.text }]}>Back</Text>
          </Pressable>
        </View>

        {/* Quick Stats */}
        <View style={[styles.quickStats, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={styles.quickStat}>
            <Text style={[styles.quickStatValue, { color: colors.warning }]}>
              {totalSpeedGames}
            </Text>
            <Text style={[styles.quickStatLabel, { color: colors.textSecondary }]}>
              Races
            </Text>
          </View>
          <View style={[styles.quickStatDivider, { backgroundColor: colors.border }]} />
          <View style={styles.quickStat}>
            <Text style={[styles.quickStatValue, { color: colors.success }]}>
              {totalSpeedWins}
            </Text>
            <Text style={[styles.quickStatLabel, { color: colors.textSecondary }]}>
              Wins
            </Text>
          </View>
          <View style={[styles.quickStatDivider, { backgroundColor: colors.border }]} />
          <View style={styles.quickStat}>
            <Text style={[styles.quickStatValue, { color: colors.primary }]}>
              {bestTime ? `${bestTime}s` : '--'}
            </Text>
            <Text style={[styles.quickStatLabel, { color: colors.textSecondary }]}>
              Best Time
            </Text>
          </View>
        </View>

        {/* Random Challenge Button */}
        <Pressable
          onPress={handleRandomSpeed}
          style={[styles.randomButton, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.randomButtonIcon}>🎲</Text>
          <View style={styles.randomButtonContent}>
            <Text style={styles.randomButtonTitle}>Random Challenge</Text>
            <Text style={styles.randomButtonSubtitle}>
              Surprise me with any difficulty!
            </Text>
          </View>
          <Text style={styles.randomButtonArrow}>➡</Text>
        </Pressable>

        {/* Difficulty Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Choose Your Challenge
          </Text>
          
          <View style={styles.difficultiesContainer}>
            {difficulties.map((diff) => (
              <Pressable
                key={diff.id}
                onPress={() => handleStartSpeed(diff.id)}
                style={[
                  styles.difficultyCard,
                  { 
                    backgroundColor: colors.cardBg,
                    borderColor: diff.color,
                  }
                ]}
              >
                {/* Header */}
                <View style={styles.difficultyHeader}>
                  <View style={[styles.difficultyIconContainer, { backgroundColor: diff.color + '20' }]}>
                    <Text style={styles.difficultyIcon}>{diff.icon}</Text>
                  </View>
                  <View style={styles.difficultyTitleContainer}>
                    <Text style={[styles.difficultyName, { color: colors.text }]}>
                      {diff.name}
                    </Text>
                    <Text style={[styles.difficultyDescription, { color: colors.textSecondary }]}>
                      {diff.description}
                    </Text>
                  </View>
                </View>

                {/* Details */}
                <View style={styles.difficultyDetails}>
                  <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                      Range
                    </Text>
                    <Text style={[styles.detailValue, { color: diff.color }]}>
                      {diff.range}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                      Time Limit
                    </Text>
                    <Text style={[styles.detailValue, { color: diff.color }]}>
                      {diff.time}s
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                      Attempts
                    </Text>
                    <Text style={[styles.detailValue, { color: diff.color }]}>
                      ∞
                    </Text>
                  </View>
                </View>

                {/* Stats */}
                {diff.stats && diff.stats.games > 0 && (
                  <View style={[styles.difficultyStats, { backgroundColor: diff.color + '10' }]}>
                    <Text style={[styles.difficultyStatsText, { color: colors.text }]}>
                      {diff.stats.wins}/{diff.stats.games} wins
                      {diff.stats.bestTime && ` • Best: ${diff.stats.bestTime}s`}
                    </Text>
                  </View>
                )}

                {/* Play Button */}
                <View style={[styles.playButtonContainer, { backgroundColor: diff.color }]}>
                  <Text style={styles.playButtonText}>Start Challenge</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* How to Play */}
        <View style={[styles.infoCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>How to Play</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            • You have unlimited attempts to find the number{'\n'}
            • Beat the clock before time runs out{'\n'}
            • Faster completion = Higher score{'\n'}
            • Use fewer guesses for bonus points
          </Text>
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
    padding: SPACING.xl,
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
    marginBottom: SPACING.xl,
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
  title: {
    ...TYPOGRAPHY.title,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
  },
  quickStats: {
    flexDirection: 'row',
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
  },
  quickStat: {
    flex: 1,
    alignItems: 'center',
  },
  quickStatValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  quickStatLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
  },
  quickStatDivider: {
    width: 1,
    marginHorizontal: SPACING.sm,
  },
  randomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: SPACING.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  randomButtonIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  randomButtonContent: {
    flex: 1,
  },
  randomButtonTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  randomButtonSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  randomButtonArrow: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '700',
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.caption,
    marginBottom: SPACING.lg,
  },
  difficultiesContainer: {
    gap: SPACING.lg,
  },
  difficultyCard: {
    borderRadius: SPACING.lg,
    padding: SPACING.lg,
    borderWidth: 2,
  },
  difficultyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  difficultyIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  difficultyIcon: {
    fontSize: 24,
  },
  difficultyTitleContainer: {
    flex: 1,
  },
  difficultyName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  difficultyDescription: {
    fontSize: 13,
  },
  difficultyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.md,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  difficultyStats: {
    borderRadius: SPACING.sm,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  difficultyStatsText: {
    fontSize: 12,
    fontWeight: '500',
  },
  playButtonContainer: {
    borderRadius: SPACING.sm,
    padding: SPACING.md,
    alignItems: 'center',
  },
  playButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  infoCard: {
    borderRadius: SPACING.lg,
    padding: SPACING.lg,
    borderWidth: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
  },
});
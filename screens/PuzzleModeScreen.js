import { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { TYPOGRAPHY, SPACING } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import { Storage } from '../utils/storage';
import { PuzzleChallengeGenerator } from '../utils/puzzleChallengeGenerator';

export default function PuzzleModeScreen({ navigation }) {
  const { colors } = useTheme();
  const [puzzleStats, setPuzzleStats] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    loadPuzzleStats();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadPuzzleStats();
    });
    return unsubscribe;
  }, [navigation]);

  const loadPuzzleStats = async () => {
    const stats = await Storage.getPuzzleStats();
    setPuzzleStats(stats);
  };

  const puzzleTypes = Object.values(PuzzleChallengeGenerator.getPuzzleTypes());
  const difficulties = [
    {
      id: 'easy',
      name: 'Beginner',
      icon: '🌱',
      description: 'Easy puzzles to get started',
      attempts: 7,
      time: '4 min',
      hints: 3,
      color: colors.success,
    },
    {
      id: 'medium',
      name: 'Intermediate',
      icon: '🧩',
      description: 'Moderate challenge',
      attempts: 5,
      time: '3 min',
      hints: 2,
      color: colors.warning,
    },
    {
      id: 'hard',
      name: 'Advanced',
      icon: '🔥',
      description: 'Tough puzzles',
      attempts: 4,
      time: '2 min',
      hints: 1,
      color: colors.danger,
    },
    {
      id: 'extreme',
      name: 'Expert',
      icon: '💀',
      description: 'Ultimate brain teasers',
      attempts: 3,
      time: '1.5 min',
      hints: 1,
      color: colors.purple,
    },
  ];

  const handleStartPuzzle = (difficulty, type = null) => {
    const challenge = PuzzleChallengeGenerator.generateChallenge(difficulty, type);
    
    console.log('🧩 Starting Puzzle Challenge:', challenge);

    navigation.navigate('Game', {
      mode: 'puzzle',
      puzzleChallenge: challenge,
    });
  };

  const handleRandomPuzzle = () => {
    const randomDiff = difficulties[Math.floor(Math.random() * difficulties.length)];
    handleStartPuzzle(randomDiff.id, null);
  };

  if (!puzzleStats) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
      </View>
    );
  }

  const totalGames = puzzleStats.totalGames || 0;
  const totalWins = puzzleStats.totalWins || 0;
  const winRate = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>🧩 Puzzle Mode</Text>
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
            <Text style={[styles.quickStatValue, { color: colors.purple }]}>
              {totalGames}
            </Text>
            <Text style={[styles.quickStatLabel, { color: colors.textSecondary }]}>
              Puzzles
            </Text>
          </View>
          <View style={[styles.quickStatDivider, { backgroundColor: colors.border }]} />
          <View style={styles.quickStat}>
            <Text style={[styles.quickStatValue, { color: colors.success }]}>
              {totalWins}
            </Text>
            <Text style={[styles.quickStatLabel, { color: colors.textSecondary }]}>
              Solved
            </Text>
          </View>
          <View style={[styles.quickStatDivider, { backgroundColor: colors.border }]} />
          <View style={styles.quickStat}>
            <Text style={[styles.quickStatValue, { color: colors.primary }]}>
              {winRate}%
            </Text>
            <Text style={[styles.quickStatLabel, { color: colors.textSecondary }]}>
              Success
            </Text>
          </View>
        </View>

        {/* Random Challenge Button */}
        <Pressable
          onPress={handleRandomPuzzle}
          style={[styles.randomButton, { backgroundColor: colors.purple }]}
        >
          <Text style={styles.randomButtonIcon}>🎲</Text>
          <View style={styles.randomButtonContent}>
            <Text style={styles.randomButtonTitle}>Random Puzzle</Text>
            <Text style={styles.randomButtonSubtitle}>
              Surprise me with any puzzle!
            </Text>
          </View>
          <Text style={styles.randomButtonArrow}>➡</Text>
        </Pressable>

        {/* Puzzle Types */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Choose Puzzle Type
          </Text>
          
          <View style={styles.typesContainer}>
            {puzzleTypes.map((type) => {
                const typeStats = puzzleStats.byType[type.id] || { games: 0, wins: 0 };
                return (
                    <Pressable
                    key={type.id}
                    onPress={() => handleStartPuzzle(selectedDifficulty, type.id)}
                    style={[
                        styles.typeCard,
                        { 
                        backgroundColor: colors.cardBg,
                        borderColor: type.color,
                        }
                    ]}
                    >
                    <View style={[styles.typeIconContainer, { backgroundColor: type.color + '20' }]}>
                        <Text style={styles.typeIcon}>{type.icon}</Text>
                    </View>
                    <View style={styles.typeContent}>
                        <Text style={[styles.typeName, { color: colors.text }]}>
                        {type.name}
                        </Text>
                        <Text style={[styles.typeDescription, { color: colors.textSecondary }]}>
                        {type.description}
                        </Text>
                        {typeStats.games > 0 ? (
                        <Text style={[styles.typeStats, { color: type.color }]}>
                            {typeStats.wins}/{typeStats.games} won • {typeStats.games > 0 ? Math.round((typeStats.wins / typeStats.games) * 100) : 0}%
                        </Text>
                        ) : (
                        <Text style={[styles.typeStats, { color: colors.textSecondary }]}>
                            Not played yet
                        </Text>
                        )}
                    </View>
                    <Text style={[styles.typeArrow, { color: type.color }]}>➡</Text>
                    </Pressable>
                );
            })}
          </View>
        </View>

        {/* Difficulty Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Choose Difficulty
          </Text>
          
          <View style={styles.difficultiesContainer}>
            {difficulties.map((diff) => {
              const diffStats = puzzleStats.byDifficulty[diff.id] || { games: 0, wins: 0 };
              const isSelected = selectedDifficulty === diff.id;
              
              return (
                <Pressable
                  key={diff.id}
                  onPress={() => setSelectedDifficulty(diff.id)}
                  style={[
                    styles.difficultyCard,
                    { 
                      backgroundColor: colors.cardBg,
                      borderColor: isSelected ? diff.color : colors.border,
                      borderWidth: isSelected ? 2 : 1,
                    }
                  ]}
                >
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

                  <View style={styles.difficultyDetails}>
                    <View style={styles.detailItem}>
                      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                        Attempts
                      </Text>
                      <Text style={[styles.detailValue, { color: diff.color }]}>
                        {diff.attempts}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                        Time
                      </Text>
                      <Text style={[styles.detailValue, { color: diff.color }]}>
                        {diff.time}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                        Hints
                      </Text>
                      <Text style={[styles.detailValue, { color: diff.color }]}>
                        {diff.hints}
                      </Text>
                    </View>
                  </View>

                  {diffStats.games > 0 && (
                    <View style={[styles.difficultyStats, { backgroundColor: diff.color + '10' }]}>
                      <Text style={[styles.difficultyStatsText, { color: colors.text }]}>
                        {diffStats.wins}/{diffStats.games} solved
                        {diffStats.bestTime && ` • Best: ${diffStats.bestTime}s`}
                      </Text>
                    </View>
                  )}

                  {isSelected && (
                    <View style={[styles.selectedBadge, { backgroundColor: diff.color }]}>
                      <Text style={styles.selectedBadgeText}>Selected</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Start Button */}
        <Pressable
          onPress={() => handleStartPuzzle(selectedDifficulty)}
          style={[styles.startButton, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.startButtonText}>
            Start {difficulties.find(d => d.id === selectedDifficulty)?.name} Puzzle
          </Text>
        </Pressable>

        {/* How to Play */}
        <View style={[styles.infoCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>How to Play</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            • Read the puzzle carefully{'\n'}
            • Use logic and reasoning to find the answer{'\n'}
            • Request hints if you get stuck{'\n'}
            • Solve before time runs out!
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
  typesContainer: {
    gap: SPACING.md,
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    borderWidth: 2,
  },
  typeIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  typeIcon: {
    fontSize: 24,
  },
  typeContent: {
    flex: 1,
  },
  typeName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  typeDescription: {
    fontSize: 13,
    marginBottom: 4,
  },
  typeStats: {
    fontSize: 12,
    fontWeight: '600',
  },
  typeArrow: {
    fontSize: 20,
    fontWeight: '700',
  },
  difficultiesContainer: {
    gap: SPACING.lg,
  },
  difficultyCard: {
    borderRadius: SPACING.lg,
    padding: SPACING.lg,
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
    marginTop: SPACING.sm,
    alignItems: 'center',
  },
  difficultyStatsText: {
    fontSize: 12,
    fontWeight: '500',
  },
  selectedBadge: {
    marginTop: SPACING.sm,
    borderRadius: SPACING.sm,
    padding: SPACING.xs,
    alignItems: 'center',
  },
  selectedBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  startButton: {
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
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